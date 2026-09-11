import { routing, type Locale } from "./routing";

// [next-intl namespace, file basename under messages/<locale>/]
const namespaces = [
  ["Common", "common"],
  ["Navbar", "navbar"],
  ["Footer", "footer"],
  ["Cta", "cta"],
  ["HomePage", "home"],
  ["WhatWeDoPage", "what-we-do"],
  ["SolutionsPage", "solutions"],
  ["BusinessesPage", "businesses"],
  ["ProjectsPage", "projects"],
  ["PartnersPage", "partners"],
  ["InsightsPage", "insights"],
  ["AboutPage", "about"],
  ["BuyTechnologyPage", "buy-technology"],
  ["RentTechnologyPage", "rent-technology"],
  ["DigitalSignagePage", "digitalsignage"],
  ["DisplayPage", "display"],
  ["LedDisplayPage", "leddisplay"],
  ["InteractiveKioskPage", "interactivekiosk"],
] as const;

type MessageTree = Record<string, unknown>;

function isPlainObject(value: unknown): value is MessageTree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Overlay `override` on top of `base`. Any key present in `override` wins;
 * keys that exist only in `base` fall through unchanged. This is what makes a
 * not-yet-translated English string render its Thai source text instead of a
 * raw `Namespace.key` placeholder. `scripts/check-i18n.mjs` fails the build
 * when that happens, so the fallback is a safety net, not a resting state.
 */
function deepMerge(base: MessageTree, override: MessageTree): MessageTree {
  const result: MessageTree = { ...base };
  for (const key of Object.keys(override)) {
    const overrideValue = override[key];
    const baseValue = result[key];
    result[key] =
      isPlainObject(baseValue) && isPlainObject(overrideValue)
        ? deepMerge(baseValue, overrideValue)
        : overrideValue;
  }
  return result;
}

function loadNamespace(locale: Locale, file: string): Promise<MessageTree> {
  return import(`../../messages/${locale}/${file}.json`).then(
    (module) => module.default as MessageTree,
  );
}

export async function loadMessages(locale: Locale) {
  const entries = await Promise.all(
    namespaces.map(async ([namespace, file]) => {
      const base = await loadNamespace(routing.defaultLocale, file);
      const messages =
        locale === routing.defaultLocale
          ? base
          : deepMerge(base, await loadNamespace(locale, file));
      return [namespace, messages] as const;
    }),
  );

  return Object.fromEntries(entries);
}
