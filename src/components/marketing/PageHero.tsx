// Compact dark hero shared by every interior route page (What We Do, Solutions,
// Businesses, …). Pulled up under the transparent overlay navbar with
// `-mt-16 lg:-mt-20`, exactly like the Home hero, so the global
// `<Navbar overlay />` reads correctly here too. The background is a placeholder
// gradient band — swap for real artwork later.

import { SectionEyebrow } from "./SectionEyebrow";
import type { PageHeroContent } from "./types";

type PageHeroProps = {
  content: PageHeroContent;
};

export function PageHero({ content }: PageHeroProps) {
  return (
    <section className="relative -mt-16 overflow-hidden bg-ink text-white lg:-mt-20">
      {/* Placeholder background band */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="flex h-full">
          <div className="flex-1 bg-gradient-to-b from-sky-800/50 to-slate-950" />
          <div className="flex-1 bg-gradient-to-b from-indigo-800/40 to-slate-950" />
          <div className="flex-1 bg-gradient-to-b from-slate-700/40 to-slate-950" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-36">
        <SectionEyebrow label={content.eyebrow} tone="dark" />
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
          {content.title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          {content.description}
        </p>
      </div>
    </section>
  );
}
