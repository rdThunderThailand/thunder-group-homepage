import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RentTechnologyClient } from "@/features/what-do-you-need/rent-technology/rent-technologyClient";
import type {
  RentalProduct,
  UseCaseCard,
  EquipmentItem,
  HowItWorksStep,
} from "@/features/what-do-you-need/rent-technology/types";

// Display Rental landing page. `Navbar` and `Footer` wrap every route from
// `src/app/[locale]/layout.tsx`, so `RentTechnologyClient` renders only the
// body. Per the project's i18n split, every string is resolved here on the
// server (the `RentTechnologyPage` namespace) and handed to the Client
// Component as plain props — it never calls `useTranslations`.

const NAMESPACE = "RentTechnologyPage";

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

export default async function RentTechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations(NAMESPACE);

  return (
    <RentTechnologyClient
      breadcrumb={{
        home: t("breadcrumb.home"),
        display: t("breadcrumb.display"),
        rental: t("breadcrumb.rental"),
      }}
      hero={{
        eyebrow: t("hero.eyebrow"),
        title: t("hero.title"),
        description: t("hero.description"),
        form: {
          lookingForLabel: t("hero.form.lookingForLabel"),
          lookingForOptions: t.raw("hero.form.lookingForOptions") as string[],
          whenLabel: t("hero.form.whenLabel"),
          whenPlaceholder: t("hero.form.whenPlaceholder"),
          submit: t("hero.form.submit"),
        },
        quoteLink: t("hero.quoteLink"),
        imageOverlayTitle: t("hero.imageOverlayTitle"),
        imageSideNote: t("hero.imageSideNote"),
      }}
      startHere={{
        eyebrow: t("startHere.eyebrow"),
        title: t("startHere.title"),
        description: t("startHere.description"),
        helpLink: t("startHere.helpLink"),
        cards: t.raw("startHere.cards") as UseCaseCard[],
      }}
      equipment={{
        eyebrow: t("equipment.eyebrow"),
        title: t("equipment.title"),
        description: t("equipment.description"),
        viewAllLink: t("equipment.viewAllLink"),
        exploreLink: t("equipment.exploreLink"),
        items: t.raw("equipment.items") as EquipmentItem[],
      }}
      popular={{
        eyebrow: t("popular.eyebrow"),
        title: t("popular.title"),
        description: t("popular.description"),
        viewAllLink: t("popular.viewAllLink"),
        popularBadge: t("popular.popularBadge"),
        detailsCta: t("popular.detailsCta"),
        quoteCta: t("popular.quoteCta"),
        products: t.raw("popular.products") as RentalProduct[],
      }}
      howItWorks={{
        eyebrow: t("howItWorks.eyebrow"),
        title: t("howItWorks.title"),
        description: t("howItWorks.description"),
        steps: t.raw("howItWorks.steps") as HowItWorksStep[],
        aside: {
          title: t("howItWorks.aside.title"),
          description: t("howItWorks.aside.description"),
          link: t("howItWorks.aside.link"),
        },
      }}
      bottomCta={{
        eyebrow: t("bottomCta.eyebrow"),
        title: t("bottomCta.title"),
        description: t("bottomCta.description"),
        primaryCta: t("bottomCta.primaryCta"),
        secondaryCta: t("bottomCta.secondaryCta"),
        sideNote: t("bottomCta.sideNote"),
      }}
    />
  );
}
