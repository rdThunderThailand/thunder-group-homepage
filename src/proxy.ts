import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { geolocation } from "@vercel/functions";
import { routing, type Locale } from "@/i18n/routing";

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
