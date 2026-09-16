import type { SVGProps } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import thunderLogoWhite from "@/image/logo/thunder-logo-white.png";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** lucide-react dropped brand glyphs, so the social marks are inlined here. */
function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56v12h3.38v-12Z" />
      <path d="M5.25 7A2 2 0 1 0 5.25 3a2 2 0 0 0 0 4Z" />
      <path d="M20.5 20.5h-3.37v-5.87c0-1.47-.52-2.47-1.84-2.47-1 0-1.6.68-1.87 1.34-.1.24-.12.57-.12.9v6.1H9.92s.05-10.97 0-12h3.38v1.44c.45-.7 1.25-1.7 3.29-1.7 2.53 0 4.41 1.66 4.41 5.12v7.14Z" />
    </svg>
  );
}

function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.95C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.64.49A2.75 2.75 0 0 0 2.42 7.19 28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .42 4.81 2.75 2.75 0 0 0 1.94 1.95c1.74.49 7.64.49 7.64.49s5.9 0 7.64-.49a2.75 2.75 0 0 0 1.94-1.95A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.42-4.81ZM10.02 15.02V8.98L15.5 12l-5.48 3.02Z" />
    </svg>
  );
}

function LineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 3C6.9 3 2.75 6.32 2.75 10.44c0 3.69 2.62 6.78 6.16 7.36.24.05.57.16.65.36.07.19.05.48.02.67l-.1.62c-.03.18-.15.72.64.39.79-.33 4.24-2.5 5.79-4.28 1.06-1.17 1.58-2.36 1.58-3.5C21.25 6.32 17.1 3 12 3Zm-3.6 9.95H6.36a.34.34 0 0 1-.34-.34V8.5a.34.34 0 0 1 .68 0v3.77H8.4a.34.34 0 0 1 0 .68Zm1.6-.34a.34.34 0 0 1-.68 0V8.5a.34.34 0 0 1 .68 0v4.11Zm3.9 0a.34.34 0 0 1-.61.2l-2.1-2.85v2.65a.34.34 0 0 1-.68 0V8.5a.34.34 0 0 1 .61-.2l2.1 2.85V8.5a.34.34 0 0 1 .68 0v4.11Zm2.98-2.4a.34.34 0 0 1 0 .68h-1.36v1.03h1.36a.34.34 0 0 1 0 .68h-1.7a.34.34 0 0 1-.34-.34V8.5a.34.34 0 0 1 .34-.34h1.7a.34.34 0 0 1 0 .68h-1.36v1.03h1.36Z" />
    </svg>
  );
}

interface FooterLinkColumn {
  key: "solutions" | "businesses" | "explore" | "thunder";
  links: { key: string; href: string }[];
}

const LINK_COLUMNS: readonly FooterLinkColumn[] = [
  {
    key: "solutions",
    links: [
      { key: "digitalSignageMedia", href: "/solutions/digital-signage-media" },
      { key: "communication", href: "/solutions/communication" },
      { key: "thunderCare", href: "/solutions/thunder-care" },
      { key: "assetIntelligence", href: "/solutions/asset-intelligence" },
    ],
  },
  {
    key: "businesses",
    links: [
      { key: "thunderDisplay", href: "/businesses/thunder-display" },
      { key: "thunderOne", href: "/businesses/thunderone" },
      { key: "cityZen", href: "/businesses/cityzen" },
      { key: "wonder", href: "/businesses/wonder" },
    ],
  },
  {
    key: "explore",
    links: [
      { key: "projects", href: "/projects" },
      { key: "insights", href: "/insights" },
      { key: "partners", href: "/partners" },
    ],
  },
  {
    key: "thunder",
    links: [
      { key: "about", href: "/about" },
      { key: "purpose", href: "/about/purpose" },
      { key: "careers", href: "/careers" },
      { key: "contact", href: "/contact" },
    ],
  },
];

const LEGAL_LINKS = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "cookies", href: "/cookies" },
  { key: "sitemap", href: "/sitemap" },
] as const;

const SOCIAL_LINKS = [
  {
    key: "linkedin",
    href: "https://www.linkedin.com/company/thunder",
    Icon: LinkedInIcon,
  },
  { key: "youtube", href: "https://www.youtube.com/@thunder", Icon: YouTubeIcon },
  { key: "line", href: "https://line.me/", Icon: LineIcon },
] as const;

export interface FooterProps {
  className?: string;
}

export async function Footer({ className }: FooterProps) {
  const t = await getTranslations("Footer");
  const tCommon = await getTranslations("Common");
  const year = String(new Date().getFullYear());

  return (
    <footer className={cx("bg-neutral-950 text-neutral-400", className)}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          {/* Brand + tagline */}
          <div className="max-w-[16rem] lg:shrink-0">
            <Link href="/" aria-label={tCommon("wordmark")} className="block">
              <Image src={thunderLogoWhite} alt="" aria-hidden="true" className="h-14 w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed">{t("tagline")}</p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:flex-1 lg:gap-x-10">
            {LINK_COLUMNS.map((column) => (
              <nav key={column.key} aria-label={t(`columns.${column.key}.title`)}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
                  {t(`columns.${column.key}.title`)}
                </h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-sm transition-colors hover:text-white"
                      >
                        {t(`columns.${column.key}.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Social + legal + copyright */}
          <div className="flex flex-col gap-5 lg:shrink-0 lg:items-end lg:text-right">
            <div className="flex items-center gap-3">
              <div
                role="group"
                aria-label={t("social.heading")}
                className="flex items-center gap-2"
              >
                {SOCIAL_LINKS.map(({ key, href, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={t(`social.${key}`)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition-colors hover:border-white hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
              <span aria-hidden="true" className="h-5 w-px bg-white/10" />
              <LocaleSwitcher
                variant="menu"
                onDark
                label={t("changeLanguage")}
              />
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs lg:justify-end">
              {LEGAL_LINKS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {t(`legal.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-xs">{t("copyright", { year })}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
