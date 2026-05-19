import type { OcrProvider, OcrProviderName } from "./types";
import { mockOcrProvider } from "./mockProvider";
import { googleVisionProvider } from "./googleVisionProvider";
import { openaiVisionProvider } from "./openaiVisionProvider";

export type { OcrInput, OcrProvider, OcrResult, OcrProviderName } from "./types";

/**
 * 환경변수 `OCR_PROVIDER` 값에 따라 활성 provider 를 결정합니다.
 * 키가 없으면 mock 으로 자동 fallback 하며, `fallbackFrom` 에 원래
 * 요청된 provider 이름을 담아 호출자가 UI 에 안내할 수 있게 합니다.
 *
 *   OCR_PROVIDER = mock           → mock
 *   OCR_PROVIDER = google         → google (키 없으면 → mock, fallbackFrom: "google")
 *   OCR_PROVIDER = openai         → openai (키 없으면 → mock, fallbackFrom: "openai")
 *   (미설정 또는 알 수 없는 값)    → mock
 */
export interface ResolvedProvider {
  provider: OcrProvider;
  fallbackFrom: OcrProviderName | null;
}

function readRequested(): OcrProviderName {
  const raw = process.env.OCR_PROVIDER?.trim().toLowerCase() ?? "";
  if (raw === "google" || raw === "openai" || raw === "mock") return raw;
  return "mock";
}

export function getActiveOcrProvider(): ResolvedProvider {
  const requested = readRequested();

  if (requested === "mock") {
    return { provider: mockOcrProvider, fallbackFrom: null };
  }

  if (requested === "google") {
    if (googleVisionProvider.isReady()) {
      return { provider: googleVisionProvider, fallbackFrom: null };
    }
    return { provider: mockOcrProvider, fallbackFrom: "google" };
  }

  if (requested === "openai") {
    if (openaiVisionProvider.isReady()) {
      return { provider: openaiVisionProvider, fallbackFrom: null };
    }
    return { provider: mockOcrProvider, fallbackFrom: "openai" };
  }

  return { provider: mockOcrProvider, fallbackFrom: null };
}
