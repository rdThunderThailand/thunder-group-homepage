// 8 · DESIGNING THE RIGHT LED — "Technology Follows the Viewing Experience."
// Dark section over a close-up-LED placeholder. Copy on the left; a static
// accordion (six rows, each with a trailing "+" — UI only, no expand wired) on
// the right.

import { Plus } from "lucide-react";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import type { LedDesigningRightLedContent } from "../../types/leddisplayTypes";

type DesigningRightLedSectionProps = {
  content: LedDesigningRightLedContent;
};

export function DesigningRightLedSection({
  content,
}: DesigningRightLedSectionProps) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Placeholder close-up-LED wash */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="h-full w-full bg-gradient-to-br from-blue-950 via-ink to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-brand/10 to-blue-500/15" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} tone="dark" />
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
              {content.description}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04]">
            {content.items.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 last:border-b-0"
              >
                <span className="text-sm font-medium text-white">
                  {item.title}
                </span>
                <Plus
                  className="h-4 w-4 shrink-0 text-white/50"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
