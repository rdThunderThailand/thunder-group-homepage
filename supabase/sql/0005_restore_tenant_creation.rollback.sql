-- Reverts 0005_restore_tenant_creation.sql: restores the 0003 (tenant/user
-- creation deferred) versions of submit_partner_application and
-- claim_due_line_calls. Does not touch any public.tenants/public.users/
-- public.memberships rows already created by 0005 -- those are ThunderCore
-- data, not this app's to delete on rollback.

DROP FUNCTION IF EXISTS public.submit_partner_application(uuid, text, text, text, text, uuid, jsonb, text);

CREATE OR REPLACE FUNCTION public.submit_partner_application(
  p_submission_id uuid,
  p_tax_id text,
  p_company_name text,
  p_email text,
  p_actor_id text,
  p_application_data jsonb DEFAULT '{}'::jsonb,
  p_line_token text DEFAULT NULL
) RETURNS thunder_partner.applications
LANGUAGE plpgsql
AS $$
DECLARE
  v_application thunder_partner.applications;
BEGIN
  SELECT * INTO v_application FROM thunder_partner.applications
  WHERE submission_id = p_submission_id OR tax_id = p_tax_id
  LIMIT 1;

  IF FOUND THEN
    RETURN v_application;
  END IF;

  INSERT INTO thunder_partner.applications (submission_id, tax_id, actor_id, data)
  VALUES (p_submission_id, p_tax_id, p_actor_id, p_application_data)
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

REVOKE ALL ON FUNCTION public.submit_partner_application(uuid, text, text, text, text, jsonb, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_partner_application(uuid, text, text, text, text, jsonb, text) TO service_role;

CREATE OR REPLACE FUNCTION public.claim_due_line_calls(p_limit int DEFAULT 20)
RETURNS SETOF thunder_partner.outbound_line_calls
LANGUAGE sql
AS $$
  UPDATE thunder_partner.outbound_line_calls
  SET locked_until = now() + interval '2 minutes'
  WHERE id IN (
    SELECT id FROM thunder_partner.outbound_line_calls
    WHERE status = 'pending'
      AND next_attempt_at <= now()
      AND (locked_until IS NULL OR locked_until < now())
    ORDER BY next_attempt_at
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
$$;
