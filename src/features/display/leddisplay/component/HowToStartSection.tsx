// 12 · HOW DO YOU WANT TO START? — "Choose the Path That Fits Your Project."
// Light section. Header with a top-right "view all options" link above a
// three-card row; each card is a `Link` with an icon badge, a title, a short
// description and a per-card link label. The Rent card points at the existing
// rental page; the others open the contact route.

import { ArrowRight, Building2, CalendarClock, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeader } from "./SectionHeader";
import type { LedHowToStartContent } from "../../types/leddisplayTypes";

/** Per-option destination + icon, paired to `howToStart.options` by index. */
const OPTION_META: { href: string; Icon: LucideIcon }[] = [
  { href: "/contact", Icon: Building2 },
  { href: "/what-do-you-need/rent-technology", Icon: CalendarClock },
  { href: "/contact", Icon: Compass },
];

type HowToStartSectionProps = {
  content: LedHowToStartContent;
};

export function HowToStartSection({ content }: HowToStartSectionProps) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.label}
          title={content.title}
          action={{ label: content.viewAll, href: "/contact" }}
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {content.options.map((option, index) => {
            const { href, Icon } = OPTION_META[index] ?? OPTION_META[0];
            return (
              <Link
                key={option.title}
                href={href}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-lg hover:shadow-slate-200/70"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-neutral-900">
                  {option.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">
                  {option.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors group-hover:text-brand-strong">
                  {option.linkLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
