import type { AromaType } from "@/types";
import { getActiveAromaRepository } from "./repository";

/**
 * 모든 향형을 반환합니다. (활성 repository — mock 또는 supabase — 를 통과)
 */
export async function getAromaTypes(): Promise<AromaType[]> {
  return getActiveAromaRepository().getAll();
}

/**
 * 슬러그로 단일 향형을 조회합니다. 찾지 못하면 `null`.
 */
export async function getAromaTypeBySlug(
  slug: string,
): Promise<AromaType | null> {
  return getActiveAromaRepository().getBySlug(slug);
}
