import type { Product } from "@/types";

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s\-_'"]/g, "");
}

function tokensFor(product: Product): string[] {
  return [
    product.nameKo,
    product.nameCn,
    product.nameEn,
    product.pinyin,
    product.category,
    product.aromaType,
    ...product.aliases,
    ...product.labelKeywords,
    ...product.searchKeywords,
    ...product.recommendedFoods,
    ...product.flavorNotes,
  ]
    .filter(Boolean)
    .map(normalize);
}

export function searchProducts(list: Product[], rawQuery: string): Product[] {
  const q = rawQuery.trim();
  if (!q) return list;
  const needle = normalize(q);

  const scored = list
    .map((p) => {
      const haystack = tokensFor(p);
      const hit = haystack.some((t) => t.includes(needle));
      if (!hit) return { p, score: 0 };
      const exact = haystack.some((t) => t === needle);
      const startsWith = haystack.some((t) => t.startsWith(needle));
      const score = (exact ? 100 : 0) + (startsWith ? 30 : 0) + 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((x) => x.p);
}
