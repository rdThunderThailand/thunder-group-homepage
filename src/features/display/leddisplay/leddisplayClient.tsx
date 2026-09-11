"use client";

// === LED DISPLAY — DISPLAY SOLUTION PAGE ===
// Full page body for `/display/leddisplay`, split out of the route's `page.tsx`
// as a Client Component per the project's `features/*Client.tsx` convention
// (mirrors the sibling `src/features/display/digitalsignageClient` and
// `src/features/home/HomeClient`). `Navbar` (with `overlay`) and `Footer`
// already wrap every route from `src/app/[locale]/layout.tsx`, so this file
// renders only the body between them — the dark hero pulls itself up under the
// transparent bar with `-mt-16 lg:-mt-20`, exactly like the shared marketing
// `PageHero`.
//
// This page is long, so each block lives in its own file under
// `./component/` and is composed here. Every string is resolved on
// the server in `page.tsx` (the `LedDisplayPage` namespace) and passed straight
// through as one plain `content` prop — nothing in this tree calls
// `useTranslations`. Section imagery is statically imported from the LED
// display asset set, and the section-8 accordion is UI only (no expand wired).

import { HeroSection } from "./component/HeroSection";
import { WhyLedSection } from "./component/WhyLedSection";
import { DesignedAroundSpaceSection } from "./component/DesignedAroundSpaceSection";
import { LedSolutionsSection } from "./component/LedSolutionsSection";
import { RealWorldSection } from "./component/RealWorldSection";
import { CompleteSystemSection } from "./component/CompleteSystemSection";
import { DesigningRightLedSection } from "./component/DesigningRightLedSection";
import { ConnectedOperationSection } from "./component/ConnectedOperationSection";
import { HowWeWorkSection } from "./component/HowWeWorkSection";
import { InActionSection } from "./component/InActionSection";
import { HowToStartSection } from "./component/HowToStartSection";
import { BottomCtaSection } from "./component/BottomCtaSection";
import type { LedDisplayContent } from "../types/leddisplayTypes";

type LedDisplayClientProps = {
  content: LedDisplayContent;
};

export function LedDisplayClient({ content }: LedDisplayClientProps) {
  return (
    <>
      <HeroSection content={content.hero} breadcrumb={content.breadcrumb} />
      <WhyLedSection content={content.whyLed} />
      <DesignedAroundSpaceSection content={content.designedAroundSpace} />
      <LedSolutionsSection content={content.ledSolutions} />
      <RealWorldSection content={content.realWorld} />
      <CompleteSystemSection content={content.completeSystem} />
      <DesigningRightLedSection content={content.designingRightLed} />
      <ConnectedOperationSection content={content.connectedOperation} />
      <HowWeWorkSection content={content.howWeWork} />
      <InActionSection content={content.inAction} />
      <HowToStartSection content={content.howToStart} />
      <BottomCtaSection content={content.bottomCta} />
    </>
  );
}
