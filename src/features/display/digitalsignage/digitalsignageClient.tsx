"use client";

// === DIGITAL SIGNAGE — DISPLAY SOLUTION PAGE ===
// Full page body for `/display/digitalsignage`, split out of the route's
// `page.tsx` as a Client Component per the project's `features/*Client.tsx`
// convention (mirrors `src/features/home/HomeClient` and
// `src/features/what-do-you-need/buy-technology`). `Navbar` (with `overlay`)
// and `Footer` already wrap every route from `src/app/[locale]/layout.tsx`, so
// this file renders only the body between them — the dark hero pulls itself up
// under the transparent bar with `-mt-16 lg:-mt-20`, exactly like the shared
// marketing `PageHero`.
//
// Every string is resolved on the server in `page.tsx` (the
// `DigitalSignagePage` namespace, plus the brand wordmark from `Common`) and
// passed in as one plain `content` prop — nothing in this tree calls
// `useTranslations`. Images are statically imported from the digital-signage assets.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import digitalSignageHero from "@/image/digital-signage/digital-signage-hero.png";
import managedMediaNetwork from "@/image/digital-signage/managed-media-network.png";
import digitalSignageFooter from "@/image/digital-signage/digital-signage-footer.png";
import whyStaticManual from "@/image/digital-signage/why-digital-signage/why-static-manual.png";
import whyContentDistribution from "@/image/digital-signage/why-digital-signage/why-content-distribution.png";
import whyMonitoringControl from "@/image/digital-signage/why-digital-signage/why-monitoring-control.png";
import systemContent from "@/image/digital-signage/connected-system/system-content.png";
import systemManage from "@/image/digital-signage/connected-system/system-manage.png";
import systemDeliver from "@/image/digital-signage/connected-system/system-deliver.png";
import systemOperate from "@/image/digital-signage/connected-system/system-operate.png";
import useCaseCorporate from "@/image/digital-signage/use-cases/use-case-corporate.png";
import useCaseRetail from "@/image/digital-signage/use-cases/use-case-retail.png";
import useCaseWayfinding from "@/image/digital-signage/use-cases/use-case-wayfinding.png";
import useCasePublicCommunication from "@/image/digital-signage/use-cases/use-case-public-communication.png";
import useCaseOperationsDashboard from "@/image/digital-signage/use-cases/use-case-operations-dashboard.png";
import useCaseMultiSite from "@/image/digital-signage/use-cases/use-case-multi-site.png";
import contextSpace from "@/image/digital-signage/context/context-space.png";
import contextAudience from "@/image/digital-signage/context/context-audience.png";
import contextContent from "@/image/digital-signage/context/context-content.png";
import contextOperation from "@/image/digital-signage/context/context-operation.png";
import contextTechnology from "@/image/digital-signage/context/context-technology.png";
import contextSupport from "@/image/digital-signage/context/context-support.png";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Eye,
  FolderOpen,
  ListVideo,
  Monitor,
  Play,
  Send,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import type {
  DesignedForSpaceContent,
  DigitalSignageContent,
  HeroContent,
  SolutionContent,
  ThunderOneContent,
  UseCasesContent,
  WhyContent,
} from "./types";

const WHY_IMAGES = [whyStaticManual, whyContentDistribution, whyMonitoringControl];
const SYSTEM_IMAGES = [systemContent, systemManage, systemDeliver, systemOperate];
const USE_CASE_IMAGES = [useCaseCorporate, useCaseRetail, useCaseWayfinding, useCasePublicCommunication, useCaseOperationsDashboard, useCaseMultiSite];
const CONTEXT_IMAGES = [contextSpace, contextAudience, contextContent, contextOperation, contextTechnology, contextSupport];

const HERO_PARTICLES = [
  { left: "12%", top: "28%", delay: 0.3, size: 3 },
  { left: "25%", top: "62%", delay: 1.5, size: 2 },
  { left: "38%", top: "42%", delay: 2.7, size: 4 },
  { left: "52%", top: "74%", delay: 0.9, size: 2 },
  { left: "66%", top: "34%", delay: 2.1, size: 3 },
  { left: "78%", top: "58%", delay: 3.3, size: 2 },
  { left: "90%", top: "22%", delay: 1.2, size: 4 },
];

/** ThunderOne Media feature-row icons, paired to `thunderone.features` by index. */
const THUNDERONE_ICONS: LucideIcon[] = [
  FolderOpen,
  ListVideo,
  CalendarClock,
  Send,
  Eye,
  Monitor,
];

