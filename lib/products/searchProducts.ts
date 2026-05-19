import type { Product } from "@/types";
import { searchProducts as searchInList } from "@/lib/search/searchProducts";
import { getProducts } from "./getProducts";

/**
 * 자유 텍스트 검색. 활성 repository에서 전체 제품을 가져온 뒤 메모리에서
 * 매칭합니다. (현재는 Supabase 풀텍스트 검색 대신 클라이언트 동일 알고리즘을
 * 사용하여 mock ↔ supabase 결과 차이를 최소화합니다.)
 *
 * 추후 데이터가 커지면 Supabase 의 `tsvector` 검색이나 RPC로 교체할 수
 * 있도록 이 함수만 수정하면 됩니다.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const all = await getProducts();
  return searchInList(all, query);
}
