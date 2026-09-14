// Content shapes for the Partner Registration flow. Every string here is
// resolved from the `PartnerProgramPage` namespace in
// `src/app/[locale]/partners/page.tsx` (a Server Component)
// and handed to `PartnerClient` as props — the client tree never calls
// `useTranslations`, matching every other feature in this repo (see
// `src/features/home/types.ts`).

export type SidebarHighlight = {
  title: string;
  description: string;
};

/** Overlay + caption copy shown on the sidebar's placeholder photo, one entry
 *  per step (plus the success screen). */
export type SidebarStepCopy = {
  overlayText: string;
  captionLine1: string;
  captionLine2: string;
};

export type SidebarContent = {
  label: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  description: string;
  highlights: SidebarHighlight[];
  imageAlt: string;
  steps: {
    step1: SidebarStepCopy;
    step2: SidebarStepCopy;
    step3: SidebarStepCopy;
    step4: SidebarStepCopy;
    step5: SidebarStepCopy;
    success: SidebarStepCopy;
  };
};

export type BreadcrumbContent = {
  home: string;
  partnerProgram: string;
  register: string;
  applicationReceived: string;
};

/** Exactly five labels — one per stepper node. */
export type StepperContent = {
  labels: [string, string, string, string, string];
};

export type HelpPanelContent = {
  title: string;
  description: string;
  phoneLabel: string;
  phone: string;
  emailLabel: string;
  email: string;
};

export type QuoteContent = {
  text: string;
  source: string;
};

/** A prefix / link / middle / link / suffix sentence, e.g. "I accept [Terms]
 *  and [Privacy Policy]" — kept as plain strings so the client tree never
 *  needs a rich-text translation call. */
export type LinkedAgreementContent = {
  prefix: string;
  termsLink: string;
  middle: string;
  privacyLink: string;
  suffix: string;
};

export type Step1Content = {
  cardTitle: string;
  cardDescription: string;
  form: {
    firstNameLabel: string;
    firstNamePlaceholder: string;
    lastNameLabel: string;
    lastNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailHelper: string;
    phoneLabel: string;
    phonePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    passwordHelper: string;
    showPasswordLabel: string;
    hidePasswordLabel: string;
    agreement: LinkedAgreementContent;
    continueButton: string;
    loginPrompt: string;
    loginLink: string;
  };
  panel: {
    confidentialTitle: string;
    confidentialDescription: string;
    help: HelpPanelContent;
    quote: QuoteContent;
  };
};

export type Step2Content = {
  cardTitle: string;
  cardDescription: string;
  form: {
    nameThLabel: string;
    nameThPlaceholder: string;
    nameEnLabel: string;
    nameEnPlaceholder: string;
    taxIdLabel: string;
    taxIdPlaceholder: string;
    businessTypeLabel: string;
    businessTypePlaceholder: string;
    businessTypeOptions: string[];
    websiteLabel: string;
    websiteOptionalTag: string;
    websitePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    addressLabel: string;
    addressPlaceholder: string;
    provinceLabel: string;
    provincePlaceholder: string;
    provinceOptions: string[];
    districtLabel: string;
    districtPlaceholder: string;
    districtOptions: string[];
    postalCodeLabel: string;
    postalCodePlaceholder: string;
  };
  backButton: string;
  continueButton: string;
  panel: {
    confidentialTitle: string;
    confidentialDescription: string;
    documentsBoxTitle: string;
    documentsBoxDescription: string;
    help: HelpPanelContent;
    quote: QuoteContent;
  };
};

export type PartnerTypeOption = {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  suitableForLabel: string;
  tags: string[];
};

export type Step3Content = {
  cardTitle: string;
  cardDescription: string;
  helperNote: string;
  options: PartnerTypeOption[];
  notSureBox: {
    title: string;
    description: string;
    link: string;
  };
  backButton: string;
  continueButton: string;
  panel: {
    benefitsTitle: string;
    benefits: string[];
    quote: QuoteContent;
    help: HelpPanelContent;
  };
};

export type CheckboxOption = {
  id: string;
  label: string;
};

export type CheckboxGroupContent = {
  label: string;
  options: CheckboxOption[];
  otherLabel: string;
  otherPlaceholder: string;
};

export type Step4Content = {
  cardTitle: string;
  cardDescription: string;
  customerSegments: CheckboxGroupContent;
  interestedProducts: CheckboxGroupContent;
  projectsPerYearLabel: string;
  projectsPerYearPlaceholder: string;
  projectsPerYearOptions: string[];
  avgProjectValueLabel: string;
  avgProjectValuePlaceholder: string;
  avgProjectValueOptions: string[];
  aboutBusinessLabel: string;
  aboutBusinessPlaceholder: string;
  backButton: string;
  continueButton: string;
  panel: {
    uploadTitle: string;
    uploadDescription: string;
    dropzoneLabel: string;
    dropzoneLink: string;
    dropzoneHint: string;
    tipTitle: string;
    tipDescription: string;
    consentTitle: string;
    consentAccurate: string;
    consentTerms: LinkedAgreementContent;
    consentContact: string;
  };
};

export type Step5Content = {
  cardTitle: string;
  cardDescription: string;
  sections: {
    account: string;
    company: string;
    partnerType: string;
    additional: string;
  };
  editLink: string;
  fields: {
    fullName: string;
    email: string;
    phone: string;
    companyNameTh: string;
    companyNameEn: string;
    taxId: string;
    businessType: string;
    website: string;
    companyPhone: string;
    address: string;
    customerSegments: string;
    interestedProducts: string;
    projectsPerYear: string;
    avgProjectValue: string;
    aboutBusiness: string;
  };
  notProvided: string;
  backButton: string;
  submitButton: string;
};

export type SuccessProgressContent = {
  submittedLabel: string;
  reviewingLabel: string;
  reviewingHint: string;
  approvedLabel: string;
  approvedHint: string;
  readyLabel: string;
  readyHint: string;
};

export type SuccessApplicationCardContent = {
  title: string;
  applicationNoLabel: string;
  copyLabel: string;
  copiedLabel: string;
  submittedAtLabel: string;
  applicantLabel: string;
  companyLabel: string;
  partnerTypeLabel: string;
  productsLabel: string;
  projectsPerYearLabel: string;
  avgProjectValueLabel: string;
};

export type SuccessContent = {
  thankYouLabel: string;
  title: string;
  description: string;
  imageAlt: string;
  progress: SuccessProgressContent;
  applicationCard: SuccessApplicationCardContent;
  viewDetailsLink: string;
  nextSteps: {
    title: string;
    items: string[];
  };
  help: HelpPanelContent & { contactButton: string };
  closingNote: string;
  loginButton: string;
};

export type PartnerPageContent = {
  sidebar: SidebarContent;
  breadcrumb: BreadcrumbContent;
  heading: string;
  subtitleStep1: string;
  subtitleDefault: string;
  stepper: StepperContent;
  step1: Step1Content;
  step2: Step2Content;
  step3: Step3Content;
  step4: Step4Content;
  step5: Step5Content;
  success: SuccessContent;
};
