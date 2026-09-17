# Partner Web: Tenant, User และ LINE Integration

เอกสารนี้สรุปข้อตกลงสำหรับเชื่อม Partner Web กับ ThunderCore และ THUNDER LINE
Service โดยรองรับทั้งผู้สมัครที่เริ่มจาก LINE OA และผู้สมัครที่เริ่มจากเว็บไซต์

## ข้อสรุป

- ทั้งสองช่องทางต้องใช้บริษัทและบุคคลชุดเดียวกันใน ThunderCore
- บริษัทเก็บใน `public.tenants`
- บุคคลเก็บใน `public.users`
- ความสัมพันธ์ระหว่างบุคคลกับบริษัทเก็บใน `public.memberships`
- Partner Web ต้องมี `tenantId` และ `userId` ที่ถูกต้องก่อนเรียก LINE Service
- LINE Service ไม่รับ `tenantId: null` หรือ `userId: null`
- ข้อมูล LINE เป็น identity เสริม ไม่ใช่ user อีกชุดหนึ่ง

## Data Ownership

| ข้อมูล | เจ้าของข้อมูล |
| --- | --- |
| บริษัท | `public.tenants` ใน ThunderCore |
| บุคคล | `public.users` ใน ThunderCore |
| ประเภทสมาชิก user/partner | `public.memberships.member_type` |
| ใบสมัครและเอกสารฉบับเต็ม | Partner Web |
| สถานะย่อของใบสมัคร | `thunder_crm_lineoa.partner_applications` |
| LINE identity | `thunder_crm_lineoa.line_users` |
| การเชื่อม LINE กับ user | `thunder_crm_lineoa.external_identity_links` |
| สถานะบริษัท Partner | `thunder_crm_lineoa.partner_relationships` |

## ค่าที่ใช้ตอนสร้างข้อมูล

### Tenant

```text
tenant_type       = enterprise
status            = active
onboarding_status = pending
activated_at      = null
```

`tenant_code` ต้องสร้างจาก Partner Web Backend ให้ไม่ซ้ำ โดยฐานข้อมูลมี UNIQUE
constraint อยู่แล้ว ห้ามใช้ `ON CONFLICT (tax_id)` เพราะ `public.tenants` ปัจจุบันไม่มี
คอลัมน์ `tax_id`

### User

`public.users.email` และ `public.users.phone` มี UNIQUE constraint แต่
`public.users.id` อ้างถึง `auth.users.id` ดังนั้นต้องสร้างหรือค้นหา Supabase Auth user
ก่อน แล้วใช้ UUID เดียวกันใน `public.users` การดำเนินการนี้ต้องอยู่ฝั่ง Backend เท่านั้น
ห้ามใช้ Service Role Key ใน browser

### Membership

```text
tenant_id  = tenant ที่สร้างหรือค้นพบ
user_id    = user ที่สร้างหรือค้นพบ
status     = active
user_type  = external
member_type = user
```

ผู้สมัครทุกคนเริ่มด้วย `member_type = 'user'` เมื่อใบสมัครได้รับอนุมัติ LINE Service
จะเปลี่ยน membership ที่ตรงกับ `tenant_id + user_id` เป็น `partner` ผ่าน Migration 006
ฝั่ง Partner Web ไม่ต้องเปลี่ยนค่านี้เอง

`public.roles.role_type` ยังคงเป็น `operator` และไม่ใช้แยก user/partner

## LINE Service Connection

```text
Base URL: https://thundercrmlineoa.vercel.app
Authorization: Bearer <PARTNER_SYSTEM_SECRET>
Content-Type: application/json
```

ทุก API ต้องเรียกจาก Partner Web Backend เท่านั้น `PARTNER_SYSTEM_SECRET` ต้องเป็นค่า
เดียวกับ LINE Service และห้ามใช้ตัวแปรที่มี prefix `NEXT_PUBLIC_`

## Flow 1: เริ่มจาก LINE OA

```text
ผู้ใช้กด Partner ใน LINE
→ LINE Service สร้าง LINE_TO_WEB token
→ เปิด Partner Web พร้อม ?t=<token>
→ Partner Web สร้าง/ค้นหา auth user, public user, tenant และ membership
→ Partner Web บันทึกใบสมัครฉบับเต็ม
→ ส่ง PENDING callback ไป LINE Service
→ exchange token ด้วย applicationId และ tenantId
→ LINE Service เชื่อม line_user กับ public user
```

ลำดับ API:

1. `POST /callbacks/partner`
2. `POST /partner/token/exchange`

Token มีอายุ 30 นาที ใช้ได้ครั้งเดียว และต้องไม่ถูกบันทึกลง log

## Flow 2: เริ่มจาก Partner Web

```text
ผู้ใช้เปิด Partner Web โดยไม่มี LINE token
→ Partner Web สร้าง/ค้นหา auth user, public user, tenant และ membership
→ Partner Web บันทึกใบสมัครฉบับเต็ม
→ ส่ง PENDING callback ไป LINE Service
→ Admin ตรวจและอนุมัติใบสมัคร
→ Partner Web ได้สถานะ APPROVED
→ ขอ WEB_TO_LINE token
→ ผู้ใช้ส่ง LINK <token> เข้า LINE OA
→ LINE Service เชื่อม line_user กับ public user
```

