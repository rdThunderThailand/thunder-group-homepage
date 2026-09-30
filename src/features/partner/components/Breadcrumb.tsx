// Text breadcrumb for the content column — "Home > Partner Program >
// Register", with an optional trailing crumb for the success screen
// ("> Application Received").

import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type BreadcrumbProps = {
  items: string[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label={items[items.length - 1]}
      className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400"
    >
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        return (
          <span key={item} className="flex items-center gap-2">
            {isFirst ? (
              <Link href="/" className="transition-colors hover:text-brand">
                {item}
              </Link>
            ) : (
              <span className={isLast ? "text-slate-600" : undefined}>
                {item}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
