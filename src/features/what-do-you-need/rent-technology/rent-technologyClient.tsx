"use client";

// === RENT TECHNOLOGY — DISPLAY RENTAL LANDING PAGE ===
// Full page body for `/what-do-you-need/rent-technology`, split out of the
// route's `page.tsx` as a Client Component per the project's
// `features/*Client.tsx` convention (mirrors `src/features/home/HomeClient` and
// `src/features/buy-technology`). `Navbar` (with `overlay`) and `Footer` already
// wrap every route from `src/app/[locale]/layout.tsx`, so this file renders only
// the body between them — the dark hero pulls itself up under the transparent
// bar with `-mt-16 lg:-mt-20`, exactly like the shared marketing `PageHero`.
//
// Every string is resolved on the server in `page.tsx` (the `RentTechnologyPage`
// namespace) and passed in as plain props — nothing here calls
// `useTranslations`. The hero
// search form is UI only (no data fetching or validation) pending real wiring.

import Image from "next/image";
import rentalHero from "@/image/rent-technology/rental-hero.png";
import rentalSupportTeam from "@/image/rent-technology/rental-support-team.png";
import rentalProjectBanner from "@/image/rent-technology/rental-project-banner.png";
import eventExhibition from "@/image/rent-technology/start-here/event-exhibition.png";
import promotionCampaign from "@/image/rent-technology/start-here/promotion-campaign.png";
import meetingPresentation from "@/image/rent-technology/start-here/meeting-presentation.png";
import informationWayfinding from "@/image/rent-technology/start-here/information-wayfinding.png";
import interactiveExperience from "@/image/rent-technology/start-here/interactive-experience.png";
import rentalConsultation from "@/image/rent-technology/start-here/rental-consultation.png";
import digitalPoster from "@/image/rent-technology/rental-equipment/digital-poster.png";
import professionalDisplay from "@/image/rent-technology/rental-equipment/professional-display.png";
import interactiveDisplay from "@/image/rent-technology/rental-equipment/interactive-display.png";
import rentalKiosk from "@/image/rent-technology/rental-equipment/rental-kiosk.png";
import rentalLedDisplay from "@/image/rent-technology/rental-equipment/rental-led-display.png";
import playersAccessories from "@/image/rent-technology/rental-equipment/players-accessories.png";
import popularPortraitPoster from "@/image/rent-technology/popular-rentals/popular-portrait-poster.png";
import popularProfessionalDisplay from "@/image/rent-technology/popular-rentals/popular-professional-display.png";
import popularInteractiveKiosk from "@/image/rent-technology/popular-rentals/popular-interactive-kiosk.png";
import popularLedStage from "@/image/rent-technology/popular-rentals/popular-led-stage.png";
import popularVideoWall from "@/image/rent-technology/popular-rentals/popular-video-wall.png";
import { Fragment } from "react";
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  ChevronDown,
  FileText,
  Hand,
  HelpCircle,
  MapPin,
  Megaphone,
  MessageCircle,
  MonitorPlay,
  Search,
  SquareStack,
  Truck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import type {
  BottomCtaContent,
  BreadcrumbContent,
  EquipmentContent,
  HeroContent,
  HowItWorksContent,
  PopularContent,
  StartHereContent,
} from "./types";

/** Route prefix for every not-yet-built sub-page linked from this landing page. */
const RENT_BASE = "/what-do-you-need/rent-technology";

/** Per use-case card: destination + icon, paired to `startHere.cards` by index. */
const USE_CASE_META: { href: string; Icon: LucideIcon }[] = [
  { href: `${RENT_BASE}/events`, Icon: Users },
  { href: `${RENT_BASE}/campaigns`, Icon: Megaphone },
  { href: `${RENT_BASE}/meetings`, Icon: MonitorPlay },
  { href: `${RENT_BASE}/information`, Icon: MapPin },
  { href: `${RENT_BASE}/interactive`, Icon: Hand },
  { href: `${RENT_BASE}/help-me-choose`, Icon: HelpCircle },
];

