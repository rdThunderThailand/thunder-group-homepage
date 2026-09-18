"use client";

// === PARTNER REGISTRATION — "สมัครเป็น Thunder Partner" ===
// Full page body for `/register`, split out of the route's `page.tsx` as a
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
import { Stepper } from "./components/Stepper";
import { Step1Account, Step1Panel } from "./steps/Step1Account";
import { Step2Company, Step2Panel } from "./steps/Step2Company";
import { Step3PartnerType, Step3Panel } from "./steps/Step3PartnerType";
import { Step4AdditionalInfo, Step4Panel } from "./steps/Step4AdditionalInfo";
import { Step5Review } from "./steps/Step5Review";
import { RegisterSuccess } from "./steps/RegisterSuccess";
import {
  createInitialWizardState,
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
  const [state, dispatch] = useReducer(wizardReducer, undefined, createInitialWizardState);

  async function handleSubmit() {
    if (!state.account.agreeTerms || state.submitting) return;
    dispatch({ type: "SUBMIT_START" });
    try {
      const response = await fetch("/api/partner/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: state.submissionId,
          taxId: state.company.taxId,
          companyName: state.company.nameEn,
          email: state.account.email,
          applicationData: {
            account: state.account,
            company: state.company,
            partnerTypes: state.partnerTypes,
            additional: state.additional,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("submit failed");
      }

      const result = (await response.json()) as { applicationId: string };
      dispatch({ type: "SUBMIT_SUCCESS", applicationId: result.applicationId });
    } catch {
      dispatch({
        type: "SUBMIT_ERROR",
        message: content.step5.submitError,
      });
    }
  }

  const sidebarStepCopy = state.submitted
    ? content.sidebar.steps.success
    : content.sidebar.steps[`step${state.step}` as `step${StepNumber}`];

  return (
    <div className="relative w-full bg-white">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col lg:min-h-screen lg:flex-row">
        <PartnerSidebar content={content.sidebar} stepCopy={sidebarStepCopy} />

        <div className="flex-1 bg-white">
          <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pb-14 lg:pt-8">
          {state.submitted ? (
            <>
              <div>
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
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
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

              <div className={state.step >= 4 ? "mt-4" : "mt-8"}>
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

                {/* Grow the original left track by 20%, taking space from the benefits panel. */}
                {state.step === 3 && (
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,calc((100%_-_1.5rem_-_20rem)*1.2))_minmax(0,1fr)]">
                    <Step3PartnerType
                      content={content.step3}
                      value={state.partnerTypes}
                      onToggle={(id) => dispatch({ type: "TOGGLE_PARTNER_TYPE", id })}
                      onBack={() => dispatch({ type: "BACK_STEP" })}
                      onContinue={() => dispatch({ type: "NEXT_STEP" })}
                      canContinue={isStep3Valid(state.partnerTypes)}
                      incompleteHint={content.incompleteHint}
                    />
                    <Step3Panel content={content.step3.panel} notSureBox={content.step3.notSureBox} />
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
                    agreement={content.step1.form.agreement}
                    onAgreeTermsChange={(value) =>
                      dispatch({ type: "SET_ACCOUNT_FIELD", field: "agreeTerms", value })
                    }
                    account={state.account}
                    company={state.company}
                    partnerTypeIds={state.partnerTypes}
                    partnerTypeOptions={content.step3.options}
                    additional={state.additional}
                    customerSegmentOptions={content.step4.customerSegments.options}
                    interestedProductOptions={content.step4.interestedProducts.options}
                    onEditStep={(step) => dispatch({ type: "GO_TO_STEP", step })}
                    onBack={() => dispatch({ type: "BACK_STEP" })}
                    onSubmit={handleSubmit}
                    submitting={state.submitting}
                    submitError={state.submitError}
                  />
                )}
              </div>
            </>
          )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
