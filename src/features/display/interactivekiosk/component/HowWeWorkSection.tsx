// 9 · HOW WE WORK — "From Interaction to Operation."
// Light section. A four-step flow: a numbered circle, an icon, the step name
// and a " · "-joined item list, arrow-separated from `sm` up and stacking on
// mobile. Mirrors `leddisplay/component/HowWeWorkSection`.

import { Fragment } from "react";
import { ArrowRight, PencilRuler, Search, Truck, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import type { KioskHowWeWorkContent } from "../../types/interactivekioskTypes";

/** Step icons, paired to `howWeWork.steps` by index. */
const STEP_ICONS: LucideIcon[] = [Search, PencilRuler, Truck, Wrench];

type HowWeWorkSectionProps = {
  content: KioskHowWeWorkContent;
};

export function HowWeWorkSection({ content }: HowWeWorkSectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader eyebrow={content.label} title={content.title} />

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-start">
          {content.steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? STEP_ICONS[0];
            return (
              <Fragment key={step.number}>
                <div className="flex flex-1 gap-4 sm:flex-col sm:gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-brand">
                        {step.number}
                      </span>
                      <h3 className="text-sm font-semibold text-neutral-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                      {step.items.join(" · ")}
                    </p>
                  </div>
                </div>
                {index < content.steps.length - 1 ? (
                  <ArrowRight
                    className="hidden h-5 w-5 shrink-0 self-start text-slate-300 sm:mt-3.5 sm:block"
                    aria-hidden="true"
                  />
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