ลำดับ API:

1. `POST /callbacks/partner` ด้วยสถานะ `PENDING`
2. Admin เปลี่ยนใบสมัครเป็น `APPROVED`
3. `POST /partner/link-token` หลังอนุมัติแล้วเท่านั้น
4. ผู้ใช้ส่ง `LINK <token>` ใน LINE OA

## Application Callback

Partner Web ต้องส่ง callback หลังบันทึกใบสมัครฉบับเต็มสำเร็จแล้วเท่านั้น

```json
{
  "applicationId": "PA-2026-00001",
  "tenantId": "11111111-1111-4111-8111-111111111111",
  "userId": "22222222-2222-4222-8222-222222222222",
  "status": "PENDING",
  "version": 1,
  "actorId": "partner-backend",
  "correlationId": "5ccbd97e-e1f8-4a13-87e8-92a6b4c93075",
  "submittedAt": "2026-09-16T09:00:00+07:00",
  "reviewedAt": null
}
```

`applicationId` ต้องคงเดิมตลอดอายุใบสมัคร การ retry operation เดิมต้องใช้ payload,
version และ correlation ID เดิม

## Outbound Queue Rules

Partner Web ต้องไม่ enqueue หรือ deliver รายการต่อไปนี้หาก `tenant_id` หรือ `user_id`
ยังเป็น null:

- `application_callback`
- `token_exchange`
- `link_token`

รายการดังกล่าวควรอยู่ในสถานะรอการ reconcile โดยไม่เพิ่ม attempt และไม่เปลี่ยนเป็น
`failed_permanent` หลัง backfill ID ครบแล้วจึงเปิดให้ worker ส่งตามปกติ

LINE Service จะตอบ `400 INVALID_PAYLOAD` เมื่อ ID เป็น null และจะไม่สร้าง application,
identity link, notification หรือ Rich Menu job

## การจัดการข้อมูลที่สร้างไว้ระหว่าง Migration 0003

ก่อนเปิด outbound worker ต้องทำตามลำดับนี้:

1. หยุดส่งแถวที่ `tenant_id` หรือ `user_id` เป็น null
2. สร้างหรือค้นหา Auth user, public user, tenant และ membership
3. Backfill `tenant_id` และ `user_id` ลงใบสมัครเดิม
4. ตรวจว่า application เดิมใช้ `applicationId` เดิม
5. เปิด queue เฉพาะแถวที่ ID ครบ
6. ส่ง operation เดิมด้วย version และ correlation ID เดิม

ห้ามสร้างใบสมัครใหม่เพื่อแทนใบสมัครเดิม เพราะจะทำให้เกิดข้อมูลซ้ำและเสียลำดับ version

## สถานะหลัง Review

| Application status | `memberships.member_type` | Partner Rich Menu |
| --- | --- | --- |
| `PENDING` | `user` | ไม่ได้รับ |
| `NEEDS_INFO` | `user` | ไม่ได้รับ |
| `REJECTED` | `user` | ไม่ได้รับ |
| `APPROVED` | `partner` | ได้เมื่อ LINE Linked และ Relationship Active |
| Relationship `SUSPENDED` | `partner` | กลับ Default Menu ชั่วคราว |
| Relationship `REVOKED` | `user` | กลับ Default Menu |

## Tax ID Open Item

ทีม ThunderCore กำลังดำเนินการเพิ่มแนวทางจัดเก็บและตรวจสอบ `tax_id` ให้เป็น canonical
field สำหรับตรวจบริษัทซ้ำ งานส่วนนี้เป็นความรับผิดชอบของ ThunderCore และ Partner Web
ต้องรอ schema/contract ที่ยืนยันแล้วก่อนเชื่อมใช้งาน

ระหว่างนี้ห้าม Partner Web สมมติว่ามี `public.tenants.tax_id`, ห้ามใช้
`ON CONFLICT (tax_id)` และไม่ควรสร้าง column หรือ workaround เอง Partner Web ต้องเก็บ
mapping ของใบสมัครกับ `tenant_id` ที่สร้างแล้ว เพื่อให้การ retry ใช้ tenant เดิมเสมอ

## Definition of Done

- ไม่มี outbound row ที่ส่ง `tenantId/userId` เป็น null
- LINE-first และ Web-first อ้าง `public.users.id` เดียวกันเมื่อเป็นบุคคลเดียวกัน
- การ submit/retry ไม่สร้าง tenant, user, membership หรือ application ซ้ำ
- Account conflict ไม่ย้าย LINE identity อัตโนมัติ
- Approved เปลี่ยน `member_type` เป็น `partner`
- Approved + LINE Linked + Active Relationship ได้ Partner Rich Menu
- Rejected หรือ Revoked ไม่ได้รับ Partner Rich Menu
