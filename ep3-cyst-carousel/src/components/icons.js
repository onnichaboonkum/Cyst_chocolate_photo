/* =========================================================
   FLAT VECTOR ILLUSTRATIONS — วาดเองทั้งหมด (ไม่มีภาพคน / อวัยวะสมจริง)
   เส้นขอบ Espresso หนาเท่ากันทุกขนาด (non-scaling-stroke)
   ========================================================= */
export const col = (c) => (!c || c === "none" ? "none" : c.startsWith("#") ? c : `var(--c-${c})`);
const st = (w = "var(--stroke)") =>
  `stroke="var(--c-espresso)" style="stroke-width:${w}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"`;
const svg = (vb, body, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}">${body}</svg>`;

/* ---------- ใบเสร็จยาวม้วนลงมา (p1) ---------- */
export function receiptRoll({ h = 820 } = {}) {
  const W = 240, x0 = 26, x1 = 214, zig = 14;
  let zz = `M${x0} 40 H${x1} V${h - 20}`;
  for (let x = x1, up = true; x > x0; x -= zig, up = !up) zz += ` L${Math.max(x - zig, x0)} ${h - 20 + (up ? 12 : 0)}`;
  zz += ` Z`;
  let lines = "";
  for (let y = 120, i = 0; y < h - 120; y += 44, i++) {
    const long = [150, 110, 132, 90, 140, 120][i % 6];
    lines += `<path d="M52 ${y} H${52 + long}" fill="none" ${st()} opacity=".75"/>`;
    lines += `<path d="M${W - 70} ${y} H${W - 50}" fill="none" ${st()} opacity=".75"/>`;
  }
  return svg(`0 0 ${W} ${h}`, `
    <path d="${zz}" fill="var(--c-oat-light)" ${st()}/>
    <path d="M52 74 H150" fill="none" ${st("7px")}/>
    ${lines}
    <path d="M52 ${h - 96} H${W - 50}" fill="none" ${st()} stroke-dasharray="2 10"/>
    <rect x="52" y="${h - 76}" width="${W - 104}" height="26" rx="6" fill="var(--c-pumpkin)" ${st()}/>
    <rect x="8" y="12" width="${W - 16}" height="46" rx="23" fill="var(--c-oat-deep)" ${st()}/>
    <ellipse cx="${W - 20}" cy="35" rx="10" ry="21" fill="var(--c-oat)" ${st()}/>
  `, "long receipt");
}

/* ---------- เหรียญ ---------- */
export function coin({ fill = "pumpkin" } = {}) {
  return svg("0 0 100 100", `
    <circle cx="54" cy="54" r="42" fill="var(--c-espresso)"/>
    <circle cx="48" cy="48" r="42" fill="${col(fill)}" ${st()}/>
    <circle cx="48" cy="48" r="29" fill="none" ${st()} opacity=".6"/>
    <text x="48" y="64" text-anchor="middle" font-family="IBM Plex Sans Thai" font-weight="700" font-size="44" fill="var(--c-espresso)">฿</text>
  `, "coin");
}

/* ---------- sparkle ---------- */
export function sparkle({ fill = "oat-light" } = {}) {
  return svg("0 0 100 100", `<path d="M50 2 C54 36 64 46 98 50 C64 54 54 64 50 98 C46 64 36 54 2 50 C36 46 46 36 50 2 Z" fill="${col(fill)}"/>`, "sparkle");
}

/* ---------- รังไข่แบบ doodle (ไม่สมจริง) ---------- */
export function ovaryDoodle() {
  return svg("0 0 360 260", `
    <path d="M40 70 C 70 40 120 40 150 70 C 170 90 190 110 212 120" fill="none" ${st("6px")}/>
    <path d="M40 70 l-26 -14 M40 70 l-30 6 M40 70 l-20 22 M40 70 l-6 -30" fill="none" ${st()}/>
    <ellipse cx="258" cy="150" rx="84" ry="68" fill="var(--c-oat-light)" ${st()} transform="rotate(-14 258 150)"/>
    <circle cx="232" cy="176" r="12" fill="var(--c-oat)" ${st()}/>
    <circle cx="300" cy="118" r="9" fill="var(--c-oat)" ${st()}/>
    <circle cx="274" cy="156" r="36" fill="var(--c-choco)" ${st()}/>
    <path d="M258 140 q 8 -8 18 -6" fill="none" stroke="var(--c-oat-light)" stroke-width="6" stroke-linecap="round"/>
    <path d="M190 226 q 30 16 70 6" fill="none" ${st()} stroke-dasharray="3 12"/>
  `, "ovary doodle");
}

