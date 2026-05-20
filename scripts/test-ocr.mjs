/**
 * /api/ocr 수동 테스트 스크립트
 *
 * 사용:
 *   node scripts/test-ocr.mjs <이미지경로> [엔드포인트]
 *
 * 예:
 *   node scripts/test-ocr.mjs test-images/라벨1.png
 *   node scripts/test-ocr.mjs test-images/라벨1.png http://localhost:3000/api/ocr
 */

import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";

const imagePath = process.argv[2];
const endpoint = process.argv[3] || "http://localhost:3000/api/ocr";

if (!imagePath) {
  console.error("Usage: node scripts/test-ocr.mjs <image-path> [endpoint]");
  process.exit(1);
}

const info = await stat(imagePath);
console.log(`📷 ${imagePath} (${(info.size / 1024).toFixed(1)} KB)`);

const buf = await readFile(imagePath);
const ext = imagePath.split(".").pop()?.toLowerCase() ?? "png";
const mime =
  ext === "jpg" || ext === "jpeg"
    ? "image/jpeg"
    : ext === "webp"
    ? "image/webp"
    : "image/png";

const blob = new Blob([buf], { type: mime });
const form = new FormData();
form.append("image", blob, basename(imagePath));

const t0 = Date.now();
const res = await fetch(endpoint, { method: "POST", body: form });
const elapsed = Date.now() - t0;
const json = await res.json();

console.log(`\n⏱  ${elapsed} ms · HTTP ${res.status}`);
console.log(JSON.stringify(json, null, 2));
