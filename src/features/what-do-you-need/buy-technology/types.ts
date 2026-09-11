// Content shapes for the Technology Category page
// (`/what-do-you-need/buy-technology`). Every string is resolved from the
// `BuyTechnologyPage` namespace in
// `src/app/[locale]/what-do-you-need/buy-technology/page.tsx` (a Server
// Component) and handed to `BuyTechnologyClient` as plain props — the client
// tree never calls `useTranslations`, matching `src/features/home`.

export type BreadcrumbContent = {
  home: string;
  current: string;
};

export type HeroFeature = {
  title: string;
  description: string;
};

export type TechnologyHeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  features: HeroFeature[];
  /** Text laid over the placeholder image (kept English in both locales). */
  imageOverlayTitle: string;
  /** Slash-separated words rendered as a vertical note on the image. */
  imageSideNote: string;
  /** Small hint describing what real artwork belongs in the placeholder. */
  imageCaption: string;
};

export type TechnologyCategory = {
  name: string;
  description: string;
  tags: string[];
};

export type CategorySectionContent = {
  eyebrow: string;
  /** Decorative right-aligned note, shown on large screens only. */
  aside: string;
  title: string;
  description: string;
  categories: TechnologyCategory[];
};

export type CtaStripContent = {
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

export type BannerItem = {
  title: string;
  description: string;
};

export type BrandBannerContent = {
  /** Brand slogan — kept English in both locales, per the design. */
  title: string;
  items: BannerItem[];
};
