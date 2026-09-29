/* =========================================================
   UI COMPONENTS — PillTag, Headline, BigNumber, RoundCard, Chip,
   HandArrow, Stamp, Sparkle, WaveBottom, Slide(ratio)
   ทุก component คืนค่าเป็น HTML string
   ========================================================= */
import { icons } from "./icons.js";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Rich text สำหรับภาษาไทย
 *  - ตัดบรรทัดได้เฉพาะที่ "ช่องว่าง" และ "|" (จุดตัดคำที่กำหนดเอง) → ไม่ตัดกลางคำ
 *  - "~" = ช่องว่างที่ห้ามตัดบรรทัด  (เช่น 30,000~×~6)
 *  - **คำ** = ตัวหนา   ==คำ== = marker ไฮไลต์   💙 = SVG heart
 *  เครื่องหมายเหล่านี้ถูกตัดออกตอนตรวจกับ copy.md
 */
export function fmt(str) {
  const inline = (t) =>
    esc(t)
      .replace(/\*\*(.+?)\*\*/g, '<b class="em">$1</b>')
      .replace(/==(.+?)==/g, '<mark class="mk">$1</mark>')
      .replace(/~/g, " ")
      .replace(/💙/g, `<span class="emoji" data-emoji="💙">${icons.blueHeart()}</span>`);
  // markers may span spaces (e.g. **ระยะรอคอย 120 วัน**) → tokenise on raw string, then re-balance tags
  const out = [];
  let open = [];
  for (const tok of String(str).split(/(\s+|\|)/)) {
    if (tok === "|") { out.push("<wbr>"); continue; }
    if (/^\s+$/.test(tok)) { out.push(" "); continue; }
    if (!tok) continue;
    // carry bold / mark across tokens
    let t = tok, pre = open.map((m) => m).join(""), post = "";
    const toggles = (t.match(/\*\*|==/g) || []);
    for (const m of toggles) open = open.includes(m) ? open.filter((x) => x !== m) : [...open, m];
    post = open.slice().reverse().join("");
    out.push(`<span class="seg">${inline(pre + t + post)}</span>`);
  }
  return out.join("");
}
export const plain = (s) => String(s).replace(/\*\*|==|\|/g, "").replace(/~/g, " ");

export const PillTag = (text, variant = "") => {
  if (!text) return "<span></span>";
  const m = String(text).match(/^(\S+)\s*\/\s*(.+)$/);
  const inner = m ? `<span class="num">${esc(m[1])}</span><span class="sl">/</span><span>${esc(m[2])}</span>` : esc(text);
  return `<span class="pill ${variant}" data-text>${inner}</span>`;
};
export const Masthead = (brand, no, total) =>
  `<div class="mast" data-meta>${esc(brand).replace(" with ", " <i>with</i> ")}<span class="rule"></span><i>No.</i> ${String(no).padStart(2, "0")} — ${String(total).padStart(2, "0")}</div>`;

export const Headline = (text, { cls = "", maxLines = 3, min } = {}) =>
  `<h1 class="hl ${cls}" data-fit="lines" data-max-lines="${maxLines}" ${min ? `data-min="${min}"` : ""} data-key>${fmt(text)}</h1>`;

/** ตัวเลขยักษ์ serif — ฿ ใช้ฟอนต์ไทย (DM Serif ไม่มี glyph ฿) */
export const BigNumber = (text, { cls = "", size = 220 } = {}) => {
  const m = String(text).match(/^(.*?)(฿?)$/);
  return `<div class="bignum ${cls}" style="font-size:${size}px" data-fit="width" data-key>${esc(m[1])}${m[2] ? '<span class="baht">฿</span>' : ""}</div>`;
};
export const RoundCard = (html, cls = "") => `<div class="card ${cls}" data-box>${html}</div>`;
export const Chip = (icon, label) => `<div class="chip" data-box><span class="ico">${icons[icon]()}</span><span>${fmt(label)}</span></div>`;
export const HandArrow = (cls, opts) => `<div class="decor ${cls}">${icons.handArrow(opts)}</div>`;
export const Sparkle = (cls, fill) => `<div class="decor ${cls}">${icons.sparkle({ fill })}</div>`;
export const Stamp = (html, cls = "") => `<div class="decor stamp ${cls}">${html}</div>`;
export const WaveBottom = (cls, opts) => `<div class="decor ${cls}">${icons.waveBottom(opts)}</div>`;
export const Illo = (name, cls, opts) => `<div class="decor ${cls}">${icons[name](opts)}</div>`;
export const Check = (text) => `<div class="check" data-box><span class="box" aria-label="☐"></span><span>${fmt(text)}</span></div>`;

/**
 * Slide — component เดียวรองรับ ratio "4x5" | "9x16" | "1x1"
 * canvasDecor: ตกแต่งระดับ canvas (ขยายพื้นหลังบน/ล่างในเวอร์ชัน 9:16)
 */
export function Slide({ ratio, bg, id, header = "", main, footer = "", decor = "", canvasDecor = "" }) {
  const hdr = ratio === "1x1" ? header : `<header class="hdr">${header}</header>`;
  const ftr = ratio === "1x1" ? footer : `<footer class="ftr">${footer}</footer>`;
  return `<div class="canvas r-${ratio} bg-${bg} ${id}" data-ratio="${ratio}">
    ${canvasDecor}
    <div class="frame">${hdr}<main class="main">${main}</main>${ftr}${decor}</div>
  </div>`;
}
