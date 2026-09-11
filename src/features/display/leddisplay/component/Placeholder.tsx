// Stand-in for artwork that has not been supplied yet: a dashed-border box with
// a faint centred image glyph. `tone` matches it to a light or dark section;
// `children` (positioned absolutely by the caller) carries any slogan overlay.

import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

type PlaceholderProps = {
  /** Sizing / aspect utilities — e.g. "aspect-[4/3]", "min-h-[16rem]". */
  className?: string;
  tone?: "light" | "dark";
  children?: ReactNode;
  src: StaticImageData;
  alt: string;
  sizes?: string;
};

export function Placeholder({
  className = "",
  tone = "light",
  children,
  src,
  alt,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: PlaceholderProps) {
  const dark = tone === "dark";
  return (
    <div
      className={
        "relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed " +
        (dark
          ? "border-white/20 bg-white/[0.04] text-white/25"
          : "border-slate-300 bg-slate-100 text-slate-300") +
        " " +
        className
      }
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      {children}
    </div>
  );
}
