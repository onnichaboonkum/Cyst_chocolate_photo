// npm run carousel → render ทุกหน้า + QA อัตโนมัติ + contact sheet + fb grid preview
//   node scripts/render.mjs p03        → render เฉพาะหน้าที่ชื่อมี "p03"
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { startServer, ROOT } from "./serve.mjs";

const RATIOS = ["4x5", "9x16"];
const PAGES = ["p01", "p02", "p03", "p04", "p05", "p06", "p07"];
const FB = ["fb01", "fb02", "fb03", "fb04"];
const OUT = join(ROOT, "out");
const only = process.argv.slice(2);
const want = (name) => !only.length || only.some((o) => name.includes(o));

/* ---------------- 1. Copy checks (ก่อน render) ---------------- */
const content = JSON.parse(readFileSync(join(ROOT, "content.json"), "utf8"));
const copy = readFileSync(join(ROOT, "copy.md"), "utf8").replace(/\*\*|`/g, "");
const plain = (s) => s.replace(/\*\*|==|\|/g, "").replace(/~/g, " ");
const SKIP_KEYS = new Set(["_help", "bg", "icon", "brand", "total", "n"]);
const copyIssues = [];
const allText = [];
(function walk(o, path) {
  for (const [k, v] of Object.entries(o)) {
    if (SKIP_KEYS.has(k)) continue;
    if (typeof v === "string") {
      allText.push(plain(v));
      if (!copy.includes(plain(v))) copyIssues.push(`COPY MISMATCH ${path}.${k}: "${plain(v)}"`);
    } else if (typeof v === "object") walk(v, `${path}.${k}`);
  }
})(content, "content");
const joined = allText.join("\n");
for (const n of ["185,297฿", "189,000฿", "120 วัน", "30,000 × 6"]) if (!joined.includes(n)) copyIssues.push(`MISSING NUMBER: ${n}`);
for (const w of ["เคลมได้แน่นอน", "คุ้มครองทุกกรณี", "ดีที่สุด", "การันตี", "100%"]) if (joined.includes(w)) copyIssues.push(`ABSOLUTE CLAIM: "${w}"`);
console.log(copyIssues.length ? copyIssues.map((i) => "✘ " + i).join("\n") : "✔ copy ตรงกับ copy.md ตามตัวอักษร · ตัวเลขครบ · ไม่มีคำฟันธง");

/* ---------------- 2. Render + per-slide QA ---------------- */
const server = await startServer();
const base = `http://localhost:${server.address().port}`;
const exe = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find(existsSync);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
let failures = copyIssues.length;

const jobs = [];
for (const r of RATIOS) for (const p of PAGES) jobs.push({ id: p, ratio: r, file: join(OUT, r, `${p}.png`), h: r === "4x5" ? 1350 : 1920 });
for (const f of FB) jobs.push({ id: f, ratio: "1x1", file: join(OUT, "fb_1x1", `${f}.png`), h: 1080 });

for (const job of jobs) {
  if (!want(job.id)) continue;
  mkdirSync(join(job.file, ".."), { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: job.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => (["error", "warning"].includes(m.type()) ? errors.push(m.text()) : 0));
  await page.goto(`${base}/carousel.html?page=${job.id}&ratio=${job.ratio}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 20000 });

  const qa = await page.evaluate(({ ratio }) => {
    const issues = [];
    const canvas = document.querySelector(".canvas"), cr = canvas.getBoundingClientRect();
    const rel = (b) => ({ L: b.left - cr.left, T: b.top - cr.top, R: b.right - cr.left, B: b.bottom - cr.top });
    const zone = { "4x5": { L: 72, T: 72, R: 1008, B: 1278 }, "9x16": { L: 72, T: 170, R: 940, B: 1540 }, "1x1": { L: 108, T: 108, R: 972, B: 972 } }[ratio];
    const lum = (rgb) => { const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const parse = (c) => (c.match(/[\d.]+/g) || []).map(Number);
    const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; const v = parse(c); if (v.length && (v.length < 4 || v[3] > 0.5)) return v.slice(0, 3); } return [255, 255, 255]; };
    const COMBINING = /^[ัิ-ฺ็-๎]/;
    let minFont = 999;

    const walker = document.createTreeWalker(canvas, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode, el = n.parentElement;
      if (!n.textContent.trim() || el.closest("svg")) continue;
      const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize);
      const isMeta = !!el.closest("[data-meta]"), isDisc = !!el.closest(".disc"), isSmall = !!el.closest(".small");
      const snippet = n.textContent.trim().slice(0, 24);
      // safe zone
      const range = document.createRange(); range.selectNodeContents(n);
      for (const b of range.getClientRects()) {
        const r = rel(b);
        if (!isMeta && (r.L < zone.L - 1 || r.T < zone.T - 1 || r.R > zone.R + 1 || r.B > zone.B + 1))
          issues.push(`SAFE-ZONE "${snippet}" [${r.L | 0},${r.T | 0},${r.R | 0},${r.B | 0}]`);
        if (ratio === "4x5" && el.closest("[data-key]") && (r.T < 135 || r.B > 1215)) issues.push(`KEY OUTSIDE SQUARE y135–1215: "${snippet}"`);
      }
      // floating Thai vowel/tone mark at start of a segment
      if (el.classList.contains("seg") && COMBINING.test(n.textContent)) issues.push(`FLOATING MARK "${snippet}"`);
      // font sizes
      if (ratio === "1x1") {
        if (el.closest(".hl") && fs < 88) issues.push(`FB HEADLINE ${fs}px < 88`);
        if (el.closest(".body") && !el.closest(".disc") && fs < 48) issues.push(`FB BODY ${fs}px < 48 "${snippet}"`);
        if (!isDisc && fs < 30) issues.push(`FB TEXT ${fs}px < 30 "${snippet}"`);
        if (isDisc && fs < 26) issues.push(`FB DISCLAIMER ${fs}px < 26`);
      } else {
        if (el.closest(".hl") && fs < 64) issues.push(`HEADLINE ${fs}px < 64`);
        if (el.closest(".body, .chip, .nlabel, .nnote, .check") && fs < 38) issues.push(`BODY ${fs}px < 38 "${snippet}"`);
        if ((isDisc || isSmall) && fs < 22) issues.push(`SMALL ${fs}px < 22`);
      }
      minFont = Math.min(minFont, fs);
      // contrast (pumpkin numerals with espresso outline are decorative per brief)
      if (!el.closest("[data-numeral]") && !el.closest(".stamp")) {
        const fg = parse(cs.color).slice(0, 3), bg = bgOf(el);
        const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x), ratioC = (a + 0.05) / (b + 0.05);
        if (ratioC < 4.5) issues.push(`CONTRAST ${ratioC.toFixed(2)}:1 "${snippet}"`);
      }
    }
    // headline line count
    document.querySelectorAll(".hl").forEach((h) => { if (+h.dataset.lines > +h.dataset.maxLines) issues.push(`HEADLINE ${h.dataset.lines} lines > ${h.dataset.maxLines}`); });
    // overflow of layout regions
    // (layout boxes, not glyph ink — Thai stacked marks legitimately rise above the line box)
    document.querySelectorAll(".main, .ftr, .hdr, [data-box]").forEach((e) => {
      const b = e.getBoundingClientRect();
      for (const k of e.querySelectorAll("*")) {
        if (k.closest("svg") || k.closest(".decor") || getComputedStyle(k).display === "inline") continue;
        const r = k.getBoundingClientRect();
        if (!r.width) continue;
        if (r.left < b.left - 2 || r.right > b.right + 2 || r.top < b.top - 2 || r.bottom > b.bottom + 2) {
          issues.push(`OVERFLOW "${k.textContent.trim().slice(0, 20)}" outside <${e.tagName.toLowerCase()} class="${e.className}"> by ${Math.max(b.left - r.left, r.right - b.right, b.top - r.top, r.bottom - b.bottom) | 0}px`);
          break;
        }
      }
    });
    // text blocks colliding with each other
    const blocks = [...document.querySelectorAll("[data-box], .hl, .bignum, .main > .body, .ftr > *, .hdr > *")];
    for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i], b = blocks[j]; if (a.contains(b) || b.contains(a)) continue;
      const p = a.getBoundingClientRect(), q = b.getBoundingClientRect();
      if (p.left < q.right - 2 && q.left < p.right - 2 && p.top < q.bottom - 2 && q.top < p.bottom - 2) issues.push(`OVERLAP ${a.className} × ${b.className}`);
    }
    // FB: ≤ 3 text blocks (headline/number/body/list/box — small print & disclaimer excluded)
    if (ratio === "1x1") {
      const n = [...document.querySelectorAll(".main > *")].filter((e) => !e.matches(".small, .disc, .rbars") && e.textContent.trim()).length;
      if (n > 3) issues.push(`FB TEXT BLOCKS ${n} > 3`);
    }
    const lines = [...document.querySelectorAll(".hl")].map((h) => `${h.dataset.lines}L@${parseFloat(getComputedStyle(h).fontSize)}px`);
    return { issues, minFont, lines, text: canvas.innerText };
  }, { ratio: job.ratio });

  // fonts actually used (no fallback)
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: ".canvas *" });
  const fonts = new Set();
  for (const nid of nodeIds) {
    try { (await cdp.send("CSS.getPlatformFontsForNode", { nodeId: nid })).fonts.forEach((f) => fonts.add(f.familyName)); } catch {}
  }
  for (const f of fonts) if (!/IBM Plex Sans Thai|DM Serif Display/.test(f)) qa.issues.push(`FONT FALLBACK: ${f}`);
  qa.issues.push(...errors.map((e) => "JS: " + e));

  await page.screenshot({ path: job.file, clip: { x: 0, y: 0, width: 1080, height: job.h } });
  const tag = `${job.ratio.padEnd(4)} ${job.id}`;
  console.log(`${qa.issues.length ? "✘" : "✔"} ${tag}  headline ${qa.lines.join(" ")} · min font ${qa.minFont}px`);
  qa.issues.forEach((i) => console.log("     - " + i));
  failures += qa.issues.length;
  await ctx.close();
}

/* ---------------- 3. Contact sheet + Facebook grid preview ---------------- */
const b64 = (f) => (existsSync(f) ? `data:image/png;base64,${readFileSync(f).toString("base64")}` : "");
const fontCss = `
  @font-face{font-family:Plex;src:url(${base}/fonts/IBMPlexSansThai-Medium.ttf);font-weight:500}
  @font-face{font-family:Plex;src:url(${base}/fonts/IBMPlexSansThai-Bold.ttf);font-weight:700}
  @font-face{font-family:Serif;src:url(${base}/fonts/DMSerifDisplay-Regular.ttf)}
  *{margin:0;box-sizing:border-box} body{font-family:Plex}`;
const labels = ["HOOK", "CONTEXT", "NUMBER", "AHA", "FRAMEWORK", "SAVEABLE", "SOFT CTA"];

async function shoot(html, width, file) {
  const ctx = await browser.newContext({ viewport: { width, height: 400 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${base}/carousel.html?page=p01`); // same origin for fonts
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: file, fullPage: true });
  await ctx.close();
}

