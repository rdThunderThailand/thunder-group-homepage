// === TALK TO THUNDER === (dark banner)
// Site-wide closing CTA: Home ends on it (numbered "05") and every interior
// route page reuses it unnumbered. Heading + prompt on the left; the
// "Talk to Thunder" CTA and the LINE / Call / Meet contact row on the right.
// The city skyline behind it is a placeholder strip of bars.

import { ArrowRight, CalendarDays, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "./SectionEyebrow";
import type { TalkToThunderContent } from "./types";

/** Contact-channel icons, paired to `content.channels` by index. */
const CHANNEL_ICONS: LucideIcon[] = [MessageCircle, Phone, CalendarDays];

/** Fixed bar heights (%) for the placeholder skyline — deterministic so SSR and
 *  the client render the same markup. */
const SKYLINE = [
  38, 64, 50, 82, 32, 70, 92, 44, 58, 76, 30, 62, 88, 46, 72, 36, 80, 54, 68, 40,
  86, 48, 66, 78, 34, 74, 56, 90, 42, 60,
];

type TalkToThunderSectionProps = {
  content: TalkToThunderContent;
};

export function TalkToThunderSection({ content }: TalkToThunderSectionProps) {
  return (
    <section
      id="talk-to-thunder"
      className="relative scroll-mt-20 overflow-hidden bg-ink text-white"
    >
      {/* Placeholder skyline */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex h-28 items-end gap-1 opacity-20"
        aria-hidden="true"
      >
        {SKYLINE.map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-sm bg-white"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-slate-900/40"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8 lg:py-20">
        <div className="lg:col-span-5">
          <SectionEyebrow
            number={content.number}
            label={content.eyebrow}
            tone="dark"
          />
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
            {content.description}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-6 lg:col-span-7 lg:mt-0 xl:justify-between">
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90"
          >
            {content.cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <div className="contents">
            {content.channels.map((channel, index) => {
              const Icon = CHANNEL_ICONS[index];
              return (
                <Link
                  key={channel.label}
                  href="/contact"
                  className="inline-flex items-center gap-2 text-base font-medium text-white/70 transition-colors hover:text-white"
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {channel.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Script side note (desktop only) */}
      <p className="pointer-events-none absolute right-4 top-8 hidden max-w-[10rem] text-right font-serif text-lg italic leading-snug text-white/40 sm:block lg:right-8">
        {content.sideNote}
      </p>
    </section>
  );
}
