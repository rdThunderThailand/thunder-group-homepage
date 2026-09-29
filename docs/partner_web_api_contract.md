# Partner Web API Contract

Partner Web เรียก `thunderCRM` จาก server-side Route Handler เท่านั้น

## Submit

`POST /partner/applications`

Headers:

```text
Authorization: Bearer <PARTNER_SYSTEM_SECRET>
Content-Type: application/json
```

Body:

```json
{
  "submissionId": "5ccbd97e-e1f8-4a13-87e8-92a6b4c93075",
  "token": "<43-character-LINE-token-or-null>",
  "taxId": "0105559999999",
  "companyName": "Example Company Limited",
  "email": "applicant@example.com",
  "applicationData": {}
}
```

Response `201`:

```json
{
  "applicationId": "5ccbd97e-e1f8-4a13-87e8-92a6b4c93075",
  "status": "PENDING"
}
```

`submissionId` เป็น idempotency key การ retry ต้องส่ง body เดิม Token มีอายุ 30 นาที
ใช้ได้ครั้งเดียว และต้องตรงรูปแบบ `[A-Za-z0-9_-]{43}`

Partner Web ไม่ต้องเรียก `/callbacks/partner`, `/partner/token/exchange` หรือ Supabase
โดยตรง การสร้างข้อมูลและผูก LINE เป็นความรับผิดชอบของ `thunderCRM`
