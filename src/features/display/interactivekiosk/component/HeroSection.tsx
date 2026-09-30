// 1 + 2 · BREADCRUMB + HERO
// Full-bleed dark hero pulled up under the transparent overlay navbar with
// `-mt-16 lg:-mt-20`. `interactive-kiosk-hero.png` fills the whole section as
// the background; left→right and bottom→top ink gradients keep the copy
// legible. The breadcrumb runs across the top, left-aligned copy + two CTAs sit
// over the scrim, a spaced-word annotation pins to the lower-left, the right
// column floats the sample kiosk-screen UI over the photo, and a slogan caption
// pins to the lower-right corner.

import { ArrowDown, ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import heroImage from "@/image/interactive-kiosk/interactive-kiosk-hero.png";
import type {
  KioskBreadcrumb,
  KioskHeroContent,
} from "../../types/interactivekioskTypes";

type HeroSectionProps = {
  content: KioskHeroContent;
  breadcrumb: KioskBreadcrumb;
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative -mt-16 overflow-hidden bg-ink text-white lg:-mt-20">
      {/* Full-bleed hero photo + legibility scrims */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-36">

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left — copy */}
          <div>
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
                href="#solutions"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {content.secondaryCta}
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <p className="mt-12 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/45 sm:mt-16">
              {content.cornerText}
            </p>
          </div>

          {/* Right — sample kiosk-screen UI floating over the photo */}
          <div className="lg:justify-self-end">
            <div className="w-full max-w-xs rounded-2xl border border-white/15 bg-white/[0.08] p-5 shadow-xl shadow-black/25 backdrop-blur-md sm:max-w-sm">
              <p className="text-lg font-bold text-white">
                {content.screen.welcome}
              </p>
              <p className="mt-1 text-xs text-white/60">
                {content.screen.prompt}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {content.screen.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white/85"
                  >
                    {item}
                    <ChevronRight
                      className="h-3.5 w-3.5 text-white/40"
                      aria-hidden="true"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Lower-right slogan caption over the photo */}
        <ul className="pointer-events-none absolute bottom-6 right-4 flex flex-col items-end gap-0.5 border-b border-white/25 pb-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70 sm:right-6 lg:right-8">
          {content.imageCaptionLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
