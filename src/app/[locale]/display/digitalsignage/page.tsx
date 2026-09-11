import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DigitalsignageClient } from "@/features/display/digitalsignage/digitalsignageClient";
import type { DigitalSignageContent } from "@/features/display/digitalsignage/types";

// Digital Signage solution page. `Navbar` and `Footer` wrap every route from
// `src/app/[locale]/layout.tsx`, so `DigitalsignageClient` renders only the
// body. Per the project's i18n split, every string is resolved here on the
// server (the `DigitalSignagePage` namespace + the `Common` wordmark) and the
// whole content tree is handed to the Client Component as one plain prop — it
// never calls `useTranslations`.

const NAMESPACE = "DigitalSignagePage";

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

export default async function DigitalSignagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations(NAMESPACE);
  const tCommon = await getTranslations("Common");

  return (
    <DigitalsignageClient
      brand={tCommon("wordmark")}
      content={t.raw("content") as DigitalSignageContent}
    />
  );
}
