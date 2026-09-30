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
          <Placeholder
            src={designedAroundSpaceImage}
            alt={content.title}
            className="aspect-[4/3] w-full lg:aspect-[5/4]"
          />

          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500">
              {content.description}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-6">
              {content.factors.map((factor, index) => {
                const Icon = FACTOR_ICONS[index] ?? FACTOR_ICONS[0];
                return (
                  <div
                    key={factor}
                    className="flex flex-col items-center text-center"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-white text-brand shadow-[0_0_0_6px_rgba(37,99,235,0.04)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="mt-3 whitespace-nowrap text-xs font-medium leading-tight text-neutral-800">
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
