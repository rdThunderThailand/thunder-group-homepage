// 13 · BOTTOM CTA BANNER — "What Do You Want the Space to Become?"
// Closing call to action over a deterministic placeholder skyline (same
// technique as `components/marketing/TalkToThunderSection` and
// `src/features/rent-technology`). Eyebrow + heading + lead + a solid and an
// outline CTA on the left; a small stacked-word slogan on the right.

import { ArrowRight, FileText } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import projectCtaImage from "@/image/led-display/project-cta/led-project-cta.png";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import type { LedBottomCtaContent } from "../../types/leddisplayTypes";

type BottomCtaSectionProps = {
  content: LedBottomCtaContent;
};

export function BottomCtaSection({ content }: BottomCtaSectionProps) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <Image src={projectCtaImage} alt="" fill sizes="100vw" className="object-cover" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-slate-900/50"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <SectionEyebrow label={content.label} tone="dark" />
          <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {content.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
            {content.description}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              {content.primaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {content.secondaryCta}
            </Link>
          </div>
        </div>

        <p className="shrink-0 text-sm font-semibold uppercase leading-relaxed tracking-[0.25em] text-white/45 lg:max-w-[10rem] lg:text-right">
          {content.sideText}
        </p>
      </div>
    </section>
  );
}
