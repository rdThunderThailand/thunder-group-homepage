// Content shapes for the Home page. Every string here is resolved from the
// `HomePage` namespace in `src/app/[locale]/page.tsx` (a Server Component) and
// handed to `HomeClient` as props — the client tree never calls
// `useTranslations`, matching the sibling ThunderOne project and this repo's
// layout design (see `src/app/[locale]/layout.tsx`).

export type HeroPillar = {
  name: string;
  description: string;
};

export type HeroContent = {
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollHint: string;
  sideNote: string;
  pillars: HeroPillar[];
};

export type StartHereCard = {
  title: string;
  description: string;
};

export type StartHereContent = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  cards: StartHereCard[];
};

export type BusinessCard = {
  name: string;
  description: string;
  cta: string;
};

export type WhatWeBuildContent = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  businesses: BusinessCard[];
};

export type WorkProject = {
  title: string;
  cta: string;
};

export type OurWorkContent = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  featured: {
    label: string;
    title: string;
    cta: string;
  };
  projects: WorkProject[];
};

export type WhyThunderContent = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  words: string[];
};

// The closing "Talk to Thunder" section is shared site-wide — its content
// shape now lives with the component.
export type {
  ContactChannel,
  TalkToThunderContent,
} from "@/components/marketing/types";
