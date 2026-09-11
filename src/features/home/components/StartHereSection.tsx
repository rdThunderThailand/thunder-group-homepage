// === 01 · START HERE ===
// Entry points into the site. Heading block on the left, a 3 × 2 card grid on
// the right that collapses to two columns on tablet and one on mobile.

import Image, { type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import type { StartHereContent } from "../types";
import buyTechnologyImage from "@/image/home/start-here/buy-technology.png";
import rentTechnologyImage from "@/image/home/start-here/rent-technology.png";
import betterWorkplaceImage from "@/image/home/start-here/better-workplace.png";
import itOperationsImage from "@/image/home/start-here/it-operations.png";
import smartCommunityImage from "@/image/home/start-here/smart-community.png";
import partnerWithThunderImage from "@/image/home/start-here/partner-with-thunder.png";

/** Per-card destination + image, paired to `content.cards` by index. */
const CARD_META: { href: string; image: StaticImageData }[] = [
  { href: "/what-do-you-need/buy-technology", image: buyTechnologyImage },
  { href: "/what-do-you-need/rent-technology", image: rentTechnologyImage },
  { href: "/what-do-you-need/build-smarter-workplace", image: betterWorkplaceImage },
  { href: "/what-do-you-need/solve-it-operations", image: itOperationsImage },
  { href: "/what-do-you-need/build-better-places-communities", image: smartCommunityImage },
  { href: "/what-do-you-need/work-with-thunder", image: partnerWithThunderImage },
];

type StartHereSectionProps = {
  content: StartHereContent;
};

export function StartHereSection({ content }: StartHereSectionProps) {
  return (
    <section id="start-here" className="scroll-mt-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-28">
        <div className="lg:col-span-4">
          <SectionEyebrow number={content.number} label={content.eyebrow} />
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
            {content.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:mt-0 xl:grid-cols-3">
          {content.cards.map((card, index) => (
            <Link
              key={card.title}
              href={CARD_META[index].href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-lg hover:shadow-slate-200/70"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image
                  src={CARD_META[index].image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 22rem, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 items-start justify-between gap-3 p-5">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    {card.description}
                  </p>
                </div>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
