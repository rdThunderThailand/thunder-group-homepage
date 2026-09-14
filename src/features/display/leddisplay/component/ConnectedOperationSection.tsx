// 9 · CONNECTED OPERATION — "From Visual Installation to Managed Experience."
// Light section, two columns on `lg`: eyebrow + heading + lead + a solid and an
// outline CTA on the left; a placeholder control-room image with a slogan
// overlay on the right. The solid CTA links to the existing
// `/display/digitalsignage` route.

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/marketing/SectionEyebrow";
import { Placeholder } from "./Placeholder";
import connectedOperation from "@/image/led-display/connected-operation/connected-operation.png";
import type { LedConnectedOperationContent } from "../../types/leddisplayTypes";

type ConnectedOperationSectionProps = {
  content: LedConnectedOperationContent;
};

export function ConnectedOperationSection({
  content,
}: ConnectedOperationSectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow label={content.label} />
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-[32px]">
              {content.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
              {content.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/display/digitalsignage"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
              >
                {content.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/businesses/thunderone"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:border-brand hover:text-brand"
              >
                {content.secondaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <Placeholder src={connectedOperation} alt={content.imageOverlay} tone="dark" className="aspect-[4/3] w-full">
            <p className="absolute inset-x-6 bottom-6 text-right text-xl font-bold uppercase leading-tight tracking-wide text-white/85 sm:text-2xl">
              {content.imageOverlay}
            </p>
          </Placeholder>
        </div>
      </div>
    </section>
  );
}
