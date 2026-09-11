import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeClient } from "@/features/home/HomeClient";
import type {
  BusinessCard,
  ContactChannel,
  HeroPillar,
  StartHereCard,
  WorkProject,
} from "@/features/home/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Resolve every string on the server and hand the client a plain content
  // tree — `HomeClient` and its sections never touch `useTranslations`. The
  // closing CTA reads the shared `Cta` namespace (every interior page reuses
  // the same block); everything else is the `HomePage` namespace.
  const t = await getTranslations("HomePage");
  const tCta = await getTranslations("Cta");

  return (
    <HomeClient
      hero={{
        title: t("hero.title"),
        description: t("hero.description"),
        ctaPrimary: t("hero.ctaPrimary"),
        ctaSecondary: t("hero.ctaSecondary"),
        scrollHint: t("hero.scrollHint"),
        sideNote: t("hero.sideNote"),
        pillars: t.raw("hero.pillars") as HeroPillar[],
      }}
      startHere={{
        number: t("startHere.number"),
        eyebrow: t("startHere.eyebrow"),
        title: t("startHere.title"),
        description: t("startHere.description"),
        cards: t.raw("startHere.cards") as StartHereCard[],
      }}
      whatWeBuild={{
        number: t("whatWeBuild.number"),
        eyebrow: t("whatWeBuild.eyebrow"),
        title: t("whatWeBuild.title"),
        description: t("whatWeBuild.description"),
        cta: t("whatWeBuild.cta"),
        businesses: t.raw("whatWeBuild.businesses") as BusinessCard[],
      }}
      ourWork={{
        number: t("ourWork.number"),
        eyebrow: t("ourWork.eyebrow"),
        title: t("ourWork.title"),
        description: t("ourWork.description"),
        cta: t("ourWork.cta"),
        featured: {
          label: t("ourWork.featured.label"),
          title: t("ourWork.featured.title"),
          cta: t("ourWork.featured.cta"),
        },
        projects: t.raw("ourWork.projects") as WorkProject[],
      }}
      whyThunder={{
        number: t("whyThunder.number"),
        eyebrow: t("whyThunder.eyebrow"),
        title: t("whyThunder.title"),
        description: t("whyThunder.description"),
        cta: t("whyThunder.cta"),
        words: t.raw("whyThunder.words") as string[],
      }}
      talkToThunder={{
        number: "05",
        eyebrow: tCta("eyebrow"),
        title: tCta("title"),
        description: tCta("description"),
        cta: tCta("cta"),
        sideNote: tCta("sideNote"),
        channels: tCta.raw("channels") as ContactChannel[],
      }}
    />
  );
}
