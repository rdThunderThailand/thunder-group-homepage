// Content shapes for the Display Solutions hub page (`/display`).
//
// Every string is resolved from the `DisplayPage` namespace
// (`messages/{th,en}/display.json`) in `src/app/[locale]/display/page.tsx` — a
// Server Component — and handed to `DisplayClient` as one plain `content` prop.
// The client tree never calls `useTranslations`, matching the sibling
// `src/features/display/digitalsignageClient` and `src/features/home`.
//
// A few labels (the hero H1 words, the small SECTION eyebrows, the solution
// card titles) stay English in both locales — they read as brand wording in the
// design — so their th/en values are intentionally identical.

export type DisplayBreadcrumb = {
  home: string;
  /** Trailing (non-link) crumb for this page. */
  current: string;
};

export type DisplayHeroHighlight = {
  label: string;
};

export type DisplayHeroContent = {
  /** Blue accent label above the H1 (kept English in both locales). */
  label: string;
  /** H1 words ahead of the accented word (kept English in both locales). */
  titleLead: string;
  /** Accented (blue) final word of the H1 (kept English in both locales). */
  titleAccent: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  /** Vertical rail of four icon + caption highlights, right of the hero. */
  highlights: DisplayHeroHighlight[];
  /** Small note under the highlight rail, above a divider. */
  highlightsNote: string;
  /** Words laid over the in-image LED screen (kept English in both locales). */
  imageOverlay: string;
  /** Hint describing the artwork the placeholder stands in for. */
  imageAlt: string;
};

export type DisplayFeature = {
  title: string;
  /** " · "-joined descriptor line under the title. */
  detail: string;
};

export type DisplayFeatureStripContent = {
  items: DisplayFeature[];
};

export type DisplaySolutionCard = {
  /** Card title (kept English in both locales, per the design). */
  title: string;
  description: string;
};

export type DisplaySolutionsContent = {
  label: string;
  title: string;
  description: string;
  /** Top-right "view all" link label (arrow rendered as an icon). */
  viewAll: string;
  cards: DisplaySolutionCard[];
};

export type DisplayProject = {
  name: string;
  /** Tag labels, rendered joined with " · ". */
  tags: string[];
};

export type DisplayFeaturedProjectsContent = {
  label: string;
  title: string;
  description: string;
  viewAll: string;
  projects: DisplayProject[];
};

export type DisplayProcessStep = {
  name: string;
  description: string;
};

export type DisplayWhyContent = {
  label: string;
  title: string;
  description: string;
  /** Outline CTA label (arrow rendered as an icon). */
  cta: string;
  steps: DisplayProcessStep[];
};

export type DisplayBottomCtaContent = {
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

export type DisplayContent = {
  breadcrumb: DisplayBreadcrumb;
  hero: DisplayHeroContent;
  featureStrip: DisplayFeatureStripContent;
  solutions: DisplaySolutionsContent;
  featuredProjects: DisplayFeaturedProjectsContent;
  why: DisplayWhyContent;
  bottomCta: DisplayBottomCtaContent;
};
