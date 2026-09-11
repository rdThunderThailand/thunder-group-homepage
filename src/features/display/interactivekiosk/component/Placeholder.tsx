// Shared responsive image frame. Children can add copy or UI overlays.

import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

type PlaceholderProps = {
  /** Sizing / aspect utilities — e.g. "aspect-[4/3]", "min-h-[16rem]". */
  className?: string;
  tone?: "light" | "dark";
  src: StaticImageData;
  alt: string;
  sizes?: string;
  children?: ReactNode;
};

export function Placeholder({
  className = "",
  tone = "light",
  src,
  alt,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  children,
}: PlaceholderProps) {
  const dark = tone === "dark";
  return (
    <div
      className={
        "relative flex items-center justify-center overflow-hidden rounded-xl border " +
        (dark
          ? "border-white/20 bg-white/[0.04] text-white/30"
          : "border-slate-300 bg-slate-100 text-slate-400") +
        " " +
        className
      }
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      {children}
    </div>
  );
}
