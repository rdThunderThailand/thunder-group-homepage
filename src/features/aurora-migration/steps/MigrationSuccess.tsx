import { CircleCheckBig } from "lucide-react";

export function MigrationSuccess({ referenceNo, onReset }: { referenceNo: string; onReset: () => void }) {
  return (
    <section className="flex min-h-[65vh] flex-col items-center justify-center text-center">
      <CircleCheckBig size={76} className="text-[#16a765]" />
      <h2 className="mt-5 text-2xl font-bold">ส่งข้อมูลเรียบร้อยแล้ว</h2>
      <p className="mt-3 max-w-sm text-[#587096]">ขอบคุณที่ลงทะเบียนกับ THUNDER ทีมงานจะตรวจสอบข้อมูลและติดต่อกลับโดยเร็วที่สุด</p>
      <p className="mt-3 font-bold text-[#1769e8]">เลขอ้างอิง: {referenceNo}</p>
      <div className="mt-8 w-full rounded-lg bg-[#f2f7fd] p-5 text-left">
        <p className="font-bold">ขั้นตอนต่อไป</p>
        <ol className="mt-3 space-y-3 text-sm text-[#405a82]">
          <li>1. ทีม THUNDER ตรวจสอบข้อมูล</li>
          <li>2. ส่งคำเชิญเข้าใช้งาน ThunderOne</li>
          <li>3. เปิดใช้งานบัญชีและตั้งค่า MFA</li>
        </ol>
      </div>
      <button type="button" onClick={onReset} className="mt-6 w-full rounded-lg border border-[#1769e8] py-3 font-bold text-[#1769e8]">กลับสู่หน้าแรก</button>
    </section>
  );
}
