// Small pull-quote card repeated on the side panel of steps 1-3.

import type { QuoteContent } from "../types";

type QuoteCardProps = {
  content: QuoteContent;
};

export function QuoteCard({ content }: QuoteCardProps) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4">
      <p className="text-3xl leading-none text-slate-300" aria-hidden="true">
        &ldquo;
      </p>
      <p className="-mt-2 text-sm font-medium italic leading-relaxed text-neutral-700">
        {content.text}
      </p>
      <p className="mt-3 text-xs font-semibold text-slate-400">{content.source}</p>
    </div>
  );
}
