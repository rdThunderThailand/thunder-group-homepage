-- Partner Web schema + RPC functions.
--
-- Run this ONCE by pasting it into the Supabase SQL Editor for the
-- ThunderCore project (Project -> SQL Editor -> New query). There is no
-- migration tool wired up for this repo -- the app talks to Postgres only
-- through @supabase/supabase-js using SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY,
-- never a direct connection string, so schema changes are applied by hand
-- here and kept in this file for review/history.
--
-- To undo, see 0001_create_partner_schema.rollback.sql.

CREATE SCHEMA IF NOT EXISTS thunder_partner;

-- `applications` is the source of truth for the registration wizard's
-- submission. Reviewers are expected to change `status` directly via the
-- Supabase table editor (no admin UI in this iteration) -- the triggers
-- below are what turn that edit into a version bump + an outbound call to
-- the LINE Service, and what stop an invalid edit before it gets that far.
CREATE TABLE thunder_partner.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Client-generated per attempt at the review step; rejects a double-click
  -- or browser auto-retry of the same submit before it ever reaches tenant
  -- creation in ThunderCore.
  submission_id uuid NOT NULL,
  -- Deliberately not a FK to public.tenants/public.users: that schema is
  -- owned by ThunderCore, and this app should not couple its own schema
  -- changes to theirs.
  tenant_id uuid NOT NULL,
  user_id uuid NOT NULL,
  -- Second layer of double-submit protection. NOTE: also blocks a genuinely
  -- new application from a company whose earlier application was REJECTED --
  -- that re-application case wasn't covered in the design review.
  tax_id text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'NEEDS_INFO', 'APPROVED', 'REJECTED')),
  -- System-managed: applications_before_write() overwrites any manual edit
  -- to version/correlation_id so a reviewer editing the row by hand can't
  -- desync it from what LINE Service expects.
  version integer NOT NULL DEFAULT 1,
  correlation_id uuid NOT NULL DEFAULT gen_random_uuid(),
  actor_id text NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT applications_submission_id_key UNIQUE (submission_id),
  CONSTRAINT applications_tax_id_key UNIQUE (tax_id)
);

CREATE TABLE thunder_partner.relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'SUSPENDED', 'REVOKED')),
  version integer NOT NULL DEFAULT 1,
  correlation_id uuid NOT NULL DEFAULT gen_random_uuid(),
  actor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT relationships_tenant_id_key UNIQUE (tenant_id)
);

-- Generic retry queue for every outbound call this app makes to the LINE
-- Service (application callback, token exchange, link-token, relationship
-- callback). `payload` is captured at enqueue time so a retry always resends
-- the exact original body, per the contract's "retry ด้วย body เดิม" rule.
-- Nothing is ever attempted synchronously at submit time -- a Vercel Cron
-- job calls claim_due_line_calls()/record_line_call_result() below for
-- every attempt, first one included, on a 1m/5m/15m/1h/6h/24h backoff
-- (7 attempts total, then `failed_permanent`).
CREATE TABLE thunder_partner.outbound_line_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES thunder_partner.applications (id),
  relationship_id uuid REFERENCES thunder_partner.relationships (id),
  call_type text NOT NULL
    CHECK (call_type IN ('application_callback', 'token_exchange', 'link_token', 'relationship_callback')),
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'delivered', 'failed_permanent')),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  -- Visibility-timeout style lock so two overlapping cron ticks can't both
  -- claim the same row while the first is still mid-flight on the HTTP call.
  locked_until timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT outbound_line_calls_target_check CHECK (
    (application_id IS NOT NULL AND relationship_id IS NULL)
    OR (application_id IS NULL AND relationship_id IS NOT NULL)
  )
);

CREATE INDEX outbound_line_calls_pending_idx
  ON thunder_partner.outbound_line_calls (next_attempt_at)
  WHERE status = 'pending';

CREATE OR REPLACE FUNCTION thunder_partner.applications_before_write()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status <> 'PENDING' THEN
      RAISE EXCEPTION 'new applications must start as PENDING';
    END IF;
    IF NEW.reviewed_at IS NOT NULL THEN
      RAISE EXCEPTION 'reviewed_at must be null for a new PENDING application';
    END IF;
    NEW.version := 1;
    NEW.correlation_id := COALESCE(NEW.correlation_id, gen_random_uuid());
    RETURN NEW;
  END IF;

  NEW.updated_at := now();

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    -- Mirrors the contract's state machine exactly:
    -- PENDING -> NEEDS_INFO -> PENDING, PENDING -> APPROVED, PENDING -> REJECTED.
    IF NOT (
      (OLD.status = 'PENDING' AND NEW.status IN ('NEEDS_INFO', 'APPROVED', 'REJECTED'))
      OR (OLD.status = 'NEEDS_INFO' AND NEW.status = 'PENDING')
    ) THEN
      RAISE EXCEPTION 'invalid application status transition: % -> %', OLD.status, NEW.status;
    END IF;

    IF NEW.status = 'PENDING' AND NEW.reviewed_at IS NOT NULL THEN
      RAISE EXCEPTION 'reviewed_at must be null when status is PENDING';
    END IF;

    IF NEW.status IN ('NEEDS_INFO', 'APPROVED', 'REJECTED') AND NEW.reviewed_at IS NULL THEN
      RAISE EXCEPTION 'reviewed_at is required when status is %', NEW.status;
    END IF;

    IF NEW.actor_id IS NULL OR btrim(NEW.actor_id) = '' THEN
      RAISE EXCEPTION 'actor_id is required when changing application status';
    END IF;

    NEW.version := OLD.version + 1;
    NEW.correlation_id := gen_random_uuid();
  ELSE
    NEW.version := OLD.version;
    NEW.correlation_id := OLD.correlation_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_before_write
  BEFORE INSERT OR UPDATE ON thunder_partner.applications
  FOR EACH ROW EXECUTE FUNCTION thunder_partner.applications_before_write();

