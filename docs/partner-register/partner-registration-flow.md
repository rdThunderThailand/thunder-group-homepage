# Partner Registration Flow

`thunder-group` รับข้อมูลฟอร์มและส่งต่อไป `thunderCRM` เท่านั้น ไม่เชื่อม Supabase
และไม่เขียนฐานข้อมูลเอง

1. ผู้ใช้เปิด `/th/partners?t=<LINE token>` จาก LINE Rich Menu
2. หน้าเว็บเก็บ token ใน HttpOnly cookie แล้วลบ token ออกจาก URL
3. ผู้ใช้กรอกฟอร์มและ browser ส่ง `POST /api/partner/applications`
4. Route Handler ตรวจ same-origin และส่ง body พร้อม token ไป
   `POST {THUNDER_LINE_API_URL}/partner/applications`
5. `thunderCRM` สร้าง Auth user, tenant, user, membership และ application พร้อมผูก
   LINE identity ภายใน transaction เดียว
6. เมื่อสำเร็จ หน้าเว็บแสดงเลข application และลบ token cookie

ผล review จาก Admin เป็นหน้าที่ของระบบ Production ซึ่งเรียก callback ของ `thunderCRM`
โดยตรง ไม่ย้อนผ่าน `thunder-group`

Environment ฝั่งเว็บ:

```env
NEXT_PUBLIC_LIFF_ID=
NEXT_PUBLIC_LINE_API_URL=
THUNDER_LINE_API_URL=
PARTNER_SYSTEM_SECRET=
```

`PARTNER_SYSTEM_SECRET` ต้องอยู่ฝั่ง server เท่านั้น
