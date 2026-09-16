-- Temporary: unblocks testing the Partner Web side (application record +
-- outbound queue + cron) while ThunderCore's tenant creation rules are still
-- an open question -- `public.tenants.status` only has active/archived/
-- suspended (no "pending"), and tenant_type/tenant_code's valid values
-- aren't confirmed yet. Until that's answered, submit_partner_application()
-- stops inserting into public.tenants/public.users entirely and leaves
-- tenant_id/user_id NULL.
--
-- MUST be revisited once ThunderCore confirms those values: re-add the
-- insert, restore NOT NULL below, and backfill/reconcile any application
-- rows created in the meantime before their queued application_callback/
-- token_exchange/link_token rows are ever sent for real (they currently
-- enqueue with "tenantId": null).

ALTER TABLE thunder_partner.applications
  ALTER COLUMN tenant_id DROP NOT NULL,
  ALTER COLUMN user_id DROP NOT NULL;

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
  v_application thunder_partner.applications;
BEGIN
  -- p_company_name/p_email aren't written anywhere yet (no public.tenants/
  -- public.users row to put them on) -- they still reach reviewers via
  -- p_application_data, which the client already includes them in.
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
