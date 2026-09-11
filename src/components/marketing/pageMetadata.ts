import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Builds `title` / `description` from an interior page's namespace. Every
 * interior page's `generateMetadata` is one call to this.
 */
export async function marketingPageMetadata(
  namespace: string,
  locale: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}
