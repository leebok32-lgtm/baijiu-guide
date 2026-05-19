/**
 * OCR Provider 추상화.
 *
 * 모든 provider 구현체 (mock / google / openai) 는 `OcrProvider` 인터페이스를
 * 만족합니다. 활성 provider 선택은 `lib/ocr/providers/index.ts` 의
 * `getActiveOcrProvider()` 가 환경변수 기반으로 결정합니다.
 *
 * Provider 는 반드시 서버 사이드에서만 호출되어야 합니다 (`app/api/ocr` 등).
 * API key 가 클라이언트에 노출되면 안 되기 때문입니다.
 */

export type OcrProviderName = "mock" | "google" | "openai";

export interface OcrInput {
  /** Base64 인코딩된 이미지 본문 (no data: prefix). */
  imageBase64: string;
  /** MIME 타입. 예: "image/jpeg". */
  contentType: string;
  /** 파일명 (provider 가 hint로 쓸 수 있음). */
  fileName?: string;
}

export interface OcrResult {
  /** 추출된 전체 텍스트 (행 단위 \n 으로 구분 권장). */
  text: string;
  /** Provider 가 행/블록을 별도로 줄 경우 보존 (선택). */
  blocks?: string[];
  /** 실제로 사용된 provider 이름. */
  provider: OcrProviderName;
  /** 추가 메타데이터 (provider 별 디버그 정보). 응답에 포함되어 클라이언트로 전달됨. */
  meta?: Record<string, unknown>;
  /** ISO timestamp */
  receivedAt: string;
}

export interface OcrProvider {
  readonly name: OcrProviderName;
  /**
   * 환경변수만으로 즉시 사용 가능한지 여부. (API key 등 필수 설정 검증)
   * `false` 면 selector 가 mock 으로 fallback 합니다.
   */
  isReady(): boolean;
  recognize(input: OcrInput): Promise<OcrResult>;
}
