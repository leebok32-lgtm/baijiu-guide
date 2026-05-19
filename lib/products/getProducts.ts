import type { Product } from "@/types";
import { getActiveRepository } from "./repository";

/**
 * 모든 제품을 반환합니다. (활성 repository — mock 또는 supabase — 를 통과)
 */
export async function getProducts(): Promise<Product[]> {
  return getActiveRepository().getAll();
}
