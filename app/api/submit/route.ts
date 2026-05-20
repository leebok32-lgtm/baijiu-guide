import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type SubmissionInsert = Database["public"]["Tables"]["submissions"]["Insert"];

/**
 * POST /api/submit
 *
 * 사용자 제보를 접수합니다.
 *
 * Supabase 환경변수가 설정되어 있으면 `submissions` 테이블에 INSERT 하고,
 * 미설정 시 콘솔 로그로 fallback 합니다.
 *
 * 요청 body (JSON):
 *   { productName, abv?, source?, price?, description?, submitter?, contact? }
 *
 * 응답:
 *   201: { ok: true, id?, mode: "supabase" | "mock" }
 *   400: { error }
 *   500: { error }
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SubmitBody {
  productName: string;
  abv?: string;
  source?: string;
  price?: string;
  description?: string;
  submitter?: string;
  contact?: string;
}

export async function POST(request: Request) {
  let body: SubmitBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문이 올바른 JSON 형식이 아닙니다." },
      { status: 400 },
    );
  }

  if (!body.productName?.trim()) {
    return NextResponse.json(
      { error: "제품명은 필수 입력 항목입니다." },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServiceClient();

  // Supabase 미설정 시 mock fallback
  if (!supabase) {
    console.log("[고량주가이드] 제보 mock submit:", body);
    return NextResponse.json(
      { ok: true, mode: "mock" as const },
      { status: 201 },
    );
  }

  // Supabase INSERT
  const row: SubmissionInsert = {
    product_name: body.productName.trim(),
    abv: body.abv?.trim() || null,
    source: body.source?.trim() || null,
    price: body.price?.trim() || null,
    description: body.description?.trim() || null,
    submitter: body.submitter?.trim() || null,
    contact: body.contact?.trim() || null,
    image_path: null,
  };

  // submissions 테이블의 id 는 uuid auto-generated 이므로
  // Database 제네릭 타입 추론이 정확하지 않아 타입 단언을 사용합니다.
  const { data, error } = (await supabase
    .from("submissions")
    .insert(row as never)
    .select("id")
    .single()) as { data: { id: string } | null; error: Error | null };

  if (error) {
    console.error("[api/submit] Supabase insert 실패:", error.message);
    return NextResponse.json(
      { error: "제보 저장 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, id: data?.id, mode: "supabase" as const },
    { status: 201 },
  );
}

export function GET() {
  return NextResponse.json(
    { error: "POST 메서드로 JSON body 를 보내 주세요." },
    { status: 405 },
  );
}
