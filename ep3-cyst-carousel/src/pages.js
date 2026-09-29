/* =========================================================
   PAGE TEMPLATES — layout ของแต่ละหน้า (ข้อความมาจาก content.json)
   page(id, content, ratio) → HTML
   ========================================================= */
import { fmt, PillTag, Masthead, Headline, BigNumber, RoundCard, Chip, HandArrow, Sparkle, Stamp, WaveBottom, Illo, Check, Slide } from "./components/ui.js";
import { icons } from "./components/icons.js";

const small = (t, cls = "small") => (t ? `<p class="${cls}" data-text>${fmt(t)}</p>` : "");
const tall = (r) => r === "9x16";

/** ตกแต่งส่วนขยายบน/ล่างของ 9:16 (ไม่มีข้อความ) */
const extend = (r, wave, spark) =>
  tall(r) ? `${WaveBottom("ext-wave", { layers: wave, h: 260 })}${Sparkle("ext-spark", spark)}` : "";

export const templates = {
  /* ---------------- 1 · HOOK ---------------- */
  p01: (c, r, g) => Slide({
    ratio: r, bg: c.bg, id: "p01",
    header: PillTag(c.pill) + Masthead(g.brand, 1, g.total),
    main: `
      ${Headline(c.headline, { cls: "c-ink" })}
      ${BigNumber(c.number, { size: 262 })}
      <div class="block big-block" data-key>${fmt(c.block)}</div>`,
    footer: small(c.note),
    decor: `
      ${Illo("receiptRoll", "receipt", { h: 900 })}
      ${Illo("coin", "coin c1")}${Illo("coin", "coin c2")}${Illo("coin", "coin c3", { fill: "oat" })}
      ${Sparkle("sp1", "oat-light")}${Sparkle("sp2", "pumpkin")}`,
    canvasDecor: extend(r, ["red-deep"], "oat-light"),
  }),

  /* ---------------- 2 · CONTEXT ---------------- */
  p02: (c, r, g) => Slide({
    ratio: r, bg: c.bg, id: "p02",
    header: PillTag(c.pill, "pill--dark") + Masthead(g.brand, 2, g.total),
    main: `
      ${Headline(c.headline)}
      <div class="illo-row" aria-hidden="true">
        <div class="ico ovary">${icons.ovaryDoodle()}</div>
        <div class="ico arrow">${icons.handArrow({ color: "red" })}</div>
        <div class="ico cal">${icons.calendar()}</div>
      </div>
      <div class="cards">
        ${RoundCard(`<span class="lead serif" aria-hidden="true">5</span><p class="body">${fmt(c.cards[0])}</p>`, "ctx")}
        ${RoundCard(`<span class="lead icon" aria-hidden="true">${icons.painBolt()}</span><p class="body">${fmt(c.cards[1])}</p>`, "ctx")}
      </div>`,
    decor: `${Sparkle("sp1", "pumpkin")}${Sparkle("sp2", "red")}`,
    canvasDecor: extend(r, ["oat-deep"], "pumpkin"),
  }),

  /* ---------------- 3 · NUMBER ---------------- */
  p03: (c, r, g) => Slide({
    ratio: r, bg: c.bg, id: "p03",
    header: PillTag(c.pill, "pill--dark") + Masthead(g.brand, 3, g.total),
    main: `
      ${Headline(c.headline)}
      <div class="grid6">${c.items.map((i) => Chip(i.icon, i.label)).join("")}</div>
      <div class="nums">
        ${c.numbers.map((n) => RoundCard(`
          <p class="nlabel">${fmt(n.label)}</p>
          ${BigNumber(n.number, { size: 104, cls: "c-esp" })}
          ${n.note ? `<p class="nnote">${fmt(n.note)}</p>` : ""}`, "numcard")).join("")}
      </div>`,
    footer: small(c.note),
    decor: `${Sparkle("sp1", "oat-light")}`,
    canvasDecor: extend(r, ["pumpkin-deep"], "oat-light"),
  }),

  /* ---------------- 4 · AHA ---------------- */
  p04: (c, r, g) => Slide({
    ratio: r, bg: c.bg, id: "p04",
    header: PillTag(c.pill, "pill--dark") + Masthead(g.brand, 4, g.total),
    main: `
      ${Headline(c.headline, { cls: "c-red", maxLines: 2 })}
      <p class="body" data-key>${fmt(c.body)}</p>
      ${ReceiptBars(c)}`,
    footer: small(c.note),
    decor: `${Stamp('<span>≠</span>', "neq")}${Sparkle("sp1", "pumpkin")}`,
    canvasDecor: extend(r, ["oat"], "pumpkin"),
  }),

  /* ---------------- 5 · FRAMEWORK ---------------- */
  p05: (c, r, g) => Slide({
    ratio: r, bg: c.bg, id: "p05",
    header: PillTag(c.pill, "pill--dark") + Masthead(g.brand, 5, g.total),
    main: `
      ${Headline(c.headline, { min: 64 })}
      <div class="rows">
        ${c.items.map((i) => RoundCard(`
          <span class="numeral serif" data-numeral>${i.n}</span>
          <div><h2 class="rt">${fmt(i.title)}</h2><p class="body">${fmt(i.desc)}</p></div>`, "row")).join("")}
      </div>`,
    footer: small(c.note, "small b-tip"),
    decor: `${Illo("bookmark", "bm", { fill: "pumpkin" })}`,
    canvasDecor: extend(r, ["oat-deep"], "pumpkin"),
  }),

  /* ---------------- 6 · SAVEABLE ---------------- */
  p06: (c, r, g) => Slide({
    ratio: r, bg: c.bg, id: "p06",
    header: PillTag(c.pill) + Masthead(g.brand, 6, g.total),
    main: `
      ${Headline(c.headline, { maxLines: 2 })}
      ${RoundCard(c.checks.map((t) => Check(t)).join(""), "card--oat checklist body")}
      <div class="block warn" data-box>
        <span class="ico hg">${icons.hourglass()}</span>
        <p class="body">${fmt(c.box)}</p>
      </div>`,
    footer: small(c.note),
    decor: `${Sparkle("sp1", "oat-light")}${HandArrow("arr", { color: "oat-light" })}`,
    canvasDecor: extend(r, ["red-deep"], "oat-light"),
  }),

  /* ---------------- 7 · SOFT CTA ---------------- */
  p07: (c, r, g) => Slide({
    ratio: r, bg: c.bg, id: "p07",
    header: "<span></span>" + Masthead(g.brand, 7, g.total),
    main: `
      ${Headline(c.headline)}
      ${RoundCard(`<p class="body">${fmt(c.card)}</p>`, "cta-card")}
      <div class="btn" data-box><span class="ico">${icons.bookmark({ fill: "pumpkin" })}</span><span>${fmt(c.button)}</span></div>`,
    footer: small(c.disclaimer, "disc"),
    decor: `${Illo("shieldHeart", "shield")}${Sparkle("sp1", "oat-light")}${Sparkle("sp2", "red")}`,
    canvasDecor: extend(r, ["pumpkin-deep"], "oat-light"),
  }),

  /* ================= FACEBOOK 1:1 ================= */
  fb01: (c, r, g) => Slide({
    ratio: "1x1", bg: c.bg, id: "fb01",
    header: Masthead(g.brand, 1, 4),
    main: `
      ${Headline(c.headline, { maxLines: 2, min: 88 })}
      ${BigNumber(c.number, { size: 210 })}
      <div class="block big-block" data-key>${fmt(c.block)}</div>
      ${small(c.note)}`,
    decor: `${Illo("coin", "coin c1")}${Illo("coin", "coin c2", { fill: "oat" })}${Sparkle("sp1", "oat-light")}`,
  }),
  fb02: (c, r, g) => Slide({
    ratio: "1x1", bg: c.bg, id: "fb02",
    header: Masthead(g.brand, 2, 4),
    main: `
      ${Headline(c.headline, { maxLines: 2, min: 88 })}
      <p class="body" data-key>${fmt(c.body)}</p>
      ${ReceiptBars(c, true)}
      ${small(c.note, "disc")}`,
  }),
  fb03: (c, r, g) => Slide({
    ratio: "1x1", bg: c.bg, id: "fb03",
    header: Masthead(g.brand, 3, 4),
    main: `
      ${Headline(c.headline, { maxLines: 2, min: 88 })}
      <div class="rows">${c.items.map((i) => RoundCard(`<span class="numeral serif" data-numeral>${i.n}</span><h2 class="rt">${fmt(i.title)}</h2>`, "row")).join("")}</div>
      ${small(c.note)}`,
  }),
  fb04: (c, r, g) => Slide({
    ratio: "1x1", bg: c.bg, id: "fb04",
    header: Masthead(g.brand, 4, 4),
    main: `
      ${Headline(c.headline, { maxLines: 2, min: 88 })}
      ${RoundCard(c.checks.map((t) => Check(t)).join(""), "card--oat checklist body")}
      <div class="block warn" data-box><p class="body">${fmt(c.box)}</p></div>
      ${small(c.note, "disc")}`,
  }),
};

/** ใบเสร็จแบ่งแท่ง 3 สี + ส่วนเกินวงเงินลายขีดเฉียง (ภาพประกอบ ไม่ใช่ตัวเลขจริง) */
function ReceiptBars(c, compact = false) {
  const rows = [["pumpkin", 62], ["oat-deep", 48], ["espresso-soft", 70]];
  return `<div class="rbwrap"><div class="rbars ${compact ? "compact" : ""}" data-box aria-label="receipt bars">
    ${compact ? "" : `<div class="rb-head"><span class="serif rb-total">${fmt(c.visualTotal)}</span><span class="rb-dots"></span></div>`}
    ${rows.map(([color, pct]) => `
      <div class="rb-row"><span class="rb-fill c-${color}" style="width:${pct}%"></span><span class="rb-over"></span></div>`).join("")}
  </div>${compact ? "" : `
    <div class="rb-label" data-key>${fmt(c.visualExcess)}</div>
    ${HandArrow("rb-arrow", { color: "pumpkin" })}`}</div>`;
}
