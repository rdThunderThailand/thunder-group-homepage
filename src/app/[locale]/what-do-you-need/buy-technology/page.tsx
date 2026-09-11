import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BuyTechnologyClient } from "@/features/what-do-you-need/buy-technology/buy-technologyClient";
import type {
  BannerItem,
  HeroFeature,
  TechnologyCategory,
} from "@/features/what-do-you-need/buy-technology/types";

// Technology Category page. `Navbar` and `Footer` wrap every route from
// `src/app/[locale]/layout.tsx`, so `BuyTechnologyClient` renders only the body.
// Per the project's i18n split, every string is resolved here on the server
// (the `BuyTechnologyPage` namespace + the `Common` wordmark) and handed to the
// Client Component as plain props — it never calls `useTranslations`.

const NAMESPACE = "BuyTechnologyPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NAMESPACE });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function BuyTechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations(NAMESPACE);
  const tCommon = await getTranslations("Common");

  return (
    <BuyTechnologyClient
      brand={tCommon("wordmark")}
      breadcrumb={{
        home: t("breadcrumb.home"),
        current: t("breadcrumb.current"),
      }}
      hero={{
        eyebrow: t("hero.eyebrow"),
        title: t("hero.title"),
        description: t("hero.description"),
        features: t.raw("hero.features") as HeroFeature[],
        imageOverlayTitle: t("hero.imageOverlayTitle"),
        imageSideNote: t("hero.imageSideNote"),
        imageCaption: t("hero.imageCaption"),
      }}
      categorySection={{
        eyebrow: t("categorySection.eyebrow"),
        aside: t("categorySection.aside"),
        title: t("categorySection.title"),
        description: t("categorySection.description"),
        categories: t.raw("categorySection.categories") as TechnologyCategory[],
      }}
      ctaStrip={{
        title: t("ctaStrip.title"),
        description: t("ctaStrip.description"),
        primaryCta: t("ctaStrip.primaryCta"),
        secondaryCta: t("ctaStrip.secondaryCta"),
      }}
      bottomBanner={{
        title: t("bottomBanner.title"),
        items: t.raw("bottomBanner.items") as BannerItem[],
      }}
    />
  );
}
