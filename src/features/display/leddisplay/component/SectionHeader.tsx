// Shared header for the LED Display page sections: eyebrow + heading, an
// optional lead paragraph, and — floated to the top-right on large screens —
// either a link (`action`) or a plain note (`note`). `tone` flips the palette
// for the two dark sections.

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
  action?: { label: string; href: string };
  note?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  tone = "light",
  action,
  note,
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
      ) : note ? (
        <p
          className={
            "mt-4 text-sm lg:absolute lg:right-0 lg:top-1 lg:mt-1 " +
            (dark ? "text-white/55" : "text-slate-400")
          }
        >
          {note}
        </p>
      ) : null}
    </div>
  );
}
