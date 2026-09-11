// Small numbered label that sits above every section heading — "01  Start Here",
// "02  What We Build", and so on. `tone` flips it for the dark sections, and
// `number` is optional so interior route pages can use a label-only eyebrow.

type SectionEyebrowProps = {
  number?: string;
  label: string;
  tone?: "light" | "dark";
};

export function SectionEyebrow({
  number,
  label,
  tone = "light",
}: SectionEyebrowProps) {
  return (
    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em]">
      {number ? (
        <span className={tone === "dark" ? "text-white" : "text-neutral-900"}>
          {number}
        </span>
      ) : null}
      <span
        aria-hidden="true"
        className={
          tone === "dark" ? "h-px w-6 bg-white/30" : "h-px w-6 bg-slate-300"
        }
      />
      <span className={tone === "dark" ? "text-white/60" : "text-slate-400"}>
        {label}
      </span>
    </div>
  );
}
