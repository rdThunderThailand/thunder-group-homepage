import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { marketingPageMetadata } from "@/components/marketing/pageMetadata";

const NAMESPACE = "SolutionsPage";

/** Grid destinations, paired to `items` by index. Sub-pages not built yet. */
const ITEM_HREFS = [
  "/solutions/digital-signage-media",
  "/solutions/communication",
  "/solutions/thunder-care",
  "/solutions/asset-intelligence",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return marketingPageMetadata(NAMESPACE, locale);
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <MarketingPage namespace={NAMESPACE} locale={locale} hrefs={ITEM_HREFS} />
  );
}