CREATE OR REPLACE FUNCTION thunder_partner.applications_after_write()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO thunder_partner.outbound_line_calls (application_id, call_type, payload)
  VALUES (
    NEW.id,
    'application_callback',
    jsonb_build_object(
      'applicationId', NEW.id,
      'tenantId', NEW.tenant_id,
      'userId', NEW.user_id,
      'status', NEW.status,
      'version', NEW.version,
      'actorId', NEW.actor_id,
      'correlationId', NEW.correlation_id,
      'submittedAt', NEW.submitted_at,
      'reviewedAt', NEW.reviewed_at
    )
  );

  -- LINE Service creates the Active Partner Relationship itself once it
  -- receives this APPROVED callback -- this insert is our own local mirror
  -- of that fact, purely so a *later* suspend/revoke has a version to bump.
  -- It deliberately does NOT enqueue a relationship_callback.
  IF NEW.status = 'APPROVED' THEN
    INSERT INTO thunder_partner.relationships (tenant_id, status, version, actor_id)
    VALUES (NEW.tenant_id, 'ACTIVE', 1, NEW.actor_id)
    ON CONFLICT (tenant_id) DO NOTHING;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_after_insert
  AFTER INSERT ON thunder_partner.applications
  FOR EACH ROW EXECUTE FUNCTION thunder_partner.applications_after_write();

CREATE TRIGGER applications_after_status_update
  AFTER UPDATE ON thunder_partner.applications
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION thunder_partner.applications_after_write();

CREATE OR REPLACE FUNCTION thunder_partner.relationships_before_write()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();

  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.actor_id IS NULL OR btrim(NEW.actor_id) = '' THEN
      RAISE EXCEPTION 'actor_id is required when changing relationship status';
    END IF;
    NEW.version := OLD.version + 1;
    NEW.correlation_id := gen_random_uuid();
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.version := OLD.version;
    NEW.correlation_id := OLD.correlation_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER relationships_before_write
  BEFORE INSERT OR UPDATE ON thunder_partner.relationships
  FOR EACH ROW EXECUTE FUNCTION thunder_partner.relationships_before_write();

