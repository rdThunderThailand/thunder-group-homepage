import { Building2, Mail, Phone, User } from "lucide-react";
import { Field, Step } from "../components/FormControls";
import type { AuroraMigrationData, TextField } from "../types";

export function Step1Identity({ value, onChange }: { value: AuroraMigrationData; onChange: (field: TextField, value: string) => void }) {
  return (
    <Step title="บอกเราว่าคุณคือใคร" subtitle="กรุณากรอกข้อมูลเพื่อให้ทีมงานติดต่อกลับ">
      <div className="grid grid-cols-2 gap-3">
        <Field icon={<User size={18} />} label="ชื่อ *" value={value.firstName} onChange={(text) => onChange("firstName", text)} />
        <Field label="นามสกุล *" value={value.lastName} onChange={(text) => onChange("lastName", text)} />
      </div>
      <Field icon={<Building2 size={18} />} label="บริษัท / องค์กร *" value={value.company} onChange={(text) => onChange("company", text)} />
      <Field label="ตำแหน่ง / หน้าที่" value={value.position} onChange={(text) => onChange("position", text)} />
      <Field icon={<Mail size={18} />} label="Work Email *" type="email" value={value.email} onChange={(text) => onChange("email", text)} />
      <Field icon={<Phone size={18} />} label="เบอร์โทรศัพท์ *" type="tel" value={value.phone} onChange={(text) => onChange("phone", text)} />
    </Step>
  );
}
