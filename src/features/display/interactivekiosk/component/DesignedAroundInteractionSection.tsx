// 4 · DESIGNED AROUND THE INTERACTION —
// "The Right Touchpoint Starts With What People Need to Do."
// Light section, two columns on `lg`. Left: eyebrow + heading + lead, a
// six-step icon flow (Person → Need → Task → Environment → Interface → Outcome)
// with a question under each, and a highlighted line beneath it. Right: a
// placeholder for two kiosk devices with a four-item icon list.

import {
  ClipboardList,
  Flag,
  Link2,
  MapPin,
  MonitorSmartphone,
  Sparkles,
  Target,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import { Placeholder } from "./Placeholder";
import designedTouchpoint from "@/image/interactive-kiosk/designed-touchpoint.png";
import type { KioskDesignedAroundContent } from "../../types/interactivekioskTypes";

/** Step icons, paired to `designedAround.steps` by index. */
const STEP_ICONS: LucideIcon[] = [
  User,
  Target,
  ClipboardList,
  MapPin,
  MonitorSmartphone,
  Flag,
];

/** Aspect icons, paired to `designedAround.aspects` by index. */
const ASPECT_ICONS: LucideIcon[] = [Users, Sparkles, MonitorSmartphone, Link2];

type DesignedAroundInteractionSectionProps = {
  content: KioskDesignedAroundContent;
};

export function DesignedAroundInteractionSection({
  content,
}: DesignedAroundInteractionSectionProps) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500">
              {content.description}
            </p>

            <ol className="mt-8 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {content.steps.map((step, index) => {
                const Icon = STEP_ICONS[index] ?? STEP_ICONS[0];
                return (
                  <li
                    key={step.title}
                    className="flex items-start gap-3 border-l-2 border-slate-200 pl-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-neutral-900">
                        {step.title}
                      </h3>
                      <p className="mt-0.5 text-xs leading-snug text-slate-500">
                        {step.question}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <p className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand">
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
              {content.linkText}
            </p>
          </div>

          <div>
            <Placeholder
              src={designedTouchpoint}
              alt={content.imageAlt}
              className="aspect-[4/3] w-full"
            />
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {content.aspects.map((aspect, index) => {
                const Icon = ASPECT_ICONS[index] ?? ASPECT_ICONS[0];
                return (
                  <li
                    key={aspect.title}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-brand">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">
                        {aspect.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-snug text-slate-500">
                        {aspect.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
