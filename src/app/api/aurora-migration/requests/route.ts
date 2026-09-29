import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const apiUrl = process.env.THUNDER_LINE_API_URL;
  if (!apiUrl) return NextResponse.json({ error: "THUNDER_LINE_API_URL_MISSING" }, { status: 500 });

  const authorization = request.headers.get("authorization");
  if (!authorization) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  try {
    const upstream = await fetch(new URL("/aurora-migration/requests", apiUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authorization },
      body: await request.text(),
      cache: "no-store",
    });
    const payload = await upstream.json().catch(() => ({ error: "UPSTREAM_ERROR" }));
    return NextResponse.json(payload, { status: upstream.status });
  } catch (error) {
    console.error("Aurora migration request failed", error);
    return NextResponse.json({ error: "UPSTREAM_UNAVAILABLE" }, { status: 502 });
  }
}
