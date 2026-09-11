// 3 · WHY INTERACTIVE — "When People Need More Than Information."
// Light section. Split header (eyebrow + heading + lead on the left), and on
// the right the "SEE → TOUCH → UNDERSTAND → ACT" flow above a three-up strip of
// placeholders standing in for the interaction sequence. Below, a five-up row
// of icon + title + one-line features.

import { Fragment } from "react";
import {
  ArrowRight,
  Compass,
  Link2,
  ListChecks,
  MousePointerClick,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import { Placeholder } from "./Placeholder";
import journeyImage from "@/image/interactive-kiosk/why-interactive-journey.png";
import type { KioskWhyContent } from "../../types/interactivekioskTypes";

/** Feature icons, paired to `whyInteractive.features` by index. */
const FEATURE_ICONS: LucideIcon[] = [
  Compass,
  Search,
  ListChecks,
  MousePointerClick,
  Link2,
];

type WhyInteractiveSectionProps = {
  content: KioskWhyContent;
};

export function WhyInteractiveSection({ content }: WhyInteractiveSectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500">
              {content.description}
            </p>
          </div>

          <div>
            {/* SEE → TOUCH → UNDERSTAND → ACT */}
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-800">
              {content.flow.map((step, index) => (
                <Fragment key={step}>
                  <li>{step}</li>
                  {index < content.flow.length - 1 ? (
                    <ArrowRight
                      className="h-3.5 w-3.5 text-slate-300"
                      aria-hidden="true"
                    />
                  ) : null}
                </Fragment>
              ))}
            </ol>

            <Placeholder src={journeyImage} alt={content.title} className="mt-5 aspect-[16/10] w-full" />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {content.features.map((feature, index) => {
            const Icon = FEATURE_ICONS[index] ?? FEATURE_ICONS[0];
            return (
              <div key={feature.title} className="flex flex-col">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
