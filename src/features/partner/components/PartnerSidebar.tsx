// Dark ~35%-wide sidebar shared by every step and the success screen. The
// register-visual photo is a full-bleed background behind a dark scrim (for
// contrast with the white text); the caption below it still changes per step
// via `stepCopy` (see `SidebarStepCopy`).
//
// On `lg+` this renders in full: label, headline, subtitle, description, the
// five highlight bullets, and the caption. Below `lg` it collapses
// to a compact banner (label + headline + subtitle only) so the form gets the
// full screen width, per the spec's "ย่อด้านบน" responsive note.

import Image from "next/image";
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Handshake,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SidebarContent, SidebarStepCopy } from "../types";
import partnerRegisterVisual from "@/image/partner/partner-register-visual.png";

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
    <aside className="relative isolate shrink-0 overflow-hidden bg-ink px-6 pb-8 pt-20 text-white sm:px-8 lg:w-[36.5%] lg:pb-14 lg:pt-24">
      <Image
        src={partnerRegisterVisual}
        alt={content.imageAlt}
        fill
        priority
        sizes="(min-width: 1024px) 35vw, 100vw"
        className="-z-10 object-cover lg:translate-y-40"
      />
      {/* Keep the copy area dark, then reveal 80% of the image at the bottom. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10, 16, 32, 0.85) 0%, rgba(10, 16, 32, 0.85) 55%, rgba(10, 16, 32, 0.2) 75%, rgba(10, 16, 32, 0.2) 100%)",
        }}
        aria-hidden="true"
      />

      <p className="absolute right-6 top-20 hidden max-w-36 text-right text-sm font-semibold uppercase leading-snug tracking-wide text-white/85 sm:right-8 lg:bottom-14 lg:top-auto lg:block">
        {stepCopy.overlayText}
      </p>

      <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-400">
        {content.label}
      </p>
      <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:-mr-8">
        <span className="block text-white">{content.titleLine1}</span>
        <span className="block text-sky-400">{content.titleLine2}</span>
      </h2>
      <p className="mt-4 text-base font-semibold leading-snug text-white/90 sm:text-lg">
        {content.subtitle}
      </p>

      {/* Description + highlights + caption collapse away below `lg`. */}
      <p className="mt-3 hidden max-w-sm text-sm leading-relaxed text-white/60 lg:block">
        {content.description}
      </p>

      <ul className="mt-9 hidden flex-col gap-5 lg:flex">
        {content.highlights.map((highlight, index) => {
          const Icon = HIGHLIGHT_ICONS[index] ?? HIGHLIGHT_ICONS[0];
          return (
            <li key={highlight.title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center text-sky-400">
                <Icon className="h-6 w-6" aria-hidden="true" />
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

      <div className="hidden lg:absolute lg:bottom-14 lg:left-8 lg:block lg:max-w-44">
        <div className="flex items-start gap-2">
          <span
            className="mt-2 block h-0.5 w-5 shrink-0 bg-sky-400"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-medium leading-snug text-white">
              {stepCopy.captionLine1}
            </p>
            <p className="text-sm font-medium leading-snug text-white">
              {stepCopy.captionLine2}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
