"use client";

// STEP 3 — Partner type. A 2x2 grid of multi-select checkbox cards; "Continue"
// stays disabled until at least one card is checked.

import { Info, LayoutGrid, Store, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CalendarClock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NavButtons } from "../components/NavButtons";
import { HelpBox } from "../components/HelpBox";
import { QuoteCard } from "../components/QuoteCard";
import type { PartnerTypeOption, Step3Content } from "../types";

const OPTION_ICONS: Record<string, LucideIcon> = {
  dealer: Users,
  reseller: Store,
  solution: CalendarClock,
  both: LayoutGrid,
};

type Step3PartnerTypeProps = {
  content: Step3Content;
  value: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
  canContinue: boolean;
  incompleteHint: string;
};

export function Step3PartnerType({
  content,
  value,
  onToggle,
  onBack,
  onContinue,
  canContinue,
  incompleteHint,
}: Step3PartnerTypeProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-bold text-neutral-900">{content.cardTitle}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
        {content.cardDescription}{" "}
        <span className="text-xs text-slate-400">{content.helperNote}</span>
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {content.options.map((option) => (
          <PartnerTypeCard
            key={option.id}
            option={option}
            checked={value.includes(option.id)}
            onToggle={() => onToggle(option.id)}
          />
        ))}
      </div>

      <div className="mt-7">
        <NavButtons
          backLabel={content.backButton}
          continueLabel={content.continueButton}
          onBack={onBack}
          onContinue={onContinue}
          continueDisabled={!canContinue}
          incompleteHint={incompleteHint}
        />
      </div>
    </div>
  );
}

type PartnerTypeCardProps = {
  option: PartnerTypeOption;
  checked: boolean;
  onToggle: () => void;
};

function PartnerTypeCard({ option, checked, onToggle }: PartnerTypeCardProps) {
  const Icon = OPTION_ICONS[option.id] ?? Users;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={
        "flex flex-col rounded-2xl border-2 p-4 text-left transition-colors " +
        (checked ? "border-brand bg-brand/5" : "border-slate-200 hover:border-slate-300")
      }
    >
      <div className="flex items-start gap-3">
        <span
          className={
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 " +
            (checked ? "border-brand bg-brand text-white" : "border-slate-300 bg-white")
          }
          aria-hidden="true"
        >
          {checked ? (
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
              <path
                d="M3 8.5 6.2 11.5 13 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-brand">
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900">{option.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{option.subtitle}</p>
        </div>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {option.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-xs leading-relaxed text-slate-600">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
            {bullet}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-400">
        {option.suitableForLabel}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {option.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.7rem] font-medium text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

type Step3PanelProps = {
  content: Step3Content["panel"];
  notSureBox: Step3Content["notSureBox"];
};

export function Step3Panel({ content, notSureBox }: Step3PanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-3 rounded-2xl bg-sky-50 p-4">
        <Info className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900">
            {notSureBox.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {notSureBox.description}
          </p>
          <Link
            href="/contact"
            className="mt-1.5 inline-flex text-xs font-semibold text-brand hover:underline"
          >
            {notSureBox.link}
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-5">
        <p className="text-sm font-semibold text-neutral-900">{content.benefitsTitle}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {content.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <QuoteCard content={content.quote} />

      <div className="rounded-2xl bg-slate-50 p-5">
        <HelpBox content={content.help} />
      </div>
    </div>
  );
}
