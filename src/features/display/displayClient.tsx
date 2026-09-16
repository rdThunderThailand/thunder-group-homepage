"use client";

// === DISPLAY SOLUTIONS — HUB PAGE ===
// Full page body for `/display`, split out of the route's `page.tsx` as a
// Client Component per the project's `features/*Client.tsx` convention (mirrors
// the sibling `src/features/display/digitalsignageClient` and
// `src/features/home/HomeClient`). `Navbar` (with `overlay`) and `Footer`
// already wrap every route from `src/app/[locale]/layout.tsx`, so this file
// renders only the body between them — the dark hero pulls itself up under the
// transparent bar with `-mt-16 lg:-mt-20`, exactly like the shared marketing
// `PageHero`.
//
// Every string is resolved on the server in `page.tsx` (the `DisplayPage`
// namespace) and passed in as one plain `content` prop — nothing in this tree
// calls `useTranslations`. The page uses statically imported Display imagery,
// and the "Watch Video" button is UI only.
//
// The section stack, top to bottom:
//   1 + 2  Breadcrumb + hero (dark — full-bleed photo; copy left, slogan centre,
//          highlight rail right)
//   3      Feature strip (light — four icon columns)
//   4      Solutions (light — six solution cards, `#solutions` scroll target)
//   5      Featured projects (dark — four project cards)
//   6      Why Thunder Display (light — copy + a four-step process flow)
//   7      Bottom CTA banner (dark — placeholder skyline)

