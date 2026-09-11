#!/usr/bin/env node
// Fails when the Thai and English message dictionaries drift apart.
//
// `th` is the source of truth (site default locale). For every key that exists
// in a `messages/th/*.json` file, the matching English file must have that key
// with a non-empty value, and vice versa. At runtime `src/i18n/messages.ts`
// falls back to Thai for a missing English key so the page never breaks — this
// check is what stops that fallback from silently shipping to production.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MESSAGES_DIR = "messages";
const BASE_LOCALE = "th";
const LOCALES = ["th", "en"];

/** Flatten a nested message object to dotted key paths. Arrays are treated as leaves. */
function flatten(value, prefix = "", out = {}) {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      flatten(child, path, out);
    } else {
      out[path] = child;
    }
  }
  return out;
}

/** { [namespace]: { [dottedKey]: value } } for one locale. */
function loadLocale(locale) {
  const dir = join(MESSAGES_DIR, locale);
  const namespaces = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const namespace = file.slice(0, -".json".length);
    namespaces[namespace] = flatten(
      JSON.parse(readFileSync(join(dir, file), "utf8")),
    );
  }
  return namespaces;
}

const byLocale = Object.fromEntries(
  LOCALES.map((locale) => [locale, loadLocale(locale)]),
);

const problems = [];
const allNamespaces = new Set(
  LOCALES.flatMap((locale) => Object.keys(byLocale[locale])),
);

for (const namespace of [...allNamespaces].sort()) {
  const baseKeys = byLocale[BASE_LOCALE][namespace];
  if (!baseKeys) {
    problems.push(`[${BASE_LOCALE}] missing namespace file: ${namespace}.json`);
    continue;
  }

  for (const locale of LOCALES) {
    if (locale === BASE_LOCALE) continue;
    const localeKeys = byLocale[locale][namespace];
    if (!localeKeys) {
      problems.push(`[${locale}] missing namespace file: ${namespace}.json`);
      continue;
    }

    for (const key of Object.keys(baseKeys)) {
      if (!(key in localeKeys)) {
        problems.push(`[${locale}] ${namespace}.json missing key: ${key}`);
      } else if (localeKeys[key] === "") {
        problems.push(`[${locale}] ${namespace}.json empty value: ${key}`);
      }
    }
    for (const key of Object.keys(localeKeys)) {
      if (!(key in baseKeys)) {
        problems.push(
          `[${BASE_LOCALE}] ${namespace}.json missing key present in ${locale}: ${key}`,
        );
      }
    }
  }
}

if (problems.length > 0) {
  console.error(
    `\n✖ i18n check failed (${problems.length} problem${problems.length === 1 ? "" : "s"}):\n` +
      problems.map((problem) => `  ${problem}`).join("\n") +
      "\n",
  );
  process.exit(1);
}

console.log("✓ i18n check passed — th/en key sets match");
