import type { Product, ProductFilters, SortKey } from "@/types";
import { searchProducts } from "./searchProducts";
import { priceTierMatches, type PriceTier } from "@/lib/utils/formatPrice";

export function filterProducts(
  list: Product[],
  filters: ProductFilters,
): Product[] {
  let out = list;

  if (filters.query) {
    out = searchProducts(out, filters.query);
  }

  if (filters.aromaTypes && filters.aromaTypes.length > 0) {
    out = out.filter((p) => filters.aromaTypes!.includes(p.aromaType));
  }

  if (typeof filters.abvMin === "number") {
    out = out.filter((p) => p.abv >= filters.abvMin!);
  }
  if (typeof filters.abvMax === "number") {
    out = out.filter((p) => p.abv <= filters.abvMax!);
  }

  if (filters.priceTiers && filters.priceTiers.length > 0) {
    out = out.filter((p) =>
      filters.priceTiers!.some((t) =>
        priceTierMatches(p.regularPrice, t as PriceTier),
      ),
    );
  }

  if (filters.beginnerLevels && filters.beginnerLevels.length > 0) {
    out = out.filter((p) =>
      filters.beginnerLevels!.includes(p.beginnerLevel),
    );
  }

  if (filters.foods && filters.foods.length > 0) {
    out = out.filter((p) =>
      p.recommendedFoods.some((f) => filters.foods!.includes(f)),
    );
  }

  return out;
}

const BEGINNER_ORDER: Record<string, number> = {
  쉬움: 0,
  보통: 1,
  어려움: 2,
  전문가용: 3,
};

export function sortProducts(list: Product[], sortKey: SortKey): Product[] {
  const out = [...list];
  switch (sortKey) {
    case "name":
      out.sort((a, b) => a.nameKo.localeCompare(b.nameKo, "ko"));
      break;
    case "beginner":
      out.sort(
        (a, b) =>
          (BEGINNER_ORDER[a.beginnerLevel] ?? 99) -
          (BEGINNER_ORDER[b.beginnerLevel] ?? 99),
      );
      break;
    case "abvAsc":
      out.sort((a, b) => a.abv - b.abv);
      break;
    case "abvDesc":
      out.sort((a, b) => b.abv - a.abv);
      break;
    case "priceAsc":
      out.sort((a, b) => (a.regularPrice ?? 0) - (b.regularPrice ?? 0));
      break;
    case "priceDesc":
      out.sort((a, b) => (b.regularPrice ?? 0) - (a.regularPrice ?? 0));
      break;
  }
  return out;
}
