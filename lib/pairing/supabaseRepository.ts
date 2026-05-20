import type { Pairing } from "@/types";
import { getSupabaseClient } from "@/lib/supabase/client";
import { rowToPairing } from "@/lib/supabase/mappers";
import type { PairingRepository } from "./repository";

/**
 * Supabase 위에 동작하는 repository 구현.
 *
 * 환경변수가 설정되었을 때만 활성화되며, 환경변수가 없을 때 호출되면
 * 명확한 에러를 던집니다 (`getActivePairingRepository()` 가 mock으로 자동
 * fallback 하므로 실제로 이 경로가 실행되지 않아야 합니다).
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

export const supabaseRepository: PairingRepository = {
  async getAll(): Promise<Pairing[]> {
    const { data, error } = await client()
      .from("pairings")
      .select("*")
      .order("food_name", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToPairing);
  },

  async getBySlug(slug: string): Promise<Pairing | null> {
    const { data, error } = await client()
      .from("pairings")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToPairing(data) : null;
  },
};