function SectionImage({ src, alt, className = "aspect-[4/3]", sizes = "(min-width: 1024px) 33vw, 100vw" }: {
  src: StaticImageData;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden rounded-xl ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

type DigitalsignageClientProps = {
  content: DigitalSignageContent;
  /** Brand wordmark, from the `Common` namespace. */
  brand: string;
};

export function DigitalsignageClient({ content, brand }: DigitalsignageClientProps) {
  return (
    <>
      <HeroSection content={content.hero} brand={brand} />
      <WhySection content={content.why} />
      <SolutionSection content={content.solution} />
      <ThunderOneSection content={content.thunderone} />
      <UseCasesSection content={content.useCases} />
      <DesignedForSpaceSection content={content.designedForSpace} />
      <div className="relative h-48 overflow-hidden bg-ink sm:h-64 lg:h-80" aria-hidden="true">
        <Image src={digitalSignageFooter} alt="" fill sizes="100vw" className="object-cover" />
      </div>
    </>
  );
}

/* ── 1 · HERO ─────────────────────────────────────────────────────────────── */
// Dark hero with the lobby photo (`digital-signage-hero.png`) filling the whole
// section edge to edge. Ink scrims keep the left column — kicker, blue label,
// H1, lead and the two CTAs — readable over it; the right column only carries
// the "SPACES / PEOPLE / IDEAS / IN MOTION" annotations and the brand wordmark
// laid over the in-photo display. A divider row underneath holds the
// "connected world" notes.

function HeroSection({ content, brand }: { content: HeroContent; brand: string }) {
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
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 70]);

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
      {/* Full-bleed lobby photo */}
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
          style={shouldReduceMotion ? undefined : { x: smoothX, y: smoothY }}
        >
          <Image
            src={digitalSignageHero}
            alt=""
            fill
            priority
            sizes="106vw"
            className="object-cover object-center brightness-[1.18] contrast-[1.03] saturate-[1.12]"
          />
          <motion.div
            className="absolute right-[4%] top-[2%] h-[72%] w-[48%] rounded-full bg-[radial-gradient(ellipse,rgba(56,189,248,0.3)_0%,rgba(37,99,235,0.12)_42%,transparent_72%)] blur-3xl mix-blend-screen"
            animate={
              shouldReduceMotion
                ? undefined
                : { opacity: [0.3, 0.7, 0.3], scale: [0.97, 1.04, 0.97] }
            }
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[11%] top-[-6%] h-[82%] w-[44%] rounded-[45%] bg-[conic-gradient(from_210deg,transparent_0deg,rgba(34,211,238,0.2)_65deg,transparent_125deg,rgba(59,130,246,0.18)_220deg,transparent_300deg)] opacity-40 blur-2xl mix-blend-screen"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    rotate: [-5, 8, -5],
                    scale: [0.96, 1.05, 0.96],
                    opacity: [0.22, 0.52, 0.22],
                  }
            }
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute right-0 top-0 h-[78%] w-[48%] overflow-hidden">
            {HERO_PARTICLES.map((particle) => (
              <motion.span
                key={`${particle.left}-${particle.top}`}
                className="absolute rounded-full bg-cyan-100 shadow-[0_0_10px_2px_rgba(34,211,238,0.75)]"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: particle.size,
                  height: particle.size,
                }}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.4 }
                    : { opacity: [0, 0.9, 0], y: [8, -16] }
                }
                transition={{
                  duration: 5,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Keep the copy dark while allowing the display on the right to glow. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/72 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/78 via-transparent to-ink/25" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-cyan-100/12 to-transparent mix-blend-screen" />
      <motion.div
        className="pointer-events-none absolute -bottom-[12%] right-[2%] h-[42%] w-[62%] rounded-[50%] bg-[radial-gradient(ellipse,rgba(56,189,248,0.28)_0%,rgba(37,99,235,0.1)_40%,transparent_72%)] opacity-30 blur-3xl mix-blend-screen"
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: [0.18, 0.48, 0.18], scaleX: [0.94, 1.04, 0.94] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-36">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-white/45">
          {content.topLeft}
        </p>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left — copy */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              {content.label}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
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
                href="#solution"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {content.secondaryCta}
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right — annotations laid over the in-photo display */}
          <div className="relative hidden min-h-[16rem] lg:block">
            <motion.ul
              className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col items-end gap-1 text-3xl font-bold leading-tight tracking-wide text-white/90"
              variants={{
                hidden: {},
                visible: {
                  transition: { delayChildren: 0.6, staggerChildren: 0.14 },
                },
              }}
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
            >
              {content.imageOverlayLines.map((line) => (
                <motion.li
                  key={line}
                  variants={{
                    hidden: { opacity: 0, x: 18, y: 10, filter: "blur(5px)" },
                    visible: {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                >
                  {line}
                </motion.li>
              ))}
            </motion.ul>
            <span className="absolute bottom-2 right-4 flex items-center gap-1.5 text-white/85">
              <Zap
                className="h-4 w-4 fill-current"
                strokeWidth={0}
                aria-hidden="true"
              />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                {brand}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/45">
            {content.footNote}
          </p>
          <p className="text-sm text-white/70">
            <span className="border-b border-white/20 pb-1">
              {content.imageCaption}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── 2 · WHY DIGITAL SIGNAGE ──────────────────────────────────────────────── */
// Light section. Split header (eyebrow + heading left, lead right) above a
// three-up grid of "before → after" comparison cards. Each card has a
// image, then two text columns separated by an arrow.

function WhySection({ content }: { content: WhyContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {content.title}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-slate-500">
            {content.description}
          </p>
        </div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.16 } },
          }}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {content.cards.map((card, index) => (
            <motion.article
              key={card.before.title}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
              variants={{
                hidden: { opacity: 0, x: -56 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              <SectionImage src={WHY_IMAGES[index]} alt={card.after.title} className="aspect-[16/10] rounded-none" sizes="(min-width: 1280px) 384px, (min-width: 768px) 33vw, 100vw" />
              <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3 p-5">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {content.beforeLabel}
                  </p>
                  <h3 className="mt-1.5 text-sm font-semibold text-neutral-900">
                    {card.before.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {card.before.description}
                  </p>
                </div>
                <ArrowRight
                  className="mt-8 h-4 w-4 shrink-0 text-slate-300"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand">
                    {content.afterLabel}
                  </p>
                  <h3 className="mt-1.5 text-sm font-semibold text-neutral-900">
                    {card.after.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {card.after.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── 3 · THE SOLUTION ─────────────────────────────────────────────────────── */
// Dark section, and the `#solution` scroll target for the hero's second CTA.
// Copy + an outline "see how it works" button on the left; on the right a
// four-step flow (CONTENT → MANAGE → DELIVER → OPERATE) with image tiles
// joined by a faint connecting line, then a centered caption underneath.

function SolutionSection({ content }: { content: SolutionContent }) {
  const flowRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(flowRef, { amount: 0.3 });
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || !isInView) return;

    const interval = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % content.steps.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [content.steps.length, isInView, shouldReduceMotion]);

  return (
    <section id="solution" className="scroll-mt-20 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} tone="dark" />
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
              {content.description}
            </p>
            <button
              type="button"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Play
                className="h-4 w-4 fill-current"
                strokeWidth={0}
                aria-hidden="true"
              />
              {content.cta}
            </button>
          </div>

          <motion.div
            ref={flowRef}
            className="relative grid grid-cols-2 gap-6 sm:grid-cols-4"
            variants={{
              hidden: {},
              visible: {
                transition: { delayChildren: 0.15, staggerChildren: 0.16 },
              },
            }}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-[62%] hidden h-px origin-left bg-gradient-to-r from-transparent via-blue-400/70 to-transparent sm:block"
              initial={shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 1.2,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-hidden="true"
            >
              {!shouldReduceMotion && (
                <motion.span
                  className="absolute -top-1 left-0 h-2 w-16 rounded-full bg-blue-300/80 blur-sm"
                  animate={{ left: ["0%", "calc(100% - 4rem)"] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
            {content.steps.map((step, index) => (
              <motion.div
                key={step.name}
                className={
                  "relative flex flex-col rounded-xl p-2 transition-colors duration-500 " +
                  (activeStep === index ? "bg-blue-500/[0.07]" : "")
                }
                variants={{
                  hidden: { opacity: 0, x: -36, y: 12 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
              >
                <p
                  className={
                    "text-sm font-bold uppercase tracking-[0.14em] transition-colors duration-500 " +
                    (activeStep === index ? "text-blue-300" : "text-white")
                  }
                >
                  {step.name}
                </p>
                <p className="mt-1.5 text-[0.7rem] leading-relaxed text-white/50">
                  {step.items.join(" · ")}
                </p>
                <motion.div
                  className="mt-4 rounded-xl"
                  animate={{
                    scale: activeStep === index ? 1.045 : 1,
                    boxShadow:
                      activeStep === index
                        ? "0 0 28px rgba(59, 130, 246, 0.38)"
                        : "0 0 0 rgba(59, 130, 246, 0)",
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <SectionImage
                    src={SYSTEM_IMAGES[index]}
                    alt={step.name}
                    className="aspect-[4/3]"
                    sizes="(min-width: 1024px) 150px, (min-width: 640px) 25vw, 50vw"
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <p className="mt-12 text-center text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-blue-400/80">
          {content.caption}
        </p>
      </div>
    </section>
  );
}

/* ── 4 · CONNECTED BY THUNDERONE ──────────────────────────────────────────── */
// Light section, three columns on `lg`: copy + solid CTA, a laptop-dashboard
// image in the middle, and a six-item feature list on the right.

function ThunderOneSection({ content }: { content: ThunderOneContent }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-3 lg:items-center lg:gap-12">
          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500">
              {content.description}
            </p>
            <Link
              href="#/businesses/thunderone"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              {content.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <SectionImage src={managedMediaNetwork} alt={content.title} className="aspect-[16/10]" />

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {content.features.map((feature, index) => {
              const Icon = THUNDERONE_ICONS[index] ?? THUNDERONE_ICONS[0];
              return (
                <li key={feature.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-brand">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {feature.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── 5 · USE CASES ────────────────────────────────────────────────────────── */
// Dark section. Copy + outline CTA on the left; on the right a row of six
// labelled image cards that scroll horizontally on small screens and
// settle into a grid from `lg` up.

function UseCasesSection({ content }: { content: UseCasesContent }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const scrollCarousel = useCallback(
    (direction: -1 | 1) => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const firstCard = carousel.children[0] as HTMLElement | undefined;
      const secondCard = carousel.children[1] as HTMLElement | undefined;
      if (!firstCard) return;

      const step = secondCard
        ? secondCard.offsetLeft - firstCard.offsetLeft
        : firstCard.offsetWidth + 16;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const atStart = carousel.scrollLeft <= 2;
      const atEnd = carousel.scrollLeft >= maxScroll - 2;
      const left =
        direction === 1
          ? atEnd
            ? 0
            : carousel.scrollLeft + step
          : atStart
            ? maxScroll
            : carousel.scrollLeft - step;

      carousel.scrollTo({
        left,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    },
    [shouldReduceMotion],
  );

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      const carousel = carouselRef.current;
      if (
        !carousel ||
        document.hidden ||
        carousel.matches(":hover") ||
        carousel.contains(document.activeElement)
      ) {
        return;
      }
      scrollCarousel(1);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [scrollCarousel, shouldReduceMotion]);

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} tone="dark" />
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
              {content.description}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {content.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="relative min-w-0 pt-14 lg:pt-0">
            <div className="absolute right-0 top-0 flex gap-2 lg:-top-14">
              <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                aria-label="Previous use cases"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-blue-400 hover:bg-blue-500"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(1)}
                aria-label="Next use cases"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-blue-400 hover:bg-blue-500"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div
              ref={carouselRef}
              className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:gap-5 sm:px-0"
            >
              {content.items.map((item, index) => (
                <div
                  key={item.label}
                  className="relative flex aspect-[3/4] w-[82%] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl border border-white/20 bg-white/[0.04] p-3 sm:w-[calc((100%-1.25rem)/2)]"
                >
                  <Image
                    src={USE_CASE_IMAGES[index]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 82vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="relative text-xs font-semibold leading-tight text-white/85">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 6 · DESIGNED FOR YOUR SPACE ──────────────────────────────────────────── */
// Light section. Copy + a text link on the left; on the right a six-card grid,
// each card an image plus a title and a couple of " · "-separated
// context lines.

function DesignedForSpaceSection({
  content,
}: {
  content: DesignedForSpaceContent;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500">
              {content.description}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
            >
              {content.link}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.items.map((item, index) => (
              <article key={item.title} className="flex flex-col">
                <SectionImage src={CONTEXT_IMAGES[index]} alt={item.title} sizes="(min-width: 1280px) 240px, (min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw" />
                <h3 className="mt-3 text-sm font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <div className="mt-1 space-y-0.5">
                  {item.lines.map((line) => (
                    <p
                      key={line}
                      className="text-xs leading-relaxed text-slate-500"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
