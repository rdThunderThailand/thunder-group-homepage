import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { geolocation } from "@vercel/functions";
import { routing, type Locale } from "@/i18n/routing";
import {
  LINE_TOKEN_COOKIE,
  LINE_TOKEN_MAX_AGE_SECONDS,
  LINE_TOKEN_PATTERN,
} from "@/features/partner/lineToken";

// Next.js 16 renamed the `middleware` file convention to `proxy`. next-intl
// still ships its handler as `next-intl/middleware`; only the file name and the
// exported function name changed.
const handleI18nRouting = createMiddleware(routing);

const LOCALE_COOKIE = "NEXT_LOCALE";

function hasLocalePrefix(pathname: string) {
  return routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

function localeForCountry(country: string | undefined): Locale {
  if (country === "TH") return "th";
  if (country) return "en";
  // No geo data — `next dev`, or any host that is not Vercel. Treated as
  // "unknown", which the spec resolves to the site default.
  return routing.defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // LINE-first entry (`?t=<token>`, see docs/partner_web_api_contract.md).
  // A Server Component page can't write cookies -- only a Route Handler,
  // Server Action, or this proxy can -- so the token has to be captured
  // here, before next-intl's own routing runs. Redirects with `t` stripped
  // in the same hop so a single-use secret never sits in the URL bar,
  // browser history, or Vercel's request logs (design review Q17).
  if (pathname.endsWith("/partners")) {
    const token = request.nextUrl.searchParams.get("t");
    if (token) {
      const url = request.nextUrl.clone();
      url.searchParams.delete("t");
      if (!hasLocalePrefix(url.pathname)) {
        const locale = localeForCountry(geolocation(request).country);
        url.pathname = `/${locale}${url.pathname}`;
      }

      const response = NextResponse.redirect(url);
      if (LINE_TOKEN_PATTERN.test(token)) {
        response.cookies.set(LINE_TOKEN_COOKIE, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: LINE_TOKEN_MAX_AGE_SECONDS,
          path: "/",
        });
      }
      return response;
    }
  }

  // Priority: URL prefix > user's own cookie > geo-IP > site default (`th`).
  // The first two are handled by `handleI18nRouting` below. Geo-IP only gets a
  // say on a first-time visit that carries neither signal — and when it does we
  // redirect unconditionally, so next-intl never reaches its `accept-language`
  // fallback. The cookie is deliberately not set here: it records a *manual*
  // language choice only, so geo-IP keeps being re-evaluated until the visitor
  // picks a language themselves.
  if (!hasLocalePrefix(pathname) && !request.cookies.has(LOCALE_COOKIE)) {
    const locale = localeForCountry(geolocation(request).country);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
