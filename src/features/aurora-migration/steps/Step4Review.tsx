import { Building2, Mail, Phone, User } from "lucide-react";
import { Step, Summary } from "../components/FormControls";
import { roleOptions, type AuroraMigrationData } from "../types";

export function Step4Review({ value, onEdit }: { value: AuroraMigrationData; onEdit: () => void }) {
  const roleLabels = value.roles.map((role) => roleOptions.find(([key]) => key === role)?.[1]).join(", ");

  return (
    <Step title="ตรวจสอบข้อมูลของคุณ" subtitle="กรุณาตรวจสอบความถูกต้องก่อนส่ง">
      <Summary icon={<User size={19} />} label="ชื่อ - นามสกุล" value={`${value.firstName} ${value.lastName}`} />
      <Summary icon={<Building2 size={19} />} label="บริษัท / ตำแหน่ง" value={`${value.company} · ${value.position || "ไม่ระบุ"}`} />
      <Summary icon={<Mail size={19} />} label="Work Email" value={value.email} />
      <Summary icon={<Phone size={19} />} label="เบอร์โทรศัพท์" value={value.phone} />
      <Summary label="ความเกี่ยวข้องกับระบบ" value={roleLabels} />
      <Summary label="โมดูล / Site" value={`${value.modules.join(", ")} · ${value.sites.join(", ") || "ไม่ระบุ"}`} />
      <button type="button" onClick={onEdit} className="w-full rounded-lg border border-[#1769e8] py-3 font-bold text-[#1769e8]">แก้ไขข้อมูล</button>
    </Step>
  );
}
