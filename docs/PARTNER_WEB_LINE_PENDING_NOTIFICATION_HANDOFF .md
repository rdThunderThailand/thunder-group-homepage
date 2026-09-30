# Partner Web Handoff: LINE Pending Notification

## เป้าหมาย

เมื่อผู้ใช้เริ่มสมัครจาก LINE OA และส่งใบสมัครสำเร็จ ผู้ใช้ต้องได้รับข้อความใน LINE:

```text
รับข้อมูลเรียบร้อยแล้ว

THUNDER ได้รับข้อมูลการสมัคร Partner ของคุณแล้ว

เลขอ้างอิง: <applicationId>
สถานะ: รอการยืนยัน
```

LINE Service มี Notification Template และ Worker สำหรับข้อความนี้แล้ว ฝั่ง Partner Web
ต้องส่ง application callback และแลก LINE token สำเร็จตามลำดับเพื่อให้ระบบทราบ LINE user
ผู้รับข้อความ

## สถานะที่ตรวจพบ

- Partner Web ส่ง `PENDING callback` สำเร็จแล้ว จึงพบใบสมัครใน
  `thunder_crm_lineoa.partner_applications`
- ใบสมัคร LINE-first ยังไม่มี verified identity link
- LINE registration token ยังไม่ถูกใช้
- จึงยังไม่สามารถสร้างและส่ง notification ไปยัง LINE user ได้

## Flow ที่ต้องการ

```text
ผู้ใช้เปิด Partner Web จาก LINE พร้อม ?t=<token>
  -> Partner Web เก็บ token ฝั่ง server
  -> ผู้ใช้ส่งใบสมัคร
  -> Partner Web บันทึกใบสมัครหลักสำเร็จ
  -> POST /callbacks/partner สำเร็จ
  -> POST /partner/token/exchange สำเร็จ
  -> LINE Service สร้าง external_identity_link
  -> LINE Service enqueue partner_registration_received
  -> Notification Cron ส่งข้อความเข้า LINE ภายในประมาณ 1 นาที
```

## ลำดับ API ที่บังคับ

### 1. บันทึกสถานะใบสมัคร

```http
POST https://thundercrmlineoa.vercel.app/callbacks/partner
Authorization: Bearer <PARTNER_SYSTEM_SECRET>
Content-Type: application/json
```

```json
{
  "applicationId": "<stable-partner-web-application-id>",
  "tenantId": "<public.tenants.id>",
  "userId": "<public.users.id>",
  "status": "PENDING",
  "version": 1,
  "actorId": "partner-web",
  "correlationId": "<operation-uuid>",
  "submittedAt": "<ISO-8601 timestamp with offset>",
  "reviewedAt": null
}
```

ต้องได้รับ `200` ก่อนจึงดำเนินการข้อ 2

### 2. เชื่อมใบสมัครกับ LINE identity

```http
POST https://thundercrmlineoa.vercel.app/partner/token/exchange
Authorization: Bearer <PARTNER_SYSTEM_SECRET>
Content-Type: application/json
```

```json
{
  "token": "<token-from-t-query-parameter>",
  "applicationId": "<same-application-id-as-callback>",
  "tenantId": "<same-tenant-id-as-callback>"
}
```

Response ที่คาดหวัง:

```json
{
  "applicationId": "<application-id>",
  "status": "PENDING"
}
```

## Queue Requirement

ห้าม enqueue หรือ deliver `application_callback` และ `token_exchange` แบบที่สามารถทำงาน
พร้อมกันได้ เพราะ `token_exchange` ต้องพบใบสมัครใน LINE Service ก่อน

วิธีที่แนะนำ:

1. Enqueue `application_callback`
2. เมื่อ callback ได้ `200` จึง enqueue หรือปลดล็อก `token_exchange`
3. หาก callback ต้อง retry ให้ `token_exchange` รอต่อไป
4. Retry operation เดิมด้วย payload และ identifiers เดิม

หาก `token_exchange` ถูกเรียกก่อน callback ระบบจะตอบ `404 APPLICATION_NOT_FOUND` และคิว
อาจถูกตั้งเป็น `failed_permanent` ทำให้ไม่มี notification แม้ใบสมัครจะถูกบันทึกสำเร็จภายหลัง

## Error Handling

| Response | การจัดการ |
| --- | --- |
| `200` | ถือว่า identity linked และรอ LINE Notification Cron |
| `404 APPLICATION_NOT_FOUND` | callback ยังไม่สำเร็จหรือตัวระบุไม่ตรง ห้ามถือว่างานเสร็จ |
| `400 INVALID_TOKEN` | token ไม่ถูกต้อง ให้เริ่ม LINE linking ใหม่ |
| `409 TOKEN_USED` | ตรวจว่า operation เดิมเคยสำเร็จหรือไม่ |
| `409 LINK_CONFLICT` | หยุดอัตโนมัติและส่งให้เจ้าหน้าที่ตรวจ identity |
| `410 TOKEN_EXPIRED` | token หมดอายุ ให้เริ่ม LINE linking ใหม่ |
| `500` หรือ `503` | retry แบบจำกัดครั้งด้วย payload เดิม |

ห้ามบันทึก registration token หรือ `PARTNER_SYSTEM_SECRET` ลง application log

## Acceptance Criteria

- LINE-first submission สร้าง `PENDING` application callback สำเร็จ
- `token_exchange` ทำงานหลัง callback ได้ `200` เท่านั้น
- เกิด verified row ใน `thunder_crm_lineoa.external_identity_links`
- เกิด `partner_registration_received` ใน `thunder_crm_lineoa.notification_outbox`
- Notification เปลี่ยนเป็น `SENT`
- ผู้ใช้ได้รับข้อความ `สถานะ: รอการยืนยัน` ใน LINE ภายในประมาณ 1 นาที
- Retry ไม่สร้าง tenant, user, application, identity link หรือ notification ซ้ำ

## หมายเหตุสำหรับ Web-first

ผู้ใช้ที่เริ่มจากหน้าเว็บยังไม่มี LINE identity จึงไม่สามารถรับข้อความนี้ใน LINE ตอน submit
ได้ ต้องรอใบสมัครได้รับอนุมัติ แล้วจึงทำ Web-first account linking ผ่าน
`POST /partner/link-token` และข้อความ `LINK <token>` ก่อน

