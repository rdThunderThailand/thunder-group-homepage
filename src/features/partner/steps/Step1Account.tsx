"use client";

// STEP 1 — Create account. First step in the wizard, so it has no back
// button, only a "Continue" CTA (disabled until every required field is filled in) and a "log in instead" link.

import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TextField } from "../components/fields";
import { HelpBox } from "../components/HelpBox";
import { QuoteCard } from "../components/QuoteCard";
import type { AccountData } from "../state";
import type { Step1Content } from "../types";

type Step1AccountProps = {
  content: Step1Content;
  value: AccountData;
  onChange: (field: keyof AccountData, value: string | boolean) => void;
  onContinue: () => void;
  canContinue: boolean;
  incompleteHint: string;
};

export function Step1Account({
  content,
  value,
  onChange,
  onContinue,
  canContinue,
  incompleteHint,
}: Step1AccountProps) {
  const { form } = content;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-neutral-900">{content.cardTitle}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
        {content.cardDescription}
      </p>

      <div className="mt-7 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label={form.firstNameLabel}
            required
            autoComplete="given-name"
            placeholder={form.firstNamePlaceholder}
            value={value.firstName}
            onChange={(event) => onChange("firstName", event.target.value)}
          />
          <TextField
            label={form.lastNameLabel}
            required
            autoComplete="family-name"
            placeholder={form.lastNamePlaceholder}
            value={value.lastName}
            onChange={(event) => onChange("lastName", event.target.value)}
          />
        </div>

        <TextField
          type="email"
          label={form.emailLabel}
          required
          autoComplete="email"
          placeholder={form.emailPlaceholder}
          helper={form.emailHelper}
          value={value.email}
          onChange={(event) => onChange("email", event.target.value)}
        />

        <TextField
          type="tel"
          label={form.phoneLabel}
          required
          autoComplete="tel"
          placeholder={form.phonePlaceholder}
          value={value.phone}
          onChange={(event) => onChange("phone", event.target.value)}
        />

        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          {form.continueButton}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        {!canContinue ? (
          <p className="-mt-2 text-center text-xs text-slate-400">{incompleteHint}</p>
        ) : null}

        <p className="text-center text-sm text-slate-500">
          {form.loginPrompt}{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            {form.loginLink}
          </Link>
        </p>
      </div>
    </div>
  );
}

type Step1PanelProps = {
  content: Step1Content["panel"];
};

export function Step1Panel({ content }: Step1PanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-slate-50 p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand">
          <ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-semibold text-neutral-900">
          {content.confidentialTitle}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          {content.confidentialDescription}
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50 p-5">
        <HelpBox content={content.help} />
      </div>

      <QuoteCard content={content.quote} />
    </div>
  );
}