if (!only.length) {
  const tiles = (ratio, w, h) => PAGES.map((p, i) => `<figure><img src="${b64(join(OUT, ratio, p + ".png"))}" style="width:${w}px;height:${h}px"><figcaption><b>${String(i + 1).padStart(2, "0")}</b> ${labels[i]}</figcaption></figure>`).join("");
  await shoot(`<style>${fontCss}
      body{background:#2b211b;color:#F7F1E6;padding:48px 56px 56px;width:2400px}
      h1{font-family:Serif;font-weight:400;font-size:54px} p{opacity:.75;font-size:24px;margin:6px 0 28px}
      h2{font-family:Serif;font-weight:400;font-size:34px;margin:34px 0 16px}
      .row{display:flex;gap:22px} figure{display:flex;flex-direction:column;gap:10px}
      img{border-radius:10px;display:block} figcaption{font-size:22px;letter-spacing:.04em} figcaption b{font-family:Serif;font-weight:400;font-size:26px;margin-right:6px}
    </style>
    <h1>EP.3 · ผ่าตัดซีสต์ช็อกโกแลต 1 ครั้ง ≈ เงินเดือน 6 เดือน?</h1>
    <p>Prepare with Pair · Photo carousel 7 หน้า · 4:5 (IG / TikTok photo) และ 9:16 (TikTok)</p>
    <h2>4:5 · 1080×1350</h2><div class="row">${tiles("4x5", 312, 390)}</div>
    <h2>9:16 · 1080×1920</h2><div class="row">${tiles("9x16", 312, 555)}</div>`, 2400, join(OUT, "contact_sheet.png"));

  // Facebook mobile feed mock (2×2 grid) — width 1080
  const fbGrid = FB.map((f) => `<img src="${b64(join(OUT, "fb_1x1", f + ".png"))}">`).join("");
  const fbHtml = (w) => `<style>${fontCss}
      body{background:#E4E6EB;width:${w}px;padding:${w * 0.03}px 0}
      .post{background:#fff;width:100%}
      .top{display:flex;align-items:center;gap:${w * 0.03}px;padding:${w * 0.035}px ${w * 0.04}px ${w * 0.02}px}
      .av{width:${w * 0.1}px;height:${w * 0.1}px;border-radius:50%;background:#E07A2F;border:3px solid #3A2A22;display:grid;place-items:center;font-family:Serif;font-size:${w * 0.055}px;color:#3A2A22}
      .nm{font-weight:700;font-size:${w * 0.04}px;color:#050505} .tm{font-size:${w * 0.032}px;color:#65676B}
      .cap{padding:0 ${w * 0.04}px ${w * 0.03}px;font-size:${w * 0.039}px;line-height:1.4;color:#050505}
      .cap span{color:#65676B;font-weight:700}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:${Math.max(2, w * 0.004)}px}
      .grid img{width:100%;display:block}
      .bar{display:flex;justify-content:space-around;padding:${w * 0.03}px 0;font-size:${w * 0.036}px;color:#65676B;font-weight:700;border-top:1px solid #ddd;margin:0 ${w * 0.03}px}
    </style>
    <div class="post"><div class="top"><div class="av">P</div><div><div class="nm">Prepare with Pair</div><div class="tm">เมื่อสักครู่</div></div></div>
    <div class="cap">ปวดเมนส์หนักมาหลายปี จนวันหนึ่งหมอบอกว่า "ต้องผ่าตัดนะ"… <span>ดูเพิ่มเติม</span></div>
    <div class="grid">${fbGrid}</div>
    <div class="bar"><div>ถูกใจ</div><div>แสดงความคิดเห็น</div><div>แชร์</div></div></div>`;
  await shoot(fbHtml(1080), 1080, join(OUT, "fb_grid_preview.png"));
  await shoot(fbHtml(400), 400, join(OUT, "fb_grid_preview_phone400.png"));
  console.log("✔ contact_sheet.png · fb_grid_preview.png · fb_grid_preview_phone400.png");
}

await browser.close(); server.close();
console.log(failures ? `\n${failures} issue(s)` : "\nAll QA checks passed ✔");
process.exitCode = failures ? 1 : 0;
