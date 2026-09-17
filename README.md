# Follow-up Board

Next.js + TypeScript ใช้ App Router ใน `src/app`

หน้า Follow-up Board รองรับการเพิ่มและแก้ไขผู้ติดต่อ สถานะ วันติดตาม ค้นหา กรอง และบันทึกประวัติการติดตาม

หน้า `/contacts` บันทึกข้อมูลจริงใน Supabase PostgreSQL ผ่าน Prisma รองรับดูรายละเอียด เพิ่ม แก้ไข ลบ ค้นหา และกรองข้อมูล ข้อมูลแยกตามเจ้าของบัญชีและคงอยู่เมื่อรีเฟรชหรือเริ่ม server ใหม่ ฟอนต์ Inter และ Noto Sans Thai โหลดจาก Google Fonts พร้อมฟอนต์ fallback

## เริ่มต้น

```sh
npm install
npm run dev
```

เปิด http://localhost:3000

หน้า `/` และ `/dashboard` แสดงต้นแบบแดชบอร์ดจาก Stitch รวมข้อมูลตัวอย่าง ส่วน `/contacts` จัดการข้อมูลจริงตาม `docs/features/contacts.md` ตัวกรองวันนี้และเกินกำหนดใช้วันปัจจุบันในเขตเวลา Asia/Bangkok

## ตรวจสอบและ build

ทดสอบ Contacts ด้วย `npm run test:run` หรือเปิด Vitest UI ด้วย `npm run test:ui` ชุด `tests/contacts.test.ts` ครอบคลุม API CRUD, session, สิทธิ์เจ้าของข้อมูล, Origin และ validation โดยจำลอง Better Auth/Prisma ไม่เชื่อม Supabase จริงและไม่แก้ข้อมูลจริง ชุดนี้ยังไม่ทดสอบ UI ใน browser

```sh
npm run typecheck
npm run build
```

รายละเอียดโครงการ: `docs/spec.md` และ `docs/design.md`

## Authentication

ใช้ Better Auth สำหรับ Email/Password ผ่าน Prisma PG adapter กับ Supabase PostgreSQL เดิม เปิด `/sign-up` เพื่อสมัครสมาชิก หรือ `/sign-in` เพื่อเข้าสู่ระบบ เมื่อสำเร็จจะไป `/dashboard` ซึ่งตรวจ session ฝั่ง server ก่อนแสดงหน้า

ตั้ง `DATABASE_URL`, `BETTER_AUTH_SECRET` (ค่าสุ่มอย่างน้อย 32 ตัวอักษร) และ `BETTER_AUTH_URL` ใน `.env` ตาม `.env.example` เปลี่ยน URL ให้ตรงกับโดเมนเมื่อ deploy

เมื่อเปลี่ยน schema ใช้ `npx prisma db push` และ `npx prisma generate` ตาม `docs/skills/prisma.md`

## Access

หน้า `/`, `/dashboard` และ `/contacts` ตรวจ session ฝั่ง server และส่งผู้ที่ยังไม่ล็อกอินไป `/sign-in` ส่วน `/api/contacts` ตอบ 401 หากไม่มี session ที่ใช้ได้ ทุกการอ่าน/เพิ่ม/แก้ไข/ลบเลือกชุดข้อมูลจาก user ID ใน session เท่านั้น ไม่รับเจ้าของข้อมูลจาก client และตอบ 404 เมื่อใช้ ID ของ Contact ที่ไม่อยู่ในบัญชีตนเอง การเปลี่ยนข้อมูลตรวจ Origin ด้วย

## ข้อมูล Contact ตัวอย่าง

รัน `node prisma/seed-contacts.cjs user@example.com` เพื่อเพิ่มข้อมูลตัวอย่าง 8 รายชื่อให้บัญชีที่มีอยู่แล้ว วันที่ติดตามอิงวันที่รัน seed รันซ้ำสำหรับบัญชีเดิมไม่เพิ่มข้อมูลซ้ำและไม่เขียนทับข้อมูลที่แก้ไขไว้

Seed เปิด RLS บนตาราง `Contact` โดยไม่ให้สิทธิ์ public ผ่าน Supabase REST แอปอ่านเขียนจาก server ด้วย `DATABASE_URL` เดิมที่มีสิทธิ์เข้าฐานข้อมูล ส่วนการตรวจ session และเจ้าของข้อมูลใช้ Better Auth กับ Prisma ไม่ใช้ Supabase Auth
