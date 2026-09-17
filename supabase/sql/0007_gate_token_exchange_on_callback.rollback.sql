-- Reverts 0007_gate_token_exchange_on_callback.sql: restores
-- claim_due_line_calls() to its 0005 form (drops the token_exchange /
-- application_callback sequencing check) and drops the supporting index.

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

REVOKE ALL ON FUNCTION public.claim_due_line_calls(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_due_line_calls(int) TO service_role;

DROP INDEX IF EXISTS thunder_partner.outbound_line_calls_application_call_type_idx;
