/* Renders one slide: carousel.html?page=p01&ratio=4x5 | 9x16   ·   ?page=fb01 (1x1) */
import { templates } from "./pages.js";

const q = new URLSearchParams(location.search);
const id = q.get("page") ?? "p01";
const ratio = id.startsWith("fb") ? "1x1" : q.get("ratio") ?? "4x5";
if (q.has("guides")) document.documentElement.classList.add("guides");

const content = await (await fetch("./content.json", { cache: "no-store" })).json();
const data = id.startsWith("fb") ? content.fb[id] : content.pages[id];
document.getElementById("root").innerHTML = templates[id](data, ratio, content);

await document.fonts.ready;
await Promise.all(['700 40px "IBM Plex Sans Thai"', '500 40px "IBM Plex Sans Thai"', '600 40px "IBM Plex Sans Thai"',
  '400 40px "DM Serif Display"', 'italic 400 40px "DM Serif Display"'].map((f) => document.fonts.load(f, "กขAa1฿")));

/* Auto-fit: headline เกิน N บรรทัด → ลดทีละ 4px (ไม่ต่ำกว่า min) · ตัวเลขยักษ์ → ย่อให้พอดีความกว้าง */
const lineCount = (el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight));
for (const el of document.querySelectorAll('[data-fit="lines"]')) {
  const max = +el.dataset.maxLines, min = +(el.dataset.min ?? 64);
  let size = parseFloat(getComputedStyle(el).fontSize);
  while ((lineCount(el) > max || el.scrollWidth > el.clientWidth + 1) && size - 4 >= min) { size -= 4; el.style.fontSize = size + "px"; }
  el.dataset.lines = lineCount(el);
}
for (const el of document.querySelectorAll('[data-fit="width"]')) {
  let size = parseFloat(el.style.fontSize);
  const avail = () => el.parentElement.clientWidth - parseFloat(getComputedStyle(el.parentElement).paddingLeft) - parseFloat(getComputedStyle(el.parentElement).paddingRight);
  while (el.scrollWidth > avail() && size > 60) { size -= 4; el.style.fontSize = size + "px"; }
}
window.__ready = true;
