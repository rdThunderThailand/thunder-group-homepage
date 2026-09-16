"use client";

// === 04 · WHY THUNDER ===
// Full-bleed panoramic cityscape fills the whole section. Heading on the left,
// the purpose statement + "Our Purpose" link in the middle, and the People /
// Organizations / Technology / Places / Communities / Together list running
// down the right. The image is a 3:1 panorama, so it sits wider than its frame
// and pans horizontally as the section scrolls through the viewport — a slow
// parallax that reveals the full skyline. Disabled under prefers-reduced-motion.

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import type { WhyThunderContent } from "../types";
import cityscapeImage from "@/image/home/why-thunder/why-thunder-cityscape.png";

type WhyThunderSectionProps = {
  content: WhyThunderContent;
};

// Percent of the image's own width to slide in each direction. The image wrapper
// is `w-[130%] left-[-15%]`, so anything up to ~11.5 keeps both edges covered.
const PAN_PERCENT = 10;

export function WhyThunderSection({ content }: WhyThunderSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      // 0 when the section's top hits the bottom of the viewport, 1 when its
      // bottom clears the top.
      const span = rect.height + window.innerHeight;
      const progress = Math.min(
        Math.max((window.innerHeight - rect.top) / span, 0),
        1,
      );
      const offset = PAN_PERCENT - progress * PAN_PERCENT * 2;
      image.style.transform = `translate3d(${offset}%, 0, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink text-white"
    >
      {/* Full-bleed parallax cityscape + legibility scrim */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          ref={imageRef}
          className="absolute inset-y-0 left-[-15%] w-[130%] will-change-transform"
        >
          <Image
            src={cityscapeImage}
            alt=""
            fill
            sizes="130vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black/45 to-transparent lg:w-56" />
      </div>

      <div className="relative mx-auto flex min-h-[20rem] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:grid lg:min-h-[28rem] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)_max-content] lg:items-center lg:gap-8 lg:px-8 lg:py-20">
        <div>
          <SectionEyebrow
            label={content.eyebrow}
            tone="dark"
          />
          <h2 className="mt-5 whitespace-pre-line text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {content.title}
          </h2>
        </div>

        <div className="mt-8 lg:mt-0">
          <p className="whitespace-pre-line text-base leading-relaxed text-white/75 sm:text-lg">
            {content.description}
          </p>
          <Link
            href="#/about/purpose"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white/70"
          >
            {content.cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-4 gap-y-1.5 lg:mt-0 lg:flex-col lg:items-start lg:text-left">
          {content.words.map((word, index) => (
            <li
              key={word}
              className={
                index === content.words.length - 1
                  ? "text-xs font-semibold uppercase tracking-[0.22em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]"
                  : "text-xs font-semibold uppercase tracking-[0.22em] text-white/70 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]"
              }
            >
              {word}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
