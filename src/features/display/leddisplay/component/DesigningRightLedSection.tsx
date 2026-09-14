// 8 · DESIGNING THE RIGHT LED — "Technology Follows the Viewing Experience."
// Light section with copy on the left and six LED-selection factors on the
// right, following the compact icon-card treatment used across this page.

import { Eye, Maximize2, Settings, Shapes, ShieldCheck, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import type { LedDesigningRightLedContent } from "../../types/leddisplayTypes";

const ITEM_ICONS: LucideIcon[] = [
  Eye,
  Shapes,
  Sun,
  Maximize2,
  Settings,
  ShieldCheck,
];

type DesigningRightLedSectionProps = {
  content: LedDesigningRightLedContent;
};

export function DesigningRightLedSection({
  content,
}: DesigningRightLedSectionProps) {
  return (
    <section className="bg-white text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
              {content.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.items.map((item, index) => {
              const Icon = ITEM_ICONS[index] ?? ITEM_ICONS[0];
              return (
                <div
                  key={item.title}
                  className="flex min-h-24 items-center gap-4 rounded-xl border border-blue-100 bg-white px-2 shadow-[0_8px_30px_rgba(37,99,235,0.05)]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-neutral-800">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
