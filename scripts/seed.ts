/**
 * Supabase 시드 스크립트
 *
 * mock 데이터(data/*.ts)를 Supabase 테이블에 upsert 합니다.
 *
 * 실행:
 *   npx tsx scripts/seed.ts
 *
 * 필요 환경변수:
 *   NEXT_PUBLIC_SUPABASE_URL    — Supabase 프로젝트 URL
 *   SUPABASE_SERVICE_ROLE_KEY   — service_role 키 (RLS bypass)
 *
 * 주의:
 *   service_role 키는 절대 클라이언트 번들에 노출되면 안 됩니다.
 *   이 스크립트는 서버/로컬에서만 실행하세요.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// .env.local 로드 (Next.js 외부 스크립트이므로 직접 파싱)
const envPath = resolve(import.meta.dirname, "..", ".env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env.local 가 없으면 환경변수에서 직접 읽음
}

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/database.types";
import { products } from "../data/products";
import { aromaTypes } from "../data/aromaTypes";
import { pairings } from "../data/pairings";
import { articles } from "../data/articles";
import { productToInsert } from "../lib/supabase/mappers";

// ---------------------------------------------------------------------------
// 환경변수 확인
// ---------------------------------------------------------------------------
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "❌ 환경변수가 설정되지 않았습니다.\n" +
      "   NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SERVICE_ROLE_KEY 를 .env.local 에 입력해 주세요.",
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false },
});

// ---------------------------------------------------------------------------
// Upsert 헬퍼
// ---------------------------------------------------------------------------
async function upsertTable<T extends Record<string, unknown>>(
  tableName: string,
  rows: T[],
): Promise<void> {
  const { error } = await supabase
    .from(tableName)
    .upsert(rows as never[], { onConflict: "id" });

  if (error) {
    console.error(`❌ ${tableName} upsert 실패:`, error.message);
    throw error;
  }
  console.log(`✅ ${tableName}: ${rows.length}건 upsert 완료`);
}

// ---------------------------------------------------------------------------
// 시드 실행
// ---------------------------------------------------------------------------
async function seed() {
  console.log("🌱 시드 시작...\n");

  // 1. products
  const productRows = products.map(productToInsert);
  await upsertTable("products", productRows);

  // 2. aroma_types
  const aromaRows = aromaTypes.map((a) => ({
    id: a.id,
    slug: a.slug,
    name_ko: a.nameKo,
    name_cn: a.nameCn,
    name_en: a.nameEn ?? null,
    description: a.description,
    typical_flavor: a.typicalFlavor,
    beginner_level: a.beginnerLevel,
    recommended_foods: a.recommendedFoods,
    representative_product_ids: a.representativeProductIds,
  }));
  await upsertTable("aroma_types", aromaRows);

  // 3. pairings
  const pairingRows = pairings.map((p) => ({
    id: p.id,
    slug: p.slug,
    food_name: p.foodName,
    description: p.description,
    recommended_aroma_types: p.recommendedAromaTypes,
    recommended_product_ids: p.recommendedProductIds,
    reason: p.reason,
  }));
  await upsertTable("pairings", pairingRows);

  // 4. articles
  const articleRows = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    body: a.body,
    tag: a.tag,
    published_at: a.publishedAt,
  }));
  await upsertTable("articles", articleRows);

  console.log("\n🎉 모든 시드 데이터가 성공적으로 입력되었습니다!");
}

seed().catch((err) => {
  console.error("\n💥 시드 실패:", err);
  process.exit(1);
});
