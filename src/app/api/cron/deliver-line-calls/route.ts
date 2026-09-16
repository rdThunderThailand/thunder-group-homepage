import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Triggered by Vercel Cron every minute (see vercel.json). This is the ONLY
// place that ever calls the LINE Service's HTTP API -- everything else
// (the submit Route Handler, the DB triggers) just enqueues rows into
// thunder_partner.outbound_line_calls and leaves the actual delivery to this
// worker, per the design review's decision to never do it inline at submit
// time (avoids blocking the user on a third-party call, and avoids racing
// the function's own execution-time limit on retries).

const LINE_API_URL = process.env.THUNDER_LINE_API_URL;
const LINE_API_SECRET = process.env.PARTNER_SYSTEM_SECRET;

const ENDPOINT_BY_CALL_TYPE: Record<string, string> = {
  application_callback: "/callbacks/partner",
  token_exchange: "/partner/token/exchange",
  link_token: "/partner/link-token",
  relationship_callback: "/callbacks/partner/relationship",
};

// Contract's Error Contract table: retry only network errors, 500 and 503.
// Everything else needs a human/code fix, so retrying just burns through
// the backoff schedule without ever succeeding.
const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404, 409, 410, 413]);

type ClaimedCall = {
  id: string;
  call_type: string;
  payload: Record<string, unknown>;
};

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return request.headers.get("authorization") === `Bearer ${expected}`;
}

async function deliver(call: ClaimedCall): Promise<{ success: boolean; retryable: boolean; error: string | null }> {
  const path = ENDPOINT_BY_CALL_TYPE[call.call_type];
  if (!path) {
    return { success: false, retryable: false, error: `UNKNOWN_CALL_TYPE:${call.call_type}` };
  }

  try {
    const response = await fetch(`${LINE_API_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LINE_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(call.payload),
    });

    if (response.ok) {
      return { success: true, retryable: false, error: null };
    }

    const body: unknown = await response.json().catch(() => null);
    const errorCode =
      body && typeof body === "object" && "error" in body ? String((body as { error: unknown }).error) : `HTTP_${response.status}`;
    return {
      success: false,
      retryable: !NON_RETRYABLE_STATUSES.has(response.status),
      error: errorCode,
    };
  } catch (err) {
    // fetch() throwing means a network-level failure -- always retryable.
    return {
      success: false,
      retryable: true,
      error: err instanceof Error ? err.message : "NETWORK_ERROR",
    };
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (!LINE_API_URL || !LINE_API_SECRET) {
    console.error("deliver-line-calls: THUNDER_LINE_API_URL / PARTNER_SYSTEM_SECRET not set");
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }

  const supabase = createServiceRoleClient();
  const { data: calls, error: claimError } = await supabase.rpc("claim_due_line_calls", { p_limit: 20 });

  if (claimError) {
    console.error("claim_due_line_calls failed", claimError);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }

  const results = [];
  for (const call of (calls ?? []) as ClaimedCall[]) {
    const outcome = await deliver(call);

    const { error: reportError } = await supabase.rpc("record_line_call_result", {
      p_id: call.id,
      p_success: outcome.success,
      p_error: outcome.error,
      p_retryable: outcome.retryable,
    });

    if (reportError) {
      console.error("record_line_call_result failed", call.id, reportError);
    }

    results.push({ id: call.id, callType: call.call_type, success: outcome.success, error: outcome.error });
  }

  return NextResponse.json({ processed: results.length, results });
}
