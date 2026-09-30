"use client";

// 5 · LED SOLUTIONS — "LED for Different Spaces and Experiences."
// Light section, and the `#led-solutions` scroll target for the hero's second
// CTA. Header with a top-right "explore all" link above a six-card grid; each
// card is a `Link` into a (not-yet-built) sub-page: placeholder image, title,
// short description and a per-card "explore" link label.

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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
const CARD_IMAGES = [
  indoorLed,
  outdoorLed,
  finePitchLed,
  creativeArchitecturalLed,
  transparentLed,
  largeFormatLed,
];

const cardReveal = {
  hidden: { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type LedSolutionsSectionProps = {
  content: LedSolutionsContent;
};

export function LedSolutionsSection({ content }: LedSolutionsSectionProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(rowRef, { amount: 0.15, once: true });

  return (
    <section id="led-solutions" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.label}
          title={content.title}
          action={{ label: content.viewAll, href: "/display" }}
        />

        <motion.div
          ref={rowRef}
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.13 } },
          }}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion || isInView ? "visible" : "hidden"}
        >
          {content.cards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={shouldReduceMotion ? undefined : cardReveal}
              className="flex w-[82vw] shrink-0 snap-start sm:w-[22rem] lg:w-auto lg:min-w-0 lg:flex-1"
            >
              <Link
                href={CARD_HREFS[index] ?? CARD_HREFS[0]}
                className="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-lg hover:shadow-slate-200/70"
              >
                <Placeholder
                  src={CARD_IMAGES[index]}
                  alt={card.title}
                  sizes="(min-width: 1024px) 23rem, (min-width: 640px) 22rem, 82vw"
                  className="aspect-[16/10] rounded-none border-x-0 border-t-0"
                />
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
