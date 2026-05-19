import type { Product } from "@/types";
import { products as mockProducts } from "@/data/products";
import type { ProductRepository } from "./repository";

/**
 * mock 데이터 (data/products.ts) 위에 동작하는 repository 구현.
 *
 * 환경변수 미설정 시 기본으로 사용됩니다. 실제 DB 호출이 없으므로
 * 즉시 Promise를 resolve합니다.
 */
export const mockRepository: ProductRepository = {
  async getAll(): Promise<Product[]> {
    return mockProducts;
  },

  async getBySlug(slug: string): Promise<Product | null> {
    return mockProducts.find((p) => p.slug === slug) ?? null;
  },

  async getByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    return ids
      .map((id) => mockProducts.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  },

  async getByAroma(aromaName: string): Promise<Product[]> {
    return mockProducts.filter((p) => p.aromaType === aromaName);
  },
};