/* ---------- ปฏิทิน (วงแดง) ---------- */
export function calendar() {
  let dots = "";
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) dots += `<rect x="${46 + c * 40}" y="${108 + r * 34}" width="18" height="14" rx="3" fill="var(--c-espresso)" opacity=".7"/>`;
  return svg("0 0 240 240", `
    <rect x="20" y="36" width="200" height="190" rx="22" fill="var(--c-oat-light)" ${st()}/>
    <path d="M20 58 Q20 36 42 36 H198 Q220 36 220 58 V86 H20 Z" fill="var(--c-red)" ${st()}/>
    <rect x="62" y="18" width="14" height="40" rx="7" fill="var(--c-espresso)"/>
    <rect x="164" y="18" width="14" height="40" rx="7" fill="var(--c-espresso)"/>
    ${dots}
    <path d="M114 134 C 96 118 132 102 150 116 C 170 132 150 160 124 152 C 106 146 104 128 124 122" fill="none" stroke="var(--c-red)" stroke-width="7" stroke-linecap="round"/>
  `, "calendar");
}

/* ---------- ไอคอน 6 ช่อง (p3) ---------- */
export function orDoor() {
  return svg("0 0 100 100", `
    <rect x="44" y="4" width="12" height="8" rx="3" fill="var(--c-red)" ${st()}/>
    <rect x="16" y="16" width="68" height="80" rx="4" fill="var(--c-oat-light)" ${st()}/>
    <path d="M50 16 V96" fill="none" ${st()}/>
    <circle cx="33" cy="42" r="9" fill="var(--c-pumpkin)" ${st()}/><circle cx="67" cy="42" r="9" fill="var(--c-pumpkin)" ${st()}/>
    <path d="M40 66 V74 M60 66 V74" fill="none" ${st()}/>
  `, "operating room door");
}
export function scope() {
  return svg("0 0 100 100", `
    <path d="M18 84 L62 40" fill="none" stroke="var(--c-espresso)" stroke-width="9" stroke-linecap="round"/>
    <rect x="56" y="16" width="30" height="40" rx="8" fill="var(--c-pumpkin)" ${st()} transform="rotate(45 71 36)"/>
    <circle cx="78" cy="28" r="10" fill="var(--c-oat-light)" ${st()}/>
    <circle cx="78" cy="28" r="3.5" fill="var(--c-espresso)"/>
    <path d="M12 90 l8 -8" fill="none" stroke="var(--c-red)" stroke-width="6" stroke-linecap="round"/>
  `, "laparoscope");
}
export function mask() {
  return svg("0 0 100 100", `
    <path d="M10 40 Q 50 20 90 40" fill="none" ${st()}/>
    <path d="M28 30 Q 50 18 72 30 L 66 62 Q 50 72 34 62 Z" fill="var(--c-oat-light)" ${st()}/>
    <rect x="42" y="64" width="16" height="12" rx="3" fill="var(--c-pumpkin)" ${st()}/>
    <path d="M50 76 C 50 92 76 88 82 96" fill="none" stroke="var(--c-espresso)" stroke-width="6" stroke-linecap="round"/>
  `, "anesthesia mask");
}
export function scalpel() {
  return svg("0 0 100 100", `
    <g transform="rotate(-40 50 50)">
      <rect x="8" y="44" width="52" height="14" rx="6" fill="var(--c-pumpkin)" ${st()}/>
      <path d="M60 46 H70 Q 94 46 96 58 H60 Z" fill="var(--c-oat-light)" ${st()}/>
      <path d="M18 51 H48" fill="none" ${st()} opacity=".6"/>
    </g>
  `, "scalpel");
}
export function bed() {
  return svg("0 0 100 100", `
    <path d="M10 30 V86 M90 54 V86" fill="none" stroke="var(--c-espresso)" stroke-width="7" stroke-linecap="round"/>
    <rect x="10" y="56" width="80" height="16" rx="4" fill="var(--c-pumpkin)" ${st()}/>
    <rect x="16" y="44" width="26" height="14" rx="6" fill="var(--c-oat-light)" ${st()}/>
    <path d="M42 56 Q 64 42 88 50 V56 Z" fill="var(--c-oat-light)" ${st()}/>
    <circle cx="22" cy="90" r="5" fill="var(--c-espresso)"/><circle cx="80" cy="90" r="5" fill="var(--c-espresso)"/>
  `, "hospital bed");
}
export function medBottle() {
  return svg("0 0 100 100", `
    <rect x="26" y="8" width="40" height="14" rx="4" fill="var(--c-espresso)"/>
    <rect x="20" y="20" width="52" height="72" rx="12" fill="var(--c-oat-light)" ${st()}/>
    <rect x="20" y="40" width="52" height="32" fill="var(--c-pumpkin)" ${st()}/>
    <path d="M46 46 V66 M36 56 H56" fill="none" stroke="var(--c-oat-light)" stroke-width="7" stroke-linecap="round"/>
    <g transform="rotate(-30 80 78)"><rect x="66" y="70" width="30" height="16" rx="8" fill="var(--c-red)" ${st()}/></g>
  `, "medicine bottle");
}

