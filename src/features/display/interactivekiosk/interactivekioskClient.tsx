"use client";

// === INTERACTIVE & KIOSK — DISPLAY SOLUTION PAGE ===
// Full page body for `/display/interactivekiosk`, split out of the route's
// `page.tsx` as a Client Component per the project's `features/*Client.tsx`
// convention (mirrors the sibling `src/features/display/leddisplayClient` and
// `src/features/display/digitalsignage`). `Navbar` (with `overlay`) and
// `Footer` already wrap every route from `src/app/[locale]/layout.tsx`, so this
// file renders only the body between them — the dark hero pulls itself up under
// the transparent bar with `-mt-16 lg:-mt-20`, exactly like the shared
// marketing `PageHero`.
//
// This page is long, so each block lives in its own file under
// `./component/` and is composed here. Every string is resolved
// on the server in `page.tsx` (the `InteractiveKioskPage` namespace) and passed
// straight through as one plain `content` prop — nothing in this tree calls
// `useTranslations`. Section imagery is statically imported from the
// interactive-kiosk asset set.

import { HeroSection } from "./component/HeroSection";
import { WhyInteractiveSection } from "./component/WhyInteractiveSection";
import { DesignedAroundInteractionSection } from "./component/DesignedAroundInteractionSection";
import { SolutionsSection } from "./component/SolutionsSection";
import { RealWorldSection } from "./component/RealWorldSection";
import { CompleteExperienceSection } from "./component/CompleteExperienceSection";
import { InteractionCapabilitiesSection } from "./component/InteractionCapabilitiesSection";
import { HowWeWorkSection } from "./component/HowWeWorkSection";
import { InActionSection } from "./component/InActionSection";
import { BottomCtaSection } from "./component/BottomCtaSection";
import type { InteractiveKioskContent } from "../types/interactivekioskTypes";

type InteractiveKioskClientProps = {
  content: InteractiveKioskContent;
};

export function InteractiveKioskClient({ content }: InteractiveKioskClientProps) {
  return (
    <>
      <HeroSection content={content.hero} breadcrumb={content.breadcrumb} />
      <WhyInteractiveSection content={content.whyInteractive} />
      <DesignedAroundInteractionSection content={content.designedAround} />
      <SolutionsSection content={content.solutions} />
      <RealWorldSection content={content.realWorld} />
      <CompleteExperienceSection content={content.completeExperience} />
      <InteractionCapabilitiesSection content={content.capabilities} />
      <HowWeWorkSection content={content.howWeWork} />
      <InActionSection content={content.inAction} />
      <BottomCtaSection content={content.bottomCta} />
    </>
  );
}
