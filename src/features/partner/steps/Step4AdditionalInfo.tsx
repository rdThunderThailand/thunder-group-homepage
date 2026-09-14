"use client";

// STEP 4 — Additional info. Every field here is optional per the spec (no
// asterisks in the design), so "Continue" is only gated on the three consent
// checkboxes in the side panel staying checked.

import type { ReactNode } from "react";
import { Lightbulb, Upload } from "lucide-react";
import { NavButtons } from "../components/NavButtons";
import { SelectField, TextAreaField } from "../components/fields";
import { LinkedAgreement } from "../components/LinkedAgreement";
import type { AdditionalData } from "../state";
import type { CheckboxOption, Step4Content } from "../types";

const ABOUT_BUSINESS_MAX_LENGTH = 500;

type Step4AdditionalInfoProps = {
  content: Step4Content;
  value: AdditionalData;
  onToggleSegment: (id: string) => void;
  onToggleProduct: (id: string) => void;
  onChange: (field: keyof AdditionalData, value: string) => void;
  onBack: () => void;
  onContinue: () => void;
  canContinue: boolean;
};

export function Step4AdditionalInfo({
  content,
  value,
  onToggleSegment,
  onToggleProduct,
  onChange,
  onBack,
  onContinue,
  canContinue,
}: Step4AdditionalInfoProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-neutral-900">{content.cardTitle}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
        {content.cardDescription}
      </p>

      <div className="mt-7 flex flex-col gap-7">
        <CheckboxGroup
          label={content.customerSegments.label}
          options={content.customerSegments.options}
          selected={value.customerSegments}
          onToggle={onToggleSegment}
          otherLabel={content.customerSegments.otherLabel}
          otherPlaceholder={content.customerSegments.otherPlaceholder}
          otherValue={value.customerSegmentOther}
          onOtherChange={(text) => onChange("customerSegmentOther", text)}
        />

        <CheckboxGroup
          label={content.interestedProducts.label}
          options={content.interestedProducts.options}
          selected={value.interestedProducts}
          onToggle={onToggleProduct}
          otherLabel={content.interestedProducts.otherLabel}
          otherPlaceholder={content.interestedProducts.otherPlaceholder}
          otherValue={value.interestedProductOther}
          onOtherChange={(text) => onChange("interestedProductOther", text)}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label={content.projectsPerYearLabel}
            placeholder={content.projectsPerYearPlaceholder}
            options={content.projectsPerYearOptions}
            value={value.projectsPerYear}
            onChange={(event) => onChange("projectsPerYear", event.target.value)}
          />
          <SelectField
            label={content.avgProjectValueLabel}
            placeholder={content.avgProjectValuePlaceholder}
            options={content.avgProjectValueOptions}
            value={value.avgProjectValue}
            onChange={(event) => onChange("avgProjectValue", event.target.value)}
          />
        </div>

        <TextAreaField
          label={content.aboutBusinessLabel}
          rows={4}
          maxLength={ABOUT_BUSINESS_MAX_LENGTH}
          placeholder={content.aboutBusinessPlaceholder}
          value={value.aboutBusiness}
          onChange={(event) => onChange("aboutBusiness", event.target.value)}
          counter={`${value.aboutBusiness.length}/${ABOUT_BUSINESS_MAX_LENGTH}`}
        />

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

type CheckboxGroupProps = {
  label: string;
  options: CheckboxOption[];
  selected: string[];
  onToggle: (id: string) => void;
  otherLabel: string;
  otherPlaceholder: string;
  otherValue: string;
  onOtherChange: (value: string) => void;
};

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
  otherLabel,
  otherPlaceholder,
  otherValue,
  onOtherChange,
}: CheckboxGroupProps) {
  const otherChecked = selected.includes("other");

  return (
    <div>
      <p className="text-sm font-medium text-neutral-800">{label}</p>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-2.5 text-sm text-neutral-700"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => onToggle(option.id)}
              className="h-4 w-4 shrink-0 rounded border-slate-300 accent-brand"
            />
            {option.label}
          </label>
        ))}
        <label className="flex items-center gap-2.5 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={otherChecked}
            onChange={() => onToggle("other")}
            className="h-4 w-4 shrink-0 rounded border-slate-300 accent-brand"
          />
          {otherLabel}
        </label>
      </div>
      {otherChecked ? (
        <input
          type="text"
          placeholder={otherPlaceholder}
          value={otherValue}
          onChange={(event) => onOtherChange(event.target.value)}
          className="mt-2.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-slate-400 focus:border-brand"
        />
      ) : null}
    </div>
  );
}

type Step4PanelProps = {
  content: Step4Content["panel"];
  value: AdditionalData;
  onChange: (field: keyof AdditionalData, value: boolean) => void;
};

export function Step4Panel({ content, value, onChange }: Step4PanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-slate-50 p-5">
        <p className="text-sm font-semibold text-neutral-900">{content.uploadTitle}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          {content.uploadDescription}
        </p>
        <div className="mt-3 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-7 text-center">
          <Upload className="h-6 w-6 text-slate-300" aria-hidden="true" />
          <p className="text-xs text-slate-500">
            {content.dropzoneLabel}{" "}
            <span className="font-semibold text-brand">{content.dropzoneLink}</span>
          </p>
          <p className="text-[0.68rem] text-slate-400">{content.dropzoneHint}</p>
        </div>
      </div>

      <div className="flex gap-3 rounded-2xl bg-amber-50 p-4">
        <Lightbulb className="h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900">{content.tipTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            {content.tipDescription}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-5">
        <p className="text-sm font-semibold text-neutral-900">{content.consentTitle}</p>
        <div className="mt-3 flex flex-col gap-2.5">
          <ConsentRow
            checked={value.consentAccurate}
            onChange={(checked) => onChange("consentAccurate", checked)}
          >
            <span>{content.consentAccurate}</span>
          </ConsentRow>
          <ConsentRow
            checked={value.consentTerms}
            onChange={(checked) => onChange("consentTerms", checked)}
          >
            <LinkedAgreement content={content.consentTerms} />
          </ConsentRow>
          <ConsentRow
            checked={value.consentContact}
            onChange={(checked) => onChange("consentContact", checked)}
          >
            <span>{content.consentContact}</span>
          </ConsentRow>
        </div>
      </div>
    </div>
  );
}

// Pre-checked by default per the spec ("checkbox ติ๊กแล้วโดย default ได้"),
// but still a real toggle — unchecking any of the three disables "Continue"
// (see `isStep4Valid`).
function ConsentRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-brand"
      />
      {children}
    </label>
  );
}
