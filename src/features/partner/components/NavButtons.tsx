// Shared "← Back" + "Continue →" row used at the bottom of steps 2-4.
// Step 1 has no back button, and step 5 uses its own submit button, so those
// render their primary buttons inline instead of through this component.

import { ArrowLeft, ArrowRight } from "lucide-react";

type NavButtonsProps = {
  backLabel: string;
  continueLabel: string;
  onBack: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
};

export function NavButtons({
  backLabel,
  continueLabel,
  onBack,
  onContinue,
  continueDisabled,
}: NavButtonsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:border-brand hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {backLabel}
      </button>
      <button
        type="button"
        onClick={onContinue}
        disabled={continueDisabled}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        {continueLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
