// A single card for the interior pages' placeholder grids: a dashed image slot,
// a title and a short description. Pass `href` to make it a link into a
// (not-yet-built) sub-page; pass `cta` to show the "Learn more" affordance.

import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { PlaceholderItem } from "./types";

type PlaceholderCardProps = {
  item: PlaceholderItem;
  /** Locale-relative path. When omitted the card is non-interactive. */
  href?: string;
  cta?: string;
};

export function PlaceholderCard({ item, href, cta }: PlaceholderCardProps) {
  const inner = (
    <>
      {/* Image placeholder */}
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 text-slate-300">
        <ImageIcon className="h-8 w-8" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-neutral-900">
        {item.title}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">
        {item.description}
      </p>
      {cta ? (
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors group-hover:text-brand-strong">
          {cta}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="group flex flex-col">
        {inner}
      </Link>
    );
  }
  return <div className="flex flex-col">{inner}</div>;
}
