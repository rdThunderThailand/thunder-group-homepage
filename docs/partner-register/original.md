# Partner Web Integration Contract

เอกสารนี้ใช้สำหรับเชื่อม Partner Web กับ THUNDER LINE Service ใน Flow สมัคร Partner
ทั้งแบบเริ่มจาก LINE และเริ่มจากหน้าเว็บ โดย Partner Web เป็นผู้สร้างข้อมูลธุรกิจใน
ThunderCore ส่วน LINE Service รับสถานะใบสมัคร เชื่อม LINE identity เปลี่ยน Rich Menu
และส่ง Notification

## Environment

| รายการ | Production |
| --- | --- |
| LINE Service Base URL | `https://thundercrmlineoa.vercel.app` |
| Partner Registration URL | `https://thunder-group-homepage.vercel.app/th/partners` |
| Authentication | `Authorization: Bearer <PARTNER_SYSTEM_SECRET>` |
| Content Type | `application/json` |
| Maximum request body | 16 KB |

`PARTNER_SYSTEM_SECRET` ต้องอยู่ใน Partner Web Backend เท่านั้น ห้ามใช้ชื่อตัวแปรแบบ
`NEXT_PUBLIC_*` ห้ามส่งให้ browser และห้ามบันทึก secret หรือ registration token ลง log

## Application Data Ownership

Partner Web เป็นเจ้าของและต้องบันทึกข้อมูลใบสมัครฉบับเต็ม รวมถึงข้อมูลบริษัท ผู้ติดต่อ
คำตอบในฟอร์ม เอกสารแนบ และประวัติการแก้ไข ฝั่ง LINE Service ไม่ได้เก็บข้อมูลฟอร์มเหล่านี้
โดย `thunder_crm_lineoa.partner_applications` เก็บเฉพาะ reference และสถานะที่จำเป็นต่อ
การเชื่อม LINE, Notification และ Rich Menu

Partner Web ต้องบันทึกใบสมัครสำเร็จก่อนเรียก callback และต้องเก็บข้อมูลขั้นต่ำดังนี้:

- `applicationId` ที่คงเดิมตลอดอายุใบสมัคร
- `tenantId` ของบริษัทใน `public.tenants`
- `userId` ของผู้สมัครใน `public.users`
- ข้อมูลฟอร์มและเอกสารแนบทั้งหมด
- สถานะและ version ล่าสุด
- เวลา submit/review และผู้ดำเนินการ

ห้ามใช้ `POST /callbacks/partner` เป็นที่เก็บใบสมัครหลัก หาก callback ล้มเหลว Partner Web
ต้องเก็บใบสมัครไว้และ retry ด้วย payload, version และ correlation ID เดิม

## Identifier Mapping

| Field | ที่มา | รูปแบบ |
| --- | --- | --- |
| `applicationId` | ID ใบสมัครของ Partner Web | string 1-100 ตัวอักษร |
| `tenantId` | `public.tenants.id` ของบริษัท | UUID |
| `userId` | `public.users.id` ของผู้สมัคร | UUID |
| `actorId` | ID ของ backend หรือ reviewer ผู้เปลี่ยนสถานะ | string 1-100 ตัวอักษร |
| `correlationId` | Partner Web สร้างใหม่ต่อหนึ่ง business operation | UUID |
| `version` | revision ของ application หรือ relationship | positive integer |

หนึ่งบริษัทต้องอ้างถึงหนึ่ง `tenantId` เสมอ และ `tenantId` กับ `userId` ต้องมีอยู่ใน
ThunderCore ก่อนเรียก LINE Service

## Server Side Helper

ตัวอย่างนี้ต้องใช้ใน Server Action, Route Handler หรือ Backend API เท่านั้น

```ts
const lineApiUrl = process.env.THUNDER_LINE_API_URL!;
const lineApiSecret = process.env.PARTNER_SYSTEM_SECRET!;

export async function callLineApi(path: string, body: unknown) {
  const response = await fetch(`${lineApiUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${lineApiSecret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? 'LINE_INTEGRATION_FAILED');
  return result;
}
```

ตั้ง `THUNDER_LINE_API_URL=https://thundercrmlineoa.vercel.app` และใช้ค่า
`PARTNER_SYSTEM_SECRET` เดียวกับ LINE Service

## LINE First Registration

ผู้ใช้กดปุ่ม Partner ใน LINE แล้วถูกส่งมายัง Partner Web ในรูปแบบ:

```text
https://thunder-group-homepage.vercel.app/th/partners?t=<43-character-token>
```

