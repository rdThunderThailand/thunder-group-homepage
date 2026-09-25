import { Check } from "lucide-react";
import type { ReactNode } from "react";

export function Step({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-[#6b81a2]">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export function Field({ label, value, onChange, icon, type = "text" }: { label: string; value: string; onChange: (value: string) => void; icon?: ReactNode; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <span className="flex items-center gap-2 rounded-lg border border-[#c9d9ee] px-3 focus-within:border-[#1769e8]">
        {icon && <span className="text-[#1769e8]">{icon}</span>}
        <input required={label.endsWith("*")} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent py-3 outline-none" />
      </span>
    </label>
  );
}

export function Choice({ checked, title, description, onClick, compact = false }: { checked: boolean; title: string; description?: string; onClick: () => void; compact?: boolean }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left ${checked ? "border-[#1769e8] bg-[#eaf3ff]" : "border-[#d5e0ef] bg-white"} ${compact ? "min-h-14 items-center" : "min-h-20"}`}
    >
      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded border ${checked ? "border-[#1769e8] bg-[#1769e8] text-white" : "border-[#9eb1ca]"}`}>
        {checked && <Check size={14} />}
      </span>
      <span>
        <span className="block font-bold">{title}</span>
        {description && <span className="mt-1 block text-sm text-[#6b81a2]">{description}</span>}
      </span>
    </button>
  );
}

export function Summary({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-[#e3ebf5] pb-4">
      {icon && <span className="mt-1 text-[#1769e8]">{icon}</span>}
      <div>
        <p className="text-sm text-[#7a8eaa]">{label}</p>
        <p className="mt-1 font-semibold">{value}</p>
      </div>
    </div>
  );
}
