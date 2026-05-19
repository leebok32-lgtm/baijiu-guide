import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let cached: SupabaseClient<Database> | null = null;

/**
 * 환경변수가 둘 다 설정되었는지 확인합니다.
 * 둘 다 있어야만 Supabase 모드로 동작합니다.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Supabase 클라이언트를 반환합니다.
 *
 * 환경변수가 없으면 `null` 을 반환하며, 호출하는 쪽 (예: supabaseRepository)
 * 에서 mock fallback으로 자연스럽게 떨어집니다.
 *
 * 같은 프로세스 내에서 재호출 시 캐시된 클라이언트를 반환합니다.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (cached) return cached;
  if (!isSupabaseConfigured()) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  cached = createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
  return cached;
}
