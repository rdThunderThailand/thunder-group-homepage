import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Common" });

  return {
    title: t("brandName"),
    description: t("tagline"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // `Navbar` is a Client Component, so its namespace — plus `Common`, which it
  // and the shared `LocaleSwitcher` read — is handed to the client bundle here.
  // `Footer` and every page stay on the server and pull translations straight
  // from `next-intl/server`'s request-scoped store, so their namespaces never
  // cross this boundary.
  const messages = await getMessages();

  return (
    <html lang={locale} className={prompt.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <NextIntlClientProvider
          messages={{ Common: messages.Common, Navbar: messages.Navbar }}
        >
          {/* `overlay` — the Home page (the only route today) opens on a dark
              full-bleed hero that pulls itself up under the bar. */}
          <Navbar overlay />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
