# Partner Web — Flow การสมัครเป็น Thunder Partner

สรุป flow ของหน้า "สมัครเป็น Thunder Partner" (`/partners`) ฝั่ง Partner Web — ตั้งแต่
ผู้ใช้เปิดหน้าเว็บ กรอกฟอร์ม 5 ขั้นตอน จนถึง submit, การส่งต่อไปเชื่อม LINE Service
เบื้องหลัง และหน้าสำเร็จ ใช้ประกอบกับ
[`partner_web_api_contract.md`](../partner_web_api_contract.md) (contract การเชื่อมกับ
LINE Service), [`PARTNER_WEB_TENANT_USER_HANDOFF.md`](../PARTNER_WEB_TENANT_USER_HANDOFF%20(1).md)
(คำตอบเรื่อง tenant/user จากทีม ThunderCore) และ
[`partner_tenant_creation_open_item.md`](./partner_tenant_creation_open_item.md) (ประวัติ
ข้อจำกัดเรื่อง tenant/user ก่อนจะได้คำตอบ)

## สรุป: มีการยิง API อะไรบ้าง เพราะอะไร

รวมทุก API call ที่เกิดขึ้นทั้ง flow ไว้ที่เดียว (รายละเอียดแต่ละอันอยู่ในหัวข้อถัดไป) เรียง
ตามลำดับเวลาที่เกิดจริง:

| # | จาก → ไป | API | เพราะอะไร |
| --- | --- | --- | --- |
| 1 | Browser → Partner Web | `POST /api/partner/applications` | ผู้ใช้กด submit ที่ step 5 — ส่งข้อมูลฟอร์มทั้ง 4 step ไปบันทึกเป็นใบสมัคร |
| 2 | Partner Web → Supabase Auth Admin | `auth.admin.generateLink({ type: "magiclink" })` | หา auth user จาก email หรือสร้างใหม่ถ้ายังไม่มี — ต้องมี user id ก่อนเรียก RPC ข้อ 3 (Step 1 ไม่เก็บ password แล้ว จึงสร้าง user แบบไม่มี password ด้วยวิธีนี้แทน) |
| 3 | Partner Web → Supabase RPC | `submit_partner_application` | บันทึกใบสมัครจริงลง `thunder_partner.applications` + สร้าง/ยืนยัน `tenant`/`user`/`membership` ใน ThunderCore + enqueue คิว `application_callback` เสมอ และ `token_exchange` ด้วยถ้าเป็นสาย LINE-first |
| 4 | Vercel Cron → Partner Web | `GET /api/cron/deliver-line-calls` (ทุก 1 นาที) | trigger worker ให้ไปเช็คคิวที่ถึงกำหนดส่งและยิงต่อไปหา LINE Service — แยกออกจาก request ของผู้ใช้ตั้งใจ กันผู้ใช้ต้องรอ third-party call ตอน submit |
| 5 | Partner Web (cron) → Supabase RPC | `claim_due_line_calls` | ดึง+lock แถวคิวที่ถึงกำหนดส่ง (สูงสุด 20 แถว/รอบ) กันแถวเดียวถูกส่งซ้ำถ้า cron ทับซ้อนกัน |
| 6 | Partner Web (cron) → LINE Service | `POST /callbacks/partner` | แจ้งสถานะใบสมัคร (PENDING ตอน submit, แล้วทุกครั้งที่สถานะเปลี่ยนภายหลัง) ให้ LINE Service เก็บ reference ไว้ผูกกับ LINE identity/Rich Menu/แจ้งเตือน |
| 7 | Partner Web (cron) → LINE Service | `POST /partner/token/exchange` | เฉพาะสาย LINE-first — แลก token จาก `?t=` เพื่อยืนยันว่าใบสมัครนี้มาจาก LINE user คนไหน |
| 8 | Partner Web (cron) → LINE Service | `POST /partner/link-token` | เฉพาะสาย Web-first และต้องรออนุมัติก่อน — ขอ token ให้ผู้สมัครพิมพ์ `LINK <token>` ใน LINE OA เพื่อเชื่อมบัญชี |
| 9 | Partner Web (cron) → LINE Service | `POST /callbacks/partner/relationship` | แจ้งเปลี่ยนสถานะ partner relationship (suspend/revoke/reactivate) หลังมีใบสมัครที่อนุมัติแล้ว |
| 10 | Partner Web (cron) → Supabase RPC | `record_line_call_result` | บันทึกผลของแต่ละคิว (ข้อ 6-9) ว่าส่งสำเร็จหรือไม่ และตั้งเวลา retry ถัดไปถ้า error เป็นแบบ retry ได้ |