Partner Web ต้องเก็บ `t` ไว้จน submit แต่ไม่ต้องส่ง token ไปตรวจตอนเปิดหน้า เพราะ
ปัจจุบันยังไม่มี token validation endpoint แยก Token มีอายุ 30 นาที ใช้ได้ครั้งเดียว
และต้องตรงรูปแบบ `[A-Za-z0-9_-]{43}`

เมื่อลูกค้ากด submit ให้ Partner Web Backend ทำตามลำดับนี้:

1. สร้างหรือยืนยัน `public.tenants` และ `public.users` ใน ThunderCore
2. บันทึกใบสมัครในระบบ Partner Web และสร้าง `applicationId`
3. เรียก `POST /callbacks/partner` ด้วยสถานะ `PENDING` และ `version: 1`
4. เมื่อข้อ 3 สำเร็จ เรียก `POST /partner/token/exchange` ด้วย token จาก `t`
5. แสดงผลสมัครสำเร็จเมื่อบันทึกใบสมัครสำเร็จ แม้การเชื่อม LINE จะล้มเหลว

### Record Application

`POST /callbacks/partner`

```json
{
  "applicationId": "PA-2026-00001",
  "tenantId": "11111111-1111-4111-8111-111111111111",
  "userId": "22222222-2222-4222-8222-222222222222",
  "status": "PENDING",
  "version": 1,
  "actorId": "partner-backend",
  "correlationId": "5ccbd97e-e1f8-4a13-87e8-92a6b4c93075",
  "submittedAt": "2026-09-15T09:00:00+07:00",
  "reviewedAt": null
}
```

Response `200`:

```json
{
  "applicationId": "PA-2026-00001",
  "status": "PENDING",
  "version": 1
}
```

### Exchange LINE Token

`POST /partner/token/exchange`

```json
{
  "token": "<token-from-query-string>",
  "applicationId": "PA-2026-00001",
  "tenantId": "11111111-1111-4111-8111-111111111111"
}
```

Response `200`:

```json
{
  "applicationId": "PA-2026-00001",
  "status": "PENDING"
}
```

หาก exchange ล้มเหลว ห้าม rollback ใบสมัครใน Partner Web ให้แจ้งว่ารับใบสมัครแล้ว
แต่ยังเชื่อม LINE ไม่สำเร็จ และใช้ Web-first linking เพื่อให้ผู้ใช้เชื่อมใหม่ภายหลัง

## Web First Registration

กรณีผู้ใช้เข้าหน้า Partner Web โดยไม่มี `t` ให้บันทึกใบสมัครและเรียก
`POST /callbacks/partner` ก่อน จากนั้นขอ token สำหรับเชื่อม LINE

`POST /partner/link-token`

```json
{
  "applicationId": "PA-2026-00001",
  "tenantId": "11111111-1111-4111-8111-111111111111"
}
```

Response `200`:

```json
{
  "token": "<43-character-token>",
  "expiresInSeconds": 1800
}
```

ใน implementation ปัจจุบัน ผู้ใช้ส่งข้อความ `LINK <token>` มายัง LINE OA เพื่อยืนยัน
การเชื่อม Token ใช้ได้ครั้งเดียวและมีอายุ 30 นาที

## Application Status Callback

ใช้ `POST /callbacks/partner` endpoint เดิมทุกครั้งที่สถานะเปลี่ยน โดยเพิ่ม `version`
และสร้าง `correlationId` ใหม่

สถานะที่รองรับ:

```text
PENDING -> NEEDS_INFO -> PENDING
PENDING -> APPROVED
PENDING -> REJECTED
```

ตัวอย่างอนุมัติ:

```json
{
  "applicationId": "PA-2026-00001",
  "tenantId": "11111111-1111-4111-8111-111111111111",
  "userId": "22222222-2222-4222-8222-222222222222",
  "status": "APPROVED",
  "version": 2,
  "actorId": "reviewer-user-id",
  "correlationId": "d20b58f1-eae8-44b8-bcb9-127ef148b1a6",
  "submittedAt": "2026-09-15T09:00:00+07:00",
  "reviewedAt": "2026-09-16T10:30:00+07:00"
}
```

กติกา:

- `PENDING` ต้องมี `reviewedAt: null`
- `NEEDS_INFO`, `APPROVED` และ `REJECTED` ต้องมี `reviewedAt`
- การส่งกลับจาก `NEEDS_INFO` เป็น `PENDING` ต้องเพิ่ม version และตั้ง `reviewedAt: null`
- Retry request เดิมให้ส่ง body เดิม รวมถึง version และ actor เดิม
- ห้ามใช้ version เดิมกับสถานะหรือ actor คนละค่า
- Schema เป็น strict ห้ามเพิ่ม field ที่ยังไม่อยู่ใน contract

