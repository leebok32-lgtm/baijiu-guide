import type { Product, ProductFilters, SortKey } from "@/types";
import {
  filterProducts as filterInList,
  sortProducts as sortInList,
} from "@/lib/search/filterProducts";
import { getProducts } from "./getProducts";

/**
 * 필터 + 정렬을 적용해 제품 목록을 반환합니다.
 *
 * 활성 repository 에서 전체 제품을 가져온 뒤 메모리에서 필터/정렬을
 * 적용합니다. 추후 Supabase 의 인덱스를 활용한 쿼리 빌더 패턴으로 교체
 * 가능합니다 (이 함수 시그니처는 유지).
 */
export async function filterProducts(
  filters: ProductFilters,
  sortKey?: SortKey,
): Promise<Product[]> {
  const all = await getProducts();
  const matched = filterInList(all, filters);
  return sortKey ? sortInList(matched, sortKey) : matched;
}
