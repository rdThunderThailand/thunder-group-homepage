"use client";

// STEP 2 — Company details.

import { Building2, FileText } from "lucide-react";
import { NavButtons } from "../components/NavButtons";
import { SelectField, TextAreaField, TextField } from "../components/fields";
import { HelpBox } from "../components/HelpBox";
import { QuoteCard } from "../components/QuoteCard";
import type { CompanyData } from "../state";
import type { Step2Content } from "../types";

type Step2CompanyProps = {
  content: Step2Content;
  value: CompanyData;
  onChange: (field: keyof CompanyData, value: string) => void;
  onBack: () => void;
  onContinue: () => void;
  canContinue: boolean;
};

export function Step2Company({
  content,
  value,
  onChange,
  onBack,
  onContinue,
  canContinue,
}: Step2CompanyProps) {
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
            label={form.nameThLabel}
            required
            autoComplete="organization"
            placeholder={form.nameThPlaceholder}
            value={value.nameTh}
            onChange={(event) => onChange("nameTh", event.target.value)}
          />
          <TextField
            label={form.nameEnLabel}
            required
            autoComplete="organization"
            placeholder={form.nameEnPlaceholder}
            value={value.nameEn}
            onChange={(event) => onChange("nameEn", event.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label={form.taxIdLabel}
            required
            placeholder={form.taxIdPlaceholder}
            value={value.taxId}
            onChange={(event) => onChange("taxId", event.target.value)}
          />
          <SelectField
            label={form.businessTypeLabel}
            required
            placeholder={form.businessTypePlaceholder}
            options={form.businessTypeOptions}
            value={value.businessType}
            onChange={(event) => onChange("businessType", event.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            autoComplete="url"
            label={`${form.websiteLabel} ${form.websiteOptionalTag}`}
            placeholder={form.websitePlaceholder}
            value={value.website}
            onChange={(event) => onChange("website", event.target.value)}
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
        </div>

        <TextAreaField
          label={form.addressLabel}
          required
          rows={3}
          autoComplete="street-address"
          placeholder={form.addressPlaceholder}
          value={value.address}
          onChange={(event) => onChange("address", event.target.value)}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <SelectField
            label={form.provinceLabel}
            required
            placeholder={form.provincePlaceholder}
            options={form.provinceOptions}
            value={value.province}
            onChange={(event) => onChange("province", event.target.value)}
          />
          <SelectField
            label={form.districtLabel}
            required
            placeholder={form.districtPlaceholder}
            options={form.districtOptions}
            value={value.district}
            onChange={(event) => onChange("district", event.target.value)}
          />
          <TextField
            label={form.postalCodeLabel}
            required
            autoComplete="postal-code"
            placeholder={form.postalCodePlaceholder}
            value={value.postalCode}
            onChange={(event) => onChange("postalCode", event.target.value)}
          />
        </div>

        <NavButtons
          backLabel={content.backButton}
          continueLabel={content.continueButton}
          onBack={onBack}
          onContinue={onContinue}
          continueDisabled={!canContinue}
        />
      </div>
    </div>
  );
}

type Step2PanelProps = {
  content: Step2Content["panel"];
};

export function Step2Panel({ content }: Step2PanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-slate-50 p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand">
          <Building2 className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-semibold text-neutral-900">
          {content.confidentialTitle}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          {content.confidentialDescription}
        </p>
      </div>

      <div className="rounded-2xl border border-brand/20 bg-brand/5 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand">
          <FileText className="h-4 w-4" aria-hidden="true" />
          {content.documentsBoxTitle}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
          {content.documentsBoxDescription}
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50 p-5">
        <HelpBox content={content.help} />
      </div>

      <QuoteCard content={content.quote} />
    </div>
  );
}
