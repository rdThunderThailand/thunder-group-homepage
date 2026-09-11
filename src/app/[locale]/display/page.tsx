import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DisplayClient } from "@/features/display/displayClient";
import type { DisplayContent } from "@/features/display/types/displayTypes";

// Display Solutions hub page. `Navbar` and `Footer` wrap every route from
// `src/app/[locale]/layout.tsx`, so `DisplayClient` renders only the body. Per
// the project's i18n split, every string is resolved here on the server (the
// `DisplayPage` namespace) and the whole content tree is handed to the Client
// Component as one plain prop — it never calls `useTranslations`.

const NAMESPACE = "DisplayPage";

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

export default async function DisplayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations(NAMESPACE);

  return <DisplayClient content={t.raw("content") as DisplayContent} />;
}
