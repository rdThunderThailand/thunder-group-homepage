"use client";

// === PARTNER REGISTRATION — "สมัครเป็น Thunder Partner" ===
// Full page body for `/partners`, split out of the route's `page.tsx` as a
// Client Component per the project's `features/*Client.tsx` convention
// (mirrors `src/features/home/HomeClient`). `Navbar` (with `overlay`) and
// `Footer` already wrap every route from `src/app/[locale]/layout.tsx` — this
// file renders only the body.
//
// Every string is resolved on the server in `page.tsx` (the
// `PartnerProgramPage` namespace) and passed in as plain props — nothing here
// calls `useTranslations`. All state (current step, the four steps' form
// data, and the mock submit) lives in a single `useReducer` in `state.ts`;
// there is no backend call — "Submit" on step 5 just mints a mock application
// number and flips to the success screen.
//
// Layout: the dark sidebar is pulled up under the transparent overlay navbar
// with `-mt-16 lg:-mt-20`, same technique as every other page's hero (see
// `Navbar`'s `overlay` prop docs) — except here the strip has to stay dark
// across the *full* width (both columns) for the navbar's white text to read
// before the user scrolls, so the white content column gets a matching
// `lg:mt-20` (margin, not padding) instead of starting flush at the top.

import { useReducer } from "react";
import type { Locale } from "@/i18n/routing";
import { PartnerSidebar } from "./components/PartnerSidebar";
import { Breadcrumb } from "./components/Breadcrumb";
import { Stepper } from "./components/Stepper";
import { Step1Account, Step1Panel } from "./steps/Step1Account";
import { Step2Company, Step2Panel } from "./steps/Step2Company";
import { Step3PartnerType, Step3Panel } from "./steps/Step3PartnerType";
import { Step4AdditionalInfo, Step4Panel } from "./steps/Step4AdditionalInfo";
import { Step5Review } from "./steps/Step5Review";
import { RegisterSuccess } from "./steps/RegisterSuccess";
import {
  initialWizardState,
  isStep1Valid,
  isStep2Valid,
  isStep3Valid,
  isStep4Valid,
  wizardReducer,
  type StepNumber,
} from "./state";
import type { PartnerPageContent } from "./types";

type PartnerClientProps = {
  content: PartnerPageContent;
  locale: Locale;
};

export function PartnerClient({ content, locale }: PartnerClientProps) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);

  const sidebarStepCopy = state.submitted
    ? content.sidebar.steps.success
    : content.sidebar.steps[`step${state.step}` as `step${StepNumber}`];

  return (
    <div className="relative -mt-16 flex flex-col bg-ink lg:-mt-20 lg:min-h-screen lg:flex-row">
      <PartnerSidebar content={content.sidebar} stepCopy={sidebarStepCopy} />

      {/* `lg:mt-20` (margin, not padding) leaves the dark wrapper's background
          exposed above this column too, matching the navbar's own height —
          padding would fill that strip with this div's own white background
          and make the transparent overlay navbar's white text unreadable. */}
      <div className="flex-1 bg-white lg:mt-20">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          {state.submitted ? (
            <>
              <Breadcrumb
                items={[
                  content.breadcrumb.home,
                  content.breadcrumb.partnerProgram,
                  content.breadcrumb.register,
                  content.breadcrumb.applicationReceived,
                ]}
              />
              <div className="mt-6">
                <RegisterSuccess
                  content={content.success}
                  locale={locale}
                  applicationId={state.applicationId}
                  submittedAt={state.submittedAt ?? new Date()}
                  account={state.account}
                  company={state.company}
                  partnerTypeIds={state.partnerTypes}
                  partnerTypeOptions={content.step3.options}
                  additional={state.additional}
                  interestedProductOptions={content.step4.interestedProducts.options}
                />
              </div>
            </>
          ) : (
            <>
              <Breadcrumb
                items={[
                  content.breadcrumb.home,
                  content.breadcrumb.partnerProgram,
                  content.breadcrumb.register,
                ]}
              />
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                {content.heading}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
                {state.step === 1 ? content.subtitleStep1 : content.subtitleDefault}
              </p>

              <Stepper
                labels={content.stepper.labels}
                current={state.step}
                highestReached={state.highestStepReached}
                onStepClick={(step) => dispatch({ type: "GO_TO_STEP", step })}
              />

              <div className="mt-8">
                {state.step === 1 && (
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <Step1Account
                      content={content.step1}
                      value={state.account}
                      onChange={(field, value) =>
                        dispatch({ type: "SET_ACCOUNT_FIELD", field, value })
                      }
                      onContinue={() => dispatch({ type: "NEXT_STEP" })}
                      canContinue={isStep1Valid(state.account)}
                      incompleteHint={content.incompleteHint}
                    />
                    <Step1Panel content={content.step1.panel} />
                  </div>
                )}

                {state.step === 2 && (
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <Step2Company
                      content={content.step2}
                      value={state.company}
                      onChange={(field, value) =>
                        dispatch({ type: "SET_COMPANY_FIELD", field, value })
                      }
                      onBack={() => dispatch({ type: "BACK_STEP" })}
                      onContinue={() => dispatch({ type: "NEXT_STEP" })}
                      canContinue={isStep2Valid(state.company)}
                      incompleteHint={content.incompleteHint}
                    />
                    <Step2Panel content={content.step2.panel} />
                  </div>
                )}

                {state.step === 3 && (
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <Step3PartnerType
                      content={content.step3}
                      value={state.partnerTypes}
                      onToggle={(id) => dispatch({ type: "TOGGLE_PARTNER_TYPE", id })}
                      onBack={() => dispatch({ type: "BACK_STEP" })}
                      onContinue={() => dispatch({ type: "NEXT_STEP" })}
                      canContinue={isStep3Valid(state.partnerTypes)}
                      incompleteHint={content.incompleteHint}
                    />
                    <Step3Panel content={content.step3.panel} />
                  </div>
                )}

                {state.step === 4 && (
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <Step4AdditionalInfo
                      content={content.step4}
                      value={state.additional}
                      onToggleSegment={(id) =>
                        dispatch({ type: "TOGGLE_LIST_FIELD", field: "customerSegments", id })
                      }
                      onToggleProduct={(id) =>
                        dispatch({ type: "TOGGLE_LIST_FIELD", field: "interestedProducts", id })
                      }
                      onChange={(field, value) =>
                        dispatch({ type: "SET_ADDITIONAL_FIELD", field, value })
                      }
                      onBack={() => dispatch({ type: "BACK_STEP" })}
                      onContinue={() => dispatch({ type: "NEXT_STEP" })}
                      canContinue={isStep4Valid(state.additional)}
                      incompleteHint={content.incompleteHint}
                    />
                    <Step4Panel
                      content={content.step4.panel}
                      value={state.additional}
                      onChange={(field, value) =>
                        dispatch({ type: "SET_ADDITIONAL_FIELD", field, value })
                      }
                    />
                  </div>
                )}

                {state.step === 5 && (
                  <Step5Review
                    content={content.step5}
                    account={state.account}
                    company={state.company}
                    partnerTypeIds={state.partnerTypes}
                    partnerTypeOptions={content.step3.options}
                    additional={state.additional}
                    customerSegmentOptions={content.step4.customerSegments.options}
                    interestedProductOptions={content.step4.interestedProducts.options}
                    onEditStep={(step) => dispatch({ type: "GO_TO_STEP", step })}
                    onBack={() => dispatch({ type: "BACK_STEP" })}
                    onSubmit={() => dispatch({ type: "SUBMIT" })}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
