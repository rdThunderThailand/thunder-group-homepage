// Content shapes for the Display Rental landing page (`/rent-technology`).
//
// Every string is resolved from the `RentTechnologyPage` namespace
// (`messages/{th,en}/rent-technology.json`) in
// `src/app/[locale]/rent-technology/page.tsx` — a Server Component — and handed
// to `RentTechnologyClient` as plain props. The client tree never calls
// `useTranslations`, matching `src/features/home` and
// `src/features/what-do-you-need/buy-technology`.

export type BreadcrumbContent = {
  home: string;
  display: string;
  rental: string;
};

export type HeroFormContent = {
  lookingForLabel: string;
  lookingForOptions: string[];
  whenLabel: string;
  whenPlaceholder: string;
  submit: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  form: HeroFormContent;
  quoteLink: string;
  /** Handwriting-style slogan laid over the hero image (kept English in both locales). */
  imageOverlayTitle: string;
  /** Slash-separated words rendered as a vertical note on the hero image. */
  imageSideNote: string;
};

export type UseCaseCard = {
  title: string;
  description: string;
  link: string;
};

export type StartHereContent = {
  eyebrow: string;
  title: string;
  description: string;
  helpLink: string;
  cards: UseCaseCard[];
};

export type EquipmentItem = {
  name: string;
  description: string;
};

export type EquipmentContent = {
  eyebrow: string;
  title: string;
  description: string;
  viewAllLink: string;
  /** Shared "Explore →" label rendered on every equipment card. */
  exploreLink: string;
  items: EquipmentItem[];
};

export type RentalProduct = {
  name: string;
  /** Show the "Popular" badge on this card. */
  popular: boolean;
  /** Category labels, joined with " · ". */
  tags: string[];
  /** Short spec tokens, each with a small leading icon. */
  specs: string[];
  price: string;
};

export type PopularContent = {
  eyebrow: string;
  title: string;
  description: string;
  viewAllLink: string;
  /** Corner badge text (kept English in both locales, per the design). */
  popularBadge: string;
  /** Card button labels (kept English in both locales, per the design). */
  detailsCta: string;
  quoteCta: string;
  products: RentalProduct[];
};

export type HowItWorksStep = {
  number: string;
  title: string;
  description: string;
};

export type HowItWorksAside = {
  title: string;
  description: string;
  link: string;
};

export type HowItWorksContent = {
  eyebrow: string;
  title: string;
  description: string;
  steps: HowItWorksStep[];
  aside: HowItWorksAside;
};

export type BottomCtaContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  /** Handwriting-style slogan (kept English in both locales, per the design). */
  sideNote: string;
};