เมื่อ `APPROVED` ระบบจะสร้าง Active Partner Relationship, เปลี่ยน Rich Menu หลังเชื่อม
LINE สำเร็จ และส่ง `partner_activated` หลังผูกเมนูสำเร็จเท่านั้น

## Relationship Callback

ใช้สำหรับ suspend, revoke หรือเปิด relationship กลับมาเป็น active หลังมี application
ที่ได้รับอนุมัติแล้ว

`POST /callbacks/partner/relationship`

```json
{
  "tenantId": "11111111-1111-4111-8111-111111111111",
  "status": "REVOKED",
  "version": 2,
  "actorId": "reviewer-user-id",
  "correlationId": "cbf16c87-a7cb-40d7-8f9d-78510f0ea40e"
}
```

Response `200`:

```json
{
  "status": "REVOKED",
  "version": 2
}
```

สถานะที่รองรับคือ `ACTIVE`, `SUSPENDED`, `REVOKED` และ version ของ relationship
แยกจาก version ของ application

## Error Contract

Error response ใช้รูปแบบเดียวกัน:

```json
{ "error": "ERROR_CODE" }
```

| HTTP | Error | การจัดการฝั่ง Partner Web |
| --- | --- | --- |
| 400 | `INVALID_PAYLOAD` | ตรวจ field, UUID, timestamp, token และห้ามส่ง field เกิน |
| 400 | `INVALID_TOKEN` | แจ้งให้ผู้ใช้เริ่มเชื่อม LINE ใหม่ |
| 400 | `TOKEN_PURPOSE_MISMATCH` | ตรวจว่าใช้ token กับ flow ถูกประเภท |
| 401 | `UNAUTHORIZED` | ตรวจ backend secret ห้าม retry จาก browser |
| 403 | `REVIEWER_FORBIDDEN` | ผู้เปลี่ยนสถานะไม่มี permission `partner_applications:review` |
| 404 | `APPLICATION_NOT_FOUND` | ตรวจ `applicationId` และ `tenantId` |
| 404 | `RELATIONSHIP_NOT_FOUND` | ยังไม่มี approved relationship |
| 409 | `TOKEN_USED` | ขอ token ใหม่ เว้นแต่ request เดิมได้รับ `200` แล้ว |
| 409 | `LINK_CONFLICT` | หยุดอัตโนมัติและส่งให้เจ้าหน้าที่ตรวจ identity |
| 409 | `APPLICATION_CONFLICT` | `applicationId` เดิมผูกกับผู้สมัครคนละคน |
| 409 | `STALE_VERSION` | โหลดสถานะล่าสุดก่อนส่งใหม่ |
| 409 | `VERSION_CONFLICT` | ห้ามใช้ version เดิมกับข้อมูลคนละชุด |
| 409 | `STATUS_CONFLICT` | transition หรือ initial state ไม่ถูกต้อง |
| 410 | `TOKEN_EXPIRED` | ขอหรือเริ่ม token ใหม่ |
| 413 | `PAYLOAD_TOO_LARGE` | ลด payload ให้ต่ำกว่า 16 KB |
| 503 | `DATABASE_UNAVAILABLE` | retry ด้วย exponential backoff |
| 500 | `INTERNAL_ERROR` | retry แบบจำกัดครั้งและแจ้งทีมดู log |

ให้ retry อัตโนมัติเฉพาะ network error, `500` และ `503` โดยใช้ body เดิม ไม่ควร retry
ข้อผิดพลาด `400`, `401`, `404`, `409` หรือ `410` แบบไม่แก้สาเหตุ

## Current Contract Limits

- ยังไม่มี endpoint สำหรับ validate LINE registration token ก่อน submit
- Callback ยังไม่รับ rejection reason, information request summary หรือ response deadline
- Notification จึงส่งเฉพาะข้อความสถานะที่ปลอดภัยและไม่แสดง internal note
- Web-first ยังใช้ข้อความ `LINK <token>` จนกว่าจะมี UX สำหรับ account linking ที่ยืนยันแล้ว

## Integration Checklist

- เก็บ `PARTNER_SYSTEM_SECRET` เฉพาะ backend
- เก็บข้อมูลใบสมัครฉบับเต็มใน Partner Web ก่อนเรียก LINE Service
- สร้าง tenant และ user ใน ThunderCore ก่อน callback
- ใช้ application ID เดิมตลอดอายุใบสมัคร
- เพิ่ม version ทุกครั้งที่สถานะเปลี่ยน
- เรียก application callback ก่อน token exchange หรือ link-token
- รองรับกรณีใบสมัครสำเร็จแต่ LINE linking ล้มเหลว
- ไม่ log token, secret หรือข้อมูลส่วนบุคคลเกินจำเป็น
- ทดสอบ token หมดอายุ, token ใช้ซ้ำ, stale version และ identity conflict
