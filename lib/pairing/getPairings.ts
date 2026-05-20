import type { Pairing } from "@/types";
import { getActivePairingRepository } from "./repository";

/**
 * 모든 페어링을 반환합니다. (활성 repository — mock 또는 supabase — 를 통과)
 */
export async function getPairings(): Promise<Pairing[]> {
  return getActivePairingRepository().getAll();
}

/**
 * 슬러그로 단일 페어링을 조회합니다. 찾지 못하면 `null`.
 */
export async function getPairingBySlug(
  slug: string,
): Promise<Pairing | null> {
  return getActivePairingRepository().getBySlug(slug);
}
