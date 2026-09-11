"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown, Menu, Search, X, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** A top-level entry in the primary navigation. */
interface NavItem {
  /** Stable id — also the i18n key under `Navbar.nav.*`. */
  key: string;
  /** Path relative to the locale prefix. */
  href: string;
  /**
   * When true the entry opens a mega menu instead of navigating. The panel is
   * only a placeholder for now — see {@link MegaMenuPanel}.
   */
  hasMenu?: boolean;
}

const NAV_ITEMS: readonly NavItem[] = [
  { key: "whatWeDo", href: "/what-we-do" },
  { key: "solutions", href: "/solutions", hasMenu: true },
  { key: "businesses", href: "/businesses", hasMenu: true },
  { key: "projects", href: "/projects" },
  { key: "partners", href: "/partners" },
  { key: "insights", href: "/insights" },
  { key: "about", href: "/about" },
];

/** Distance scrolled before an `overlay` navbar switches to its solid style. */
const SOLID_AFTER_PX = 12;

export interface NavbarProps {
  /**
   * Start transparent with light text so the bar can sit over a dark hero,
   * then fade to the solid light style once the page is scrolled. Defaults to
   * `false` — solid from the first paint, which is safe on any page. A page
   * that renders a dark hero flush to the top (the Home page) should pass
   * `overlay` and pull its hero up under the bar with `-mt-16 lg:-mt-20` plus
   * matching top padding.
   */
  overlay?: boolean;
  className?: string;
}

export function Navbar({ overlay = false, className }: NavbarProps) {
  const t = useTranslations("Navbar");
  const tCommon = useTranslations("Common");

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Solid background when not an overlay, or once scrolled past the hero. When
  // `overlay` is false `scrolled` is irrelevant, so the effect below can skip
  // subscribing entirely.
  const solid = !overlay || scrolled;

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > SOLID_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // The bar lives in the persistent layout, so a stale open menu would survive
  // navigation — every link that leaves the current view calls `closeMenu`.
  const closeMenu = () => setOpenMenu(null);
  const closeMobile = () => setMobileOpen(false);

  // Close the desktop mega menu on an outside click or Escape.
  useEffect(() => {
    if (!openMenu) return;
    function onDocClick(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const hoverSurface = solid ? "hover:bg-black/6" : "hover:bg-white/10";
  const navItemBase = cx(
    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
    hoverSurface,
  );

  return (
    <header
      className={cx(
        "sticky top-0 z-50 transition-colors duration-300",
        solid
          ? "border-b border-black/5 bg-white/85 text-neutral-900 backdrop-blur-md supports-backdrop-filter:bg-white/75"
          : "border-b border-transparent bg-transparent text-white",
        className,
      )}
    >
      <nav
        ref={navRef}
        aria-label={t("primaryLabel")}
        className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-20 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label={t("brandHome")}
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <span
            className={cx(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
              solid ? "bg-neutral-900 text-white" : "bg-white/15 text-white",
            )}
          >
            <Zap
              className="h-5 w-5 fill-current"
              strokeWidth={0}
              aria-hidden="true"
            />
          </span>
          <span className="text-lg font-bold uppercase tracking-[0.2em]">
            {tCommon("wordmark")}
          </span>
        </Link>

        {/* Desktop primary nav */}
        <ul className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => {
            const label = t(`nav.${item.key}`);
            return (
              <li key={item.key} className="relative">
                {item.hasMenu ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu((current) =>
                          current === item.key ? null : item.key,
                        )
                      }
                      aria-haspopup="menu"
                      aria-expanded={openMenu === item.key}
                      className={cx(
                        navItemBase,
                        "flex items-center gap-1",
                        openMenu === item.key &&
                          (solid ? "bg-black/6" : "bg-white/10"),
                      )}
                    >
                      {label}
                      <ChevronDown
                        className={cx(
                          "h-4 w-4 transition-transform",
                          openMenu === item.key && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {openMenu === item.key && (
                      <MegaMenuPanel
                        label={t("menuPreview", { section: label })}
                      />
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={cx(navItemBase, "block")}
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Desktop actions */}
        <div className="ml-auto hidden items-center gap-1 lg:flex">
          <button
            type="button"
            aria-label={t("search")}
            className={cx("rounded-full p-2 transition-colors", hoverSurface)}
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>

          <LocaleSwitcher
            variant="menu"
            onDark={!solid}
            label={t("changeLanguage")}
          />

          <Link
            href="/contact"
            onClick={closeMenu}
            className={cx(
              "ml-1 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              solid
                ? "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100"
                : "border-white/40 bg-white text-neutral-900 hover:bg-white/90",
            )}
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label={t("openMenu")}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          className={cx(
            "ml-auto rounded-full p-2 transition-colors lg:hidden",
            hoverSurface,
          )}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-nav-drawer"
        className={cx(
          "fixed inset-0 z-60 lg:hidden",
          !mobileOpen && "pointer-events-none",
        )}
        inert={!mobileOpen}
      >
        <button
          type="button"
          tabIndex={mobileOpen ? 0 : -1}
          aria-label={t("closeMenu")}
          onClick={closeMobile}
          className={cx(
            "absolute inset-0 h-full w-full cursor-default bg-neutral-950/40 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("primaryLabel")}
          className={cx(
            "absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white text-neutral-900 shadow-xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4">
            <span className="text-lg font-bold uppercase tracking-[0.2em]">
              {tCommon("wordmark")}
            </span>
            <button
              type="button"
              onClick={closeMobile}
              aria-label={t("closeMenu")}
              className="rounded-full p-2 transition-colors hover:bg-black/6"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2">
            <ul className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => {
                const label = t(`nav.${item.key}`);
                return (
                  <li key={item.key}>
                    {item.hasMenu ? (
                      <details className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-black/4 [&::-webkit-details-marker]:hidden">
                          {label}
                          <ChevronDown
                            className="h-4 w-4 transition-transform group-open:rotate-180"
                            aria-hidden="true"
                          />
                        </summary>
                        <div className="px-3 pb-3 pt-1">
                          <p className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
                            {t("menuPreview", { section: label })}
                          </p>
                        </div>
                      </details>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeMobile}
                        className="block rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-black/4"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="shrink-0 space-y-3 border-t border-black/10 px-4 py-4">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-1 py-2 text-sm font-medium text-neutral-600"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              {t("search")}
            </button>

            <LocaleSwitcher
              variant="pills"
              label={t("changeLanguage")}
              onSelect={closeMobile}
            />

            <Link
              href="/contact"
              onClick={closeMobile}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-neutral-100"
            >
              {t("cta")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

interface MegaMenuPanelProps {
  label: string;
}

/**
 * Placeholder for the Solutions / Businesses mega menu. The trigger, open
 * state, outside-click handling and positioning are wired — drop the real
 * navigation grid in where the dashed box is when the content is ready.
 */
function MegaMenuPanel({ label }: MegaMenuPanelProps) {
  return (
    <div className="absolute left-1/2 top-full z-50 mt-3 w-[min(90vw,30rem)] -translate-x-1/2">
      <div className="rounded-2xl border border-black/10 bg-white p-3 text-neutral-900 shadow-xl">
        <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-8 text-center text-sm text-neutral-500">
          {label}
        </div>
      </div>
    </div>
  );
}
