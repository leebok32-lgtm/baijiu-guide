import type { Product } from "@/types";
import { getSupabaseClient } from "@/lib/supabase/client";
import { rowToProduct } from "@/lib/supabase/mappers";
import type { ProductRepository } from "./repository";

/**
 * Supabase 위에 동작하는 repository 구현.
 *
 * 환경변수가 설정되었을 때만 활성화되며, 환경변수가 없을 때 호출되면
 * 명확한 에러를 던집니다 (`getActiveRepository()` 가 mock으로 자동 fallback
 * 하므로 실제로 이 경로가 실행되지 않아야 합니다).
 *
 * 모든 함수는 서버 컴포넌트 또는 라우트 핸들러에서만 호출되어야 합니다.
 * 클라이언트 컴포넌트는 부모 서버 컴포넌트에서 props 로 데이터를 받아야
 * 합니다.
 */

function client() {
  const c = getSupabaseClient();
  if (!c) {
    throw new Error(
      "Supabase 클라이언트가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 환경변수를 확인하세요.",
    );
  }
  return c;
}

export const supabaseRepository: ProductRepository = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await client()
      .from("products")
      .select("*")
      .order("name_ko", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToProduct);
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await client()
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToProduct(data) : null;
  },

  async getByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    const { data, error } = await client()
      .from("products")
      .select("*")
      .in("id", ids);
    if (error) throw error;

    const byId = new Map<string, Product>();
    for (const row of data ?? []) {
      const product = rowToProduct(row);
      byId.set(product.id, product);
    }
    return ids
      .map((id) => byId.get(id))
      .filter((p): p is Product => Boolean(p));
  },

  async getByAroma(aromaName: string): Promise<Product[]> {
    const { data, error } = await client()
      .from("products")
      .select("*")
      .eq("aroma_type", aromaName)
      .order("name_ko", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToProduct);
  },
};
