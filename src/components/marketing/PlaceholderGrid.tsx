// Grid of `PlaceholderCard`s for an interior page's primary section. Pass
// `hrefs` (paired to `items` by index) to turn the cards into links into
// not-yet-built sub-pages; without it the cards are non-interactive.

import { PlaceholderCard } from "./PlaceholderCard";
import type { PlaceholderItem } from "./types";

type PlaceholderGridProps = {
  items: PlaceholderItem[];
  hrefs?: readonly string[];
  cta?: string;
  className?: string;
};

export function PlaceholderGrid({
  items,
  hrefs,
  cta,
  className = "grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
}: PlaceholderGridProps) {
  return (
    <div className={className}>
      {items.map((item, index) => {
        const href = hrefs?.[index];
        return (
          <PlaceholderCard
            key={item.title}
            item={item}
            href={href}
            cta={href ? cta : undefined}
          />
        );
      })}
    </div>
  );
}
