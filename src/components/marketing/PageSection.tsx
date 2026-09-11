// Generic content section for the interior route pages: a label-only eyebrow, a
// heading, a lead paragraph, and an optional slot for whatever the page drops in
// (a card grid, a dashed "coming soon" panel, …). `muted` gives it the slate
// background for alternating sections.

import type { ReactNode } from "react";
import { SectionEyebrow } from "./SectionEyebrow";
import type { PageSectionContent } from "./types";

type PageSectionProps = {
  content: PageSectionContent;
  muted?: boolean;
  id?: string;
  children?: ReactNode;
};

export function PageSection({
  content,
  muted = false,
  id,
  children,
}: PageSectionProps) {
  return (
    <section id={id} className={muted ? "bg-slate-50" : "bg-white"}>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow label={content.eyebrow} />
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-500">
            {content.description}
          </p>
        </div>
        {children ? <div className="mt-12">{children}</div> : null}
      </div>
    </section>
  );
}
