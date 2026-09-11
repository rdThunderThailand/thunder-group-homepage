import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { marketingPageMetadata } from "@/components/marketing/pageMetadata";

const NAMESPACE = "AboutPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return marketingPageMetadata(NAMESPACE, locale);
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <MarketingPage
      namespace={NAMESPACE}
      locale={locale}
      gridClassName="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    />
  );
}
