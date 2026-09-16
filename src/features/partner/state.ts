// State for the Partner Registration wizard. The reducer itself still can't
// do async work, so submitting is split across three actions dispatched by
// `PartnerClient`: SUBMIT_START before the fetch to
// /api/partner/applications, then SUBMIT_SUCCESS (with the server-assigned
// applicationId) or SUBMIT_ERROR once it resolves.

export type AccountData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agreeTerms: boolean;
};

export type CompanyData = {
  nameTh: string;
  nameEn: string;
  taxId: string;
  businessType: string;
  website: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  postalCode: string;
};

export type AdditionalData = {
  customerSegments: string[];
  customerSegmentOther: string;
  interestedProducts: string[];
  interestedProductOther: string;
  projectsPerYear: string;
  avgProjectValue: string;
  aboutBusiness: string;
  consentAccurate: boolean;
  consentTerms: boolean;
  consentContact: boolean;
};

export type StepNumber = 1 | 2 | 3 | 4 | 5;

export type WizardState = {
  step: StepNumber;
  /** Highest step the user has reached — lets the stepper re-open any
   *  previously visited step without letting them skip ahead. */
  highestStepReached: StepNumber;
  /** Client-generated once per mount; sent with the submit request so a
   *  double-click or browser auto-retry doesn't create two applications
   *  (server also enforces this on tax ID as a second layer). */
  submissionId: string;
  submitting: boolean;
  submitError: string | null;
  submitted: boolean;
  applicationId: string;
  submittedAt: Date | null;
  account: AccountData;
  company: CompanyData;
  partnerTypes: string[];
  additional: AdditionalData;
};

export function createInitialWizardState(): WizardState {
  return {
    step: 1,
    highestStepReached: 1,
    submissionId: crypto.randomUUID(),
    submitting: false,
    submitError: null,
    submitted: false,
    applicationId: "",
    submittedAt: null,
    account: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      agreeTerms: false,
    },
    company: {
      nameTh: "",
      nameEn: "",
      taxId: "",
      businessType: "",
      website: "",
      phone: "",
      address: "",
      province: "",
      district: "",
      postalCode: "",
    },
    partnerTypes: [],
    additional: {
      customerSegments: [],
      customerSegmentOther: "",
      interestedProducts: [],
      interestedProductOther: "",
      projectsPerYear: "",
      avgProjectValue: "",
      aboutBusiness: "",
      consentAccurate: true,
      consentTerms: true,
      consentContact: true,
    },
  };
}

export type WizardAction =
  | { type: "SET_ACCOUNT_FIELD"; field: keyof AccountData; value: string | boolean }
  | { type: "SET_COMPANY_FIELD"; field: keyof CompanyData; value: string }
  | { type: "TOGGLE_PARTNER_TYPE"; id: string }
  | {
      type: "TOGGLE_LIST_FIELD";
      field: "customerSegments" | "interestedProducts";
      id: string;
    }
  | {
      type: "SET_ADDITIONAL_FIELD";
      field: keyof AdditionalData;
      value: string | boolean;
    }
  | { type: "GO_TO_STEP"; step: StepNumber }
  | { type: "NEXT_STEP" }
  | { type: "BACK_STEP" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS"; applicationId: string }
  | { type: "SUBMIT_ERROR"; message: string };

function toggleInList(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export function wizardReducer(
  state: WizardState,
  action: WizardAction,
): WizardState {
  switch (action.type) {
    case "SET_ACCOUNT_FIELD":
      return {
        ...state,
        account: { ...state.account, [action.field]: action.value },
      };
    case "SET_COMPANY_FIELD":
      return {
        ...state,
        company: { ...state.company, [action.field]: action.value },
      };
    case "TOGGLE_PARTNER_TYPE":
      return { ...state, partnerTypes: toggleInList(state.partnerTypes, action.id) };
    case "TOGGLE_LIST_FIELD":
      return {
        ...state,
        additional: {
          ...state.additional,
          [action.field]: toggleInList(state.additional[action.field], action.id),
        },
      };
    case "SET_ADDITIONAL_FIELD":
      return {
        ...state,
        additional: { ...state.additional, [action.field]: action.value },
      };
    case "GO_TO_STEP":
      return {
        ...state,
        step: action.step,
        highestStepReached: Math.max(
          state.highestStepReached,
          action.step,
        ) as StepNumber,
      };
    case "NEXT_STEP": {
      const step = Math.min(state.step + 1, 5) as StepNumber;
      return { ...state, step, highestStepReached: Math.max(state.highestStepReached, step) as StepNumber };
    }
    case "BACK_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) as StepNumber };
    case "SUBMIT_START":
      return { ...state, submitting: true, submitError: null };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        submitting: false,
        submitted: true,
        applicationId: action.applicationId,
        submittedAt: new Date(),
      };
    case "SUBMIT_ERROR":
      return { ...state, submitting: false, submitError: action.message };
    default:
      return state;
  }
}

export function isStep1Valid(account: AccountData): boolean {
  return (
    account.firstName.trim() !== "" &&
    account.lastName.trim() !== "" &&
    account.email.trim() !== "" &&
    account.phone.trim() !== ""
  );
}

export function isStep2Valid(company: CompanyData): boolean {
  return (
    company.nameTh.trim() !== "" &&
    company.nameEn.trim() !== "" &&
    company.taxId.trim() !== "" &&
    company.businessType.trim() !== "" &&
    company.phone.trim() !== "" &&
    company.address.trim() !== "" &&
    company.province.trim() !== "" &&
    company.district.trim() !== "" &&
    company.postalCode.trim() !== ""
  );
}

export function isStep3Valid(partnerTypes: string[]): boolean {
  return partnerTypes.length > 0;
}

export function isStep4Valid(additional: AdditionalData): boolean {
  return (
    additional.consentAccurate && additional.consentTerms && additional.consentContact
  );
}
