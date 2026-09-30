// Renders a "I accept [Terms] and [Privacy Policy]" sentence from plain-string
// parts (see `LinkedAgreementContent`) so the client tree never needs a
// rich-text translation call — the two bracketed spans are real links.

import { Link } from "@/i18n/navigation";
import type { LinkedAgreementContent } from "../types";

type LinkedAgreementProps = {
  content: LinkedAgreementContent;
};

export function LinkedAgreement({ content }: LinkedAgreementProps) {
  return (
    <span>
      {content.prefix}{" "}
      <Link href="/terms" className="font-medium text-brand hover:underline">
        {content.termsLink}
      </Link>{" "}
      {content.middle}{" "}
      <Link href="/privacy" className="font-medium text-brand hover:underline">
        {content.privacyLink}
      </Link>{" "}
      {content.suffix}
    </span>
  );
}
