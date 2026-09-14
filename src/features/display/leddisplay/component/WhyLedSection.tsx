// 3 · WHY LED — "When the Experience Needs More Scale."
// Light section. Split header (eyebrow + heading left, lead + a small overlay
// image right), then a four-up row of icon + title + one-line features.

import { Maximize2, Shapes, ShieldCheck, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import { Placeholder } from "./Placeholder";
import whyLedImage from "@/image/led-display/why-led/why-led-experience.png";
import type { LedWhyContent } from "../../types/leddisplayTypes";

/** Feature icons, paired to `whyLed.features` by index. */
const FEATURE_ICONS: LucideIcon[] = [Maximize2, Shapes, Sun, ShieldCheck];

type WhyLedSectionProps = {
  content: LedWhyContent;
};

export function WhyLedSection({ content }: WhyLedSectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.75fr)_minmax(20rem,0.8fr)] lg:items-stretch lg:gap-10">
          <div className="flex flex-col">
            <div>
              <SectionEyebrow label={content.label} />
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                {content.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500">
                {content.description}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {content.features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index] ?? FEATURE_ICONS[0];
                return (
                  <div key={feature.title} className="flex flex-col">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-white text-brand shadow-[0_0_0_6px_rgba(37,99,235,0.04)]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
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

          <Placeholder
            src={whyLedImage}
            alt={content.imageAlt}
            className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[25rem]"
            sizes="(min-width: 1024px) 30vw, 100vw"
          >
            <p className="absolute left-7 top-7 z-10 text-2xl font-semibold uppercase leading-[1.18] tracking-wide text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.45)] sm:text-3xl">
              {content.imageOverlay.split(" ").map((word) => (
                <span key={word} className="block">
                  {word}
                </span>
              ))}
            </p>
            <div className="absolute inset-0 bg-gradient-to-br from-ink/20 via-transparent to-transparent" />
          </Placeholder>
        </div>
      </div>
    </section>
  );
}
