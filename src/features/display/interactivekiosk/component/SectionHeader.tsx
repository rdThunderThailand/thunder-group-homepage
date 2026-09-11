// Shared header for the Interactive & Kiosk page sections: eyebrow + heading,
// an optional lead paragraph, and — floated to the top-right on large screens —
// an optional link (`action`). `tone` flips the palette for the dark sections.
// Mirrors `leddisplay/component/SectionHeader`.

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
  action?: { label: string; href: string };
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  tone = "light",
  action,
}: SectionHeaderProps) {
  const dark = tone === "dark";
  return (
    <div className="relative">
      <div className="max-w-2xl">
        <SectionEyebrow label={eyebrow} tone={tone} />
        <h2
          className={
            "mt-5 text-3xl font-bold tracking-tight sm:text-4xl " +
            (dark ? "text-white" : "text-neutral-900")
          }
        >
          {title}
        </h2>
        {description ? (
          <p
            className={
              "mt-4 text-base leading-relaxed " +
              (dark ? "text-white/70" : "text-slate-500")
            }
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className={
            "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors lg:absolute lg:right-0 lg:top-1 lg:mt-0 " +
            (dark
              ? "text-blue-400 hover:text-blue-300"
              : "text-brand hover:text-brand-strong")
          }
        >
          {action.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
