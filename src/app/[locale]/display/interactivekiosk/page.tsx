import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InteractiveKioskClient } from "@/features/display/interactivekiosk/interactivekioskClient";
import type { InteractiveKioskContent } from "@/features/display/types/interactivekioskTypes";

// Interactive & Kiosk solution page. `Navbar` and `Footer` wrap every route
// from `src/app/[locale]/layout.tsx`, so `InteractiveKioskClient` renders only
// the body. Per the project's i18n split, every string is resolved here on the
// server (the `InteractiveKioskPage` namespace) and the whole content tree is
// handed to the Client Component as one plain prop — it never calls
// `useTranslations`.

const NAMESPACE = "InteractiveKioskPage";

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

export default async function InteractiveKioskPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations(NAMESPACE);

  return (
    <InteractiveKioskClient
      content={t.raw("content") as InteractiveKioskContent}
    />
  );
}