/* ---------- นาฬิกาทราย (p6) ---------- */
export function hourglass() {
  return svg("0 0 100 130", `
    <rect x="12" y="6" width="76" height="14" rx="6" fill="var(--c-espresso)"/>
    <rect x="12" y="110" width="76" height="14" rx="6" fill="var(--c-espresso)"/>
    <path d="M22 20 H78 C78 50 56 58 56 65 C56 72 78 80 78 110 H22 C22 80 44 72 44 65 C44 58 22 50 22 20 Z" fill="var(--c-oat-light)" ${st()}/>
    <path d="M32 34 H68 C 64 48 54 52 50 58 C 46 52 36 48 32 34 Z" fill="var(--c-red)"/>
    <path d="M30 108 C 34 92 44 88 50 86 C 56 88 66 92 70 108 Z" fill="var(--c-red)"/>
    <path d="M50 66 V86" fill="none" stroke="var(--c-red)" stroke-width="4" stroke-dasharray="3 5" stroke-linecap="round"/>
  `, "hourglass");
}

/* ---------- shield + หัวใจ (p7) ---------- */
export function shieldHeart() {
  return svg("0 0 240 270", `
    <path d="M128 18 L222 54 V130 Q222 212 128 258 Q34 212 34 130 V54 Z" fill="var(--c-espresso)"/>
    <path d="M120 10 L214 46 V122 Q214 204 120 250 Q26 204 26 122 V46 Z" fill="var(--c-oat-light)" ${st()}/>
    <path d="M120 34 L192 62 V122 Q192 186 120 224 Q48 186 48 122 V62 Z" fill="none" ${st()} stroke-dasharray="4 12" opacity=".6"/>
    <path d="M120 180 C 76 150 66 128 66 110 C 66 92 80 82 94 82 C 106 82 116 90 120 100 C 124 90 134 82 146 82 C 160 82 174 92 174 110 C 174 128 164 150 120 180 Z" fill="var(--c-red)" ${st()}/>
    <path d="M86 106 Q 88 96 98 94" fill="none" stroke="var(--c-oat-light)" stroke-width="7" stroke-linecap="round"/>
  `, "shield with heart");
}
export function bookmark({ fill = "oat-light" } = {}) {
  return svg("0 0 60 80", `<path d="M8 6 H52 V74 L30 56 L8 74 Z" fill="${col(fill)}" ${st()}/>`, "bookmark");
}
/** 💙 — ฟอนต์หลักไม่มี emoji จึงวาดเป็น SVG (สีฟ้าเฉพาะสัญลักษณ์ประจำตัวแพร์) */
export function blueHeart() {
  return svg("0 0 120 110", `<path d="M60 102 C 20 74 6 54 6 34 C 6 16 20 6 36 6 C 48 6 56 13 60 22 C 64 13 72 6 84 6 C 100 6 114 16 114 34 C 114 54 100 74 60 102 Z" fill="var(--c-blue-heart)" ${st()}/>
    <path d="M26 32 Q 28 20 40 18" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/>`, "blue heart");
}
/** ความปวดเมนส์ — สายฟ้าเล็ก doodle */
export function painBolt() {
  return svg("0 0 80 100", `<path d="M48 4 L12 56 H38 L28 96 L70 38 H44 L58 4 Z" fill="var(--c-red)" ${st()}/>`, "pain");
}

/* ---------- Hand-drawn doodles ---------- */
export function handArrow({ color = "pumpkin", w = "7px" } = {}) {
  const l = `fill="none" stroke="${col(color)}" style="stroke-width:${w}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"`;
  return svg("0 0 220 140", `<path d="M10 24 C 70 -2 150 16 172 96" ${l}/><path d="M146 80 L174 108 L196 74" ${l}/>`, "arrow");
}
export function squiggle({ color = "pumpkin" } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true"><path d="M6 24 q 24 -18 48 0 t 48 0 t 48 0 t 48 0 t 48 0 t 48 0 t 48 0 t 48 0" fill="none" stroke="${col(color)}" style="stroke-width:6px" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;
}
export function waveBottom({ layers = ["red-deep"], w = 1080, h = 200, amp = 18, len = 180 } = {}) {
  let body = "";
  layers.forEach((c, i) => {
    const y0 = 20 + i * (h / (layers.length + 0.5)), ph = (i % 2) * (len / 2) - len;
    let d = `M${ph} ${y0}`;
    for (let x = ph; x < w + len; x += len) d += ` q ${len / 4} ${-amp} ${len / 2} 0 t ${len / 2} 0`;
    body += `<path d="${d} L ${w + len} ${h + 5} L ${ph} ${h + 5} Z" fill="${col(c)}"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:100%" aria-hidden="true">${body}</svg>`;
}

export const icons = { receiptRoll, coin, sparkle, ovaryDoodle, calendar, orDoor, scope, mask, scalpel, bed, medBottle,
  hourglass, shieldHeart, bookmark, blueHeart, painBolt, handArrow, squiggle, waveBottom };
