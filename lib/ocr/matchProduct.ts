import type { Product } from "@/types";
import { normalizeOcrText, type NormalizedOcr } from "./normalizeOcrText";

/**
 * OCR 결과 ↔ 제품 매칭.
 *
 * 점수 계산은 3-tier 로 구성:
 *
 *   tier 1: substring 완전 일치 (정규화 후 OCR 텍스트가 제품 필드를 포함)
 *           → weight + 길이 보너스
 *   tier 2: CJK 부분 일치 (n-gram 슬라이딩 윈도우 매칭)
 *           → weight * 0.4 + n * 4
 *   tier 3: Latin 단어 단위 일치 (병음/영문 브랜드)
 *           → weight * 0.4 + hits * 4
 *
 * 동일 필드에 대해 한 tier 만 점수에 반영하여 중복 가산을 막습니다.
 * ABV / Volume 일치는 별도 보너스로 추가합니다.
 *
 * 최종 점수에 0~100 사이로 정규화한 `confidence` 도 함께 반환합니다.
 */

export interface ProductMatch {
  product: Product;
  score: number;
  confidence: number; // 0..100
  reasons: string[];
}

const FIELD_WEIGHTS: Record<string, number> = {
  한글명: 40,
  중국어명: 45, // 라벨 자체와 가장 가까운 중국어 한자에 가중치 ↑
  영문명: 40,
  병음: 35,
  별칭: 30,
  "라벨 키워드": 35,
  "검색 키워드": 15,
};

// confidence 산출용 기준 — 이 점수 이상이면 100%
const CONFIDENCE_FULL_SCORE = 120;

const STRIP_REGEX = /[\s -　.,;:!?'"`()\[\]{}<>·•|/\\\-_=+*&^%$#@~]+/g;
const CJK_TEST = /[一-鿿가-힯]/;
const LATIN_ONLY_TEST = /^[a-z0-9\s]+$/i;

function norm(s: string): string {
  return s.toLowerCase().replace(STRIP_REGEX, "");
}

interface FieldScore {
  score: number;
  reason?: string;
}

function scoreField(
  value: string,
  weight: number,
  fieldLabel: string,
  ocr: NormalizedOcr,
): FieldScore {
  if (!value) return { score: 0 };
  const n = norm(value);
  if (n.length < 2) return { score: 0 };

  // Tier 1: substring 완전 일치 (가장 강력)
  if (ocr.normalized.includes(n)) {
    const lenBonus = Math.min(n.length, 12) * 2;
    return {
      score: weight + lenBonus,
      reason: `${fieldLabel} 전체 일치: ${value}`,
    };
  }

  // Tier 2: CJK n-gram 부분 일치
  if (CJK_TEST.test(value)) {
    let bestN = 0;
    let bestGram = "";
    for (let n = Math.min(value.length, 4); n >= 2; n--) {
      for (let i = 0; i <= value.length - n; i++) {
        const gram = norm(value.slice(i, i + n));
        if (gram && ocr.normalized.includes(gram)) {
          if (n > bestN) {
            bestN = n;
            bestGram = value.slice(i, i + n);
          }
        }
      }
      if (bestN > 0) break; // 더 긴 gram 부터 시도했으므로 첫 매칭이 최선
    }
    if (bestN > 0) {
      return {
        score: Math.round(weight * 0.4) + bestN * 4,
        reason: `${fieldLabel} 부분 일치: ${bestGram}`,
      };
    }
  }

  // Tier 3: Latin 단어 단위 일치 (병음/영문)
  if (LATIN_ONLY_TEST.test(value)) {
    const words = value
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length >= 3);
    if (words.length > 0) {
      const hits = words.filter((w) => ocr.latinWords.includes(w));
      if (hits.length > 0) {
        return {
          score: Math.round(weight * 0.4) + hits.length * 6,
          reason: `${fieldLabel} 단어 일치: ${hits.join(", ")}`,
        };
      }
    }
  }

  return { score: 0 };
}

function scoreCandidate(
  field: string,
  weight: number,
  values: string[],
  ocr: NormalizedOcr,
): FieldScore {
  // 한 필드(예: aliases)에 여러 값이 있을 때 가장 좋은 매칭 하나만 채택
  let best: FieldScore = { score: 0 };
  for (const v of values) {
    const s = scoreField(v, weight, field, ocr);
    if (s.score > best.score) best = s;
  }
  return best;
}

function scoreProduct(
  product: Product,
  ocr: NormalizedOcr,
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  const candidates: Array<{ field: string; values: string[] }> = [
    { field: "한글명", values: [product.nameKo] },
    { field: "중국어명", values: [product.nameCn] },
    { field: "영문명", values: [product.nameEn] },
    { field: "병음", values: [product.pinyin] },
    { field: "별칭", values: product.aliases },
    { field: "라벨 키워드", values: product.labelKeywords },
    { field: "검색 키워드", values: product.searchKeywords },
  ];

  for (const c of candidates) {
    const result = scoreCandidate(
      c.field,
      FIELD_WEIGHTS[c.field] ?? 15,
      c.values,
      ocr,
    );
    if (result.score > 0) {
      score += result.score;
      if (result.reason) reasons.push(result.reason);
    }
  }

  if (typeof ocr.abv === "number" && product.abv === ocr.abv) {
    score += 25;
    reasons.push(`도수 일치: ${ocr.abv}%`);
  } else if (
    typeof ocr.abv === "number" &&
    Math.abs(product.abv - ocr.abv) <= 1
  ) {
    // ±1% 근사 일치 (소수점 인식 오류 보정)
    score += 10;
    reasons.push(`도수 근사 일치: ${ocr.abv}% ≈ ${product.abv}%`);
  }

  if (
    typeof ocr.volumeMl === "number" &&
    typeof product.volumeMl === "number" &&
    product.volumeMl === ocr.volumeMl
  ) {
    score += 15;
    reasons.push(`용량 일치: ${ocr.volumeMl}ml`);
  }

  return { score, reasons };
}

export function matchProducts(
  rawText: string,
  products: Product[],
  topN = 3,
): ProductMatch[] {
  if (!rawText.trim()) return [];

  const ocr = normalizeOcrText(rawText);

  const scored: ProductMatch[] = products
    .map((product) => {
      const { score, reasons } = scoreProduct(product, ocr);
      const confidence = Math.min(
        100,
        Math.round((score / CONFIDENCE_FULL_SCORE) * 100),
      );
      return { product, score, confidence, reasons };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return scored;
}

/** 이 점수 미만이면 UI 에서 "정확한 제품을 찾지 못했어요" 안내. */
export const MATCH_CONFIDENCE_THRESHOLD = 35;
