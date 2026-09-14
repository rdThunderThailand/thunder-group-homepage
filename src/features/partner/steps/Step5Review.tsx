"use client";

// STEP 5 — Review & submit. No design reference was supplied for this step
// (see the spec's note), so it follows the same card styling as steps 1-4 but
// renders full width with no side panel: a read-only summary of steps 1-4,
// grouped into four sections, each with an "Edit" link back to that step.

import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import type { AccountData, AdditionalData, CompanyData, StepNumber } from "../state";
import type { CheckboxOption, PartnerTypeOption, Step5Content } from "../types";

type Step5ReviewProps = {
  content: Step5Content;
  account: AccountData;
  company: CompanyData;
  partnerTypeIds: string[];
  partnerTypeOptions: PartnerTypeOption[];
  additional: AdditionalData;
  customerSegmentOptions: CheckboxOption[];
  interestedProductOptions: CheckboxOption[];
  onEditStep: (step: StepNumber) => void;
  onBack: () => void;
  onSubmit: () => void;
};

export function Step5Review({
  content,
  account,
  company,
  partnerTypeIds,
  partnerTypeOptions,
  additional,
  customerSegmentOptions,
  interestedProductOptions,
  onEditStep,
  onBack,
  onSubmit,
}: Step5ReviewProps) {
  const { fields, notProvided } = content;

  const selectedPartnerTypes = partnerTypeOptions
    .filter((option) => partnerTypeIds.includes(option.id))
    .map((option) => option.title);

  const customerSegmentLabels = [
    ...customerSegmentOptions
      .filter((option) => additional.customerSegments.includes(option.id))
      .map((option) => option.label),
    ...(additional.customerSegments.includes("other") && additional.customerSegmentOther
      ? [additional.customerSegmentOther]
      : []),
  ];

  const interestedProductLabels = [
    ...interestedProductOptions
      .filter((option) => additional.interestedProducts.includes(option.id))
      .map((option) => option.label),
    ...(additional.interestedProducts.includes("other") && additional.interestedProductOther
      ? [additional.interestedProductOther]
      : []),
  ];

  const addressLine = [company.address, company.district, company.province, company.postalCode]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-neutral-900">{content.cardTitle}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
        {content.cardDescription}
      </p>

      <div className="mt-7 flex flex-col gap-6">
        <ReviewSection title={content.sections.account} editLabel={content.editLink} onEdit={() => onEditStep(1)}>
          <ReviewField label={fields.fullName} value={`${account.firstName} ${account.lastName}`.trim() || notProvided} />
          <ReviewField label={fields.email} value={account.email || notProvided} />
          <ReviewField label={fields.phone} value={account.phone || notProvided} />
        </ReviewSection>

        <ReviewSection title={content.sections.company} editLabel={content.editLink} onEdit={() => onEditStep(2)}>
          <ReviewField label={fields.companyNameTh} value={company.nameTh || notProvided} />
          <ReviewField label={fields.companyNameEn} value={company.nameEn || notProvided} />
          <ReviewField label={fields.taxId} value={company.taxId || notProvided} />
          <ReviewField label={fields.businessType} value={company.businessType || notProvided} />
          <ReviewField label={fields.website} value={company.website || notProvided} />
          <ReviewField label={fields.companyPhone} value={company.phone || notProvided} />
          <ReviewField label={fields.address} value={addressLine || notProvided} wide />
        </ReviewSection>

        <ReviewSection
          title={content.sections.partnerType}
          editLabel={content.editLink}
          onEdit={() => onEditStep(3)}
        >
          <div className="col-span-full flex flex-wrap gap-2">
            {selectedPartnerTypes.length > 0 ? (
              selectedPartnerTypes.map((title) => (
                <span
                  key={title}
                  className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand"
                >
                  {title}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">{notProvided}</span>
            )}
          </div>
        </ReviewSection>

        <ReviewSection
          title={content.sections.additional}
          editLabel={content.editLink}
          onEdit={() => onEditStep(4)}
        >
          <ReviewField
            label={fields.customerSegments}
            value={customerSegmentLabels.join(", ") || notProvided}
            wide
          />
          <ReviewField
            label={fields.interestedProducts}
            value={interestedProductLabels.join(", ") || notProvided}
            wide
          />
          <ReviewField label={fields.projectsPerYear} value={additional.projectsPerYear || notProvided} />
          <ReviewField label={fields.avgProjectValue} value={additional.avgProjectValue || notProvided} />
          <ReviewField label={fields.aboutBusiness} value={additional.aboutBusiness || notProvided} wide />
        </ReviewSection>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:border-brand hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {content.backButton}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
          >
            {content.submitButton}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

type ReviewSectionProps = {
  title: string;
  editLabel: string;
  onEdit: () => void;
  children: ReactNode;
};

function ReviewSection({ title, editLabel, onEdit, children }: ReviewSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand hover:underline"
        >
          <Pencil className="h-3 w-3" aria-hidden="true" />
          {editLabel}
        </button>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

type ReviewFieldProps = {
  label: string;
  value: string;
  wide?: boolean;
};

function ReviewField({ label, value, wide }: ReviewFieldProps) {
  return (
    <div className={wide ? "col-span-full" : undefined}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 whitespace-pre-line text-sm font-medium text-neutral-800">{value}</p>
    </div>
  );
}
