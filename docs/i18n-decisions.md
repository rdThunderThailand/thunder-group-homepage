# การตัดสินใจเรื่องเว็บสองภาษา (i18n)

วันที่: 2026-09-08
สรุปจากการสัมภาษณ์ (grilling) ก่อนลงมือ implement รอบแรก

โครงสร้างพื้นฐานอ้างอิงจากโปรเจกต์พี่น้อง **ThunderOne-Connected-Organization-Platform**
(`workja/thunderone-connected-organization-platform/`) — เอกสารนี้บันทึกเฉพาะสิ่งที่ตัดสินใจ
สำหรับ `thunder-group-homepage` และ **จุดที่จงใจทำต่างจาก ThunderOne**

---

## 1. ภาษาที่รองรับ

- **ไทย (`th`)** — ค่าเริ่มต้น (default locale) และเป็นภาษาต้นทางของคำแปล
- **อังกฤษ (`en`)** — ภาษารอง

## 2. โครงสร้าง routing

- path-based routing: `src/app/[locale]/...`
- **มี locale prefix เสมอทุกภาษา** (`localePrefix: "always"`) — `/th/...`, `/en/...` ไม่มีเวอร์ชันไม่มี prefix
- `/` เปล่า → redirect ไป `/{locale}` เสมอ
- slug เหมือนกันทั้งสองภาษา ไม่แปล path

## 3. การเลือกภาษาเมื่อเข้า root `/` — ลำดับความสำคัญ

1. **locale ใน URL** (มี prefix อยู่แล้ว) — จัดการโดย `handleI18nRouting` ของ next-intl
2. **cookie `NEXT_LOCALE` ที่ผู้ใช้เลือกเอง** — จัดการโดย next-intl (`localeDetection: true`)
3. **geo-IP** ผ่าน `geolocation()` จาก `@vercel/functions`
   - `country === "TH"` → `th`
   - มี country อื่น → `en`
   - ไม่มี country (unknown / `next dev` / host ที่ไม่ใช่ Vercel) → `th` (site default)
4. (ไม่มีข้อ 4 — geo คลุมทุกกรณีแล้ว)

**ข้อจำกัด:** `geolocation()` มีข้อมูลเฉพาะบน Vercel จริง — `next dev` จะเข้าทาง unknown → `th`
เสมอ การทดสอบ branch "ไม่ใช่ไทย → en" ต้อง deploy จริง (ตัดสินใจ: ไม่ใส่ dev override)

## 4. การเก็บคำแปล

- ไฟล์ dictionary ในโค้ด ไม่ใช่ database — dev แก้เอง ผ่าน deploy
- ไลบรารี **`next-intl`** v4
- **แยกไฟล์ต่อ namespace**: `messages/{th,en}/<namespace>.json` (ที่ root repo ไม่ใช่ใน `src/`)
- namespace รอบนี้: `common`, `home` เท่านั้น (map: `Common→common`, `HomePage→home` ใน
  `src/i18n/messages.ts`) — ไม่ pre-create namespace ของหน้าอนาคต

## 5. เนื้อหาในอนาคต

- ยังไม่มี Supabase ในโปรเจกต์นี้ (ต่างจาก ThunderOne) — เมื่อถึงเวลาเก็บเนื้อหาที่โตเรื่อยๆ
  (Customer Stories, บทความ) ค่อยเพิ่ม แล้วแยกชั้น data-fetching ออกจาก UI

## 6. คำแปลขาดหาย — **ทำเต็ม (ThunderOne ไม่มีส่วนนี้)**

- `src/i18n/messages.ts`: โหลด `th/*` เป็น base เสมอ ถ้า locale เป็น `en` จะ `deepMerge` ไฟล์
  `en/*` ทับ — key ที่ยังไม่มีใน `en` จะ fallback เป็นข้อความไทย ไม่โชว์ `Namespace.key` ดิบ
  และไม่ทำให้หน้าเว็บพัง
- `scripts/check-i18n.mjs`: เทียบ set ของ key path ทุก namespace ระหว่าง `th` กับ `en`
  (จับทั้ง key ที่ขาด และ value ที่เป็น string ว่าง) — เจอปัญหา → `exit 1`
- gate ใน build: `"build": "node scripts/check-i18n.mjs && next build"` + มี
  `"check:i18n"` แยกให้เรียกเดี่ยว — Vercel deploy ผ่าน `pnpm build` จึงบล็อกคำแปลไม่ครบก่อนขึ้น prod

## 7. Language switcher

- **ยังไม่ทำ UI รอบนี้** — deferred ไปพร้อม Navbar
- `src/i18n/navigation.ts` export `Link`/`usePathname`/`useRouter` ไว้ให้ switcher ในอนาคต
  สลับ locale prefix โดยอยู่หน้าเดิม

