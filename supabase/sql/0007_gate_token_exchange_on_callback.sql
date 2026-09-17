-- Fixes a contract violation flagged by
-- docs/PARTNER_WEB_LINE_PENDING_NOTIFICATION_HANDOFF .md's "Queue
-- Requirement": `application_callback` and `token_exchange` must never be
-- able to run concurrently, because `token_exchange` 404s
-- (APPLICATION_NOT_FOUND, non-retryable) if the LINE Service hasn't
-- committed the application from the callback yet -- and a 404 burns the
-- row straight to `failed_permanent` with no notification ever sent, even
-- though the callback goes on to succeed moments later.
--
-- submit_partner_application() enqueues `token_exchange` for a LINE-first
-- submission in the very same INSERT that fires applications_after_write(),
-- which enqueues `application_callback` -- both rows land with
-- next_attempt_at = now(), so claim_due_line_calls() (ORDER BY
-- next_attempt_at, LIMIT 20, no tie-break) can hand both to the same cron
-- tick and race them. This is the gap behind the handoff doc's "สถานะที่
-- ตรวจพบ": PENDING callbacks succeed, but LINE-first applications never end
-- up with a verified identity link because token_exchange keeps losing the
-- race.
--
-- 0006 fixed the equivalent web-first race for `link_token` by not
-- enqueueing it until APPROVED. token_exchange can't use that trick --it's
-- enqueued at submission time by design (Flow 1 has no approval gate)-- so
-- this fixes it at claim time instead: a `token_exchange` row is only
-- eligible for claiming once its sibling `application_callback` (same
-- application_id) has reached `delivered`. If the callback is still
-- pending/retrying, token_exchange just waits for the next tick, per the
-- doc's "หาก callback ต้อง retry ให้ token_exchange รอต่อไป". If the callback
-- ever burns to failed_permanent, token_exchange stays blocked forever too
-- -- correct, since the application was never actually committed on the LINE
-- Service side, so exchanging the token would only ever 404.
--
-- Run after 0006, same way (paste into Supabase SQL Editor).

-- Backs the new EXISTS check below -- without it, every token_exchange claim
-- attempt does a sequential scan of outbound_line_calls for its sibling row.
CREATE INDEX IF NOT EXISTS outbound_line_calls_application_call_type_idx
  ON thunder_partner.outbound_line_calls (application_id, call_type)
  WHERE application_id IS NOT NULL;

-- Same signature as 0005 -- CREATE OR REPLACE is enough, no DROP needed.
-- Only change: the added `call_type <> 'token_exchange' OR NOT EXISTS (...)`
-- clause.
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
      AND (
        olc.call_type <> 'token_exchange'
        OR NOT EXISTS (
          SELECT 1 FROM thunder_partner.outbound_line_calls cb
          WHERE cb.application_id = olc.application_id
            AND cb.call_type = 'application_callback'
            AND cb.status <> 'delivered'
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
