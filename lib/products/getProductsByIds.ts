import type { Product } from "@/types";
import { getActiveRepository } from "./repository";

/**
 * 여러 ID를 한 번에 조회합니다. 입력 순서를 유지하며 없는 ID는 결과에서 제외됩니다.
 */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return getActiveRepository().getByIds(ids);
}
