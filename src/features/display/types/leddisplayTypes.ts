// Content shapes for the LED Display solution page (`/display/leddisplay`).
//
// Every string is resolved from the `LedDisplayPage` namespace
// (`messages/{th,en}/leddisplay.json`) in
// `src/app/[locale]/display/leddisplay/page.tsx` — a Server Component — and
// handed to `LedDisplayClient` (and, through it, every `leddisplay/component/*`
// component) as one plain `content` prop. Nothing in that tree calls
// `useTranslations`, matching the sibling `src/features/display/digitalsignage`
// and `src/features/home`.
//
// The small SECTION eyebrows ("LED DISPLAY", "WHY LED", …) and a handful of
// slogan overlays stay English in both locales — they read as brand wording in
// the design — so their th/en values are intentionally identical.

export type LedBreadcrumb = {
  home: string;
  display: string;
  /** Trailing (non-link) crumb for this page. */
  current: string;
};

export type LedHeroContent = {
  label: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  /** Small stacked words, lower-left of the hero (kept English in both locales). */
  cornerLines: string[];
  /** Small stacked words, lower-right over the image (kept English in both locales). */
  imageOverlayLines: string[];
  imageAlt: string;
};

export type LedFeature = {
  title: string;
  description: string;
};

export type LedWhyContent = {
  label: string;
  title: string;
  description: string;
  features: LedFeature[];
  /** Words over the small placeholder image (kept English in both locales). */
  imageOverlay: string;
  imageAlt: string;
};

export type LedDesignedAroundSpaceContent = {
  label: string;
  title: string;
  description: string;
  /** Six short context labels rendered as an icon row. */
  factors: string[];
  /** "→ …" line under the factor row. */
  linkText: string;
  imageAlt: string;
};

export type LedSolutionCard = {
  title: string;
  description: string;
  /** Per-card link label (arrow rendered as an icon). */
  linkLabel: string;
};

export type LedSolutionsContent = {
  label: string;
  title: string;
  viewAll: string;
  cards: LedSolutionCard[];
};

export type LedRealWorldItem = {
  label: string;
};

export type LedRealWorldContent = {
  label: string;
  title: string;
  viewAll: string;
  items: LedRealWorldItem[];
};

export type LedSystemLayer = {
  name: string;
};

export type LedCompleteSystemContent = {
  label: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  layers: LedSystemLayer[];
  imageAlt: string;
};

export type LedAccordionItem = {
  title: string;
};

export type LedDesigningRightLedContent = {
  label: string;
  title: string;
  description: string;
  items: LedAccordionItem[];
  imageAlt: string;
};

export type LedConnectedOperationContent = {
  label: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  /** Words over the placeholder image. */
  imageOverlay: string;
  imageAlt: string;
};

export type LedProcessStep = {
  number: string;
  title: string;
  /** Rendered joined with " · ". */
  items: string[];
};

export type LedHowWeWorkContent = {
  label: string;
  title: string;
  /** Small note, top-right of the header. */
  note: string;
  steps: LedProcessStep[];
};

export type LedProjectCard = {
  name: string;
  tag: string;
};

export type LedInActionContent = {
  label: string;
  title: string;
  viewAll: string;
  projects: LedProjectCard[];
};

export type LedStartOption = {
  title: string;
  description: string;
  /** Card link label (arrow rendered as an icon). */
  linkLabel: string;
};

export type LedHowToStartContent = {
  label: string;
  title: string;
  viewAll: string;
  options: LedStartOption[];
};

export type LedBottomCtaContent = {
  label: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  /** Words to the right of the CTA copy (kept English in both locales). */
  sideText: string;
};

export type LedDisplayContent = {
  breadcrumb: LedBreadcrumb;
  hero: LedHeroContent;
  whyLed: LedWhyContent;
  designedAroundSpace: LedDesignedAroundSpaceContent;
  ledSolutions: LedSolutionsContent;
  realWorld: LedRealWorldContent;
  completeSystem: LedCompleteSystemContent;
  designingRightLed: LedDesigningRightLedContent;
  connectedOperation: LedConnectedOperationContent;
  howWeWork: LedHowWeWorkContent;
  inAction: LedInActionContent;
  howToStart: LedHowToStartContent;
  bottomCta: LedBottomCtaContent;
};
