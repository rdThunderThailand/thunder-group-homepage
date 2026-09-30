import { Check } from "lucide-react";
import type { StepNumber } from "../types";

export function Progress({ step }: { step: StepNumber }) {
  return (
    <div className="mt-4 flex items-center" aria-label={`ขั้นตอนที่ ${step} จาก 4`}>
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex flex-1 items-center last:flex-none">
          <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${item <= step ? "bg-[#0866f5] text-white" : "bg-[#dce7f5] text-[#7590b4]"}`}>
            {item < step ? <Check size={14} /> : item}
          </span>
          {item < 4 && <span className={`h-0.5 flex-1 ${item < step ? "bg-[#0866f5]" : "bg-[#dce7f5]"}`} />}
        </div>
      ))}
    </div>
  );
}
