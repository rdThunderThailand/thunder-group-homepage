"use client";

// === BUY TECHNOLOGY — TECHNOLOGY CATEGORY PAGE ===
// Full page body for `/what-do-you-need/buy-technology`, split out of the
// route's `page.tsx` as a Client Component per the project's
// `features/*Client.tsx` convention (mirrors
// `src/features/home/HomeClient`). `Navbar` (with `overlay`) and `Footer`
// already wrap every route from `src/app/[locale]/layout.tsx`, so this file
// renders only the body between them — the dark hero pulls itself up under the
// transparent bar with `-mt-16 lg:-mt-20`, exactly like the shared marketing
// `PageHero`.
//
// Every string is resolved on the server in `page.tsx` (the `BuyTechnologyPage`
// namespace, plus the brand wordmark from `Common`) and passed in as plain
// props — nothing in this tree calls `useTranslations`.

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Compass,
  FileText,
  Headset,
  Laptop,
  MonitorPlay,
  Network,
  Settings,
  ShieldCheck,
  Tag,
  Touchpad,
  Users,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import technologyHero from "@/image/buy-technology/technology-hero.png";
import displaySignage from "@/image/buy-technology/display-signage.png";
import interactiveKiosk from "@/image/buy-technology/interactive-kiosk.png";
import workplaceTechnology from "@/image/buy-technology/workplace-technology.png";
import computersDevices from "@/image/buy-technology/computers-devices.png";
import networkInfrastructure from "@/image/buy-technology/network-infrastructure.png";
import technologyConnectedBanner from "@/image/buy-technology/technology-connected-banner.png";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import type {
  BrandBannerContent,
  BreadcrumbContent,
  CategorySectionContent,
  CtaStripContent,
  TechnologyHeroContent,
} from "./types";

/** Hero feature-row icons, paired to `hero.features` by index. */
const FEATURE_ICONS: LucideIcon[] = [Tag, ShieldCheck, Users];

/** Per-category destination + icon, paired to `categorySection.categories` by
 *  index. Sub-pages not built yet. */
const CATEGORY_META: { href: string; Icon: LucideIcon; image: StaticImageData }[] = [
  { href: "/display/digitalsignage", Icon: MonitorPlay, image: displaySignage },
  { href: "/display/interactivekiosk", Icon: Touchpad, image: interactiveKiosk },
  { href: "/workplace-technology", Icon: Users, image: workplaceTechnology },
  { href: "/computers-devices", Icon: Laptop, image: computersDevices },
  {
    href: "/network-infrastructure",
    Icon: Network,
    image: networkInfrastructure,
  },
];

/** Bottom-banner item icons, paired to `bottomBanner.items` by index. */
const BANNER_ICONS: LucideIcon[] = [Headset, Settings, BarChart3];

type BuyTechnologyClientProps = {
  breadcrumb: BreadcrumbContent;
  /** Brand wordmark, from the `Common` namespace. */
  brand: string;
  hero: TechnologyHeroContent;
  categorySection: CategorySectionContent;
  ctaStrip: CtaStripContent;
  bottomBanner: BrandBannerContent;
};

export function BuyTechnologyClient({
  breadcrumb,
  hero,
  categorySection,
  ctaStrip,
  bottomBanner,
}: BuyTechnologyClientProps) {
  return (
    <>
      <HeroSection content={hero} breadcrumb={breadcrumb} />
      <CategorySection content={categorySection} />
      <CtaStrip content={ctaStrip} />
      <BottomBanner content={bottomBanner} />
    </>
  );
}

/* ── 1 + 2 · BREADCRUMB + HERO ─────────────────────────────────────────────── */
// Dark hero over a full-bleed showroom photo (`technology-hero.png`, which
// carries its own dark left panel as a text zone): breadcrumb + copy + feature
// row on the left over a scrim, and overlay labels — title, vertical side note,
// THUNDER watermark — sitting directly on the photo's right side on large
// screens.

type HeroSectionProps = {
  content: TechnologyHeroContent;
  breadcrumb: BreadcrumbContent;
};

