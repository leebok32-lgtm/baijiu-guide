import { NextResponse } from "next/server";
import { getActiveOcrProvider } from "@/lib/ocr/providers";

/**
 * POST /api/ocr
 *
 * 클라이언트로부터 multipart/form-data 의 `image` 필드로 이미지를 받아
 * 활성 OCR provider 로 텍스트를 추출해 반환합니다.
 *
 * 보안/프라이버시 정책:
 *   - 이미지는 메모리에서만 처리되며 디스크/DB에 저장되지 않습니다.
 *   - 8MB 초과 파일은 거부합니다.
 *   - `image/*` 외 content-type 은 거부합니다.
 *   - 처리 후 base64 등 중간 데이터는 즉시 소멸 (스코프 종료).
 *   - 응답에는 OCR 텍스트와 provider 메타데이터만 포함되며, 이미지 자체는
 *     절대 반환되지 않습니다.
 *
 * 응답 shape:
 *   200: { text, blocks?, provider, fallbackFrom, receivedAt, meta? }
 *   400: { error }   잘못된 요청 (이미지 누락, 잘못된 타입 등)
 *   413: { error }   파일이 너무 큼
 *   500: { error }   provider 호출 실패
 */

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_PREFIX = "image/";

// Node.js runtime: provider 들이 fetch + base64 + 환경변수에 접근하므로 edge 가 아닌 nodejs 사용
export const runtime = "nodejs";
// 캐싱 금지 — 매 요청마다 새 OCR 실행
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "요청 본문이 multipart/form-data 가 아닙니다." },
      { status: 400 },
    );
  }

  const fileEntry = formData.get("image");
  if (!fileEntry || typeof fileEntry === "string") {
    return NextResponse.json(
      { error: "'image' 필드에 파일을 첨부해 주세요." },
      { status: 400 },
    );
  }
  const file = fileEntry as File;

  if (!file.type || !file.type.startsWith(ALLOWED_PREFIX)) {
    return NextResponse.json(
      { error: `이미지 파일만 업로드할 수 있어요. (받은 타입: ${file.type || "unknown"})` },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        error: `파일 크기가 너무 큽니다. (${(file.size / 1024 / 1024).toFixed(1)}MB > ${MAX_BYTES / 1024 / 1024}MB)`,
      },
      { status: 413 },
    );
  }

  // 메모리에서만 처리: ArrayBuffer → base64. 디스크/DB 저장 없음.
  let imageBase64: string;
  try {
    const arrayBuffer = await file.arrayBuffer();
    imageBase64 = Buffer.from(arrayBuffer).toString("base64");
  } catch {
    return NextResponse.json(
      { error: "이미지를 읽는 중 문제가 발생했어요." },
      { status: 400 },
    );
  }

  const { provider, fallbackFrom } = getActiveOcrProvider();

  try {
    const result = await provider.recognize({
      imageBase64,
      contentType: file.type,
      fileName: file.name,
    });

    return NextResponse.json({
      text: result.text,
      blocks: result.blocks,
      provider: result.provider,
      fallbackFrom,
      meta: result.meta,
      receivedAt: result.receivedAt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[api/ocr] provider=${provider.name} 호출 실패:`,
      message,
    );
    return NextResponse.json(
      {
        error: "OCR 처리 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.",
        provider: provider.name,
      },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { error: "POST 메서드로 multipart/form-data 의 image 필드를 보내 주세요." },
    { status: 405 },
  );
}
