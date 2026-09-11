// Content shapes for the Digital Signage solution page
// (`/display/digitalsignage`). Every string is resolved from the
// `DigitalSignagePage` namespace in
// `src/app/[locale]/display/digitalsignage/page.tsx` (a Server Component) and
// handed to `DigitalsignageClient` as a single plain `content` prop — the
// client tree never calls `useTranslations`, matching `src/features/home` and
// `src/features/what-do-you-need/buy-technology`.

export type HeroContent = {
  /** Small kicker in the very top-left corner. */
  topLeft: string;
  /** Blue accent label above the H1. */
  label: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  /** Small note bottom-left of the hero, above a divider. */
  footNote: string;
  /** Caption bottom-right of the hero image, under a divider. */
  imageCaption: string;
  /** Words stacked over the in-image display (kept English in both locales). */
  imageOverlayLines: string[];
  /** Hint describing what real artwork belongs in the placeholder. */
  imageAlt: string;
};

export type BeforeAfterItem = {
  title: string;
  description: string;
};

export type BeforeAfterCard = {
  before: BeforeAfterItem;
  after: BeforeAfterItem;
};

export type WhyContent = {
  label: string;
  title: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  cards: BeforeAfterCard[];
};

export type SolutionStep = {
  name: string;
  /** Rendered joined with " · ". */
  items: string[];
};

export type SolutionContent = {
  label: string;
  title: string;
  description: string;
  cta: string;
  steps: SolutionStep[];
  /** Centered divider line under the step row. */
  caption: string;
};

export type FeatureItem = {
  title: string;
  description: string;
};

export type ThunderOneContent = {
  label: string;
  title: string;
  description: string;
  cta: string;
  /** Label shown inside the laptop-dashboard placeholder. */
  dashboardCaption: string;
  imageAlt: string;
  features: FeatureItem[];
};

export type UseCaseItem = {
  label: string;
};

export type UseCasesContent = {
  label: string;
  title: string;
  description: string;
  cta: string;
  items: UseCaseItem[];
};

export type SpaceCard = {
  title: string;
  /** One string per line; each already contains its own " · " separators. */
  lines: string[];
};

export type DesignedForSpaceContent = {
  label: string;
  title: string;
  description: string;
  link: string;
  items: SpaceCard[];
};

export type DigitalSignageContent = {
  hero: HeroContent;
  why: WhyContent;
  solution: SolutionContent;
  thunderone: ThunderOneContent;
  useCases: UseCasesContent;
  designedForSpace: DesignedForSpaceContent;
};
