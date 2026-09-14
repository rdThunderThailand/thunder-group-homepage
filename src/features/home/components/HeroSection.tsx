"use client";

// === HERO ===
// Full-bleed dark hero. A brightened collage of People / Organizations /
// Technology / Places / Communities imagery sits under light legibility scrims.
// The section is pulled up under the transparent overlay navbar with
// `-mt-16 lg:-mt-20` (see `Navbar`'s `overlay` prop docs).

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
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
  transitionEyebrow: string;
  transitionTitle: string;
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

// Coordinates follow the light ribbons in hero.png. The SVG uses the same
// centered contain layout as the image and shares its parallax transform.
const laserPaths = [
  "M -10 331 C 95 404 192 296 330 338 S 582 491 791 430 S 1004 427 1168 436",
  "M 623 265 C 677 312 713 234 793 245 C 812 245 825 250 839 256 M 976 253 C 1040 269 1116 314 1181 316",
  "M 1418 291 C 1516 355 1569 314 1631 291 S 1727 281 1791 314 S 1880 348 1920 355 M 1993 359 Q 2026 357 2058 345",
];

export function HeroSection({
  content,
  transitionEyebrow,
  transitionTitle,
}: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimers = useRef<number[]>([]);
  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const smoothImageX = useSpring(imageX, { stiffness: 90, damping: 24 });
  const smoothImageY = useSpring(imageY, { stiffness: 90, damping: 24 });

  useEffect(
    () => () => {
      transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const scrollToContent = (behavior: ScrollBehavior = "smooth") => {
    document
      .getElementById("start-here")
      ?.scrollIntoView({ behavior, block: "start" });
  };

  const transitionToStartHere = () => {
    if (shouldReduceMotion) {
      scrollToContent("auto");
      return;
    }
    if (isTransitioning) return;

    setIsTransitioning(true);
    transitionTimers.current = [
      window.setTimeout(() => scrollToContent("auto"), 700),
      window.setTimeout(() => setIsTransitioning(false), 1450),
    ];
  };

  const scrollToTalkToThunder = () => {
    document.getElementById("talk-to-thunder")?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
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
        {/* A blurred copy fills any space around the panoramic source image. */}
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-[1.04] object-contain object-center brightness-90 blur-[9px]"
        />
        <motion.div
          className="relative h-full w-full [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.7)_22%,black_36%,black_64%,rgba(0,0,0,0.7)_78%)]"
          initial={shouldReduceMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: smoothImageX, y: smoothImageY }}
        >
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain object-center brightness-110 contrast-[1.03]"
          />

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
            viewBox="0 0 2048 735"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            aria-hidden="true"
          >
            {laserPaths.map((path) => (
              <g key={path}>
                <motion.path
                  d={path}
                  stroke="#21baff"
                  strokeWidth="13"
                  strokeLinecap="round"
                  style={{ filter: "blur(8px)" }}
                  animate={{
                    opacity: shouldReduceMotion ? 0.45 : [0.3, 0.75, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <path d={path} stroke="#83e5ff" strokeWidth="3" opacity="0.7" />
                {!shouldReduceMotion && (
                  <motion.path
                    d={path}
                    stroke="#e4fbff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="90 1500"
                    animate={{ strokeDashoffset: [1590, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ filter: "drop-shadow(0 0 4px #39cfff)" }}
                  />
                )}
              </g>
            ))}
          </svg>

          {/* A soft pulse centered on the sun in the source artwork. */}
          <motion.div
            className="absolute left-[58.3%] top-[38%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,240,185,0.32)_0%,rgba(255,218,128,0.12)_35%,transparent_72%)] blur-md sm:h-56 sm:w-56"
            animate={
              shouldReduceMotion
                ? { opacity: 0.45 }
                : { opacity: [0.3, 0.58, 0.3], scale: [0.94, 1.08, 0.94] }
            }
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
          />

          {/* Fade the panorama into the surrounding background at both edges. */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-ink/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        </motion.div>
      </div>

      <motion.div
        className="relative mx-auto flex min-h-[37.4rem] max-w-7xl flex-col px-4 pb-14 pt-28 sm:min-h-[40.8rem] sm:px-6 lg:min-h-[44.2rem] lg:px-8 lg:pb-20 lg:pt-36"
        variants={entrance}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
      >
        {/* Headline block — pushed toward the lower half of the hero */}
        <div className="mt-auto pt-12">
          <div className="max-w-3xl">
            <motion.h1
              variants={entranceItem}
              className="whitespace-pre-line text-4xl font-bold leading-[1.05] tracking-tight [text-shadow:0_2px_18px_rgba(0,0,0,0.5)] sm:text-5xl lg:text-6xl"
            >
              {content.title}
            </motion.h1>
            <motion.p
              variants={entranceItem}
              className="mt-5 max-w-xl whitespace-pre-line text-base text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.55)] sm:text-lg"
            >
              {content.description}
            </motion.p>
          </div>

          <motion.div
            variants={entranceItem}
            className="mt-8 grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-10"
          >
            <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-3">
              <div className="flex flex-col items-center gap-3">
                <motion.button
                  type="button"
                  onClick={transitionToStartHere}
                  whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90"
                >
                  {content.ctaPrimary}
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </motion.button>

              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition-colors hover:text-white"
              >
                {content.ctaSecondary}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Theme pillars — aligned with the CTA row on desktop. */}
            <div
              className="grid grid-cols-2 gap-2 border-t border-white/15 pt-4 sm:grid-cols-3 lg:grid-cols-5"
              onPointerLeave={() => setActivePillar(null)}
            >
              {content.pillars.map((pillar, index) => (
                <motion.button
                  key={pillar.name}
                  type="button"
                  onPointerEnter={() => setActivePillar(index)}
                  onFocus={() => setActivePillar(index)}
                  onClick={scrollToTalkToThunder}
                  animate={
                    activePillar === index
                      ? { y: -5, backgroundColor: "rgba(255,255,255,0.12)" }
                      : { y: 0, backgroundColor: "rgba(255,255,255,0)" }
                  }
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="group relative min-h-24 overflow-hidden rounded-xl border border-transparent px-3 py-3 text-left outline-none transition-colors hover:border-white/15 focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-300/60"
                >
                  <motion.span
                    className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
                    animate={{ opacity: activePillar === index ? 1 : 0 }}
                  />
                  <span className="text-sm font-semibold text-white">{pillar.name}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-white/55">
                    {pillar.description}
                  </span>
                  <motion.span
                    className="mt-2 flex items-center gap-1 text-[0.68rem] font-semibold text-cyan-200"
                    animate={
                      activePillar === index
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -8 }
                    }
                  >
                    {content.ctaPrimary}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

          <p className="whitespace-pre-line  text-[0.7rem] font-semibold uppercase leading-relaxed tracking-[0.25em] text-white/40">
            {content.sideNote}
          </p>

        {/* Scroll cue */}
        <button
          type="button"
          onClick={() => scrollToContent()}
          className="mt-8 flex items-center gap-2 self-end text-xs font-medium text-white/60 transition-colors hover:text-white lg:mt-10"
        >
          {content.scrollHint}
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
      </motion.div>


      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[80] overflow-hidden bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden="true"
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={{ scale: 1.06 }}
              transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={heroImage}
                alt=""
                fill
                sizes="100vw"
                className="object-cover brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-white/35 to-white/90" />
            </motion.div>

            <div className="absolute inset-0 grid grid-cols-3">
              {[0, 1, 2].map((panel) => (
                <motion.div
                  key={panel}
                  className="border-r border-white/30 bg-white/30 backdrop-blur-sm"
                  initial={{ y: panel % 2 === 0 ? "100%" : "-100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: panel * 0.1,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}
            </div>

            <motion.div
              className="absolute inset-0 flex items-center justify-center px-6 text-center text-neutral-950"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
                  {transitionEyebrow}
                </p>
                <p className="mt-4 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                  {transitionTitle}
                </p>
              </div>
            </motion.div>
          </motion.div>
          
        )}
      </AnimatePresence>
      
    </section>
  );
}
