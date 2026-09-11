// Shared body for every interior route page: a dark `PageHero`, a `primary`
// section with a placeholder card grid, a `secondary` "coming soon" section,
// and the site-wide `TalkToThunder` CTA. Every string comes from `namespace`,
// which has a uniform shape across all pages — see `messages/{th,en}/<page>.json`.

import { getTranslations } from "next-intl/server";
import { PageHero } from "./PageHero";
import { PageSection } from "./PageSection";
import { PlaceholderGrid } from "./PlaceholderGrid";
import { TalkToThunder } from "./TalkToThunder";
import type { PlaceholderItem } from "./types";

type MarketingPageProps = {
  namespace: string;
  locale: string;
  /** Per-item destination paths for the primary grid, paired by index. Omit for
   *  a non-interactive placeholder grid. */
  hrefs?: readonly string[];
  /** Tailwind classes for the primary grid wrapper. */
  gridClassName?: string;
};

export async function MarketingPage({
  namespace,
  locale,
  hrefs,
  gridClassName,
}: MarketingPageProps) {
  const t = await getTranslations({ locale, namespace });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const items = t.raw("items") as PlaceholderItem[];

  return (
    <>
      <PageHero
        content={{
          eyebrow: t("hero.eyebrow"),
          title: t("hero.title"),
          description: t("hero.description"),
        }}
      />

      <PageSection
        content={{
          eyebrow: t("primary.eyebrow"),
          title: t("primary.title"),
          description: t("primary.description"),
        }}
      >
        <PlaceholderGrid
          items={items}
          hrefs={hrefs}
          cta={tCommon("learnMore")}
          className={gridClassName}
        />
      </PageSection>

      <PageSection
        muted
        content={{
          eyebrow: t("secondary.eyebrow"),
          title: t("secondary.title"),
          description: t("secondary.description"),
        }}
      >
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 text-center text-sm text-slate-400">
          {tCommon("comingSoon")}
        </div>
      </PageSection>

      <TalkToThunder />
    </>
  );
}
