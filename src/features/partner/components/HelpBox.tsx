// "Need help?" panel — phone + email — repeated on every step's side panel
// and again on the success screen.

import { HelpCircle, Mail, Phone } from "lucide-react";
import type { HelpPanelContent } from "../types";

type HelpBoxProps = {
  content: HelpPanelContent;
};

export function HelpBox({ content }: HelpBoxProps) {
  return (
    <div className="flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand">
        <HelpCircle className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-neutral-900">{content.title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{content.description}</p>
        <a
          href={`tel:${content.phone.replace(/\s+/g, "")}`}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-neutral-700 hover:text-brand"
        >
          <Phone className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          {content.phone}
        </a>
        <a
          href={`mailto:${content.email}`}
          className="mt-1 flex items-center gap-1.5 text-xs font-medium text-neutral-700 hover:text-brand"
        >
          <Mail className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          {content.email}
        </a>
      </div>
    </div>
  );
}
