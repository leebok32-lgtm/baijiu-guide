import type { Product } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { mockRepository } from "./mockRepository";
import { supabaseRepository } from "./supabaseRepository";

/**
 * 제품 데이터 접근 계층의 공통 인터페이스.
 *
 * mock 구현(`mockRepository`)과 Supabase 구현(`supabaseRepository`)은
 * 모두 이 인터페이스를 만족합니다. `lib/products/*` 의 public 함수들은
 * `getActiveRepository()` 를 통해 어느 구현을 사용할지 결정합니다.
 */
export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getBySlug(slug: string): Promise<Product | null>;
  getByIds(ids: string[]): Promise<Product[]>;
  getByAroma(aromaName: string): Promise<Product[]>;
}

let active: ProductRepository | null = null;

/**
 * 환경변수가 설정되어 있으면 Supabase 구현을, 그렇지 않으면 mock 구현을
 * 반환합니다. 같은 프로세스 내에서는 한 번 결정한 구현을 재사용합니다.
 */
export function getActiveRepository(): ProductRepository {
  if (active) return active;
  active = isSupabaseConfigured() ? supabaseRepository : mockRepository;
  return active;
}

/**
 * 테스트나 개발 도중 활성 구현을 강제로 교체할 때 사용합니다.
 * 프로덕션 코드에서는 사용하지 마세요.
 */
export function __setActiveRepositoryForTesting(
  repo: ProductRepository | null,
) {
  active = repo;
}
