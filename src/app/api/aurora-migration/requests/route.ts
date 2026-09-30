import { NextResponse, type NextRequest } from "next/server";

async function forward(request: NextRequest, method: "GET" | "POST") {
  const apiUrl = process.env.THUNDER_LINE_API_URL;
  if (!apiUrl) return NextResponse.json({ error: "THUNDER_LINE_API_URL_MISSING" }, { status: 500 });

  const authorization = request.headers.get("authorization");
  if (!authorization) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  try {
    const upstream = await fetch(new URL("/aurora-migration/requests", apiUrl), {
      method,
      headers: { "Content-Type": "application/json", Authorization: authorization },
      body: method === "POST" ? await request.text() : undefined,
      cache: "no-store",
    });
    const payload = await upstream.json().catch(() => ({ error: "UPSTREAM_ERROR" }));
    return NextResponse.json(payload, { status: upstream.status });
  } catch (error) {
    console.error("Aurora migration request failed", error);
    return NextResponse.json({ error: "UPSTREAM_UNAVAILABLE" }, { status: 502 });
  }
}

export function GET(request: NextRequest) {
  return forward(request, "GET");
}

export function POST(request: NextRequest) {
  return forward(request, "POST");
}
