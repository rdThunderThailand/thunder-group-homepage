-- Rollback for 0003_defer_tenant_creation.sql -- restores the
-- public.tenants/public.users creation from 0002. Only run this once that
-- logic is fixed with confirmed column values; running it as-is reintroduces
-- the original "column tax_id does not exist" style failures.

DROP FUNCTION IF EXISTS public.submit_partner_application(uuid, text, text, text, text, jsonb, text);

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
  v_tenant_id uuid;
  v_user_id uuid;
  v_application thunder_partner.applications;
  v_is_new boolean := true;
BEGIN
  INSERT INTO public.tenants (tax_id, name)
  VALUES (p_tax_id, p_company_name)
  ON CONFLICT (tax_id) DO UPDATE SET tax_id = EXCLUDED.tax_id
  RETURNING id INTO v_tenant_id;

  INSERT INTO public.users (email)
  VALUES (p_email)
  ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
  RETURNING id INTO v_user_id;

  BEGIN
    INSERT INTO thunder_partner.applications (submission_id, tenant_id, user_id, tax_id, actor_id, data)
    VALUES (p_submission_id, v_tenant_id, v_user_id, p_tax_id, p_actor_id, p_application_data)
    RETURNING * INTO v_application;
  EXCEPTION WHEN unique_violation THEN
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

REVOKE ALL ON FUNCTION public.submit_partner_application(uuid, text, text, text, text, jsonb, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_partner_application(uuid, text, text, text, text, jsonb, text) TO service_role;

ALTER TABLE thunder_partner.applications
  ALTER COLUMN tenant_id SET NOT NULL,
  ALTER COLUMN user_id SET NOT NULL;
