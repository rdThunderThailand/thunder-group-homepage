// 4 · DESIGNED AROUND YOUR SPACE
// Light section, two columns on `lg`: a tall placeholder image on the left, and
// on the right the eyebrow + heading + lead, a six-item icon row of context
// factors, and a "→ …" line beneath it.

import { Eye, FileText, Ruler, Settings, Sun, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import { Placeholder } from "./Placeholder";
import designedAroundSpaceImage from "@/image/led-display/designed-around-space/designed-around-space.png";
import type { LedDesignedAroundSpaceContent } from "../../types/leddisplayTypes";

/** Factor icons, paired to `designedAroundSpace.factors` by index. */
const FACTOR_ICONS: LucideIcon[] = [Ruler, Eye, Users, FileText, Sun, Settings];

type DesignedAroundSpaceSectionProps = {
  content: LedDesignedAroundSpaceContent;
};

export function DesignedAroundSpaceSection({
  content,
}: DesignedAroundSpaceSectionProps) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Placeholder src={designedAroundSpaceImage} alt={content.title} className="aspect-[4/3] w-full lg:aspect-[5/4]" />

          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500">
              {content.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {content.factors.map((factor, index) => {
                const Icon = FACTOR_ICONS[index] ?? FACTOR_ICONS[0];
                return (
                  <div
                    key={factor}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                  >
                    <Icon
                      className="h-4 w-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium leading-tight text-neutral-800">
                      {factor}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 text-sm font-medium leading-relaxed text-brand">
              {content.linkText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