## 8. glossary คำตายตัว

- `common.json` เป็น namespace กลางสำหรับชื่อแบรนด์/feature ที่ต้องพิมพ์ตรงกันทุกที่
  (รอบนี้: `brandName`, `brandMark`) — interpolate เข้าประโยคผ่าน next-intl แทนพิมพ์ซ้ำ
- ค่าใน `th.json` ไม่จำเป็นต้องเป็นภาษาไทย — ใส่อังกฤษตรงๆ ได้ถ้าตั้งใจให้คงเป็นอังกฤษ

## 9. งานคู่ขนาน

- ไม่มี `middleware.ts` เดิมให้ migrate (โปรเจกต์นี้ยังไม่เคยมี) — สร้าง `src/proxy.ts` ใหม่
  ตาม convention Next.js 16 เลย

---

## สถานะโปรเจกต์ตอนเริ่ม (2026-09-08)

- Next.js 16.3.4, App Router, React 19.2.8, Tailwind v4, pnpm 12.3.4
- ก่อนหน้านี้เป็น create-next-app เปล่า: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- ไม่มี `src/`, ไม่มี Navbar/Footer/หน้าอื่น, ไม่มี Supabase
- ติดตั้งใน session นี้: `next-intl@4.14.2`, `lucide-react@1.41.0`, `@vercel/functions@3.9.5`
  (`lucide-react` ยังไม่ได้ใช้ — เผื่อ Navbar/switcher)

## สิ่งที่ทำในรอบนี้

- ย้าย `app/` → `src/app/[locale]/`, `tsconfig` `@/*` → `./src/*`
- ไม่มี `src/app/layout.tsx` — root layout คือ `src/app/[locale]/layout.tsx` (ตาม ThunderOne)
- `src/i18n/`: `routing.ts`, `navigation.ts`, `request.ts`, `messages.ts` (+ deep-merge fallback)
- `src/proxy.ts`: URL > cookie(manual) > geo-IP > `th`; geo redirect **ไม่เซ็ต cookie**;
  redirect ก่อนเสมอเมื่อไม่มี prefix+cookie → next-intl ไม่มีวันไปถึง `accept-language`
- `src/app/[locale]/layout.tsx`: `generateStaticParams` + `setRequestLocale` +
  `generateMetadata` (namespace `Common`) + ฟอนต์ `Prompt` (`subsets: ['thai','latin']`,
  weight 300–700, `variable: --font-prompt`) + `NextIntlClientProvider` ครอบ `{children}`
  ส่งแค่ `{ Common }`
- `src/app/[locale]/page.tsx`: placeholder — `<h1>` + `<p>` จาก namespace `HomePage`
- `src/app/globals.css`: `--font-sans` → `var(--font-prompt)`
- `messages/{th,en}/common.json` + `home.json` — **ค่าเป็น draft placeholder รอ copy จริง**
- `scripts/check-i18n.mjs` + `next.config.ts` (`createNextIntlPlugin`) + `package.json` scripts

## จุดที่ทำต่างจาก ThunderOne (จงใจ)

| เรื่อง | ThunderOne | ที่นี่ |
|---|---|---|
| proxy §3 flow | fall through หา `accept-language` ได้ + geo redirect เซ็ต cookie | redirect ก่อนเสมอ (accept-language ไม่ทำงาน) + geo ไม่เซ็ต cookie |
| คำแปลขาด (§6) | ไม่มี — vanilla | deep-merge ไทยเป็น base + `check-i18n` gate ใน build |
| Supabase | มีใน deps แล้ว | ยังไม่มี |
| ขอบเขต | ทำหน้าจริง + Navbar/Footer | infra ล้วน — Navbar/Footer/switcher/หน้าเนื้อหา deferred |

## เลื่อนไปทีหลัง

Navbar · Footer · language switcher UI · หน้าเนื้อหา (`about`, `partners`, `platform`,
`resources`, `solutions`, `use-cases`) · Supabase data layer · copy จริง · CI workflow

## หมายเหตุที่ควรรู้

- `localeCookie` ปล่อย default — next-intl จะเซ็ต `NEXT_LOCALE` เองเวลา resolve locale ผ่าน
  `<Link>`/router (ตอนทำ switcher) ไม่ใช่ "manual only" เป๊ะตาม §3 แต่เป็น behavior มาตรฐาน
- ไม่มี `src/app/layout.tsx` — ถ้า `next build` ทักเรื่อง root layout / not-found นอก `[locale]`
  ค่อยเพิ่มไฟล์ minimal ที่ return `children`
