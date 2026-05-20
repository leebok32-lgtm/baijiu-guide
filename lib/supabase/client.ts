import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let cachedAnon: SupabaseClient<Database> | null = null;
let cachedService: SupabaseClient<Database> | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isSupabaseServiceConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/**
 * 익명(publishable) 키 기반 클라이언트. 클라이언트/서버 어디서나 사용 가능.
 * RLS 정책의 영향을 받습니다.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (cachedAnon) return cachedAnon;
  if (!isSupabaseConfigured()) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  cachedAnon = createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
  return cachedAnon;
}

/**
 * service_role 키 기반 클라이언트. **서버 사이드에서만** 사용하세요.
 * RLS 를 우회하므로 클라이언트 번들에 절대 노출되면 안 됩니다.
 *
 * route handler / server action 안에서 mutations (예: submissions INSERT) 에
 * 사용합니다. 환경변수 미설정 시 `null` 반환.
 */
export function getSupabaseServiceClient(): SupabaseClient<Database> | null {
  if (typeof window !== "undefined") {
    throw new Error(
      "getSupabaseServiceClient() must only be called on the server.",
    );
  }
  if (cachedService) return cachedService;
  if (!isSupabaseServiceConfigured()) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

  cachedService = createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
  return cachedService;
}
