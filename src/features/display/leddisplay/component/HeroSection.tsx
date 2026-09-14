// 1 + 2 · BREADCRUMB + HERO
// Full-bleed dark hero pulled up under the transparent overlay navbar with
// `-mt-16 lg:-mt-20`. The background is a gradient-band placeholder — swap for
// the building / curved-LED photo later. The breadcrumb runs across the top;
// left-aligned copy + two CTAs sit over the scrim, and two small stacked-word
// annotations pin to the lower corners.

import { ArrowDown, ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import heroImage from "@/image/led-display/hero/led-display-hero.png";
import type { LedBreadcrumb, LedHeroContent } from "../../types/leddisplayTypes";

type HeroSectionProps = {
  content: LedHeroContent;
  breadcrumb: LedBreadcrumb;
};

export function HeroSection({ content, breadcrumb }: HeroSectionProps) {
  return (
    <section className="relative -mt-16 overflow-hidden bg-ink text-white lg:-mt-20">
      {/* LED installation background */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-36">
        {/* Breadcrumb — "Home > Display Solutions > LED Display" */}
        <nav
          aria-label={breadcrumb.current}
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/55"
        >
          <Link href="/" className="transition-colors hover:text-white">
            {breadcrumb.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link
            href="/display"
            className="transition-colors hover:text-white"
          >
            {breadcrumb.display}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-white/85">{breadcrumb.current}</span>
        </nav>

        <div className="mt-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            {content.label}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            {content.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              {content.primaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#led-solutions"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {content.secondaryCta}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Lower-corner annotations */}
        <div className="mt-16 flex items-end justify-between gap-6 sm:mt-24">
          <ul className="flex flex-col gap-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/45">
            {content.cornerLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <ul className="hidden flex-col items-end gap-0.5 border-b border-white/20 pb-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/60 sm:flex">
            {content.imageOverlayLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
