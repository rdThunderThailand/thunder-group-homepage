import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { LINE_TOKEN_COOKIE } from "@/features/partner/lineToken";

// Submits the registration wizard (step 5). Everything that talks to the
// LINE Service itself happens later, out of band, via the Vercel Cron
// worker reading thunder_partner.outbound_line_calls -- this handler only
// has to get the application committed to our own DB, which is why its
// error surface is just "bad input" / "unexpected failure", not the
// contract's ~15 LINE Service error codes (those belong to the cron job).
const SYSTEM_ACTOR_ID = "partner-web";

type SubmitBody = {
  submissionId: string;
  taxId: string;
  companyName: string;
  email: string;
  applicationData: Record<string, unknown>;
};

// Route Handlers don't get the Origin check Server Actions get for free
// (design review Q16) -- SameSite=Lax on the LINE-token cookie is the
// primary defense, this is the defense-in-depth layer for everything else.
function isSameOrigin(request: NextRequest): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "none";

  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  let body: SubmitBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  if (!body.submissionId || !body.taxId || !body.companyName || !body.email) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  // NOTE: `applicationData.account.password` must never reach here -- it
  // lands in a plain jsonb column for reviewers to read. The client already
  // omits it, but strip it again defensively since this endpoint only
  // records the application; creating the partner's actual login credential
  // (Supabase Auth) is a separate, not-yet-built concern.
  const applicationData: Record<string, unknown> = { ...body.applicationData };
  if (applicationData.account && typeof applicationData.account === "object") {
    const account: Record<string, unknown> = { ...applicationData.account };
    delete account.password;
    applicationData.account = account;
  }

  const lineToken = request.cookies.get(LINE_TOKEN_COOKIE)?.value ?? null;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.rpc("submit_partner_application", {
    p_submission_id: body.submissionId,
    p_tax_id: body.taxId,
    p_company_name: body.companyName,
    p_email: body.email,
    p_actor_id: SYSTEM_ACTOR_ID,
    p_application_data: applicationData,
    p_line_token: lineToken,
  });

  if (error) {
    console.error("submit_partner_application failed", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }

  const response = NextResponse.json({
    applicationId: data.id,
    status: data.status,
  });

  // One-time LINE token has been handed off to the RPC -- clear it so a
  // page refresh/back-navigation can't resend it.
  response.cookies.delete(LINE_TOKEN_COOKIE);

  return response;
}