function HeroSection({ content }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 75, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 75, damping: 24 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 72]);

  const moveImage = (event: React.PointerEvent<HTMLElement>) => {
    if (shouldReduceMotion || event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * -12);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -8);
  };

  const resetImage = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      className="relative -mt-16 overflow-hidden bg-ink text-white lg:-mt-20"
      onPointerMove={moveImage}
      onPointerLeave={resetImage}
    >
      {/* Full-bleed hero photo — showroom video wall + welcome desk. The image
          carries its own dark panel on the left; the scrims deepen it so the
          copy stays legible while the video wall keeps its glow on the right. */}
      <motion.div
        className="absolute -inset-[3%]"
        style={shouldReduceMotion ? undefined : { y: parallaxY }}
        aria-hidden="true"
      >
        <motion.div
          className="relative h-full w-full"
          initial={shouldReduceMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          style={
            shouldReduceMotion
              ? undefined
              : { x: smoothX, y: smoothY }
          }
        >
          <Image
            src={technologyHero}
            alt=""
            fill
            priority
            sizes="106vw"
            className="object-cover object-[65%_50%] brightness-[1.18] contrast-[1.04] saturate-[1.08]"
          />

          <motion.div
            className="absolute right-[4%] top-[4%] h-[58%] w-[52%] rounded-[50%] bg-cyan-300/15 blur-3xl mix-blend-screen"
            animate={
              shouldReduceMotion
                ? undefined
                : { opacity: [0.25, 0.55, 0.25], scale: [0.96, 1.04, 0.96] }
            }
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {!shouldReduceMotion && (
            <motion.div
              className="absolute inset-y-[-20%] -left-[35%] w-[34%] rotate-12 bg-gradient-to-r from-transparent via-cyan-200/25 to-transparent blur-xl mix-blend-screen"
              animate={{ x: ["0%", "410%"] }}
              transition={{
                duration: 1.35,
                repeat: Infinity,
                repeatDelay: 4.15,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          )}
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/72 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/5 to-transparent" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">

        <div className="mt-10 lg:min-h-[22rem] lg:max-w-[56%]">
          {/* Left — copy */}
          <div>
            <SectionEyebrow label={content.eyebrow} tone="dark" />
            <h1 className="mt-5 whitespace-pre-line text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-xl whitespace-pre-line text-base leading-relaxed text-white/70 sm:text-lg">
              {content.description}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/15 pt-8 sm:grid-cols-3">
              {content.features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index] ?? FEATURE_ICONS[0];
                return (
                  <div key={feature.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex shrink-0 text-white">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-semibold text-white">
                        {feature.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-white/55">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ── 3 · CHOOSE A CATEGORY ─────────────────────────────────────────────────── */
// Section header (eyebrow + heading + lead, with a decorative right-aligned note
// on large screens) above a responsive grid of five technology-category cards.
// On `lg` the grid is 6 columns: the first two cards span 3 (a 2-up row) and the
// last three span 2 (a 3-up row); on `sm` it is two columns with the first two
// cards full width; below that everything stacks. Each card is one link into a
// not-yet-built sub-page, with a category image and a circular
// icon badge.

type CategorySectionProps = {
  content: CategorySectionContent;
};

function CategorySection({ content }: CategorySectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="relative">
          <div className="max-w-2xl">
            <SectionEyebrow label={content.eyebrow} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500">
              {content.description}
            </p>
          </div>

          {/* Decorative right-aligned note — "DIFFERENT NEEDS. ONE THUNDER." */}
          <p className="absolute right-0 top-0 hidden max-w-[11rem] border-l border-slate-200 pl-4 text-right text-[0.7rem] font-semibold uppercase leading-relaxed tracking-[0.2em] text-slate-400 lg:block">
            {content.aside}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {content.categories.map((category, index) => {
            const { href, Icon, image } = CATEGORY_META[index] ?? CATEGORY_META[0];
            const large = index < 2;
            return (
              <Link
                key={category.name}
                href={href}
                className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-lg hover:shadow-slate-200/70 ${
                  large ? "sm:col-span-2 lg:col-span-3" : "lg:col-span-2"
                }`}
              >
                {/* Category image + icon badge */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    sizes={large
                      ? "(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
                      : "(min-width: 1280px) 384px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                    className="object-cover"
                  />
                  <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-brand shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="relative flex items-start">
                    <div className="w-full min-w-0">
                      <h3 className="pr-12 text-lg font-semibold text-neutral-900">
                        {category.name}
                      </h3>
                      <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-500">
                        {category.description}
                      </p>
                    </div>
                    <span className="absolute right-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>

                  <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                    {category.tags.join(" | ")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── 4 · CTA STRIP ────────────────────────────────────────────────────────── */
// Full-width light-blue card: a compass icon and a short "not sure what you
// need?" prompt on the left, a solid primary button (contact) and an outline
// secondary button (request) on the right.

type CtaStripProps = {
  content: CtaStripContent;
};

function CtaStrip({ content }: CtaStripProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="flex flex-col gap-6 rounded-2xl border border-sky-100 bg-sky-50 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10 lg:py-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-white text-brand">
              <Compass className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl">
                {content.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {content.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              {content.primaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-brand hover:text-brand"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {content.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 5 · BOTTOM BANNER ────────────────────────────────────────────────────── */
// Closing brand banner (dark): an English slogan on the left (kept English in
// both locales, per the design) and a row of three icon + label + note items on
// the right whose copy differs slightly by locale. The connected-technology artwork sits behind a dark overlay.

type BottomBannerProps = {
  content: BrandBannerContent;
};

function BottomBanner({ content }: BottomBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const panoramaX = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const imageBrightness = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["brightness(0.72)", "brightness(1.15)"],
  );
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.68]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink text-white"
    >
      <motion.div
        className="absolute inset-y-0 -left-[5%] w-[110%]"
        style={
          shouldReduceMotion
            ? { filter: "brightness(1)" }
            : { x: panoramaX, filter: imageBrightness }
        }
        aria-hidden="true"
      >
        <Image
          src={technologyConnectedBanner}
          alt=""
          fill
          sizes="110vw"
          className="object-cover"
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/75 to-slate-900/60"
        style={shouldReduceMotion ? undefined : { opacity: scrimOpacity }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8 lg:py-16">
        <h2 className="max-w-md text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {content.title}
        </h2>

        <div className="grid gap-10 sm:grid-cols-3 lg:shrink-0 lg:grid-cols-[max-content_max-content_max-content]">
          {content.items.map((item, index) => {
            const Icon = BANNER_ICONS[index] ?? BANNER_ICONS[0];
            return (
              <div key={item.title} className="flex items-start gap-4">
                <span className="mt-0.5 flex shrink-0 text-white">
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </span>
                <div className="lg:whitespace-nowrap">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
