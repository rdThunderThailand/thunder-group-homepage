// 7 · THE COMPLETE SYSTEM — "More Than an LED Screen."
// Light section, two columns on `lg`: eyebrow + heading + lead + a solid CTA and
// a text link on the left; a placeholder isometric graphic on the right with a
// vertical six-layer list joined by a connector line.

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import { Placeholder } from "./Placeholder";
import completeLedSystem from "@/image/led-display/complete-system/complete-led-system.png";
import type { LedCompleteSystemContent } from "../../types/leddisplayTypes";

type CompleteSystemSectionProps = {
  content: LedCompleteSystemContent;
};

export function CompleteSystemSection({ content }: CompleteSystemSectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
              {content.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
              >
                {content.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/what-we-do"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
              >
                {content.secondaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
            <Placeholder src={completeLedSystem} alt={content.title} className="aspect-square w-full" />

            <ol className="relative space-y-3 border-l border-slate-200 pl-6">
              {content.layers.map((layer) => (
                <li key={layer.name} className="relative">
                  <span
                    className="absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-neutral-800">
                    {layer.name}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
