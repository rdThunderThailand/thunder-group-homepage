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
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500">
              {content.description}
            </p>
          </div>

          <Placeholder src={whyLedImage} alt={content.imageOverlay} className="aspect-[16/10] w-full">
            <p className="absolute inset-x-5 bottom-5 text-right text-lg font-bold uppercase leading-tight tracking-wide text-white/85 sm:text-xl">
              {content.imageOverlay}
            </p>
          </Placeholder>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
