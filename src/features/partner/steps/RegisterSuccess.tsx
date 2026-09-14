"use client";

// SUCCESS / THANK YOU screen shown after Step 5's "Submit" — a mock
// confirmation built entirely from client state (no backend call). Every
// summarized value is read straight back out of the wizard state that was
// just submitted.

import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Check, Circle, Copy, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { HelpBox } from "../components/HelpBox";
import type { AccountData, AdditionalData, CompanyData } from "../state";
import type { CheckboxOption, PartnerTypeOption, SuccessContent } from "../types";

type RegisterSuccessProps = {
  content: SuccessContent;
  locale: Locale;
  applicationId: string;
  submittedAt: Date;
  account: AccountData;
  company: CompanyData;
  partnerTypeIds: string[];
  partnerTypeOptions: PartnerTypeOption[];
  additional: AdditionalData;
  interestedProductOptions: CheckboxOption[];
};

export function RegisterSuccess({
  content,
  locale,
  applicationId,
  submittedAt,
  account,
  company,
  partnerTypeIds,
  partnerTypeOptions,
  additional,
  interestedProductOptions,
}: RegisterSuccessProps) {
  const [copied, setCopied] = useState(false);

  const dateFormatter = new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const submittedAtLabel = dateFormatter.format(submittedAt);

  const partnerTypeTitles = partnerTypeOptions
    .filter((option) => partnerTypeIds.includes(option.id))
    .map((option) => option.title)
    .join(", ");

  const interestedProductLabels = [
    ...interestedProductOptions
      .filter((option) => additional.interestedProducts.includes(option.id))
      .map((option) => option.label),
    ...(additional.interestedProducts.includes("other") && additional.interestedProductOther
      ? [additional.interestedProductOther]
      : []),
  ].join(", ");

  const handleCopy = () => {
    navigator.clipboard
      ?.writeText(applicationId)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard access can be denied (permissions, insecure context) —
        // the copy button just silently no-ops rather than throwing.
      });
  };

  return (
    <div>
      <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div
          className="absolute right-6 top-6 hidden h-14 w-14 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-300 sm:flex"
          aria-hidden="true"
        >
          <Mail className="h-6 w-6" />
        </div>

        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="h-7 w-7" strokeWidth={3} aria-hidden="true" />
        </span>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
          {content.thankYouLabel}
        </p>
        <h2 className="mt-2 max-w-lg text-2xl font-bold text-neutral-900 sm:text-3xl">
          {content.title}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
          {content.description}
        </p>

        {/* Progress stepper */}
        <div className="mt-8 flex items-start">
          <ProgressNode
            icon={<Check className="h-4 w-4" aria-hidden="true" />}
            state="done"
            label={content.progress.submittedLabel}
            hint={submittedAtLabel}
            isFirst
          />
          <ProgressNode
            state="active"
            label={content.progress.reviewingLabel}
            hint={content.progress.reviewingHint}
          />
          <ProgressNode
            state="pending"
            label={content.progress.approvedLabel}
            hint={content.progress.approvedHint}
          />
          <ProgressNode
            state="pending"
            label={content.progress.readyLabel}
            hint={content.progress.readyHint}
            isLast
          />
        </div>
      </div>

      {/* Application summary card */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-sm font-bold text-neutral-900">
          {content.applicationCard.title}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <div>
            <p className="text-xs text-slate-400">{content.applicationCard.applicationNoLabel}</p>
            <p className="text-base font-bold text-neutral-900">{applicationId}</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:border-brand hover:text-brand"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            {copied ? content.applicationCard.copiedLabel : content.applicationCard.copyLabel}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <SummaryField
            label={content.applicationCard.submittedAtLabel}
            value={submittedAtLabel}
          />
          <SummaryField
            label={content.applicationCard.applicantLabel}
            value={`${account.firstName} ${account.lastName}`.trim()}
          />
          <SummaryField label={content.applicationCard.companyLabel} value={company.nameTh} />
          <SummaryField
            label={content.applicationCard.partnerTypeLabel}
            value={partnerTypeTitles}
          />
          <SummaryField
            label={content.applicationCard.productsLabel}
            value={interestedProductLabels}
          />
          <SummaryField
            label={content.applicationCard.projectsPerYearLabel}
            value={additional.projectsPerYear}
          />
          <SummaryField
            label={content.applicationCard.avgProjectValueLabel}
            value={additional.avgProjectValue}
          />
        </div>

        <Link
          href={`/partners/application/${applicationId}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-brand hover:text-brand"
        >
          👁 {content.viewDetailsLink}
        </Link>
      </div>

      {/* Next steps */}
      <div className="mt-6 rounded-2xl bg-sky-50 p-6 sm:p-8">
        <h3 className="text-sm font-bold text-neutral-900">{content.nextSteps.title}</h3>
        <ol className="mt-4 flex flex-col gap-4">
          {content.nextSteps.items.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-neutral-700">{item}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Help */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <HelpBox content={content.help} />
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
          >
            {content.help.contactButton}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Closing note */}
      <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl bg-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-500">{content.closingNote}</p>
        <Link
          href="/login"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 transition-colors hover:border-brand hover:text-brand"
        >
          {content.loginButton}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

type ProgressNodeProps = {
  state: "done" | "active" | "pending";
  label: string;
  hint: string;
  icon?: ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
};

function ProgressNode({ state, label, hint, icon, isFirst, isLast }: ProgressNodeProps) {
  const lineDone = state === "done";
  return (
    <div className="flex flex-1 flex-col items-center last:flex-none">
      <div className="flex w-full items-center">
        <span
          className={isFirst ? "invisible h-px flex-1" : "h-px flex-1 " + (lineDone ? "bg-brand" : "bg-slate-200")}
          aria-hidden="true"
        />
        <span
          className={
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold " +
            (state === "done"
              ? "bg-brand text-white"
              : state === "active"
                ? "border-2 border-brand text-brand"
                : "border-2 border-slate-200 text-slate-300")
          }
        >
          {state === "active" ? (
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          ) : state === "done" ? (
            icon
          ) : (
            <Circle className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
          )}
        </span>
        <span
          className={isLast ? "invisible h-px flex-1" : "h-px flex-1 bg-slate-200"}
          aria-hidden="true"
        />
      </div>
      <p className="mt-2 max-w-[7rem] text-center text-xs font-semibold text-neutral-900">{label}</p>
      <p className="mt-0.5 max-w-[7rem] text-center text-[0.68rem] leading-tight text-slate-400">
        {hint}
      </p>
    </div>
  );
}

type SummaryFieldProps = {
  label: string;
  value: string;
};

function SummaryField({ label, value }: SummaryFieldProps) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-neutral-800">{value || "—"}</p>
    </div>
  );
}
