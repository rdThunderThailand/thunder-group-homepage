import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { marketingPageMetadata } from "@/components/marketing/pageMetadata";

const NAMESPACE = "BusinessesPage";

/** Grid destinations, paired to `items` by index. Sub-pages not built yet —
 *  these match `WhatWeBuildSection`'s links on the Home page. */
const ITEM_HREFS = [
  "/businesses/thunder-display",
  "/businesses/thunderone",
  "/businesses/cityzen",
  "/businesses/wonder",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return marketingPageMetadata(NAMESPACE, locale);
}

export default async function BusinessesPage({
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