/** Per equipment card destination, paired to `equipment.items` by index. */
const EQUIPMENT_HREFS: string[] = [
  `${RENT_BASE}/equipment/digital-poster`,
  `${RENT_BASE}/equipment/professional-display`,
  `${RENT_BASE}/equipment/interactive-display`,
  `${RENT_BASE}/equipment/kiosk`,
  `${RENT_BASE}/equipment/led-display`,
  `${RENT_BASE}/equipment/players-accessories`,
];

/** Per product "View Details" destination, paired to `popular.products` by index. */
const PRODUCT_HREFS: string[] = [
  `${RENT_BASE}/products/portrait-digital-poster-43`,
  `${RENT_BASE}/products/professional-display-55`,
  `${RENT_BASE}/products/interactive-kiosk-32`,
  `${RENT_BASE}/products/led-display-indoor`,
  `${RENT_BASE}/products/video-wall-2x2-55`,
];

/** How-it-works step icons, paired to `howItWorks.steps` by index. */
const STEP_ICONS: LucideIcon[] = [Search, CalendarDays, FileText, Truck];

const USE_CASE_IMAGES = [eventExhibition, promotionCampaign, meetingPresentation, informationWayfinding, interactiveExperience, rentalConsultation];
const EQUIPMENT_IMAGES = [digitalPoster, professionalDisplay, interactiveDisplay, rentalKiosk, rentalLedDisplay, playersAccessories];
const PRODUCT_IMAGES = [popularPortraitPoster, popularProfessionalDisplay, popularInteractiveKiosk, popularLedStage, popularVideoWall];

type RentTechnologyClientProps = {
  breadcrumb: BreadcrumbContent;
  hero: HeroContent;
  startHere: StartHereContent;
  equipment: EquipmentContent;
  popular: PopularContent;
  howItWorks: HowItWorksContent;
  bottomCta: BottomCtaContent;
};

export function RentTechnologyClient({
  breadcrumb,
  hero,
  startHere,
  equipment,
  popular,
  howItWorks,
  bottomCta,
}: RentTechnologyClientProps) {
  return (
    <>
      <HeroSection content={hero} breadcrumb={breadcrumb} />
      <StartHereSection content={startHere} />
      <EquipmentSection content={equipment} />
      <PopularSection content={popular} />
      <HowItWorksSection content={howItWorks} />
      <BottomCtaSection content={bottomCta} />
    </>
  );
}

