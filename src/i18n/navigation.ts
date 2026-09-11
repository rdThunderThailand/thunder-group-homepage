import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware replacements for `next/link` and `next/navigation`. A later
// language switcher uses `usePathname`/`useRouter` from here to swap the locale
// prefix while staying on the current page.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
