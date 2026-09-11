"use client";

// === HERO ===
// Full-bleed dark hero. A brightened collage of People / Organizations /
// Technology / Places / Communities imagery sits under light legibility scrims.
// The section is pulled up under the transparent overlay navbar with
// `-mt-16 lg:-mt-20` (see `Navbar`'s `overlay` prop docs).

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { HeroContent } from "../types";
import heroImage from "@/image/home/hero.png";

type HeroSectionProps = {
  content: HeroContent;
};

const entrance = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.11,
    },
  },
};

const entranceItem = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSection({ content }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const smoothImageX = useSpring(imageX, { stiffness: 90, damping: 24 });
  const smoothImageY = useSpring(imageY, { stiffness: 90, damping: 24 });

  const scrollToContent = () => {
    document
      .getElementById("start-here")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const moveImage = (event: React.PointerEvent<HTMLElement>) => {
    if (shouldReduceMotion || event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontalProgress = (event.clientX - bounds.left) / bounds.width - 0.5;
    const verticalProgress = (event.clientY - bounds.top) / bounds.height - 0.5;

    imageX.set(horizontalProgress * -14);
    imageY.set(verticalProgress * -10);
  };

  const resetImage = () => {
    imageX.set(0);
    imageY.set(0);
  };

  return (
    <section
      className="relative -mt-16 overflow-hidden bg-ink text-white lg:-mt-20"
      onPointerMove={moveImage}
      onPointerLeave={resetImage}
    >
      {/* Collage background */}
      <div className="absolute inset-0" aria-hidden="true">
        <motion.div
          className="relative h-full w-full"
          initial={shouldReduceMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: smoothImageX, y: smoothImageY }}
        >
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-110 contrast-[1.03]"
        />

        {/* A soft pulse centered on the sun in the source artwork. */}
        <motion.div
          className="absolute left-[58.3%] top-[31%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,240,185,0.32)_0%,rgba(255,218,128,0.12)_35%,transparent_72%)] blur-md sm:h-56 sm:w-56"
          animate={
            shouldReduceMotion
              ? { opacity: 0.45 }
              : { opacity: [0.3, 0.58, 0.3], scale: [0.94, 1.08, 0.94] }
          }
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        />

        {/* legibility scrims (kept light so the collage stays vivid) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        </motion.div>
      </div>

      <motion.div
        className="relative mx-auto flex min-h-[44rem] max-w-7xl flex-col px-4 pb-14 pt-28 sm:min-h-[48rem] sm:px-6 lg:min-h-[52rem] lg:px-8 lg:pb-20 lg:pt-36"
        variants={entrance}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
      >
        {/* Headline block — pushed toward the lower half of the hero */}
        <div className="mt-auto pt-12">
          <div className="max-w-3xl">
            <motion.h1
              variants={entranceItem}
              className="text-4xl font-bold leading-[1.05] tracking-tight [text-shadow:0_2px_18px_rgba(0,0,0,0.5)] sm:text-5xl lg:text-6xl"
            >
              {content.title}
            </motion.h1>
            <motion.p
              variants={entranceItem}
              className="mt-5 max-w-xl text-base text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.55)] sm:text-lg"
            >
              {content.description}
            </motion.p>
          </div>

          <motion.div
            variants={entranceItem}
            className="mt-8 grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-10"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <motion.button
                type="button"
                onClick={scrollToContent}
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90"
              >
                {content.ctaPrimary}
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </motion.button>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition-colors hover:text-white"
              >
                {content.ctaSecondary}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Theme pillars — aligned with the CTA row on desktop. */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-4">
              {content.pillars.map((pillar) => (
                <div key={pillar.name}>
                  <p className="text-sm font-semibold text-white">{pillar.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <button
          type="button"
          onClick={scrollToContent}
          className="mt-8 flex items-center gap-2 self-end text-xs font-medium text-white/60 transition-colors hover:text-white lg:mt-10"
        >
          {content.scrollHint}
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
      </motion.div>

      {/* Vertical side note (desktop only) */}
      <p className="pointer-events-none absolute right-4 top-1/2 hidden max-w-[8rem] -translate-y-1/2 text-right text-[0.7rem] font-semibold uppercase leading-relaxed tracking-[0.25em] text-white/40 lg:right-8 lg:block">
        {content.sideNote}
      </p>
    </section>
  );
}
