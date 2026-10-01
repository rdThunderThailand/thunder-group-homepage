"use client";

import liff from "@line/liff";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useReducer, useState, type FormEvent } from "react";
import { Progress } from "./components/Progress";
import { createInitialWizardState, isCurrentStepValid, wizardReducer } from "./state";
import { MigrationSuccess } from "./steps/MigrationSuccess";
import { Step1Identity } from "./steps/Step1Identity";
import { Step2Relationship } from "./steps/Step2Relationship";
import { Step3Usage } from "./steps/Step3Usage";
import { Step4Review } from "./steps/Step4Review";
import type { AuroraMigrationData } from "./types";

async function submitRequest(form: AuroraMigrationData, idToken: string) {
  const { company, ...fields } = form;
  const response = await fetch("/api/aurora-migration/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ ...fields, companyName: company }),
  });
  const result = (await response.json()) as { referenceNo?: string; error?: string };
  if (!response.ok) throw new Error(result.error ?? "REQUEST_FAILED");
  if (!result.referenceNo) throw new Error("Missing reference number");
  return result.referenceNo;
}

async function getExistingRequest(idToken: string) {
  const response = await fetch("/api/aurora-migration/requests", {
    headers: { Authorization: `Bearer ${idToken}` },
    cache: "no-store",
  });
  const result = (await response.json()) as Array<{ referenceNo: string }> | { error?: string };
  if (!response.ok || !Array.isArray(result)) {
    throw new Error(!Array.isArray(result) && result.error ? result.error : "REQUEST_LOOKUP_FAILED");
  }
  return result[0]?.referenceNo;
}

export function AuroraMigrationClient() {
  const [state, dispatch] = useReducer(wizardReducer, undefined, createInitialWizardState);
  const [lineName, setLineName] = useState<string>();
  const [liffError, setLiffError] = useState<string>();
  const [checkingRequest, setCheckingRequest] = useState(true);

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

    async function connectLine() {
      try {
        if (!liffId) throw new Error("LIFF_ID_MISSING");
        await liff.init({ liffId });
        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }
        setLineName((await liff.getProfile()).displayName);
        const idToken = liff.getIDToken();
        if (!idToken) throw new Error("ID_TOKEN_MISSING");
        const referenceNo = await getExistingRequest(idToken);
        if (referenceNo) dispatch({ type: "SUBMIT_SUCCESS", referenceNo });
      } catch (error) {
        console.error("LIFF initialization failed", error);
        setLiffError(error instanceof Error ? error.message : "LIFF_INIT_FAILED");
      } finally {
        setCheckingRequest(false);
      }
    }

    void connectLine();
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.step < 4) {
      dispatch({ type: "NEXT_STEP" });
      scrollTop();
      return;
    }

    let idToken: string | null;
    try {
      idToken = liff.getIDToken();
    } catch {
      idToken = null;
    }
    if (!idToken) {
      setLiffError("ID_TOKEN_MISSING");
      return;
    }

    dispatch({ type: "SUBMIT_START" });
    try {
      dispatch({ type: "SUBMIT_SUCCESS", referenceNo: await submitRequest(state.form, idToken) });
      scrollTop();
    } catch (error) {
      console.error("Aurora migration submission failed", error);
      const code = error instanceof Error ? error.message : "REQUEST_FAILED";
      dispatch({ type: "SUBMIT_ERROR", message: code === "APPLICATION_ALREADY_SUBMITTED"
        ? "บัญชี LINE นี้ส่งคำขอไปแล้ว"
        : `ส่งข้อมูลไม่สำเร็จ (${code})` });
    }
  }

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#eef5ff] text-[#102c61]">
      <div className="mx-auto min-h-screen max-w-lg bg-white shadow-xl">
        <header className="sticky top-0 z-10 border-b border-[#dbe8f8] bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            {state.step > 1 && !state.submitted ? (
              <button type="button" aria-label="ย้อนกลับ" onClick={() => dispatch({ type: "BACK_STEP" })} className="grid size-10 place-items-center text-[#1769e8]"><ArrowLeft size={22} /></button>
            ) : (
              <span className="grid size-10 place-items-center rounded-full bg-[#0c2f69] font-bold text-white">T</span>
            )}
            <div>
              <p className="text-sm font-bold text-[#1769e8]">THUNDER</p>
              <h1 className="text-lg font-bold">Aurora Migration</h1>
              {lineName && <p className="text-xs text-[#6b81a2]">LINE: {lineName}</p>}
            </div>
          </div>
          {!state.submitted && <Progress step={state.step} />}
        </header>

        {liffError && <p role="alert" className="mx-5 mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ไม่สามารถเชื่อมต่อ LINE ได้ กรุณาปิดแล้วเปิดหน้านี้จาก LINE อีกครั้ง ({liffError})</p>}

        <form className="space-y-6 px-5 py-6" onSubmit={handleSubmit}>
          {checkingRequest ? (
            <p className="py-12 text-center text-sm text-[#6b81a2]">กำลังตรวจสอบคำขอ...</p>
          ) : state.submitted ? (
            <MigrationSuccess referenceNo={state.referenceNo} />
          ) : (
            <>
              {state.step === 1 && <Step1Identity value={state.form} onChange={(field, value) => dispatch({ type: "SET_FIELD", field, value })} />}
              {state.step === 2 && <Step2Relationship selected={state.form.roles} onToggle={(value) => dispatch({ type: "TOGGLE_LIST", field: "roles", value })} />}
              {state.step === 3 && (
                <Step3Usage
                  modules={state.form.modules}
                  sites={state.form.sites}
                  siteInput={state.siteInput}
                  onToggleModule={(value) => dispatch({ type: "TOGGLE_LIST", field: "modules", value })}
                  onSiteInputChange={(value) => dispatch({ type: "SET_SITE_INPUT", value })}
                  onAddSite={() => dispatch({ type: "ADD_SITE" })}
                  onRemoveSite={(value) => dispatch({ type: "REMOVE_SITE", value })}
                />
              )}
              {state.step === 4 && <Step4Review value={state.form} onEdit={() => dispatch({ type: "GO_TO_STEP", step: 1 })} />}

              {state.submitError && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.submitError}</p>}
              <button type="submit" disabled={!isCurrentStepValid(state) || state.submitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0866f5] py-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-[#a9bdd8]">
                {state.submitting ? "กำลังส่ง..." : state.step === 4 ? "ส่งข้อมูล" : "ถัดไป"}
                {!state.submitting && (state.step === 4 ? <Check size={20} /> : <ArrowRight size={20} />)}
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
