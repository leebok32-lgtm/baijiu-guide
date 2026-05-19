import type { OcrInput, OcrProvider, OcrResult } from "./types";

/**
 * Google Cloud Vision OCR provider.
 *
 * REST API + API key 인증을 사용합니다 (service account 보다 단순).
 * 활성화 조건:
 *   OCR_PROVIDER=google
 *   GOOGLE_VISION_API_KEY=...
 *
 * Vision API는 한자/한글/영문/숫자가 섞인 백주 라벨 인식에 강합니다.
 * `DOCUMENT_TEXT_DETECTION` 을 사용하여 라벨 텍스트 블록 구조도 활용할 수 있게
 * 합니다.
 *
 * 요청 본문 형태:
 *   {
 *     requests: [{
 *       image: { content: <base64> },
 *       features: [{ type: "DOCUMENT_TEXT_DETECTION", maxResults: 1 }],
 *       imageContext: { languageHints: ["zh", "ko", "en"] }
 *     }]
 *   }
 */
const ENDPOINT = "https://vision.googleapis.com/v1/images:annotate";

interface GoogleVisionResponse {
  responses?: Array<{
    fullTextAnnotation?: {
      text?: string;
      pages?: Array<{
        blocks?: Array<{
          paragraphs?: Array<{
            words?: Array<{
              symbols?: Array<{ text?: string }>;
            }>;
          }>;
        }>;
      }>;
    };
    textAnnotations?: Array<{ description?: string }>;
    error?: { code: number; message: string };
  }>;
}

function getApiKey(): string | undefined {
  const key = process.env.GOOGLE_VISION_API_KEY;
  return key && key.trim() ? key.trim() : undefined;
}

export const googleVisionProvider: OcrProvider = {
  name: "google",

  isReady() {
    return Boolean(getApiKey());
  },

  async recognize(input: OcrInput): Promise<OcrResult> {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error(
        "GOOGLE_VISION_API_KEY 가 설정되지 않았습니다. selector 가 mock 으로 fallback 했어야 합니다.",
      );
    }

    const url = `${ENDPOINT}?key=${encodeURIComponent(apiKey)}`;
    const body = {
      requests: [
        {
          image: { content: input.imageBase64 },
          features: [{ type: "DOCUMENT_TEXT_DETECTION", maxResults: 1 }],
          imageContext: { languageHints: ["zh", "ko", "en"] },
        },
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(
        `Google Vision API 호출 실패 (${res.status}): ${detail.slice(0, 200)}`,
      );
    }

    const json = (await res.json()) as GoogleVisionResponse;
    const first = json.responses?.[0];

    if (first?.error) {
      throw new Error(
        `Google Vision API 에러: ${first.error.code} ${first.error.message}`,
      );
    }

    const text =
      first?.fullTextAnnotation?.text ??
      first?.textAnnotations?.[0]?.description ??
      "";

    // 블록(문단) 단위 텍스트도 추출 (선택)
    const blocks: string[] = [];
    for (const page of first?.fullTextAnnotation?.pages ?? []) {
      for (const block of page.blocks ?? []) {
        const blockText = (block.paragraphs ?? [])
          .map((p) =>
            (p.words ?? [])
              .map((w) =>
                (w.symbols ?? []).map((s) => s.text ?? "").join(""),
              )
              .join(" "),
          )
          .join("\n")
          .trim();
        if (blockText) blocks.push(blockText);
      }
    }

    return {
      text,
      blocks: blocks.length > 0 ? blocks : undefined,
      provider: "google",
      meta: { endpoint: ENDPOINT, languageHints: ["zh", "ko", "en"] },
      receivedAt: new Date().toISOString(),
    };
  },
};
