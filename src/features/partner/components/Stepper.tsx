// Horizontal 5-node progress stepper. A node is "done" (blue check) once the
// wizard has moved past it, "active" (solid blue) for the current step, and
// otherwise a plain grey number. Done nodes stay clickable so the user can
// jump back to review or edit an earlier step.

import { Check } from "lucide-react";
import type { StepNumber } from "../state";

type StepperProps = {
  labels: readonly [string, string, string, string, string];
  current: StepNumber;
  highestReached: StepNumber;
  onStepClick: (step: StepNumber) => void;
};

export function Stepper({
  labels,
  current,
  highestReached,
  onStepClick,
}: StepperProps) {
  return (
    <ol className="mt-8 flex items-start">
      {labels.map((label, index) => {
        const step = (index + 1) as StepNumber;
        const isDone = step < current;
        const isActive = step === current;
        const isClickable = step <= highestReached && !isActive;
        const isLast = index === labels.length - 1;

        return (
          <li key={label} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <span
                className={
                  index === 0 ? "invisible h-px flex-1" : "h-px flex-1 " + (isDone || isActive ? "bg-brand" : "bg-slate-200")
                }
                aria-hidden="true"
              />
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step)}
                aria-current={isActive ? "step" : undefined}
                className={
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors " +
                  (isActive
                    ? "bg-brand text-white"
                    : isDone
                      ? "border-2 border-brand text-brand enabled:hover:bg-brand/5"
                      : "bg-slate-100 text-slate-400") +
                  (isClickable ? " cursor-pointer" : " cursor-default")
                }
              >
                {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : step}
              </button>
              <span
                className={
                  isLast ? "invisible h-px flex-1" : "h-px flex-1 " + (isDone ? "bg-brand" : "bg-slate-200")
                }
                aria-hidden="true"
              />
            </div>
            <span
              className={
                "mt-2 max-w-[6.5rem] text-center text-[0.7rem] font-medium leading-tight sm:text-xs " +
                (isActive ? "text-neutral-900" : "text-slate-400")
              }
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
