-- Rollback for 0004_retryable_failures.sql.

DROP FUNCTION IF EXISTS public.record_line_call_result(uuid, boolean, text, boolean);

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

REVOKE ALL ON FUNCTION public.record_line_call_result(uuid, boolean, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_line_call_result(uuid, boolean, text) TO service_role;
