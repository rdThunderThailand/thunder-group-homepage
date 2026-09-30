// 8 · INTERACTION CAPABILITIES —
// "From Simple Interaction to Connected Service."
// Light section, two columns on `lg`. Left: header with a top-right link above
// an eight-up icon grid. Right: a dark "CONNECTED JOURNEY" card with copy, a QR
// placeholder, a small phone mock and a closing link.

import {
  ArrowRight,
  Compass,
  CreditCard,
  Link2,
  MessageSquare,
  Navigation,
  QrCode,
  ScanLine,
  Search,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SectionHeader } from "./SectionHeader";
import type { KioskCapabilitiesContent } from "../../types/interactivekioskTypes";
import connectedJourneyImage from "@/image/interactive-kiosk/connected-journey.png";

/** Capability icons, paired to `capabilities.items` by index. */
const CAPABILITY_ICONS: LucideIcon[] = [
  Compass,
  Search,
  Navigation,
  UserCheck,
  MessageSquare,
  ScanLine,
  Link2,
  CreditCard,
];

type InteractionCapabilitiesSectionProps = {
  content: KioskCapabilitiesContent;
};

export function InteractionCapabilitiesSection({
  content,
}: InteractionCapabilitiesSectionProps) {
  const journey = content.connectedJourney;
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeader
          eyebrow={content.label}
          title={content.title}
          action={{ label: content.viewAll, href: "#/what-we-do" }}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {/* Left — eight capabilities */}
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {content.items.map((item, index) => {
              const Icon = CAPABILITY_ICONS[index] ?? CAPABILITY_ICONS[0];
              return (
                <li
                  key={item.label}
                  className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold leading-tight text-neutral-900">
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Right — CONNECTED JOURNEY card */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl bg-ink p-7 text-white sm:p-9">
            <Image src={connectedJourneyImage} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/45" aria-hidden="true" />
            <div className="relative flex h-full flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
              {journey.label}
            </p>
            <h3 className="mt-4 text-xl font-bold leading-tight sm:text-2xl">
              {journey.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {journey.description}
            </p>

            <div className="mt-6 flex items-end gap-5">
              {/* QR placeholder */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/[0.04] text-white/40">
                <QrCode className="h-10 w-10" aria-hidden="true" />
              </div>
              {/* Phone mock */}
              <div className="flex h-32 w-20 flex-col items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.06] p-3 text-center">
                <span className="h-1 w-6 rounded-full bg-white/25" aria-hidden="true" />
                <span className="text-[0.6rem] font-medium leading-snug text-white/80">
                  {journey.phoneText}
                </span>
              </div>
            </div>

            <Link
              href="#/what-we-do"
              className="mt-7 inline-flex items-center gap-2 self-start rounded-full border border-white/30 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              {journey.cta}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
