import type { Product } from "@/types";
import { getActiveRepository } from "./repository";

/**
 * 향형 한글명 (예: "농향형") 으로 제품 목록을 조회합니다.
 */
export async function getProductsByAroma(aromaName: string): Promise<Product[]> {
  return getActiveRepository().getByAroma(aromaName);
}
