import { NextResponse, type NextRequest } from "next/server";
import { LINE_TOKEN_COOKIE } from "@/features/partner/lineToken";

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

  const lineToken = request.cookies.get(LINE_TOKEN_COOKIE)?.value ?? null;
  const apiUrl = process.env.THUNDER_LINE_API_URL;
  const systemSecret = process.env.PARTNER_SYSTEM_SECRET;
  if (!apiUrl || !systemSecret) {
    console.error("THUNDER_LINE_API_URL / PARTNER_SYSTEM_SECRET are not set");
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(new URL("/partner/applications", apiUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${systemSecret}`,
      },
      body: JSON.stringify({ ...body, token: lineToken }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("partner application request failed", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }

  const payload = await upstream.json().catch(() => ({ error: "UPSTREAM_ERROR" }));
  const response = NextResponse.json(payload, { status: upstream.status });

  if (upstream.ok) response.cookies.delete(LINE_TOKEN_COOKIE);

  return response;
}
