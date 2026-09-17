-- Reverts 0006_gate_link_token_on_approval.sql: restores the 0005 versions
-- of submit_partner_application (enqueues `link_token` at submission again)
-- and applications_after_write() (drops the on-approval enqueue).

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
  SELECT * INTO v_application FROM thunder_partner.applications
  WHERE submission_id = p_submission_id OR tax_id = p_tax_id
  LIMIT 1;

  IF FOUND THEN
    RETURN v_application;
  END IF;

  v_tenant_code := 'PTR-' || upper(substr(md5(gen_random_uuid()::text), 1, 10));

  INSERT INTO public.tenants (name, tenant_code, tenant_type, status, onboarding_status, activated_at)
  VALUES (p_company_name, v_tenant_code, 'enterprise', 'active', 'pending', NULL)
  RETURNING id INTO v_tenant_id;

  INSERT INTO public.users (id, email)
  VALUES (p_user_id, p_email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

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

  IF NEW.status = 'APPROVED' THEN
    INSERT INTO thunder_partner.relationships (tenant_id, status, version, actor_id)
    VALUES (NEW.tenant_id, 'ACTIVE', 1, NEW.actor_id)
    ON CONFLICT (tenant_id) DO NOTHING;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
