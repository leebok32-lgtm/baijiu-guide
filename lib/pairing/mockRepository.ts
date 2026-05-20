import type { Pairing } from "@/types";
import { pairings as mockPairings } from "@/data/pairings";
import type { PairingRepository } from "./repository";

/**
 * mock 데이터 (data/pairings.ts) 위에 동작하는 repository 구현.
 *
 * 환경변수 미설정 시 기본으로 사용됩니다. 실제 DB 호출이 없으므로
 * 즉시 Promise를 resolve합니다.
 */
export const mockRepository: PairingRepository = {
  async getAll(): Promise<Pairing[]> {
    return mockPairings;
  },

  async getBySlug(slug: string): Promise<Pairing | null> {
    return mockPairings.find((p) => p.slug === slug) ?? null;
  },
};
