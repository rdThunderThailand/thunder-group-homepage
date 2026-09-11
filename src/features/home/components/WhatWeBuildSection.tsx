// === 02 · WHAT WE BUILD ===
// The four Thunder businesses. Heading + "Explore Our Businesses" link on the
// left, a four-across card row on the right (2 columns on tablet, 1 on mobile).

import Image, { type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import type { WhatWeBuildContent } from "../types";
import thunderDisplayImage from "@/image/home/what-we-build/thunder-display.png";
import thunderOneImage from "@/image/home/what-we-build/thunder-one.png";
import cityzenImage from "@/image/home/what-we-build/cityzen.png";
import wonderImage from "@/image/home/what-we-build/wonder.png";

/** Per-business destination + image, paired to `content.businesses` by index. */
const BUSINESS_META: { href: string; image: StaticImageData }[] = [
  { href: "/display", image: thunderDisplayImage },
  { href: "/thunderone", image: thunderOneImage },
  { href: "/cityzen", image: cityzenImage },
  { href: "/wonder", image: wonderImage },
];

type WhatWeBuildSectionProps = {
  content: WhatWeBuildContent;
};

export function WhatWeBuildSection({ content }: WhatWeBuildSectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-28">
        <div className="lg:col-span-4">
          <SectionEyebrow number={content.number} label={content.eyebrow} />
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
            {content.description}
          </p>
          <Link
            href="/businesses"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
          >
            {content.cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:mt-0 lg:grid-cols-4">
          {content.businesses.map((business, index) => (
            <Link
              key={business.name}
              href={BUSINESS_META[index].href}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={BUSINESS_META[index].image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 16rem, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-neutral-900">
                {business.name}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">
                {business.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors group-hover:text-brand-strong">
                {business.cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
