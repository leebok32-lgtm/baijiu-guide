import type { AromaType } from "@/types";
import { aromaTypes } from "@/data/aromaTypes";
import type { AromaTypeRepository } from "./repository";

/**
 * mock 데이터 (data/aromaTypes.ts) 위에 동작하는 repository 구현.
 *
 * 환경변수 미설정 시 기본으로 사용됩니다. 실제 DB 호출이 없으므로
 * 즉시 Promise를 resolve합니다.
 */
export const mockRepository: AromaTypeRepository = {
  async getAll(): Promise<AromaType[]> {
    return aromaTypes;
  },

  async getBySlug(slug: string): Promise<AromaType | null> {
    return aromaTypes.find((a) => a.slug === slug) ?? null;
  },
};
