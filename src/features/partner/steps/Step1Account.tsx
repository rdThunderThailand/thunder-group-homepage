"use client";

// STEP 1 — Create account. First step in the wizard, so it has no back
// button, only a "Continue" CTA (disabled until every required field plus
// the terms checkbox are filled in) and a "log in instead" link.

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TextField } from "../components/fields";
import { LinkedAgreement } from "../components/LinkedAgreement";
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
};

export function Step1Account({
  content,
  value,
  onChange,
  onContinue,
  canContinue,
}: Step1AccountProps) {
  const [showPassword, setShowPassword] = useState(false);
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

        <div className="relative">
          <TextField
            type={showPassword ? "text" : "password"}
            label={form.passwordLabel}
            required
            autoComplete="new-password"
            placeholder={form.passwordPlaceholder}
            helper={form.passwordHelper}
            value={value.password}
            onChange={(event) => onChange("password", event.target.value)}
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? form.hidePasswordLabel : form.showPasswordLabel}
            className="absolute right-3 top-9 text-slate-400 transition-colors hover:text-neutral-600"
          >
            {showPassword ? (
              <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
            ) : (
              <Eye className="h-4.5 w-4.5" aria-hidden="true" />
            )}
          </button>
        </div>

        <label className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-700">
          <input
            type="checkbox"
            checked={value.agreeTerms}
            onChange={(event) => onChange("agreeTerms", event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-brand"
          />
          <LinkedAgreement content={form.agreement} />
        </label>

        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          {form.continueButton}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

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
