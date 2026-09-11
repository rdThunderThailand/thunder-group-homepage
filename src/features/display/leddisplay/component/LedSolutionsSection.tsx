// 5 · LED SOLUTIONS — "LED for Different Spaces and Experiences."
// Light section, and the `#led-solutions` scroll target for the hero's second
// CTA. Header with a top-right "explore all" link above a six-card grid; each
// card is a `Link` into a (not-yet-built) sub-page: placeholder image, title,
// short description and a per-card "explore" link label.

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeader } from "./SectionHeader";
import { Placeholder } from "./Placeholder";
import indoorLed from "@/image/led-display/led-solutions/indoor-led.png";
import outdoorLed from "@/image/led-display/led-solutions/outdoor-led.png";
import finePitchLed from "@/image/led-display/led-solutions/fine-pitch-led.png";
import creativeArchitecturalLed from "@/image/led-display/led-solutions/creative-architectural-led.png";
import transparentLed from "@/image/led-display/led-solutions/transparent-led.png";
import largeFormatLed from "@/image/led-display/led-solutions/large-format-led.png";
import type { LedSolutionsContent } from "../../types/leddisplayTypes";

/** Per-card destination, paired to `ledSolutions.cards` by index. */
const CARD_HREFS = [
  "/display/leddisplay/indoor",
  "/display/leddisplay/outdoor",
  "/display/leddisplay/fine-pitch",
  "/display/leddisplay/creative-architectural",
  "/display/leddisplay/transparent",
  "/display/leddisplay/large-format",
];
const CARD_IMAGES = [indoorLed, outdoorLed, finePitchLed, creativeArchitecturalLed, transparentLed, largeFormatLed];

type LedSolutionsSectionProps = {
  content: LedSolutionsContent;
};

export function LedSolutionsSection({ content }: LedSolutionsSectionProps) {
  return (
    <section id="led-solutions" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.label}
          title={content.title}
          action={{ label: content.viewAll, href: "/display" }}
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.cards.map((card, index) => (
            <Link
              key={card.title}
              href={CARD_HREFS[index] ?? CARD_HREFS[0]}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-lg hover:shadow-slate-200/70"
            >
              <Placeholder src={CARD_IMAGES[index]} alt={card.title} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10] rounded-none border-x-0 border-t-0" />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-sm font-semibold text-neutral-900">
                  {card.title}
                </h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-500">
                  {card.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors group-hover:text-brand-strong">
                  {card.linkLabel}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
