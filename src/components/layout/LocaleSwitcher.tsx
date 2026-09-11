"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronDown, Globe } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/** Short label shown for each locale. Locale codes, not translatable copy. */
const LOCALE_LABEL: Record<Locale, string> = { th: "TH", en: "EN" };

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export type LocaleSwitcherVariant = "menu" | "pills" | "inline";

export interface LocaleSwitcherProps {
  /**
   * Visual treatment:
   * - `menu` — globe button that opens a dropdown (desktop navbar)
   * - `pills` — a row of toggle buttons (mobile drawer)
   * - `inline` — plain text links (footer)
   */
  variant?: LocaleSwitcherVariant;
  /** `menu` only: render light-on-dark for a transparent navbar over a hero. */
  onDark?: boolean;
  /** Accessible label for the control / group. */
  label: string;
  /** Called after a locale is chosen — e.g. to close a mobile drawer. */
  onSelect?: () => void;
  className?: string;
}

/**
 * Swaps the locale prefix while keeping the visitor on the current page.
 * `usePathname()` from `@/i18n/navigation` returns the path without the prefix,
 * and next-intl's `<Link locale>` re-adds the target one (and records the
 * choice in the `NEXT_LOCALE` cookie).
 */
export function LocaleSwitcher({
  variant = "menu",
  onDark = false,
  label,
  onSelect,
  className,
}: LocaleSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  if (variant === "inline") {
    return (
      <div
        className={cx("flex items-center", className)}
        role="group"
        aria-label={label}
      >
        {routing.locales.map((loc, index) => (
          <span key={loc} className="inline-flex items-center">
            {index > 0 && (
              <span aria-hidden="true" className="mx-1.5 opacity-40">
                /
              </span>
            )}
            <Link
              href={pathname}
              locale={loc}
              onClick={onSelect}
              aria-current={loc === locale ? "true" : undefined}
              className={cx(
                "text-xs font-medium uppercase transition-colors",
                loc === locale
                  ? "text-white"
                  : "text-neutral-400 hover:text-white",
              )}
            >
              {LOCALE_LABEL[loc]}
            </Link>
          </span>
        ))}
      </div>
    );
  }

  if (variant === "pills") {
    return (
      <div
        className={cx("flex items-center gap-2", className)}
        role="group"
        aria-label={label}
      >
        <Globe className="h-4 w-4 text-neutral-500" aria-hidden="true" />
        {routing.locales.map((loc) => (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            onClick={onSelect}
            aria-current={loc === locale ? "true" : undefined}
            className={cx(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              loc === locale
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
            )}
          >
            {LOCALE_LABEL[loc]}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <MenuVariant
      onDark={onDark}
      label={label}
      locale={locale}
      pathname={pathname}
      onSelect={onSelect}
      className={className}
    />
  );
}

interface MenuVariantProps {
  onDark: boolean;
  label: string;
  locale: Locale;
  pathname: string;
  onSelect?: () => void;
  className?: string;
}

function MenuVariant({
  onDark,
  label,
  locale,
  pathname,
  onSelect,
  className,
}: MenuVariantProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cx("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cx(
          "flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
          onDark
            ? "text-white hover:bg-white/10"
            : "text-neutral-800 hover:bg-black/[0.06]",
        )}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        {LOCALE_LABEL[locale]}
        <ChevronDown
          className={cx(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-32 overflow-hidden rounded-xl border border-black/10 bg-white p-1 text-neutral-900 shadow-lg"
        >
          {routing.locales.map((loc) => (
            <li key={loc} role="none">
              <Link
                href={pathname}
                locale={loc}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onSelect?.();
                }}
                aria-current={loc === locale ? "true" : undefined}
                className={cx(
                  "block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-neutral-100",
                  loc === locale ? "font-semibold" : "font-normal",
                )}
              >
                {LOCALE_LABEL[loc]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