/* ── Shared section header ─────────────────────────────────────────────────── */
// Eyebrow + heading + lead, with an optional link that floats to the top-right
// on large screens. Link labels already carry their own " →" from the message
// files, so no separate arrow icon is rendered.

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
};

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="relative">
      <div className="max-w-2xl">
        <SectionEyebrow label={eyebrow} />
        <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
      {action ? (
        <Link
          href={action.href}
          className="mt-4 inline-flex items-center text-sm font-semibold text-brand transition-colors hover:text-brand-strong lg:absolute lg:right-0 lg:top-1 lg:mt-0"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

/* ── 1 + 2 · BREADCRUMB + HERO ─────────────────────────────────────────────── */
// Dark hero over a full-bleed `rental-hero` photo: breadcrumb + copy + a white
// search-form card on the left; a handwriting-style slogan and a vertical word
// list laid straight over the right half of the photo. A left-weighted scrim
// keeps the copy legible. The form is UI only.

type HeroSectionProps = {
  content: HeroContent;
  breadcrumb: BreadcrumbContent;
};

function HeroSection({ content }: HeroSectionProps) {
  const sideNoteWords = content.imageSideNote
    .split("/")
    .map((word) => word.trim())
    .filter(Boolean);

  return (
    <section className="relative -mt-16 overflow-hidden bg-ink text-white lg:-mt-20">
      {/* Full-bleed hero photo */}
      <Image
        src={rentalHero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Left-weighted scrim so the copy + form stay legible, plus a soft
          top/bottom darkening for the breadcrumb and the corner overlays. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/35"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left — copy + search form */}
          <div>
            <SectionEyebrow label={content.eyebrow} tone="dark" />
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {content.description}
            </p>

            {/* Search form card — UI only, no logic wired */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 text-neutral-900 shadow-2xl shadow-slate-950/40 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                {/* What are you looking for? */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-slate-500">
                    {content.form.lookingForLabel}
                  </span>
                  <span className="relative block">
                    <select
                      defaultValue={content.form.lookingForOptions[0]}
                      aria-label={content.form.lookingForLabel}
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-neutral-900 outline-none transition-colors focus:border-brand"
                    >
                      {content.form.lookingForOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                  </span>
                </label>

                {/* When do you need it? */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-slate-500">
                    {content.form.whenLabel}
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-brand"
                  >
                    <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {content.form.whenPlaceholder}
                  </button>
                </label>

                {/* Submit */}
                <div className="flex items-end">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong sm:w-auto"
                  >
                    {content.form.submit}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className="mt-4 inline-flex items-center text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {content.quoteLink}
            </Link>
          </div>

          {/* Right — handwriting slogan + word list laid straight over the
              full-bleed hero photo (no framed box of its own). */}
          <div className="relative aspect-[4/3] min-h-[16rem]">
            {/* Handwriting-style overlay */}
            <p className="absolute right-0 top-2 max-w-[12rem] text-right text-xl font-medium italic leading-tight text-white/90 drop-shadow sm:text-2xl">
              {content.imageOverlayTitle}
            </p>

            {/* Vertical word list */}
            <ul className="absolute bottom-2 right-0 flex flex-col items-end gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-white/60 drop-shadow">
              {sideNoteWords.map((word, index) => (
                <li key={`${word}-${index}`}>{word}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 3 · START HERE ───────────────────────────────────────────────────────── */
// "What Do You Need the Display For?" — a header with a top-right help link and
// a responsive grid of six use-case cards (six across on xl, wrapping down to
// one column on mobile). Each card links into a not-yet-built sub-page.

type StartHereSectionProps = {
  content: StartHereContent;
};

function StartHereSection({ content }: StartHereSectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          action={{
            label: content.helpLink,
            href: `${RENT_BASE}/help-me-choose`,
          }}
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {content.cards.map((card, index) => {
            const { href, Icon } = USE_CASE_META[index] ?? USE_CASE_META[0];
            return (
              <Link
                key={card.title}
                href={href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-lg hover:shadow-slate-200/70"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image src={USE_CASE_IMAGES[index] ?? USE_CASE_IMAGES[0]} alt={card.title} fill
                    sizes="(min-width: 1280px) 192px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-brand">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-neutral-900">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-500">
                    {card.description}
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-semibold text-brand transition-colors group-hover:text-brand-strong">
                    {card.link}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── 4 · RENTAL EQUIPMENT ─────────────────────────────────────────────────── */
// "Choose the Technology That Fits Your Project." — a header with a "view all"
// link and a six-across grid of equipment cards (no icon badge, unlike the
// use-case cards).

type EquipmentSectionProps = {
  content: EquipmentContent;
};

function EquipmentSection({ content }: EquipmentSectionProps) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          action={{ label: content.viewAllLink, href: `${RENT_BASE}/equipment` }}
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {content.items.map((item, index) => (
            <Link
              key={item.name}
              href={EQUIPMENT_HREFS[index] ?? EQUIPMENT_HREFS[0]}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-lg hover:shadow-slate-200/70"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <Image src={EQUIPMENT_IMAGES[index] ?? EQUIPMENT_IMAGES[0]} alt={item.name} fill
                    sizes="(min-width: 1280px) 192px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-semibold text-neutral-900">
                  {item.name}
                </h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-500">
                  {item.description}
                </p>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-brand transition-colors group-hover:text-brand-strong">
                  {content.exploreLink}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 5 · POPULAR RENTALS ──────────────────────────────────────────────────── */
// "Ready for Your Next Project." — a five-across grid of product cards: an
// optional "Popular" badge, product image, name, category tags, small spec
// row, price, and an outline + solid button pair.

type PopularSectionProps = {
  content: PopularContent;
};

function PopularSection({ content }: PopularSectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          action={{ label: content.viewAllLink, href: `${RENT_BASE}/products` }}
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {content.products.map((product, index) => (
            <div
              key={product.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <Image src={PRODUCT_IMAGES[index] ?? PRODUCT_IMAGES[0]} alt={product.name} fill
                    sizes="(min-width: 1280px) 240px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover" />
                {product.popular ? (
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-semibold text-brand shadow-sm">
                    {content.popularBadge}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-semibold text-neutral-900">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-[0.7rem] text-slate-400">
                  {product.tags.join(" · ")}
                </p>

                <ul className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.7rem] text-slate-500">
                  {product.specs.map((spec) => (
                    <li key={spec} className="inline-flex items-center gap-1">
                      <SquareStack
                        className="h-3 w-3 text-slate-400"
                        aria-hidden="true"
                      />
                      {spec}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-sm font-semibold text-neutral-900">
                  {product.price}
                </p>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={PRODUCT_HREFS[index] ?? PRODUCT_HREFS[0]}
                    className="flex-1 rounded-full border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-neutral-800 transition-colors hover:border-brand hover:text-brand"
                  >
                    {content.detailsCta}
                  </Link>
                  <Link
                    href="/contact"
                    className="flex-1 rounded-full bg-brand px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-brand-strong"
                  >
                    {content.quoteCta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 6 · HOW IT WORKS ─────────────────────────────────────────────────────── */
// "From Requirement to Ready-to-Use." — a four-step row (arrow-separated on
// `sm`+, stacked on mobile) beside a "More than equipment" aside card.

type HowItWorksSectionProps = {
  content: HowItWorksContent;
};

function HowItWorksSection({ content }: HowItWorksSectionProps) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow label={content.eyebrow} />
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            {content.description}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Steps */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {content.steps.map((step, index) => {
                const Icon = STEP_ICONS[index] ?? STEP_ICONS[0];
                return (
                  <Fragment key={step.number}>
                    <div className="flex flex-1 gap-4 sm:flex-col sm:gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-400">
                          {step.number}
                        </p>
                        <h3 className="mt-0.5 text-sm font-semibold text-neutral-900">
                          {step.title}
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

          {/* Aside */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
              <Image src={rentalSupportTeam} alt={content.aside.title} fill
                sizes="(min-width: 1280px) 344px, (min-width: 1024px) 33vw, 100vw"
                className="object-cover" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-neutral-900">
              {content.aside.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              {content.aside.description}
            </p>
            <Link
              href={`${RENT_BASE}/services`}
              className="mt-4 inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:border-brand hover:text-brand"
            >
              {content.aside.link}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 7 · BOTTOM CTA BANNER === (dark) ─────────────────────────────────────── */
// Closing call to action over the rental project artwork.

type BottomCtaSectionProps = {
  content: BottomCtaContent;
};

function BottomCtaSection({ content }: BottomCtaSectionProps) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <Image src={rentalProjectBanner} alt="" fill sizes="100vw" className="object-cover" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/75 to-slate-900/60"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <SectionEyebrow label={content.eyebrow} tone="dark" />
          <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {content.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
            {content.description}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`${RENT_BASE}/equipment`}
              className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              {content.primaryCta}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {content.secondaryCta}
            </Link>
          </div>
        </div>

        <p className="shrink-0 text-xl font-medium italic leading-snug text-white/80 sm:text-2xl lg:max-w-[16rem] lg:text-right">
          {content.sideNote}
        </p>
      </div>
    </section>
  );
}
