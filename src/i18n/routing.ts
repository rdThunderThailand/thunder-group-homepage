import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["th", "en"],
  defaultLocale: "th",
  // Every locale carries its prefix, including the default: `/th/...`, `/en/...`.
  localePrefix: "always",
  // Kept on so that a returning visitor's `NEXT_LOCALE` cookie still wins when
  // they land on `/`. `proxy.ts` redirects before next-intl ever reaches the
  // `accept-language` step, so browser language never overrides geo-IP.
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
