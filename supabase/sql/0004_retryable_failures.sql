-- Fixes a gap flagged in the design review's test case list (#37): the
-- contract requires retry ONLY for network errors, 500 and 503 -- 400/401/
-- 404/409/410 must NOT be retried automatically (the cause needs a human/
-- code fix, so burning through the backoff schedule on them is pointless
-- and just delays surfacing the real problem). record_line_call_result()
-- previously applied the same 7-attempt backoff to every failure; it now
-- takes a `p_retryable` flag so the caller (the cron worker, which knows the
-- HTTP status) can force an immediate `failed_permanent` for non-retryable
-- errors instead.

DROP FUNCTION IF EXISTS public.record_line_call_result(uuid, boolean, text);

CREATE OR REPLACE FUNCTION public.record_line_call_result(
  p_id uuid,
  p_success boolean,
  p_error text DEFAULT NULL,
  p_retryable boolean DEFAULT true
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

  IF NOT p_retryable OR v_next_attempts > array_length(v_backoff_minutes, 1) THEN
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

REVOKE ALL ON FUNCTION public.record_line_call_result(uuid, boolean, text, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_line_call_result(uuid, boolean, text, boolean) TO service_role;
