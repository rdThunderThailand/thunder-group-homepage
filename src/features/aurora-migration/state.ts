import type { AuroraMigrationData, StepNumber, TextField } from "./types";

export type WizardState = {
  step: StepNumber;
  form: AuroraMigrationData;
  siteInput: string;
  submitting: boolean;
  submitError: boolean;
  submitted: boolean;
  referenceNo: string;
};

export function createInitialWizardState(): WizardState {
  return {
    step: 1,
    form: {
      firstName: "",
      lastName: "",
      company: "",
      position: "",
      email: "",
      phone: "",
      roles: [],
      modules: [],
      sites: [],
    },
    siteInput: "",
    submitting: false,
    submitError: false,
    submitted: false,
    referenceNo: "",
  };
}

export type WizardAction =
  | { type: "SET_FIELD"; field: TextField; value: string }
  | { type: "TOGGLE_LIST"; field: "roles" | "modules"; value: string }
  | { type: "SET_SITE_INPUT"; value: string }
  | { type: "ADD_SITE" }
  | { type: "REMOVE_SITE"; value: string }
  | { type: "GO_TO_STEP"; step: StepNumber }
  | { type: "NEXT_STEP" }
  | { type: "BACK_STEP" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS"; referenceNo: string }
  | { type: "SUBMIT_ERROR" }
  | { type: "RESET" };

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, form: { ...state.form, [action.field]: action.value } };
    case "TOGGLE_LIST":
      return {
        ...state,
        form: { ...state.form, [action.field]: toggle(state.form[action.field], action.value) },
      };
    case "SET_SITE_INPUT":
      return { ...state, siteInput: action.value };
    case "ADD_SITE": {
      const site = state.siteInput.trim();
      if (!site || state.form.sites.includes(site)) return state;
      return { ...state, siteInput: "", form: { ...state.form, sites: [...state.form.sites, site] } };
    }
    case "REMOVE_SITE":
      return {
        ...state,
        form: { ...state.form, sites: state.form.sites.filter((site) => site !== action.value) },
      };
    case "GO_TO_STEP":
      return { ...state, step: action.step };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 4) as StepNumber, submitError: false };
    case "BACK_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) as StepNumber, submitError: false };
    case "SUBMIT_START":
      return { ...state, submitting: true, submitError: false };
    case "SUBMIT_SUCCESS":
      return { ...state, submitting: false, submitted: true, referenceNo: action.referenceNo };
    case "SUBMIT_ERROR":
      return { ...state, submitting: false, submitError: true };
    case "RESET":
      return createInitialWizardState();
  }
}

export function isCurrentStepValid({ step, form }: WizardState) {
  if (step === 1) return Boolean(form.firstName && form.lastName && form.company && form.email && form.phone);
  if (step === 2) return form.roles.length > 0;
  if (step === 3) return form.modules.length > 0;
  return true;
}
