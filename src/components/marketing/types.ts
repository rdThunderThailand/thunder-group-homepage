// Content shapes for the shared marketing sections. Every string is resolved
// from a next-intl namespace in the Server Component that renders the section
// (Home's `page.tsx`, or one of the interior route pages) and handed in as a
// plain prop — these components never call `useTranslations`.

export type ContactChannel = {
  label: string;
};

export type TalkToThunderContent = {
  /** Optional section index — Home passes "05"; interior pages omit it. */
  number?: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  sideNote: string;
  channels: ContactChannel[];
};

export type PageHeroContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export type PageSectionContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export type PlaceholderItem = {
  title: string;
  description: string;
};
