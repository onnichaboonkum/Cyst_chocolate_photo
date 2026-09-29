// Static server (ES modules ต้องเปิดผ่าน http ไม่ใช่ file://)
// ใช้: npm run preview  แล้วเปิด http://localhost:5173/carousel.html?page=p01&ratio=4x5  (เพิ่ม ?guides=1 เพื่อดู safe area)
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".ttf": "font/ttf", ".json": "application/json" };

export function startServer(port = 0) {
  const server = http.createServer(async (req, res) => {
    try {
      let p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
      if (p.endsWith("/")) p += "index.html";
      const file = join(ROOT, p);
      if (!file.startsWith(ROOT)) throw new Error("forbidden");
      const data = await readFile(file);
      res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
      res.end(data);
    } catch { res.writeHead(404); res.end("not found"); }
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const s = await startServer(5173);
  console.log(`http://localhost:${s.address().port}/carousel.html?page=p01&ratio=4x5`);
}
