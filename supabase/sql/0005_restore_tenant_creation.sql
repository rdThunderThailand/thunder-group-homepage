-- Restores tenant/user creation per docs/PARTNER_WEB_TENANT_USER_HANDOFF.md
-- (the backend team's answers to the open items 0003 punted on). Run after
-- 0004, same way (paste into Supabase SQL Editor).
--
-- What this does NOT do, on purpose:
-- - Does not restore `NOT NULL` on thunder_partner.applications.tenant_id /
--   user_id -- existing rows created while 0003 was live (including QA test
--   rows from partner-registration testing) still have both as null. Adding
--   NOT NULL now would fail the migration outright. Per the handoff doc's
--   "การจัดการข้อมูลที่สร้างไว้ระหว่าง Migration 0003" section, those rows
--   must be individually reconciled (or, for pure test junk, deleted) first
--   -- that is a separate, deliberate follow-up (0006), not scripted here.
-- - Does not touch tax_id handling. `public.tenants` has no `tax_id` column
--   (confirmed in the handoff doc's "Tax ID Open Item") -- Partner Web still
--   cannot dedup companies against ThunderCore by tax_id. The existing local
--   dedup on thunder_partner.applications.tax_id (submission_id OR tax_id,
--   unchanged below) is unaffected and still has the identity-conflation
--   limitation noted in docs/partner_tenant_creation_open_item.md.

DROP FUNCTION IF EXISTS public.submit_partner_application(uuid, text, text, text, text, jsonb, text);

-- `p_user_id`: the caller's Supabase Auth user id. A Postgres function can't
-- create an Auth user itself (GoTrue owns that, not a plain INSERT into
-- auth.users) -- the Route Handler finds-or-creates it via
-- supabase.auth.admin.generateLink({ type: "magiclink", email }) *before*
-- calling this function, then passes the resulting id here so
-- public.users.id can equal auth.users.id as the handoff doc requires.
CREATE OR REPLACE FUNCTION public.submit_partner_application(
  p_submission_id uuid,
  p_tax_id text,
  p_company_name text,
  p_email text,
  p_actor_id text,
  p_user_id uuid,
  p_application_data jsonb DEFAULT '{}'::jsonb,
  p_line_token text DEFAULT NULL
) RETURNS thunder_partner.applications
LANGUAGE plpgsql
AS $$
DECLARE
  v_application thunder_partner.applications;
  v_tenant_id uuid;
  v_tenant_code text;
BEGIN
  -- Local idempotency/dedup, unchanged from 0003: same submission retried, or
  -- a tax_id that collides with an earlier applicant, both just return the
  -- existing row without creating anything new in ThunderCore.
  SELECT * INTO v_application FROM thunder_partner.applications
  WHERE submission_id = p_submission_id OR tax_id = p_tax_id
  LIMIT 1;

  IF FOUND THEN
    RETURN v_application;
  END IF;

  -- No tax_id column on public.tenants to dedup against (open ThunderCore
  -- item), so every genuinely-new local application creates a genuinely-new
  -- tenant. tenant_code just needs to satisfy the UNIQUE constraint the
  -- handoff doc says already exists -- random suffix, no retry-on-collision
  -- loop, collision odds are negligible at this volume.
  v_tenant_code := 'PTR-' || upper(substr(md5(gen_random_uuid()::text), 1, 10));

  INSERT INTO public.tenants (name, tenant_code, tenant_type, status, onboarding_status, activated_at)
  VALUES (p_company_name, v_tenant_code, 'enterprise', 'active', 'pending', NULL)
  RETURNING id INTO v_tenant_id;

  INSERT INTO public.users (id, email)
  VALUES (p_user_id, p_email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

  -- Every applicant starts as member_type = 'user'. LINE Service flips the
  -- membership matching (tenant_id, user_id) to 'partner' itself on APPROVED
  -- (its own Migration 006) -- Partner Web never sets 'partner' here.
  INSERT INTO public.memberships (tenant_id, user_id, status, user_type, member_type)
  VALUES (v_tenant_id, p_user_id, 'active', 'external', 'user');

  INSERT INTO thunder_partner.applications (submission_id, tenant_id, user_id, tax_id, actor_id, data)
  VALUES (p_submission_id, v_tenant_id, p_user_id, p_tax_id, p_actor_id, p_application_data)
  RETURNING * INTO v_application;

  INSERT INTO thunder_partner.outbound_line_calls (application_id, call_type, payload)
  VALUES (
    v_application.id,
    CASE WHEN p_line_token IS NOT NULL THEN 'token_exchange' ELSE 'link_token' END,
    CASE WHEN p_line_token IS NOT NULL
      THEN jsonb_build_object('token', p_line_token, 'applicationId', v_application.id, 'tenantId', v_application.tenant_id)
      ELSE jsonb_build_object('applicationId', v_application.id, 'tenantId', v_application.tenant_id)
    END
  );

  RETURN v_application;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_partner_application(uuid, text, text, text, text, uuid, jsonb, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_partner_application(uuid, text, text, text, text, uuid, jsonb, text) TO service_role;

-- Defense-in-depth per the handoff doc's "Outbound Queue Rules": never let
-- the cron worker claim (and therefore deliver) an application_callback /
-- token_exchange / link_token row while its application's tenant_id or
-- user_id is still null -- LINE Service rejects those with
-- 400 INVALID_PAYLOAD, which the cron treats as non-retryable and burns the
-- row straight to failed_permanent. New rows from the function above are
-- never null, so this only matters for the leftover 0003-era rows until 0006
-- backfills or deletes them. relationship_callback rows (application_id
-- null, keyed off thunder_partner.relationships.tenant_id instead, which was
-- never made nullable) pass through untouched.
CREATE OR REPLACE FUNCTION public.claim_due_line_calls(p_limit int DEFAULT 20)
RETURNS SETOF thunder_partner.outbound_line_calls
LANGUAGE sql
AS $$
  UPDATE thunder_partner.outbound_line_calls
  SET locked_until = now() + interval '2 minutes'
  WHERE id IN (
    SELECT olc.id
    FROM thunder_partner.outbound_line_calls olc
    WHERE olc.status = 'pending'
      AND olc.next_attempt_at <= now()
      AND (olc.locked_until IS NULL OR olc.locked_until < now())
      AND (
        olc.application_id IS NULL
        OR EXISTS (
          SELECT 1 FROM thunder_partner.applications a
          WHERE a.id = olc.application_id
            AND a.tenant_id IS NOT NULL
            AND a.user_id IS NOT NULL
        )
      )
    ORDER BY olc.next_attempt_at
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
$$;
