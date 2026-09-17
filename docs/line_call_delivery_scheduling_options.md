# Outbound LINE Call Delivery — Scheduling Options (ยังไม่ตัดสินใจ)

เก็บไว้เทียบตอนต้องตัดสินใจว่าจะให้อะไรเป็นตัวเรียก `/api/cron/deliver-line-calls`
(endpoint ที่หยิบแถว `pending` จาก `thunder_partner.outbound_line_calls` ไปส่งจริงหา
LINE Service) — endpoint เองไม่ผูกกับ Vercel เลย เช็คแค่ `Authorization: Bearer
<CRON_SECRET>` อะไรก็ได้ที่ยิง HTTP GET ตามเวลาแทนได้ทันทีโดยไม่ต้องแก้โค้ด

## บริบท

ปัจจุบันใช้ Vercel Cron (`vercel.json`, `* * * * *` — ทุก 1 นาที) แต่ Vercel Hobby
plan (ฟรี) เท่าที่ทราบจำกัดความถี่ cron ไว้ไม่ถึงระดับนาที ต้องขึ้น Pro plan ถึงจะยิงถี่
ขนาดนี้ได้จริง — ยังไม่ได้ยืนยัน plan จริงของโปรเจกต์นี้

## ตัวเลือก

| ตัวเลือก | ข้อดี | ข้อเสีย | ข้อจำกัด |
|---|---|---|---|
| **Vercel Cron** (ที่ใช้อยู่) | ตั้งค่าใน `vercel.json` ไฟล์เดียว ไม่ต้องพึ่ง service ภายนอก ผูกกับ deploy pipeline อยู่แล้ว | ผูกชีวิตไว้กับ Vercel ล้วน ๆ ย้าย hosting วันไหนต้องรื้อใหม่ | Hobby plan จำกัดความถี่ cron ไว้ไม่ถึงระดับนาที ต้องขึ้น Pro plan ถึงจะยิงถี่แบบ `* * * * *` ที่ตั้งไว้ตอนนี้ได้จริง — ควรเช็ค plan ก่อน |
| **Supabase `pg_cron` + `pg_net`** | อยู่ในระบบ Supabase ล้วน ไม่เพิ่ม dependency ภายนอก ไม่ผูกกับ Vercel plan เลย ตั้งความถี่ได้อิสระ | ต้อง enable extension เพิ่ม (`pg_cron`, `pg_net`) และเขียน SQL เอง แก้/ดู log ต้องเข้า Supabase SQL Editor แทน Vercel dashboard | ต้องเก็บ `CRON_SECRET`/URL ไว้ใน DB (SQL constant หรือ Vault) แทนที่จะเป็น env var ของแอป — ต้องระวัง secret ปนอยู่ใน SQL history |
| **External cron ping** (cron-job.org, EasyCron ฯลฯ) | ตั้งเร็วที่สุด ไม่ต้องแก้โค้ด/SQL เลย ยิง HTTP ธรรมดา | ฝากความน่าเชื่อถือของงานสำคัญไว้กับ 3rd-party ฟรีเซอร์วิสที่คุมไม่ได้ ถ้า service ล่ม/หยุดให้บริการไม่มีใครรู้ตัว | เวอร์ชันฟรีส่วนใหญ่จำกัดความถี่ (เช่น ทุก 5-15 นาที) และมักไม่มี SLA |
| **GitHub Actions (scheduled workflow)** | ถ้าทีมใช้ GitHub อยู่แล้วไม่ต้องเปิด service ใหม่ ดู log/run history ได้ใน Actions tab | เพิ่ม maintenance อีกจุด (ไฟล์ workflow แยกจาก app code) กิน GitHub Actions minutes ของ org | `schedule: cron` การันตีแค่ "ประมาณ" เวลา granularity ต่ำสุดจริง ๆ อยู่ที่ราว 5 นาที ไม่ใช่ทุกนาที |
| **Supabase Database Webhook** (trigger ตอน insert) | ส่งครั้งแรกแทบ real-time ไม่ต้องรอรอบ poll ลด latency ของเคสปกติ (ไม่ fail) ได้เยอะ | ใช้แทนตัว poll เดิมทั้งหมดไม่ได้ — retry ตาม backoff (1m/5m/15m/...) ยังต้องมี scheduler แยกอยู่ดี เพราะ webhook ยิงครั้งเดียวตอน insert ไม่ยิงซ้ำเอง | ต้องทำคู่กับตัวเลือกด้านบนตัวใดตัวหนึ่งเสมอ ใช้เดี่ยว ๆ ไม่ครบ flow |

## คำแนะนำ

ถ้าอยากตัดปัญหาเรื่อง Vercel plan limit ทิ้งไปเลย **`pg_cron` + `pg_net`** คุ้มสุด
เพราะอยู่ในระบบเดียวกับ DB อยู่แล้ว ไม่เพิ่ม external dependency — ถ้าอยากได้ latency
ต่ำสุดสำหรับการส่งครั้งแรกด้วย ค่อยเสริม Database Webhook คู่กันทีหลังได้ ไม่ต้องเลือกอย่างใดอย่างหนึ่ง

## สถานะ

ยังไม่ตัดสินใจ — ยังใช้ Vercel Cron อยู่ตามเดิม รอเช็ค Vercel plan จริงของโปรเจกต์นี้ก่อน
ว่าจำเป็นต้องย้ายออกจริงไหม
