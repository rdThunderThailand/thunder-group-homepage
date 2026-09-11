// Content shapes for the Interactive & Kiosk solution page
// (`/display/interactivekiosk`).
//
// Every string is resolved from the `InteractiveKioskPage` namespace
// (`messages/{th,en}/interactivekiosk.json`) in
// `src/app/[locale]/display/interactivekiosk/page.tsx` — a Server Component —
// and handed to `InteractiveKioskClient` (and, through it, every
// `interactivekiosk/component/*` component) as one plain `content` prop. Nothing
// in that tree calls `useTranslations`, matching the sibling
// `src/features/display/leddisplay` and `src/features/display/digitalsignage`.
//
// The small SECTION eyebrows ("INTERACTIVE & KIOSK", "WHY INTERACTIVE", …), the
// sample kiosk-screen UI copy and a few stacked-word slogans stay English in
// both locales — they read as brand / product wording in the design — so their
// th/en values are intentionally identical.

export type KioskBreadcrumb = {
  home: string;
  display: string;
  /** Trailing (non-link) crumb for this page. */
  current: string;
};

export type KioskHeroContent = {
  label: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  /** Spaced words, lower-left of the hero (kept English in both locales). */
  cornerText: string;
  /** Two stacked words over the lower-right of the image. */
  imageCaptionLines: string[];
  /** Sample kiosk-screen UI shown inside the hero placeholder (English both). */
  screen: {
    welcome: string;
    prompt: string;
    items: string[];
  };
  imageAlt: string;
};

export type KioskFeature = {
  title: string;
  description: string;
};

export type KioskGalleryItem = {
  /** Optional caption shown on the placeholder (English both locales). */
  caption?: string;
  /** Optional sub-line under the caption. */
  note?: string;
  /** Optional short list rendered inside the placeholder. */
  items?: string[];
  imageAlt: string;
};

export type KioskWhyContent = {
  label: string;
  title: string;
  description: string;
  /** "SEE → TOUCH → UNDERSTAND → ACT" — rendered arrow-separated. */
  flow: string[];
  gallery: KioskGalleryItem[];
  /** Five icon + title + one-line features. */
  features: KioskFeature[];
};

export type KioskStep = {
  title: string;
  /** Short question under the step title. */
  question: string;
};

export type KioskAspect = {
  title: string;
  description: string;
};

export type KioskDesignedAroundContent = {
  label: string;
  title: string;
  description: string;
  /** Person → Need → Task → Environment → Interface → Outcome. */
  steps: KioskStep[];
  /** Highlighted line under the step flow. */
  linkText: string;
  /** Four icon + title + one-line items beside the device placeholder. */
  aspects: KioskAspect[];
  imageAlt: string;
};

export type KioskSolutionCard = {
  title: string;
  description: string;
  /** Per-card link label (arrow rendered as an icon). */
  linkLabel: string;
};

export type KioskSolutionsContent = {
  label: string;
  title: string;
  viewAll: string;
  cards: KioskSolutionCard[];
};

export type KioskRealWorldItem = {
  label: string;
};

export type KioskRealWorldContent = {
  label: string;
  title: string;
  viewAll: string;
  items: KioskRealWorldItem[];
};

export type KioskSystemLayer = {
  name: string;
  description: string;
};

export type KioskCompleteExperienceContent = {
  label: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  layers: KioskSystemLayer[];
  imageAlt: string;
};

export type KioskCapabilityItem = {
  label: string;
};

export type KioskConnectedJourneyContent = {
  label: string;
  title: string;
  description: string;
  /** Words on the sample phone screen. */
  phoneText: string;
  cta: string;
  imageAlt: string;
};

export type KioskCapabilitiesContent = {
  label: string;
  title: string;
  viewAll: string;
  /** Eight icon + label capabilities. */
  items: KioskCapabilityItem[];
  connectedJourney: KioskConnectedJourneyContent;
};

export type KioskProcessStep = {
  number: string;
  title: string;
  /** Rendered joined with " · ". */
  items: string[];
};

export type KioskHowWeWorkContent = {
  label: string;
  title: string;
  steps: KioskProcessStep[];
};

export type KioskProjectCard = {
  name: string;
  tag: string;
};

export type KioskInActionContent = {
  label: string;
  title: string;
  viewAll: string;
  projects: KioskProjectCard[];
};

export type KioskBottomCtaContent = {
  label: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  /** Stacked words to the right of the CTA copy (kept English in both locales). */
  sideText: string;
};

export type InteractiveKioskContent = {
  breadcrumb: KioskBreadcrumb;
  hero: KioskHeroContent;
  whyInteractive: KioskWhyContent;
  designedAround: KioskDesignedAroundContent;
  solutions: KioskSolutionsContent;
  realWorld: KioskRealWorldContent;
  completeExperience: KioskCompleteExperienceContent;
  capabilities: KioskCapabilitiesContent;
  howWeWork: KioskHowWeWorkContent;
  inAction: KioskInActionContent;
  bottomCta: KioskBottomCtaContent;
};
