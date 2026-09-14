// Shared form-field primitives for every step card: a labeled text input, a
// labeled select, and a labeled textarea. All three take an optional
// `helper` line and a `required` flag that renders the red asterisk used
// throughout the design.

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

function RequiredMark() {
  return (
    <span className="text-red-500" aria-hidden="true">
      {" *"}
    </span>
  );
}

export const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-slate-400 focus:border-brand";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  helper?: string;
};

export function TextField({
  label,
  required,
  helper,
  id,
  className,
  ...inputProps
}: TextFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-neutral-800">
        {label}
        {required ? <RequiredMark /> : null}
      </span>
      <input id={id} className={inputClass + (className ? ` ${className}` : "")} {...inputProps} />
      {helper ? <span className="text-xs leading-relaxed text-slate-400">{helper}</span> : null}
    </label>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  required?: boolean;
  helper?: string;
  counter?: string;
};

export function TextAreaField({
  label,
  required,
  helper,
  counter,
  id,
  className,
  ...textareaProps
}: TextAreaFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-neutral-800">
        {label}
        {required ? <RequiredMark /> : null}
      </span>
      <textarea
        id={id}
        className={inputClass + " resize-none" + (className ? ` ${className}` : "")}
        {...textareaProps}
      />
      <div className="flex items-center justify-between">
        {helper ? <span className="text-xs leading-relaxed text-slate-400">{helper}</span> : <span />}
        {counter ? <span className="text-xs text-slate-400">{counter}</span> : null}
      </div>
    </label>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  placeholder: string;
  options: string[];
};

export function SelectField({
  label,
  required,
  placeholder,
  options,
  id,
  className,
  value,
  ...selectProps
}: SelectFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-neutral-800">
        {label}
        {required ? <RequiredMark /> : null}
      </span>
      <select
        id={id}
        value={value}
        className={
          inputClass +
          " appearance-none bg-[image:var(--chevron)] bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-9" +
          (className ? ` ${className}` : "")
        }
        style={{
          ["--chevron" as string]:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
        }}
        {...selectProps}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