import { Fragment, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Eye,
  Handshake,
  Headphones,
  LayoutDashboard,
  Lightbulb,
  MessageCircle,
  Monitor,
  MonitorPlay,
  MousePointerClick,
  PencilRuler,
  Play,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import type {
  DisplayBottomCtaContent,
  DisplayBreadcrumb,
  DisplayContent,
  DisplayFeatureStripContent,
  DisplayFeaturedProjectsContent,
  DisplayHeroContent,
  DisplaySolutionsContent,
  DisplayWhyContent,
} from "./types/displayTypes";
import displayHero from "@/image/display/display-hero.png";
import ledDisplay from "@/image/display/solutions/led-display.png";
import digitalSignage from "@/image/display/solutions/digital-signage.png";
import interactiveKiosk from "@/image/display/solutions/interactive-kiosk.png";
import controlRoomCommandCenter from "@/image/display/solutions/control-room-command-center.png";
import retailExperience from "@/image/display/solutions/retail-experience.png";
import smartSpaceCity from "@/image/display/solutions/smart-space-city.png";
import airportDisplayProject from "@/image/display/projects/airport-display-project.png";
import energyCommandCenter from "@/image/display/projects/energy-command-center.png";
import retailMediaFacade from "@/image/display/projects/retail-media-facade.png";
import interactiveShowroom from "@/image/display/projects/interactive-showroom.png";
import displayCta from "@/image/display/display-cta.png";

/** Hero highlight-rail icons, paired to `hero.highlights` by index. */
const HERO_HIGHLIGHT_ICONS: LucideIcon[] = [
  Eye,
  ShieldCheck,
  SlidersHorizontal,
  Handshake,
];

const DISPLAY_PARTICLES = [
  { left: "12%", top: "72%", size: 3, delay: 0.2, duration: 5.2 },
  { left: "21%", top: "48%", size: 2, delay: 1.4, duration: 4.6 },
  { left: "30%", top: "64%", size: 4, delay: 2.1, duration: 5.8 },
  { left: "39%", top: "35%", size: 2, delay: 0.8, duration: 4.9 },
  { left: "47%", top: "78%", size: 3, delay: 3.2, duration: 5.4 },
  { left: "56%", top: "52%", size: 2, delay: 1.9, duration: 4.4 },
  { left: "64%", top: "24%", size: 4, delay: 0.5, duration: 6.1 },
  { left: "72%", top: "69%", size: 3, delay: 2.7, duration: 5.1 },
  { left: "80%", top: "42%", size: 2, delay: 1.1, duration: 4.7 },
  { left: "88%", top: "58%", size: 4, delay: 3.6, duration: 5.7 },
  { left: "94%", top: "30%", size: 2, delay: 2.3, duration: 4.5 },
];

/** Feature-strip icons, paired to `featureStrip.items` by index. */
const FEATURE_STRIP_ICONS: LucideIcon[] = [
  MonitorPlay,
  Lightbulb,
  Share2,
  ShieldCheck,
];

/** Per solution card: destination + icon, paired to `solutions.cards` by index.
 *  Sub-pages other than `/display/digitalsignage` are not built yet. */
const SOLUTION_META: { href: string; Icon: LucideIcon }[] = [
  { href: "/display/led-display", Icon: Monitor },
  { href: "/display/digitalsignage", Icon: MonitorPlay },
  { href: "/display/interactivekiosk", Icon: MousePointerClick },
  { href: "/display/control-room", Icon: LayoutDashboard },
  { href: "/display/retail-experience", Icon: ShoppingBag },
  { href: "/display/smart-space", Icon: Building2 },
];

const SOLUTION_IMAGES = [
  ledDisplay,
  digitalSignage,
  interactiveKiosk,
  controlRoomCommandCenter,
  retailExperience,
  smartSpaceCity,
];

const PROJECT_IMAGES = [
  airportDisplayProject,
  energyCommandCenter,
  retailMediaFacade,
  interactiveShowroom,
];

/** Why-Thunder process-step icons, paired to `why.steps` by index. */
const PROCESS_ICONS: LucideIcon[] = [
  MessageCircle,
  PencilRuler,
  Settings,
  Headphones,
];

type DisplayClientProps = {
  content: DisplayContent;
};

export function DisplayClient({ content }: DisplayClientProps) {
  return (
    <>
      <HeroSection content={content.hero} breadcrumb={content.breadcrumb} />
      <FeatureStripSection content={content.featureStrip} />
      <SolutionsSection content={content.solutions} />
      <FeaturedProjectsSection content={content.featuredProjects} />
      <WhySection content={content.why} />
      <BottomCtaSection content={content.bottomCta} />
    </>
  );
}

/* ── 1 + 2 · BREADCRUMB + HERO ─────────────────────────────────────────────── */
// Full-bleed dark hero. The `display-hero.png` photo fills the whole section
// edge to edge under ink scrims that keep the copy readable. The breadcrumb
// runs across the top; below it a 12-column grid holds the copy + CTAs on the
// left (≈5/12), the in-photo LED-screen slogan in the centre (≈4/12), and a
// vertical rail of four icon highlights on the right (≈3/12) closing with a
// divider and a small note.

function HeroSection({
  content,
}: {
  content: DisplayHeroContent;
  breadcrumb: DisplayBreadcrumb;
}) {
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
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 68]);

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
      {/* Full-bleed hero photo */}
      <motion.div
        className="absolute -inset-[3%]"
        style={shouldReduceMotion ? undefined : { y: parallaxY }}
        aria-hidden="true"
      >
        <motion.div
          className="relative h-full w-full"
          initial={shouldReduceMotion ? false : { scale: 1.07 }}
          animate={{ scale: 1.015 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          style={
            shouldReduceMotion ? undefined : { x: smoothX, y: smoothY }
          }
        >
          <Image
            src={displayHero}
            alt=""
            fill
            priority
            sizes="106vw"
            className="object-cover object-center brightness-110 saturate-[1.12]"
          />

          <motion.div
            className="absolute right-[-4%] top-[-8%] h-[68%] w-[60%] rounded-full bg-[radial-gradient(ellipse,rgba(83,224,255,0.28)_0%,rgba(37,99,235,0.12)_42%,transparent_72%)] blur-2xl mix-blend-screen"
            animate={
              shouldReduceMotion
                ? undefined
                : { opacity: [0.32, 0.7, 0.32], scale: [0.97, 1.04, 0.97] }
            }
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="absolute right-0 top-0 h-[66%] w-[58%] overflow-hidden">
            {DISPLAY_PARTICLES.map((particle, index) => (
              <motion.span
                key={`${particle.left}-${particle.top}`}
                className="absolute rounded-full bg-cyan-100 shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: particle.size,
                  height: particle.size,
                }}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.45 }
                    : {
                        opacity: [0, 0.9, 0],
                        y: [10, -18],
                        scale: [0.7, 1.25, 0.7],
                      }
                }
                transition={{
                  duration: particle.duration,
                  delay: particle.delay + index * 0.05,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

        </motion.div>
      </motion.div>

      {/* Scrims keep the copy dark while the LED display remains vivid. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/78 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/25" />
      <div className="absolute inset-y-0 right-0 w-[58%] bg-gradient-to-l from-cyan-100/15 via-blue-400/5 to-transparent mix-blend-screen" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left — copy */}
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              {content.label}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              {content.titleLead}{" "}
              <span className="text-blue-500">{content.titleAccent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {content.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#solutions"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
              >
                {content.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Play
                  className="h-4 w-4 fill-current"
                  strokeWidth={0}
                  aria-hidden="true"
                />
                {content.secondaryCta}
              </button>
            </div>
          </div>

          {/* Centre — slogan laid over the in-photo LED screen */}
          <div className="relative hidden min-h-[16rem] lg:col-span-4 lg:block">
            <p className="absolute -right-60 -top-10 -rotate-6 text-left text-xl font-bold uppercase leading-[0.95] tracking-tight text-white/95 drop-shadow-[0_2px_10px_rgba(0,20,60,0.9)] sm:text-2xl">
              {content.imageOverlay.split(" ").map((word) => (
                <span key={word} className="block">
                  {word}
                </span>
              ))}
            </p>
          </div>

          {/* Right — highlight rail */}
          <div className="text-[#ffffff] lg:absolute lg:bottom-8 lg:right-8 lg:w-60">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 lg:grid-cols-1 lg:gap-0">
              {content.highlights.map((highlight, index) => {
                const Icon =
                  HERO_HIGHLIGHT_ICONS[index] ?? HERO_HIGHLIGHT_ICONS[0];
                const withRule = index < content.highlights.length - 1;
                return (
                  <motion.li
                    key={highlight.label}
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, x: 16 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: shouldReduceMotion ? 0 : 0.55 + index * 0.14,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={
                      "relative flex items-center gap-3 lg:py-3.5"
                    }
                  >
                    <Icon
                      className="h-7 w-7 shrink-0 text-blue-400"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium leading-tight text-[#ffffff]">
                      {highlight.label}
                    </span>
                    {withRule && (
                      <motion.span
                        className="absolute inset-x-0 bottom-0 hidden h-px origin-left bg-white/10 lg:block"
                        initial={shouldReduceMotion ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.65,
                          delay: shouldReduceMotion ? 0 : 0.75 + index * 0.14,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    )}
                  </motion.li>
                );
              })}
            </ul>
            <p className="mt-4 border-t border-white/15 pt-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#ffffff]">
              {content.highlightsNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 3 · FEATURE STRIP ────────────────────────────────────────────────────── */
// Light band directly under the hero. Four icon + title + descriptor columns,
// divided by a faint left rule from `lg` up and stacking to one/two columns
// below that.

function FeatureStripSection({
  content,
}: {
  content: DisplayFeatureStripContent;
}) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, index) => {
            const Icon = FEATURE_STRIP_ICONS[index] ?? FEATURE_STRIP_ICONS[0];
            return (
              <div
                key={item.title}
                className={
                  "flex items-start gap-3 " +
                  (index > 0
                    ? "lg:border-l lg:border-slate-200 lg:pl-6"
                    : "")
                }
              >
                <Icon
                  className="mt-0.5 h-6 w-6 shrink-0 text-brand"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.detail}
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

/* ── Shared section header ─────────────────────────────────────────────────── */
// Eyebrow + heading + lead on the left, with an optional link that floats to
// the top-right on large screens. `tone` flips the palette for dark sections.

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="relative">
      <div className="max-w-2xl">
        <SectionEyebrow label={eyebrow} tone={tone} />
        <h2
          className={
            "mt-5 text-3xl font-bold tracking-tight sm:text-4xl " +
            (dark ? "text-white" : "text-neutral-900")
          }
        >
          {title}
        </h2>
        <p
          className={
            "mt-4 text-base leading-relaxed " +
            (dark ? "text-white/70" : "text-slate-500")
          }
        >
          {description}
        </p>
      </div>
      {action ? (
        <Link
          href={action.href}
          className={
            "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors lg:absolute lg:right-0 lg:top-1 lg:mt-0 " +
            (dark
              ? "text-blue-400 hover:text-blue-300"
              : "text-brand hover:text-brand-strong")
          }
        >
          {action.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

/* ── 4 · SOLUTIONS ────────────────────────────────────────────────────────── */
// Light section, and the `#solutions` scroll target for the hero's primary CTA.
// A shared header with a top-right "view all" link above a six-card grid. Each
// card is a `Link` into a solution sub-page: solution image with an icon
// badge overlapping its lower-left corner, a title + short description, and a
// circular arrow button pinned bottom-right.

function SolutionsSection({ content }: { content: DisplaySolutionsContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="solutions" className="scroll-mt-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.label}
          title={content.title}
          description={content.description}
          action={{ label: content.viewAll, href: "#/solutions" }}
        />

        <motion.div
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.16 } },
          }}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: false, amount: 0.08 }}
        >
          {content.cards.map((card, index) => {
            const { href, Icon } = SOLUTION_META[index] ?? SOLUTION_META[0];
            return (
              <motion.div
                key={card.title}
                className="h-full"
                variants={{
                  hidden: { opacity: 0, y: 32, scale: 0.98 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
              >
                <Link
                  href={href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-200/50"
                >
                  <span className="pointer-events-none absolute inset-0 z-20 rounded-2xl ring-1 ring-inset ring-blue-400/0 transition-all duration-500 group-hover:ring-blue-400/70 group-hover:shadow-[inset_0_0_28px_rgba(59,130,246,0.12)]" />
                  <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-slate-100">
                    <Image
                      src={SOLUTION_IMAGES[index]}
                      alt={card.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.08]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 via-transparent to-cyan-200/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/95 text-brand shadow-md backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-blue-300 group-hover:shadow-[0_0_24px_rgba(37,99,235,0.55)]">
                      <span className="absolute inset-0 rounded-xl border border-blue-400 opacity-0 group-hover:animate-ping group-hover:opacity-30" />
                      <Icon className="relative h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5 pb-14">
                    <h3 className="text-sm font-semibold text-neutral-900">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      {card.description}
                    </p>
                  </div>
                  <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-brand transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── 5 · FEATURED PROJECTS ────────────────────────────────────────────────── */
// Dark section. Shared header with a top-right "view all" link above a four-card
// row. Each card is a `Link` to `/projects`: project image, then the project
// name, a " · "-joined tag row and a circular arrow button.

function FeaturedProjectsSection({
  content,
}: {
  content: DisplayFeaturedProjectsContent;
}) {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.label}
          title={content.title}
          description={content.description}
          action={{ label: content.viewAll, href: "#/projects" }}
          tone="dark"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.projects.map((project, index) => (
            <Link
              key={project.name}
              href="#/projects"
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] transition-colors hover:border-white/40"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-white/[0.03]">
                <Image src={PROJECT_IMAGES[index]} alt={project.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 items-end justify-between gap-3 p-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">
                    {project.name}
                  </h3>
                  <p className="mt-1 truncate text-[0.7rem] text-white/50">
                    {project.tags.join(" · ")}
                  </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-ink">
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

/* ── 6 · WHY THUNDER DISPLAY ──────────────────────────────────────────────── */
// Light section, two columns on `lg`: eyebrow + heading + lead + an outline CTA
// on the left; a four-step process flow (CONSULT → DESIGN → DELIVER → OPERATE)
// on the right, arrow-separated from `sm` up and stacking vertically below that.

function WhySection({ content }: { content: DisplayWhyContent }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500">
              {content.description}
            </p>
            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:border-brand hover:text-brand"
            >
              {content.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {content.steps.map((step, index) => {
              const Icon = PROCESS_ICONS[index] ?? PROCESS_ICONS[0];
              return (
                <Fragment key={step.name}>
                  <div className="flex flex-1 gap-4 sm:flex-col sm:gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900">
                        {step.name}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < content.steps.length - 1 ? (
                    <ArrowRight
                      className="hidden h-5 w-5 shrink-0 self-start text-slate-300 sm:mt-3.5 sm:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 7 · BOTTOM CTA BANNER ────────────────────────────────────────────────── */
// Closing call to action over the Display CTA artwork. Copy on the left and a
// solid + outline button pair on the right.

function BottomCtaSection({ content }: { content: DisplayBottomCtaContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <motion.div
        className="absolute inset-y-0 -left-[8%] w-[116%]"
        animate={
          shouldReduceMotion ? undefined : { x: ["-3%", "3%", "-3%"] }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      >
        <Image
          src={displayCta}
          alt=""
          fill
          sizes="116vw"
          className="object-cover"
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-slate-900/50"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {content.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
            {content.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
          >
            {content.primaryCta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {content.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
