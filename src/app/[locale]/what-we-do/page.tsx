import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { marketingPageMetadata } from "@/components/marketing/pageMetadata";

const NAMESPACE = "WhatWeDoPage";

/** Grid destinations, paired to `items` by index — the What Do You Need pages. */
const ITEM_HREFS = [
  "/what-do-you-need/buy-technology",
  "/what-do-you-need/rent-technology",
  "/what-do-you-need/build-smarter-workplace",
  "/what-do-you-need/solve-it-operations",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return marketingPageMetadata(NAMESPACE, locale);
}

export default async function WhatWeDoPage({
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
