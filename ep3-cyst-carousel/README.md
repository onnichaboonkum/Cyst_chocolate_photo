# EP.3 · ผ่าตัดซีสต์ช็อกโกแลต 1 ครั้ง ≈ เงินเดือน 6 เดือน?

Photo carousel ของ **Prepare with Pair** สร้างด้วย HTML/CSS/SVG แล้ว render เป็น PNG ด้วย Playwright
(ไม่มีภาพคน AI ไม่มี stock photo ไม่มีภาพอวัยวะสมจริง ไม่มีโลโก้บริษัทประกัน)

| ชุด | ขนาด | ไฟล์ |
|---|---|---|
| IG / TikTok photo mode | 1080×1350 (4:5) × 7 | `out/4x5/p01.png … p07.png` |
| TikTok | 1080×1920 (9:16) × 7 | `out/9x16/p01.png … p07.png` |
| Facebook โพสต์หลายภาพ | 1080×1080 (1:1) × 4 | `out/fb_1x1/fb01.png … fb04.png` |
| ภาพรวม | — | `out/contact_sheet.png`, `out/fb_grid_preview.png` (+ `fb_grid_preview_phone400.png` จำลองจอมือถือกว้าง 400px) |

## แก้แล้ว render ใหม่ในคำสั่งเดียว

```bash
npm install          # ครั้งแรกครั้งเดียว (ติดตั้ง playwright)
npm run carousel     # render ทุกชุด + QA + contact sheet + fb grid preview
```

| อยากแก้ | แก้ที่ |
|---|---|
| **ข้อความ** | `content.json` (ไม่ต้องแตะ HTML) |
| **สี / ฟอนต์ / ขนาดตัวอักษร / ขอบ / เงา** | `tokens.css` |
| ตำแหน่ง / ขนาดของ graphic ในแต่ละหน้า | `src/styles/pages.css` (แยกตามหน้า `.p01` … `.fb04`, ปรับเฉพาะ 9:16 ด้วย `.r-9x16.p0X`) |
| โครงหน้า (ลำดับการ์ด ฯลฯ) | `src/pages.js` |
| รูปทรง illustration | `src/components/icons.js` |
| component กลาง (PillTag, Headline, BigNumber, RoundCard, Chip, HandArrow, Stamp, Sparkle, WaveBottom, Slide) | `src/components/ui.js` |

### สัญลักษณ์ใน content.json
- `|` = จุดที่อนุญาตให้ตัดบรรทัด (ภาษาไทยตัดได้เฉพาะที่ช่องว่างและ `|` → ไม่ตัดกลางคำ)
- `~` = ช่องว่างที่ห้ามตัดบรรทัด เช่น `30,000~×~6~เดือน`
- `**คำ**` = ตัวหนา · `==คำ==` = ไฮไลต์ marker
- `💙` จะถูกวาดเป็น SVG (ฟอนต์หลักไม่มี emoji) · ☐ วาดเป็นกล่อง checkbox

`npm run carousel` จะตรวจว่าข้อความ (หลังตัดสัญลักษณ์ข้างบนออก) **ตรงกับ `copy.md` ตามตัวอักษร** — ถ้าแก้ข้อความ ให้แก้ `copy.md` ให้ตรงกันด้วย

### ดูสดระหว่างแก้
```bash
npm run preview
# http://localhost:5173/carousel.html?page=p03&ratio=4x5     (ratio: 4x5 | 9x16 · page: p01–p07 | fb01–fb04)
# เพิ่ม &guides=1 เพื่อดูกรอบ frame / จัตุรัสกลาง
```

## Layout rules ที่ระบบบังคับ
- **4:5** ขอบ 72px · ข้อความหลัก (`data-key`) อยู่ในจัตุรัสกลาง y 135–1215 เผื่อแพลตฟอร์มครอปเป็นจัตุรัส
- **9:16** ใช้ layout เดียวกันในกรอบ 1080×1350 ที่ y 170 → ข้อความไม่เกิน y 1540 (เว้นล่าง 380) และ x ≤ 940 (เว้นขวา 140 สำหรับปุ่ม TikTok) พื้นหลังบน/ล่างขยายด้วยสีพื้น + คลื่น (ไม่ยืดภาพ)
- **1:1 Facebook** ข้อความอยู่ในกรอบกลาง 864×864 (ขอบ 108 = 10%) · headline ≥ 88px · body ≥ 48px · ตัวหนังสือ ≥ 30px (disclaimer ≥ 26px) · ≤ 3 ก้อนข้อความ
- Headline เกิน 3 บรรทัด → ลดทีละ 4px จนพอดี ไม่ต่ำกว่า 64px (อัตโนมัติ)

## QA อัตโนมัติ (`scripts/render.mjs`)
copy ตรงตามตัวอักษร · ตัวเลข 185,297฿ / 189,000฿ / 120 วัน / 30,000 × 6 ครบ · ไม่มีคำฟันธง · safe zone ทุก ratio ·
ข้อความหลักอยู่ในจัตุรัสกลาง (4:5) · ขนาดตัวอักษรขั้นต่ำ · contrast ≥ 4.5:1 ทุกข้อความ · ไม่มีฟอนต์ fallback ·
ไม่มีสระ/วรรณยุกต์ลอยต้นบรรทัด · ไม่มีกล่องข้อความล้นหรือทับกัน · FB ≤ 3 ก้อนข้อความ

## ฟอนต์
IBM Plex Sans Thai (500/600/700) + DM Serif Display — SIL Open Font License (`fonts/OFL-*.txt`)
DM Serif Display ไม่มี glyph `฿` จึง render `฿` ด้วย IBM Plex Sans Thai
