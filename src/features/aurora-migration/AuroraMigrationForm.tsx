"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleCheckBig,
  Mail,
  Phone,
  Plus,
  User,
  X,
} from "lucide-react";
import liff from "@line/liff";
import { useEffect, useState } from "react";

const roles = [
  ["coordinator", "ผู้ประสานงาน / ผู้มีอำนาจตัดสินใจ", "ดูแลโครงการหรือติดต่อกับทีม THUNDER"],
  ["user", "ผู้ใช้งาน Aurora", "ใช้งานระบบจัดการ Content และ Schedule"],
  ["inspector", "ผู้ตรวจสอบหน้างาน", "ตรวจสอบ Player และสถานะการทำงาน"],
] as const;

const modules = ["Content", "Playlist", "Schedule", "Publish", "Screens", "Admin"];
const apiUrl = process.env.NEXT_PUBLIC_LINE_API_URL ?? "https://thundercrmlineoa.vercel.app";

type Form = {
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  roles: string[];
  modules: string[];
  sites: string[];
};

const initialForm: Form = {
  firstName: "",
  lastName: "",
  company: "",
  position: "",
  email: "",
  phone: "",
  roles: [],
  modules: [],
  sites: [],
};

async function submitRequest(form: Form, idToken: string) {
  const { company, ...fields } = form;
  const response = await fetch(`${apiUrl}/aurora-migration/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ ...fields, companyName: company }),
  });
  if (!response.ok) throw new Error("Request failed");

  const result = (await response.json()) as { referenceNo?: string };
  if (!result.referenceNo) throw new Error("Missing reference number");
  return result.referenceNo;
}

export function AuroraMigrationForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [site, setSite] = useState("");
  const [lineName, setLineName] = useState<string>();
  const [liffError, setLiffError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (!liffId) return;

    async function connectLine() {
      try {
        await liff.init({ liffId: liffId! });
        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }

        const profile = await liff.getProfile();
        setLineName(profile.displayName);
      } catch (error) {
        console.error("LIFF initialization failed", error);
        setLiffError(true);
      }
    }

    void connectLine();
  }, []);

  const update = (field: keyof Form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const toggle = (field: "roles" | "modules", value: string) =>
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));

  const addSite = () => {
    const value = site.trim();
    if (!value || form.sites.includes(value)) return;
    setForm((current) => ({ ...current, sites: [...current.sites, value] }));
    setSite("");
  };

  const canContinue =
    step === 1
      ? Boolean(form.firstName && form.lastName && form.company && form.email && form.phone)
      : step === 2
        ? form.roles.length > 0
        : step === 3
          ? form.modules.length > 0
          : true;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(false);

    if (step < 4) {
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    let idToken: string | null;
    try {
      idToken = liff.getIDToken();
    } catch {
      idToken = null;
    }
    if (!idToken) {
      setLiffError(true);
      return;
    }

    setSubmitting(true);
    try {
      setReferenceNo(await submitRequest(form, idToken));
      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Aurora migration submission failed", error);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#eef5ff] text-[#102c61]">
      <div className="mx-auto min-h-screen max-w-lg bg-white shadow-xl">
        <header className="sticky top-0 z-10 border-b border-[#dbe8f8] bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            {step > 1 && step < 5 ? (
              <button
                type="button"
                aria-label="ย้อนกลับ"
                onClick={() => setStep(step - 1)}
                className="grid size-10 place-items-center text-[#1769e8]"
              >
                <ArrowLeft size={22} />
              </button>
            ) : (
              <span className="grid size-10 place-items-center rounded-full bg-[#0c2f69] font-bold text-white">
                T
              </span>
            )}
            <div>
              <p className="text-sm font-bold text-[#1769e8]">THUNDER</p>
              <h1 className="text-lg font-bold">Aurora Migration</h1>
              {lineName && <p className="text-xs text-[#6b81a2]">LINE: {lineName}</p>}
            </div>
          </div>
          {step < 5 && <Progress step={step} />}
        </header>

        {liffError && (
          <p role="alert" className="mx-5 mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            ไม่สามารถเชื่อมต่อ LINE ได้ กรุณาปิดแล้วเปิดหน้านี้จาก LINE อีกครั้ง
          </p>
        )}

        <form
          className="space-y-6 px-5 py-6"
          onSubmit={handleSubmit}
        >
          {step === 1 && (
            <Step title="บอกเราว่าคุณคือใคร" subtitle="กรุณากรอกข้อมูลเพื่อให้ทีมงานติดต่อกลับ">
              <div className="grid grid-cols-2 gap-3">
                <Field icon={<User size={18} />} label="ชื่อ *" value={form.firstName} onChange={(value) => update("firstName", value)} />
                <Field label="นามสกุล *" value={form.lastName} onChange={(value) => update("lastName", value)} />
              </div>
              <Field icon={<Building2 size={18} />} label="บริษัท / องค์กร *" value={form.company} onChange={(value) => update("company", value)} />
              <Field label="ตำแหน่ง / หน้าที่" value={form.position} onChange={(value) => update("position", value)} />
              <Field icon={<Mail size={18} />} label="Work Email *" type="email" value={form.email} onChange={(value) => update("email", value)} />
              <Field icon={<Phone size={18} />} label="เบอร์โทรศัพท์ *" type="tel" value={form.phone} onChange={(value) => update("phone", value)} />
            </Step>
          )}

          {step === 2 && (
            <Step title="คุณเกี่ยวข้องกับ Aurora อย่างไร?" subtitle="เลือกได้มากกว่า 1 ข้อ">
              {roles.map(([value, title, description]) => (
                <Choice
                  key={value}
                  checked={form.roles.includes(value)}
                  title={title}
                  description={description}
                  onClick={() => toggle("roles", value)}
                />
              ))}
            </Step>
          )}

          {step === 3 && (
            <Step title="ข้อมูลการใช้งาน Aurora" subtitle="เลือกโมดูลและ Site ที่คุณใช้งาน">
              <fieldset>
                <legend className="mb-3 font-bold">โมดูลที่ใช้งาน</legend>
                <div className="grid grid-cols-2 gap-3">
                  {modules.map((item) => (
                    <Choice
                      key={item}
                      compact
                      checked={form.modules.includes(item)}
                      title={item}
                      onClick={() => toggle("modules", item)}
                    />
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-3 font-bold">Site ที่ดูแล</legend>
                <div className="flex flex-wrap gap-2">
                  {form.sites.map((item) => (
                    <span key={item} className="flex items-center gap-1 rounded-full bg-[#e9f2ff] px-3 py-2 text-sm font-semibold text-[#1769e8]">
                      {item}
                      <button
                        type="button"
                        aria-label={`ลบ ${item}`}
                        onClick={() => setForm((current) => ({ ...current, sites: current.sites.filter((value) => value !== item) }))}
                      >
                        <X size={15} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={site}
                    onChange={(event) => setSite(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSite();
                      }
                    }}
                    placeholder="เพิ่มชื่อ Site"
                    className="min-w-0 flex-1 rounded-lg border border-[#c9d9ee] px-4 py-3 outline-none focus:border-[#1769e8]"
                  />
                  <button type="button" onClick={addSite} aria-label="เพิ่ม Site" className="grid size-12 place-items-center rounded-lg bg-[#e9f2ff] text-[#1769e8]">
                    <Plus size={20} />
                  </button>
                </div>
              </fieldset>
            </Step>
          )}

          {step === 4 && (
            <Step title="ตรวจสอบข้อมูลของคุณ" subtitle="กรุณาตรวจสอบความถูกต้องก่อนส่ง">
              <Summary icon={<User size={19} />} label="ชื่อ - นามสกุล" value={`${form.firstName} ${form.lastName}`} />
              <Summary icon={<Building2 size={19} />} label="บริษัท / ตำแหน่ง" value={`${form.company} · ${form.position || "ไม่ระบุ"}`} />
              <Summary icon={<Mail size={19} />} label="Work Email" value={form.email} />
              <Summary icon={<Phone size={19} />} label="เบอร์โทรศัพท์" value={form.phone} />
              <Summary label="ความเกี่ยวข้องกับระบบ" value={form.roles.map((value) => roles.find(([key]) => key === value)?.[1]).join(", ")} />
              <Summary label="โมดูล / Site" value={`${form.modules.join(", ")} · ${form.sites.join(", ") || "ไม่ระบุ"}`} />
              <button type="button" onClick={() => setStep(1)} className="w-full rounded-lg border border-[#1769e8] py-3 font-bold text-[#1769e8]">
                แก้ไขข้อมูล
              </button>
            </Step>
          )}

          {step === 5 && (
            <section className="flex min-h-[65vh] flex-col items-center justify-center text-center">
              <CircleCheckBig size={76} className="text-[#16a765]" />
              <h2 className="mt-5 text-2xl font-bold">ส่งข้อมูลเรียบร้อยแล้ว</h2>
              <p className="mt-3 max-w-sm text-[#587096]">
                ขอบคุณที่ลงทะเบียนกับ THUNDER ทีมงานจะตรวจสอบข้อมูลและติดต่อกลับโดยเร็วที่สุด
              </p>
              <p className="mt-3 font-bold text-[#1769e8]">เลขอ้างอิง: {referenceNo}</p>
              <div className="mt-8 w-full rounded-lg bg-[#f2f7fd] p-5 text-left">
                <p className="font-bold">ขั้นตอนต่อไป</p>
                <ol className="mt-3 space-y-3 text-sm text-[#405a82]">
                  <li>1. ทีม THUNDER ตรวจสอบข้อมูล</li>
                  <li>2. ส่งคำเชิญเข้าใช้งาน ThunderOne</li>
                  <li>3. เปิดใช้งานบัญชีและตั้งค่า MFA</li>
                </ol>
              </div>
              <button type="button" onClick={() => { setForm(initialForm); setReferenceNo(""); setStep(1); }} className="mt-6 w-full rounded-lg border border-[#1769e8] py-3 font-bold text-[#1769e8]">
                กลับสู่หน้าแรก
              </button>
            </section>
          )}

          {step < 5 && (
            <>
              {submitError && (
                <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
                </p>
              )}
              <button
                type="submit"
                disabled={!canContinue || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0866f5] py-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-[#a9bdd8]"
              >
                {submitting ? "กำลังส่ง..." : step === 4 ? "ส่งข้อมูล" : "ถัดไป"}
                {!submitting && (step === 4 ? <Check size={20} /> : <ArrowRight size={20} />)}
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}

function Progress({ step }: { step: number }) {
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

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
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

function Field({ label, value, onChange, icon, type = "text" }: { label: string; value: string; onChange: (value: string) => void; icon?: React.ReactNode; type?: string }) {
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

function Choice({ checked, title, description, onClick, compact = false }: { checked: boolean; title: string; description?: string; onClick: () => void; compact?: boolean }) {
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

function Summary({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
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
