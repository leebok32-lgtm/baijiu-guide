import type { Product } from "@/types";
import { getActiveRepository } from "./repository";

/**
 * 슬러그로 단일 제품을 조회합니다. 찾지 못하면 `null`.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return getActiveRepository().getBySlug(slug);
}
