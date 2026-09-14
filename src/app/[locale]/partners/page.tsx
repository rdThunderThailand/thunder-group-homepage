import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PartnerClient } from "@/features/partner/partnerClient";
import type { Locale } from "@/i18n/routing";
import type {
  CheckboxOption,
  PartnerTypeOption,
  SidebarHighlight,
} from "@/features/partner/types";

// Partner Registration page ("สมัครเป็น Thunder Partner"). `Navbar` and
// `Footer` wrap every route from `src/app/[locale]/layout.tsx`, so
// `PartnerClient` renders only the body. Per the project's i18n split, every
// string is resolved here on the server (the `PartnerProgramPage` namespace)
// and handed to the Client Component as plain props — it never calls
// `useTranslations`.

const NAMESPACE = "PartnerProgramPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NAMESPACE });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PartnerRegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations(NAMESPACE);
  const helpPanel = (prefix: string) => ({
    title: t(`${prefix}.title`),
    description: t(`${prefix}.description`),
    phoneLabel: t(`${prefix}.phoneLabel`),
    phone: t(`${prefix}.phone`),
    emailLabel: t(`${prefix}.emailLabel`),
    email: t(`${prefix}.email`),
  });
  const quote = (prefix: string) => ({
    text: t(`${prefix}.text`),
    source: t(`${prefix}.source`),
  });
  const agreement = (prefix: string) => ({
    prefix: t(`${prefix}.prefix`),
    termsLink: t(`${prefix}.termsLink`),
    middle: t(`${prefix}.middle`),
    privacyLink: t(`${prefix}.privacyLink`),
    suffix: t(`${prefix}.suffix`),
  });

  return (
    <PartnerClient
      locale={locale as Locale}
      content={{
        sidebar: {
          label: t("sidebar.label"),
          titleLine1: t("sidebar.titleLine1"),
          titleLine2: t("sidebar.titleLine2"),
          subtitle: t("sidebar.subtitle"),
          description: t("sidebar.description"),
          highlights: t.raw("sidebar.highlights") as SidebarHighlight[],
          imageAlt: t("sidebar.imageAlt"),
          steps: {
            step1: {
              overlayText: t("sidebar.steps.step1.overlayText"),
              captionLine1: t("sidebar.steps.step1.captionLine1"),
              captionLine2: t("sidebar.steps.step1.captionLine2"),
            },
            step2: {
              overlayText: t("sidebar.steps.step2.overlayText"),
              captionLine1: t("sidebar.steps.step2.captionLine1"),
              captionLine2: t("sidebar.steps.step2.captionLine2"),
            },
            step3: {
              overlayText: t("sidebar.steps.step3.overlayText"),
              captionLine1: t("sidebar.steps.step3.captionLine1"),
              captionLine2: t("sidebar.steps.step3.captionLine2"),
            },
            step4: {
              overlayText: t("sidebar.steps.step4.overlayText"),
              captionLine1: t("sidebar.steps.step4.captionLine1"),
              captionLine2: t("sidebar.steps.step4.captionLine2"),
            },
            step5: {
              overlayText: t("sidebar.steps.step5.overlayText"),
              captionLine1: t("sidebar.steps.step5.captionLine1"),
              captionLine2: t("sidebar.steps.step5.captionLine2"),
            },
            success: {
              overlayText: t("sidebar.steps.success.overlayText"),
              captionLine1: t("sidebar.steps.success.captionLine1"),
              captionLine2: t("sidebar.steps.success.captionLine2"),
            },
          },
        },
        breadcrumb: {
          home: t("breadcrumb.home"),
          partnerProgram: t("breadcrumb.partnerProgram"),
          register: t("breadcrumb.register"),
          applicationReceived: t("breadcrumb.applicationReceived"),
        },
        heading: t("heading"),
        subtitleStep1: t("subtitleStep1"),
        subtitleDefault: t("subtitleDefault"),
        stepper: {
          labels: t.raw("stepper.labels") as [string, string, string, string, string],
        },
        step1: {
          cardTitle: t("step1.cardTitle"),
          cardDescription: t("step1.cardDescription"),
          form: {
            firstNameLabel: t("step1.form.firstNameLabel"),
            firstNamePlaceholder: t("step1.form.firstNamePlaceholder"),
            lastNameLabel: t("step1.form.lastNameLabel"),
            lastNamePlaceholder: t("step1.form.lastNamePlaceholder"),
            emailLabel: t("step1.form.emailLabel"),
            emailPlaceholder: t("step1.form.emailPlaceholder"),
            emailHelper: t("step1.form.emailHelper"),
            phoneLabel: t("step1.form.phoneLabel"),
            phonePlaceholder: t("step1.form.phonePlaceholder"),
            passwordLabel: t("step1.form.passwordLabel"),
            passwordPlaceholder: t("step1.form.passwordPlaceholder"),
            passwordHelper: t("step1.form.passwordHelper"),
            showPasswordLabel: t("step1.form.showPasswordLabel"),
            hidePasswordLabel: t("step1.form.hidePasswordLabel"),
            agreement: agreement("step1.form.agreement"),
            continueButton: t("step1.form.continueButton"),
            loginPrompt: t("step1.form.loginPrompt"),
            loginLink: t("step1.form.loginLink"),
          },
          panel: {
            confidentialTitle: t("step1.panel.confidentialTitle"),
            confidentialDescription: t("step1.panel.confidentialDescription"),
            help: helpPanel("step1.panel.help"),
            quote: quote("step1.panel.quote"),
          },
        },
        step2: {
          cardTitle: t("step2.cardTitle"),
          cardDescription: t("step2.cardDescription"),
          form: {
            nameThLabel: t("step2.form.nameThLabel"),
            nameThPlaceholder: t("step2.form.nameThPlaceholder"),
            nameEnLabel: t("step2.form.nameEnLabel"),
            nameEnPlaceholder: t("step2.form.nameEnPlaceholder"),
            taxIdLabel: t("step2.form.taxIdLabel"),
            taxIdPlaceholder: t("step2.form.taxIdPlaceholder"),
            businessTypeLabel: t("step2.form.businessTypeLabel"),
            businessTypePlaceholder: t("step2.form.businessTypePlaceholder"),
            businessTypeOptions: t.raw("step2.form.businessTypeOptions") as string[],
            websiteLabel: t("step2.form.websiteLabel"),
            websiteOptionalTag: t("step2.form.websiteOptionalTag"),
            websitePlaceholder: t("step2.form.websitePlaceholder"),
            phoneLabel: t("step2.form.phoneLabel"),
            phonePlaceholder: t("step2.form.phonePlaceholder"),
            addressLabel: t("step2.form.addressLabel"),
            addressPlaceholder: t("step2.form.addressPlaceholder"),
            provinceLabel: t("step2.form.provinceLabel"),
            provincePlaceholder: t("step2.form.provincePlaceholder"),
            provinceOptions: t.raw("step2.form.provinceOptions") as string[],
            districtLabel: t("step2.form.districtLabel"),
            districtPlaceholder: t("step2.form.districtPlaceholder"),
            districtOptions: t.raw("step2.form.districtOptions") as string[],
            postalCodeLabel: t("step2.form.postalCodeLabel"),
            postalCodePlaceholder: t("step2.form.postalCodePlaceholder"),
          },
          backButton: t("step2.backButton"),
          continueButton: t("step2.continueButton"),
          panel: {
            confidentialTitle: t("step2.panel.confidentialTitle"),
            confidentialDescription: t("step2.panel.confidentialDescription"),
            documentsBoxTitle: t("step2.panel.documentsBoxTitle"),
            documentsBoxDescription: t("step2.panel.documentsBoxDescription"),
            help: helpPanel("step2.panel.help"),
            quote: quote("step2.panel.quote"),
          },
        },
        step3: {
          cardTitle: t("step3.cardTitle"),
          cardDescription: t("step3.cardDescription"),
          helperNote: t("step3.helperNote"),
          options: t.raw("step3.options") as PartnerTypeOption[],
          notSureBox: {
            title: t("step3.notSureBox.title"),
            description: t("step3.notSureBox.description"),
            link: t("step3.notSureBox.link"),
          },
          backButton: t("step3.backButton"),
          continueButton: t("step3.continueButton"),
          panel: {
            benefitsTitle: t("step3.panel.benefitsTitle"),
            benefits: t.raw("step3.panel.benefits") as string[],
            quote: quote("step3.panel.quote"),
            help: helpPanel("step3.panel.help"),
          },
        },
        step4: {
          cardTitle: t("step4.cardTitle"),
          cardDescription: t("step4.cardDescription"),
          customerSegments: {
            label: t("step4.customerSegments.label"),
            options: t.raw("step4.customerSegments.options") as CheckboxOption[],
            otherLabel: t("step4.customerSegments.otherLabel"),
            otherPlaceholder: t("step4.customerSegments.otherPlaceholder"),
          },
          interestedProducts: {
            label: t("step4.interestedProducts.label"),
            options: t.raw("step4.interestedProducts.options") as CheckboxOption[],
            otherLabel: t("step4.interestedProducts.otherLabel"),
            otherPlaceholder: t("step4.interestedProducts.otherPlaceholder"),
          },
          projectsPerYearLabel: t("step4.projectsPerYearLabel"),
          projectsPerYearPlaceholder: t("step4.projectsPerYearPlaceholder"),
          projectsPerYearOptions: t.raw("step4.projectsPerYearOptions") as string[],
          avgProjectValueLabel: t("step4.avgProjectValueLabel"),
          avgProjectValuePlaceholder: t("step4.avgProjectValuePlaceholder"),
          avgProjectValueOptions: t.raw("step4.avgProjectValueOptions") as string[],
          aboutBusinessLabel: t("step4.aboutBusinessLabel"),
          aboutBusinessPlaceholder: t("step4.aboutBusinessPlaceholder"),
          backButton: t("step4.backButton"),
          continueButton: t("step4.continueButton"),
          panel: {
            uploadTitle: t("step4.panel.uploadTitle"),
            uploadDescription: t("step4.panel.uploadDescription"),
            dropzoneLabel: t("step4.panel.dropzoneLabel"),
            dropzoneLink: t("step4.panel.dropzoneLink"),
            dropzoneHint: t("step4.panel.dropzoneHint"),
            tipTitle: t("step4.panel.tipTitle"),
            tipDescription: t("step4.panel.tipDescription"),
            consentTitle: t("step4.panel.consentTitle"),
            consentAccurate: t("step4.panel.consentAccurate"),
            consentTerms: agreement("step4.panel.consentTerms"),
            consentContact: t("step4.panel.consentContact"),
          },
        },
        step5: {
          cardTitle: t("step5.cardTitle"),
          cardDescription: t("step5.cardDescription"),
          sections: {
            account: t("step5.sections.account"),
            company: t("step5.sections.company"),
            partnerType: t("step5.sections.partnerType"),
            additional: t("step5.sections.additional"),
          },
          editLink: t("step5.editLink"),
          fields: {
            fullName: t("step5.fields.fullName"),
            email: t("step5.fields.email"),
            phone: t("step5.fields.phone"),
            companyNameTh: t("step5.fields.companyNameTh"),
            companyNameEn: t("step5.fields.companyNameEn"),
            taxId: t("step5.fields.taxId"),
            businessType: t("step5.fields.businessType"),
            website: t("step5.fields.website"),
            companyPhone: t("step5.fields.companyPhone"),
            address: t("step5.fields.address"),
            customerSegments: t("step5.fields.customerSegments"),
            interestedProducts: t("step5.fields.interestedProducts"),
            projectsPerYear: t("step5.fields.projectsPerYear"),
            avgProjectValue: t("step5.fields.avgProjectValue"),
            aboutBusiness: t("step5.fields.aboutBusiness"),
          },
          notProvided: t("step5.notProvided"),
          backButton: t("step5.backButton"),
          submitButton: t("step5.submitButton"),
        },
        success: {
          thankYouLabel: t("success.thankYouLabel"),
          title: t("success.title"),
          description: t("success.description"),
          imageAlt: t("success.imageAlt"),
          progress: {
            submittedLabel: t("success.progress.submittedLabel"),
            reviewingLabel: t("success.progress.reviewingLabel"),
            reviewingHint: t("success.progress.reviewingHint"),
            approvedLabel: t("success.progress.approvedLabel"),
            approvedHint: t("success.progress.approvedHint"),
            readyLabel: t("success.progress.readyLabel"),
            readyHint: t("success.progress.readyHint"),
          },
          applicationCard: {
            title: t("success.applicationCard.title"),
            applicationNoLabel: t("success.applicationCard.applicationNoLabel"),
            copyLabel: t("success.applicationCard.copyLabel"),
            copiedLabel: t("success.applicationCard.copiedLabel"),
            submittedAtLabel: t("success.applicationCard.submittedAtLabel"),
            applicantLabel: t("success.applicationCard.applicantLabel"),
            companyLabel: t("success.applicationCard.companyLabel"),
            partnerTypeLabel: t("success.applicationCard.partnerTypeLabel"),
            productsLabel: t("success.applicationCard.productsLabel"),
            projectsPerYearLabel: t("success.applicationCard.projectsPerYearLabel"),
            avgProjectValueLabel: t("success.applicationCard.avgProjectValueLabel"),
          },
          viewDetailsLink: t("success.viewDetailsLink"),
          nextSteps: {
            title: t("success.nextSteps.title"),
            items: t.raw("success.nextSteps.items") as string[],
          },
          help: {
            ...helpPanel("success.help"),
            contactButton: t("success.help.contactButton"),
          },
          closingNote: t("success.closingNote"),
          loginButton: t("success.loginButton"),
        },
      }}
    />
  );
}
