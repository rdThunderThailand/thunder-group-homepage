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

import { Fragment } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  ChevronRight,
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
  breadcrumb,
}: {
  content: DisplayHeroContent;
  breadcrumb: DisplayBreadcrumb;
}) {
  return (
    <section className="relative -mt-16 overflow-hidden bg-ink text-white lg:-mt-20">
      {/* Full-bleed hero photo */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={displayHero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Scrims keep the left-hand copy readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
        {/* Breadcrumb — "Home > Display Solutions" */}
        <nav
          aria-label={breadcrumb.current}
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/55"
        >
          <Link href="/" className="transition-colors hover:text-white">
            {breadcrumb.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-white/85">{breadcrumb.current}</span>
        </nav>

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
            <p className="absolute inset-x-2 bottom-6 text-right text-xl font-bold uppercase leading-tight tracking-wide text-white/90 sm:text-2xl">
              {content.imageOverlay}
            </p>
          </div>

          {/* Right — highlight rail */}
          <div className="lg:col-span-3">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 lg:grid-cols-1 lg:gap-0">
              {content.highlights.map((highlight, index) => {
                const Icon =
                  HERO_HIGHLIGHT_ICONS[index] ?? HERO_HIGHLIGHT_ICONS[0];
                const withRule = index < content.highlights.length - 1;
                return (
                  <li
                    key={highlight.label}
                    className={
                      "flex items-center gap-3 lg:py-3.5 " +
                      (withRule ? "lg:border-b lg:border-white/10" : "")
                    }
                  >
                    <Icon
                      className="h-5 w-5 shrink-0 text-blue-400"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium leading-tight text-white/85">
                      {highlight.label}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 border-t border-white/15 pt-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/45">
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
  return (
    <section id="solutions" className="scroll-mt-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.label}
          title={content.title}
          description={content.description}
          action={{ label: content.viewAll, href: "/solutions" }}
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.cards.map((card, index) => {
            const { href, Icon } = SOLUTION_META[index] ?? SOLUTION_META[0];
            return (
              <Link
                key={card.title}
                href={href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-lg hover:shadow-slate-200/70"
              >
                <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-slate-100">
                  <Image src={SOLUTION_IMAGES[index]} alt={card.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute -bottom-5 left-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-brand shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 pb-14 pt-8">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {card.description}
                  </p>
                </div>
                <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-brand transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
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
          action={{ label: content.viewAll, href: "/projects" }}
          tone="dark"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.projects.map((project, index) => (
            <Link
              key={project.name}
              href="/projects"
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
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <Image src={displayCta} alt="" fill sizes="100vw" className="object-cover" />
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