CREATE OR REPLACE FUNCTION thunder_partner.relationships_after_status_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO thunder_partner.outbound_line_calls (relationship_id, call_type, payload)
  VALUES (
    NEW.id,
    'relationship_callback',
    jsonb_build_object(
      'tenantId', NEW.tenant_id,
      'status', NEW.status,
      'version', NEW.version,
      'actorId', NEW.actor_id,
      'correlationId', NEW.correlation_id
    )
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Only fires on UPDATE (not the initial INSERT from applications_after_write)
-- since the contract's relationship endpoint is for suspend/revoke/reactivate
-- of an *existing* relationship, not its creation.
CREATE TRIGGER relationships_after_status_update
  AFTER UPDATE ON thunder_partner.relationships
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION thunder_partner.relationships_after_status_update();

-- ---------------------------------------------------------------------------
-- RPC functions -- these are the only way the app touches this schema. It
-- calls them with supabase.rpc(...) using the service-role key; nothing in
-- `thunder_partner` is exposed to PostgREST directly (the schema is never
-- added to the project's "Exposed schemas" setting).
-- ---------------------------------------------------------------------------

-- Called once from the Route Handler when the wizard's step 5 is submitted.
-- Confirms the tenant/user in ThunderCore, inserts the application, and
-- enqueues exactly one linking call (token_exchange if a LINE-first token
-- cookie was present, link_token otherwise) -- all in one transaction, so a
-- crash partway through can't leave a tenant without an application or vice
-- versa.
CREATE OR REPLACE FUNCTION public.submit_partner_application(
  p_submission_id uuid,
  p_tax_id text,
  p_company_name text,
  p_email text,
  p_actor_id text,
  p_line_token text DEFAULT NULL
) RETURNS thunder_partner.applications
LANGUAGE plpgsql
AS $$
DECLARE
  v_tenant_id uuid;
  v_user_id uuid;
  v_application thunder_partner.applications;
  v_is_new boolean := true;
BEGIN
  -- TODO(open item): column/constraint names on public.tenants and
  -- public.users are assumed, not confirmed -- fix once their real DDL is
  -- checked (design review Q7: does tax_id/email actually carry a unique
  -- constraint there?).
  INSERT INTO public.tenants (tax_id, name)
  VALUES (p_tax_id, p_company_name)
  ON CONFLICT (tax_id) DO UPDATE SET tax_id = EXCLUDED.tax_id
  RETURNING id INTO v_tenant_id;

  INSERT INTO public.users (email)
  VALUES (p_email)
  ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
  RETURNING id INTO v_user_id;

  BEGIN
    INSERT INTO thunder_partner.applications (submission_id, tenant_id, user_id, tax_id, actor_id)
    VALUES (p_submission_id, v_tenant_id, v_user_id, p_tax_id, p_actor_id)
    RETURNING * INTO v_application;
  EXCEPTION WHEN unique_violation THEN
    -- Double-submit (same submission_id, or same tax_id from a second tab) --
    -- return the existing row instead of erroring, per design review Q13.
    v_is_new := false;
    SELECT * INTO v_application FROM thunder_partner.applications
    WHERE submission_id = p_submission_id OR tax_id = p_tax_id
    LIMIT 1;
  END;

  IF v_is_new THEN
    INSERT INTO thunder_partner.outbound_line_calls (application_id, call_type, payload)
    VALUES (
      v_application.id,
      CASE WHEN p_line_token IS NOT NULL THEN 'token_exchange' ELSE 'link_token' END,
      CASE WHEN p_line_token IS NOT NULL
        THEN jsonb_build_object('token', p_line_token, 'applicationId', v_application.id, 'tenantId', v_application.tenant_id)
        ELSE jsonb_build_object('applicationId', v_application.id, 'tenantId', v_application.tenant_id)
      END
    );
  END IF;

  RETURN v_application;
END;
$$;

-- Called by the Vercel Cron worker. Locks up to p_limit due rows so two
-- overlapping cron ticks can't both grab the same one.
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

-- Called by the cron worker after it POSTs a claimed row's payload to the
-- LINE Service. Backoff schedule agreed in the design review: 1m, 5m, 15m,
-- 1h, 6h, 24h between attempts (7 attempts total), then `failed_permanent`.
CREATE OR REPLACE FUNCTION public.record_line_call_result(
  p_id uuid,
  p_success boolean,
  p_error text DEFAULT NULL
) RETURNS thunder_partner.outbound_line_calls
LANGUAGE plpgsql
AS $$
DECLARE
  v_row thunder_partner.outbound_line_calls;
  v_backoff_minutes int[] := ARRAY[1, 5, 15, 60, 360, 1440];
  v_next_attempts int;
BEGIN
  SELECT * INTO v_row FROM thunder_partner.outbound_line_calls WHERE id = p_id;

  IF p_success THEN
    UPDATE thunder_partner.outbound_line_calls
    SET status = 'delivered', locked_until = NULL, last_error = NULL, updated_at = now()
    WHERE id = p_id
    RETURNING * INTO v_row;
    RETURN v_row;
  END IF;

  v_next_attempts := v_row.attempts + 1;

  IF v_next_attempts > array_length(v_backoff_minutes, 1) THEN
    UPDATE thunder_partner.outbound_line_calls
    SET status = 'failed_permanent', attempts = v_next_attempts, last_error = p_error,
        locked_until = NULL, updated_at = now()
    WHERE id = p_id
    RETURNING * INTO v_row;
  ELSE
    UPDATE thunder_partner.outbound_line_calls
    SET attempts = v_next_attempts,
        next_attempt_at = now() + (v_backoff_minutes[v_next_attempts] || ' minutes')::interval,
        last_error = p_error,
        locked_until = NULL,
        updated_at = now()
    WHERE id = p_id
    RETURNING * INTO v_row;
  END IF;

  RETURN v_row;
END;
$$;

-- ---------------------------------------------------------------------------
-- Grants. `CREATE FUNCTION` grants EXECUTE to PUBLIC by default in Postgres
-- (unlike tables) -- without the REVOKE below, anyone holding only the
-- public anon key could call submit_partner_application directly and create
-- fake tenants/applications.
-- ---------------------------------------------------------------------------

GRANT USAGE ON SCHEMA thunder_partner TO service_role;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA thunder_partner TO service_role;

REVOKE ALL ON FUNCTION public.submit_partner_application(uuid, text, text, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_due_line_calls(int) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_line_call_result(uuid, boolean, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.submit_partner_application(uuid, text, text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_due_line_calls(int) TO service_role;
GRANT EXECUTE ON FUNCTION public.record_line_call_result(uuid, boolean, text) TO service_role;