ข้อสังเกต: มีแค่ **2 จุด** ในทั้งระบบที่ยิง HTTP request ออกไปหา service ภายนอกจริง ๆ — (1)
Browser ยิงเข้า Partner Web เอง (#1) และ (2) cron worker ยิงออกไปหา LINE Service (#6-9)
ส่วน Partner Web ไม่เคยเรียก LINE Service ตรง ๆ ระหว่าง request ของผู้ใช้เลย เพราะ contract
ต้องการให้ผู้ใช้เห็นหน้าสำเร็จได้แม้การเชื่อม LINE จะยังไม่เสร็จหรือล้มเหลว (ดูข้อ 5 ใน "LINE
First Registration" ของ `partner_web_api_contract.md`)

## Route และจุดเริ่มต้น

| Route | ไฟล์ | หมายเหตุ |
| --- | --- | --- |
| `/{locale}/partners` | `src/app/[locale]/partners/page.tsx` | Server Component — resolve ข้อความทั้งหมดจาก namespace `PartnerProgramPage` แล้วส่งเป็น props ให้ `PartnerClient` (ไม่มี `useTranslations` ฝั่ง client) |

ผู้ใช้เข้าหน้านี้ได้ 2 ทาง:

- **เริ่มจากเว็บโดยตรง** — เปิด `/partners` ปกติ
- **เริ่มจาก LINE (LINE-first)** — ลิงก์จาก LINE OA พา user มาที่ `/partners?t=<token>`
  โดย `proxy.ts` (`src/proxy.ts`) จะดัก request ที่มี `?t=` ไว้ก่อนถึง Server Component
  เพื่อ set httpOnly cookie (`partner_line_token`, ดู `lineToken.ts`) — Server Component
  เขียน cookie เองไม่ได้ ต้องเป็น Route Handler/Server Action/proxy เท่านั้น (design review
  Q17)

## โครงสร้างไฟล์หลัก

```
src/features/partner/
├── partnerClient.tsx        # orchestrator — render ตาม step ปัจจุบัน, ยิง submit
├── state.ts                 # useReducer state + validation ต่อ step
├── types.ts                 # content shape (คำแปลทุกช่องของหน้านี้)
├── lineToken.ts              # ชื่อ/อายุ/pattern ของ LINE token cookie
├── components/                # Breadcrumb, Stepper, PartnerSidebar, HelpBox, ...
└── steps/
    ├── Step1Account.tsx       # ข้อมูลผู้ติดต่อ
    ├── Step2Company.tsx       # ข้อมูลบริษัท
    ├── Step3PartnerType.tsx   # เลือกประเภท partner
    ├── Step4AdditionalInfo.tsx# ข้อมูลเพิ่มเติม + consent
    ├── Step5Review.tsx        # ตรวจทาน + submit
    └── RegisterSuccess.tsx    # หน้าสำเร็จหลัง submit

src/app/api/partner/applications/route.ts   # POST รับ submit ของ step 5
```

## State การกรอกฟอร์ม (`state.ts`)

State ทั้งหมดอยู่ใน `useReducer` เดียว (`wizardReducer`) ที่ `PartnerClient` — ไม่มีการ
persist ระหว่าง step ลง localStorage/URL ใด ๆ รีเฟรชหน้าเท่ากับเริ่มใหม่

| Key | ชนิด | คำอธิบาย |
| --- | --- | --- |
| `step` | `1-5` | step ที่กำลังแสดง |
| `highestStepReached` | `1-5` | step สูงสุดที่เคยไปถึง — ใช้ให้ Stepper คลิกย้อนกลับไปดู step เก่าได้ แต่กระโดดข้ามไปข้างหน้าไม่ได้ |
| `submissionId` | `string` (UUID) | สร้างครั้งเดียวตอน mount ส่งไปพร้อม submit กันไม่ให้ double-click/auto-retry สร้างใบสมัครซ้ำ (server เช็คซ้ำอีกชั้นด้วย tax ID) |
| `account` | `AccountData` | firstName, lastName, email, phone, agreeTerms |
| `company` | `CompanyData` | nameTh, nameEn, taxId, businessType, website, phone, address, province, district, postalCode |
| `partnerTypes` | `string[]` | id ของประเภท partner ที่เลือก (เลือกได้หลายอัน) |
| `additional` | `AdditionalData` | customerSegments, interestedProducts, projectsPerYear, avgProjectValue, aboutBusiness, consent 3 ข้อ |
| `submitting` / `submitError` / `submitted` / `applicationId` / `submittedAt` | — | สถานะการ submit (async, แยกจาก reducer ที่เหลือซึ่ง sync ล้วน) |

แต่ละ step มีฟังก์ชันเช็ค validity ก่อนกด "ถัดไป" ได้: `isStep1Valid` ... `isStep4Valid`
(step 5 ไม่มีฟังก์ชันแยก เพราะปุ่ม submit เช็คแค่ `agreeTerms` ใน `handleSubmit`)

## ทั้ง 5 ขั้นตอน

1. **Step 1 — ข้อมูลผู้ติดต่อ** (`Step1Account.tsx`) — ชื่อ, นามสกุล, อีเมล, เบอร์โทร,
   ยอมรับข้อตกลง (checkbox `agreeTerms` แสดงตรงนี้ แต่ค่าจริงที่ใช้ enable ปุ่ม submit
   คือใน Step 5)
2. **Step 2 — ข้อมูลบริษัท** (`Step2Company.tsx`) — ชื่อบริษัทไทย/อังกฤษ, เลขผู้เสียภาษี,
   ประเภทธุรกิจ, เว็บไซต์ (optional), เบอร์โทรบริษัท, ที่อยู่, จังหวัด/อำเภอ/รหัสไปรษณีย์
3. **Step 3 — ประเภท Partner** (`Step3PartnerType.tsx`) — เลือกได้หลายประเภทจากรายการ
   `PartnerTypeOption[]` (id, title, subtitle, bullets, tags) ต้องเลือกอย่างน้อย 1
4. **Step 4 — ข้อมูลเพิ่มเติม** (`Step4AdditionalInfo.tsx`) — กลุ่มลูกค้า, สินค้าที่สนใจ
   (checkbox group ทั้งคู่ มีช่อง "อื่น ๆ"), จำนวนโปรเจกต์/ปี, มูลค่าเฉลี่ยต่อโปรเจกต์,
   เกี่ยวกับธุรกิจ (free text), consent 3 ข้อ (ข้อมูลถูกต้อง / ยอมรับเงื่อนไข /
   ยินยอมให้ติดต่อ) — ต้องติ๊กครบทั้ง 3 ถึงจะไป step 5 ได้
5. **Step 5 — ตรวจทานและยืนยัน** (`Step5Review.tsx`) — สรุปทุก field จาก step 1-4 พร้อม
   ลิงก์ "แก้ไข" ย้อนกลับไปแต่ละ step, ปุ่ม submit ถูก disable จนกว่า `agreeTerms` จะ true

## Submit (`POST /api/partner/applications`)

`PartnerClient.handleSubmit` ยิง fetch เดียวตอนกด submit ที่ step 5:

```json
{
  "submissionId": "...",
  "taxId": "...",
  "companyName": "...",   // = company.nameEn
  "email": "...",
  "applicationData": { "account": {...}, "company": {...}, "partnerTypes": [...], "additional": {...} }
}
```

ฝั่ง Route Handler (`route.ts`) ทำตามลำดับ:

1. เช็ค same-origin (`sec-fetch-site` header ก่อน, fallback เป็น `origin` header) —
   Route Handler ไม่ได้ Origin check ฟรีเหมือน Server Action (design review Q16) จึงต้อง
   เช็คเอง เป็น defense-in-depth ชั้นที่สองรองจาก `SameSite=Lax` ของ LINE token cookie
2. validate payload ต้องมีครบ `submissionId` / `taxId` / `companyName` / `email`
3. อ่าน LINE token จาก cookie `partner_line_token` (ถ้ามี — มาจาก LINE-first flow)
4. `supabase.auth.admin.generateLink({ type: "magiclink", email })` — find-or-create
   auth user จาก email (ไม่ได้ส่งอีเมลจริง แค่ใช้ side-effect สร้าง user ถ้ายังไม่มี เพราะ
   Partner Web ยังไม่มี email flow และ step 1 ไม่เก็บ password แล้ว)
5. เรียก RPC `submit_partner_application` พร้อม submission id, tax id, company name,
   email, actor id คงที่ (`"partner-web"`), user id, application data ทั้งก้อน, LINE token
6. ลบ cookie `partner_line_token` ทิ้งหลัง submit สำเร็จ (กันหน้า refresh/back แล้วส่ง token
   ซ้ำ เพราะ token เป็น single-use)

ทุกอย่างที่คุยกับ LINE Service จริง ๆ (callback, token exchange, link token) เกิด **นอก
request นี้** — enqueue ไว้ใน `thunder_partner.outbound_line_calls` แล้วมี Vercel Cron
worker เป็นคนยิงทีหลัง จึง handler นี้มี error surface แค่ "bad input" กับ "unexpected
failure" ไม่ต้องรู้จัก ~15 error code ของ LINE Service (นั่นเป็นหน้าที่ cron job)

## หน้าสำเร็จ (`RegisterSuccess.tsx`)

หลัง submit สำเร็จ `PartnerClient` ไม่ redirect ไปหน้าอื่น แค่ตั้ง `submitted = true` แล้ว
render `RegisterSuccess` แทนที่ wizard — แสดง:

- เลขที่ใบสมัคร (`applicationId` จาก response) พร้อมปุ่ม copy
- เวลา submit, ผู้สมัคร, บริษัท, ประเภท partner, สินค้าที่สนใจ, จำนวน/มูลค่าโปรเจกต์
- progress bar สถานะ: ส่งแล้ว → กำลังตรวจสอบ → อนุมัติ → พร้อมใช้งาน (labels เท่านั้น —
  หน้านี้ไม่ได้ poll สถานะจริงจาก backend)
- next steps + ปุ่มติดต่อ/login

## หลัง submit: การเชื่อม LINE Service (outbound queue + cron)

`route.ts` (submit handler) เขียนแค่ลง `thunder_partner.applications` เท่านั้น **ไม่เรียก
LINE Service ตรง ๆ เลย** — ทุกการเรียกจริงถูกส่งผ่านคิว `thunder_partner.outbound_line_calls`
โดย DB function/trigger เป็นคนสร้างแถวคิว แล้วปล่อยให้ Vercel Cron (`vercel.json`, รันทุก
1 นาที) เดินไปเรียก `/api/cron/deliver-line-calls` ซึ่งเป็นจุดเดียวในระบบที่ยิง HTTP ออกไป
หา LINE Service จริง (ตั้งใจแยกออกจาก request ของผู้ใช้ ตามการตัดสินใจใน design review —
กันไม่ให้ผู้ใช้ต้องรอ third-party call และกันชน execution-time limit ตอน retry)

ประเภทคิว (`call_type` → endpoint ตาม `partner_web_api_contract.md`):

| `call_type` | Endpoint | Enqueue เมื่อไร |
| --- | --- | --- |
| `application_callback` | `POST /callbacks/partner` | ทุกครั้งที่ insert/update แถวใบสมัคร (trigger `applications_after_write()`) — ครั้งแรกตอน submit (`PENDING`) แล้วอีกทุกครั้งที่สถานะเปลี่ยน |
| `token_exchange` | `POST /partner/token/exchange` | ตอน submit เฉพาะสาย **LINE-first** (มี `p_line_token` จาก cookie) เท่านั้น — แต่ claim ไม่ได้จนกว่าแถว `application_callback` ของใบสมัครเดียวกันจะ `delivered` แล้ว (แก้ไขใน migration `0007_gate_token_exchange_on_callback.sql` ตาม `docs/PARTNER_WEB_LINE_PENDING_NOTIFICATION_HANDOFF .md` — เดิมทั้งสองแถวถูก enqueue พร้อมกันในทรานแซกชันเดียว ทำให้ cron อาจยิง `token_exchange` ก่อน callback สำเร็จ ได้ `404 APPLICATION_NOT_FOUND` (non-retryable) แล้วเข้า `failed_permanent` แบบเงียบ ๆ แม้ callback จะสำเร็จตามมาทีหลังก็ตาม) |
| `link_token` | `POST /partner/link-token` | เฉพาะสาย **Web-first** — enqueue เมื่อใบสมัคร **ถูกอนุมัติ (`APPROVED`) แล้วเท่านั้น** (แก้ไขใน migration `0006_gate_link_token_on_approval.sql` — เดิม enqueue ทันทีตอน submit ทำให้โดน LINE Service ตอบ `409` แล้วเข้า `failed_permanent` แบบเงียบ ๆ ทุกใบสมัคร web-first) |
| `relationship_callback` | `POST /callbacks/partner/relationship` | เปลี่ยนสถานะ partner relationship (suspend/revoke/reactivate) |

Cron worker (`src/app/api/cron/deliver-line-calls/route.ts`) ต่อรอบ:

1. auth ด้วย `Authorization: Bearer CRON_SECRET`
2. claim แถวที่ถึงกำหนดผ่าน RPC `claim_due_line_calls` (สูงสุด 20 แถว/รอบ)
3. ยิง `POST` ไปหา endpoint ตาม `call_type` พร้อม `Authorization: Bearer PARTNER_SYSTEM_SECRET`
4. บันทึกผลด้วย RPC `record_line_call_result`:
   - สำเร็จ → `delivered`
   - error ที่ retry ได้ (network error, `500`, `503`) → เข้า backoff `1m → 5m → 15m → 1h →
     6h → 24h` (สูงสุด 6 รอบ) ก่อนตกเป็น `failed_permanent`
   - error ที่ retry ไม่ได้ (`400/401/403/404/409/410/413`) → `failed_permanent` ทันที
     ไม่ retry (ตรงกับ Error Contract ใน `partner_web_api_contract.md`)


