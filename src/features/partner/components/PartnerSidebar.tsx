// Dark ~35%-wide sidebar shared by every step and the success screen. Content
// is identical across steps except the photo overlay + caption, which change
// per `stepCopy` (see `SidebarStepCopy`).
//
// On `lg+` this renders in full: label, headline, subtitle, description, the
// five highlight bullets, and the placeholder photo. Below `lg` it collapses
// to a compact banner (label + headline + subtitle only) so the form gets the
// full screen width, per the spec's "ย่อด้านบน" responsive note.

import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Handshake,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SidebarContent, SidebarStepCopy } from "../types";

const HIGHLIGHT_ICONS: LucideIcon[] = [
  BarChart3,
  Handshake,
  BookOpen,
  GraduationCap,
  Star,
];

type PartnerSidebarProps = {
  content: SidebarContent;
  stepCopy: SidebarStepCopy;
};

export function PartnerSidebar({ content, stepCopy }: PartnerSidebarProps) {
  return (
    <aside className="shrink-0 bg-ink px-6 pb-8 pt-20 text-white sm:px-8 lg:w-[35%] lg:pb-14 lg:pt-24">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-400">
        {content.label}
      </p>
      <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        <span className="block text-white">{content.titleLine1}</span>
        <span className="block text-sky-400">{content.titleLine2}</span>
      </h2>
      <p className="mt-4 text-base font-semibold leading-snug text-white/90 sm:text-lg">
        {content.subtitle}
      </p>

      {/* Description + highlights + photo collapse away below `lg`. */}
      <p className="mt-3 hidden max-w-sm text-sm leading-relaxed text-white/60 lg:block">
        {content.description}
      </p>

      <ul className="mt-9 hidden flex-col gap-5 lg:flex">
        {content.highlights.map((highlight, index) => {
          const Icon = HIGHLIGHT_ICONS[index] ?? HIGHLIGHT_ICONS[0];
          return (
            <li key={highlight.title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-400">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{highlight.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/55">
                  {highlight.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div
        className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/5 lg:block"
        role="img"
        aria-label={content.imageAlt}
      >
        <div className="absolute inset-0 flex items-center justify-center text-white/10">
          <ImageIcon className="h-10 w-10" aria-hidden="true" />
        </div>
        <p className="absolute right-4 top-4 max-w-[10.5rem] text-right text-sm font-semibold uppercase leading-snug tracking-wide text-white/85">
          {stepCopy.overlayText}
        </p>
        <div className="absolute bottom-4 left-4">
          <span className="mb-2 block h-0.5 w-6 bg-white/50" aria-hidden="true" />
          <p className="text-sm font-medium leading-snug text-white">
            {stepCopy.captionLine1}
          </p>
          <p className="text-sm font-medium leading-snug text-white">
            {stepCopy.captionLine2}
          </p>
        </div>
      </div>
    </aside>
  );
}
