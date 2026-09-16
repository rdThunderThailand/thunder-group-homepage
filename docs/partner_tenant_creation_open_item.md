# Partner Web ↔ ThunderCore — เรื่อง tenant/user creation ที่ยังค้างอยู่

สรุปสั้น ๆ สำหรับคุยกับทีม backend/ThunderCore เพื่อปิด open item ที่บล็อกการเชื่อม Partner
Web กับ LINE Service ให้ทำงานได้เต็มรูปแบบ — อ้างอิงจาก `supabase/sql/0003_defer_tenant_creation.sql`

## บริบท

Contract เดิม (`docs/original.md`) กำหนดให้ Partner Web ต้อง "สร้างหรือยืนยัน
`public.tenants` และ `public.users` ใน ThunderCore" **ก่อน**บันทึกใบสมัครและเรียก LINE
Service ทุกครั้ง — โค้ดชุดแรก (`0001_create_partner_schema.sql`) implement ตามนี้ แต่มี
TODO ติดไว้ตั้งแต่ต้นว่า:

> column/constraint names on `public.tenants` and `public.users` are assumed, not
> confirmed -- fix once their real DDL is checked (design review Q7: does
> tax_id/email actually carry a unique constraint there?)

## สถานะปัจจุบัน (migration 0003)

เพราะยังไม่มีคำตอบสำหรับ 2 เรื่องด้านล่าง `0003_defer_tenant_creation.sql` เลย**หยุดสร้าง
tenant/user ไปก่อนชั่วคราว** เพื่อให้ทดสอบฝั่ง Partner Web (application record + outbound
queue + cron) ต่อไปได้ — ผลคือทุกใบสมัครตอนนี้มี `tenant_id` / `user_id` เป็น `NULL`
และ payload ที่ enqueue ไปหา LINE Service (`application_callback`, `token_exchange`,
`link_token`) ก็มี `"tenantId": null` ติดไปด้วยทุกแถว

## ผลกระทบที่คาดว่าจะเกิด (ยังไม่ได้ทดสอบยิงจริงกับ LINE Service เพื่อความปลอดภัย)

จากสคีมาฝั่ง LINE Service (`thunder_crm_lineoa.partner_applications`) ที่ทีม backend
ส่งมาให้ดู — `tenant_id` และ `applicant_user_id` เป็น `NOT NULL` และมี FK ไป
`public.tenants(id)` / `public.users(id)` จริง ซึ่งตรงกับ contract ที่ล็อกไว้ว่า `tenantId`
กับ `userId` "ต้องมีอยู่ใน ThunderCore ก่อนเรียก LINE Service" ดังนั้นเมื่อ Vercel Cron
(`/api/cron/deliver-line-calls`) หยิบแถวที่ค้างอยู่ไปยิงจริง คาดว่า LINE Service จะ reject
callback ที่มี `tenantId: null` (น่าจะเป็น `400 INVALID_PAYLOAD`) — และฝั่ง cron worker
จัดว่า 4xx เป็น non-retryable อยู่แล้ว จึงยิงครั้งเดียวแล้วเข้า `failed_permanent` ทันที
ไม่มี automatic retry

ผลคือ: ใบสมัครที่ submit ผ่านเว็บช่วงนี้จะ "สำเร็จ" ฝั่ง Partner Web ปกติ (ผู้สมัครเห็นหน้า
success) แต่การเชื่อม LINE identity / เปลี่ยน Rich Menu / แจ้งเตือนสถานะ จะไม่เกิดขึ้นเลย
แบบเงียบ ๆ ไม่มีใครเห็น error

## คำถามที่ต้องการคำตอบจากทีม ThunderCore

1. **tenant_type / tenant_code** — ใบสมัคร partner ที่มาจากเว็บ (self-serve) ควรสร้าง
   `public.tenants` ด้วยค่าอะไร มี type/code สำหรับ partner สมัครเองโดยเฉพาะไหม
2. **สถานะ tenant ระหว่างรอ review** — `public.tenants.status` ตอนนี้มีแค่
   `active` / `archived` / `suspended` ไม่มี "pending" — ควรสร้าง tenant เป็น `active`
   ตั้งแต่ submit เลย (ก่อนได้รับอนุมัติ) หรือ ThunderCore ต้องเพิ่มสถานะใหม่
3. **Unique constraint ของ `tax_id` / `email`** — `public.tenants.tax_id` และ
   `public.users.email` มี unique constraint จริงไหม (โค้ดปัจจุบันสมมติไว้เฉย ๆ ด้วย
   `ON CONFLICT (tax_id)` / `ON CONFLICT (email)` ยังไม่เคยถูกยืนยันกับ DDL จริง)

## แผนเมื่อได้คำตอบแล้ว

เมื่อ 3 ข้อด้านบนชัดเจน Partner Web จะ:

- ย้อน `0003_defer_tenant_creation.sql` กลับ (restore การสร้าง tenant/user +
  `NOT NULL` บน `tenant_id`/`user_id`)
- Backfill/reconcile ใบสมัครที่ถูกสร้างระหว่างช่วงนี้ (ที่ `tenant_id`/`user_id` เป็น
  null) ก่อนปล่อยให้แถว `outbound_line_calls` ที่ค้างอยู่ถูกส่งจริง

## เรื่องที่อยากคุยเพิ่มกับทีม LINE Service ระหว่างนี้

ระหว่างที่ 3 ข้อบนยังไม่ปิด อยากถามว่าทีม LINE Service สะดวกให้ Partner Web **หยุดส่ง**
callback ที่ `tenantId: null` ไปก่อนไหม (กันไว้ที่ cron worker ฝั่ง Partner Web เอง ไม่ให้
หยิบแถวที่ tenant_id เป็น null ไปยิง) เพื่อไม่ให้ไปกิน attempt แบบไม่มีความหมายหรือสร้าง log
error ที่ไม่จำเป็นฝั่งนั้น จนกว่าจะ revert 0003 เสร็จ

## อ้างอิง

- `supabase/sql/0001_create_partner_schema.sql`
- `supabase/sql/0003_defer_tenant_creation.sql`
- `docs/original.md` (หัวข้อ "LINE First Registration", "Identifier Mapping")
- `src/app/api/cron/deliver-line-calls/route.ts` (`NON_RETRYABLE_STATUSES`)
