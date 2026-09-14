// === 03 · OUR WORK === (dark)
// Heading + "Explore All Projects" link on the left. On the right, a tall
// featured-project card next to two stacked smaller cards. Each card carries a
// full-bleed image under a bottom-up scrim behind the caption.

import Image, { type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import type { OurWorkContent } from "../types";
import smartPublicSpaceImage from "@/image/home/our-work/smart-public-space.png";
import futureWorkplaceImage from "@/image/home/our-work/future-workplace.png";
import digitalDestinationImage from "@/image/home/our-work/digital-destination-experience.png";

/** Paired to `content.projects` by index. */
const PROJECT_IMAGES: StaticImageData[] = [
  futureWorkplaceImage,
  digitalDestinationImage,
];

type OurWorkSectionProps = {
  content: OurWorkContent;
};

export function OurWorkSection({ content }: OurWorkSectionProps) {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-28">
        <div className="lg:col-span-4">
          <SectionEyebrow
            number={content.number}
            label={content.eyebrow}
            tone="dark"
          />
          <h2 className="mt-5 whitespace-pre-line text-3xl font-bold tracking-tight sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-5 max-w-md whitespace-pre-line text-base leading-relaxed text-white/60">
            {content.description}
          </p>
          <Link
            href="/projects"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white/70"
          >
            {content.cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:mt-0">
          {/* Featured project */}
          <Link
            href="/projects"
            className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl bg-slate-950 p-6 sm:row-span-2 sm:min-h-[440px]"
          >
            <Image
              src={smartPublicSpaceImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 32rem, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
            <div className="relative">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/60">
                {content.featured.label}
              </p>
              <h3 className="mt-2 whitespace-pre-line text-xl font-bold leading-snug sm:text-2xl">
                {content.featured.title}
              </h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-transform group-hover:translate-x-0.5">
                {content.featured.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Secondary projects */}
          {content.projects.map((project, index) => (
            <Link
              key={project.title}
              href="/projects"
              className="group relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-2xl bg-slate-950 p-6"
            >
              <Image
                src={PROJECT_IMAGES[index]}
                alt=""
                fill
                sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 90vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
              <div className="relative">
                <h3 className="whitespace-pre-line text-lg font-bold leading-snug">
                  {project.title}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-transform group-hover:translate-x-0.5">
                  {project.cta}
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
