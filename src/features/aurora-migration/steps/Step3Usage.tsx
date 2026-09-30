import { Plus, X } from "lucide-react";
import type { KeyboardEvent } from "react";
import { Choice, Step } from "../components/FormControls";
import { moduleOptions } from "../types";

type Props = {
  modules: string[];
  sites: string[];
  siteInput: string;
  onToggleModule: (value: string) => void;
  onSiteInputChange: (value: string) => void;
  onAddSite: () => void;
  onRemoveSite: (value: string) => void;
};

export function Step3Usage({ modules, sites, siteInput, onToggleModule, onSiteInputChange, onAddSite, onRemoveSite }: Props) {
  const addSiteOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    onAddSite();
  };

  return (
    <Step title="ข้อมูลการใช้งาน Aurora" subtitle="เลือกโมดูลและ Site ที่คุณใช้งาน">
      <fieldset>
        <legend className="mb-3 font-bold">โมดูลที่ใช้งาน</legend>
        <div className="grid grid-cols-2 gap-3">
          {moduleOptions.map((item) => (
            <Choice key={item} compact checked={modules.includes(item)} title={item} onClick={() => onToggleModule(item)} />
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 font-bold">Site ที่ดูแล</legend>
        <div className="flex flex-wrap gap-2">
          {sites.map((item) => (
            <span key={item} className="flex items-center gap-1 rounded-full bg-[#e9f2ff] px-3 py-2 text-sm font-semibold text-[#1769e8]">
              {item}
              <button type="button" aria-label={`ลบ ${item}`} onClick={() => onRemoveSite(item)}><X size={15} /></button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={siteInput} onChange={(event) => onSiteInputChange(event.target.value)} onKeyDown={addSiteOnEnter} placeholder="เพิ่มชื่อ Site" className="min-w-0 flex-1 rounded-lg border border-[#c9d9ee] px-4 py-3 outline-none focus:border-[#1769e8]" />
          <button type="button" onClick={onAddSite} aria-label="เพิ่ม Site" className="grid size-12 place-items-center rounded-lg bg-[#e9f2ff] text-[#1769e8]"><Plus size={20} /></button>
        </div>
      </fieldset>
    </Step>
  );
}
