import type { OcrInput, OcrProvider, OcrResult } from "./types";

/**
 * OpenAI Vision OCR provider.
 *
 * Chat Completions API + vision-capable 모델 (gpt-4o, gpt-4o-mini 등) 을
 * 사용해 이미지의 텍스트를 추출합니다. Vision 전용 API 가 아닌 멀티모달
 * 입력 형태이며, 백주 라벨처럼 다국어가 섞인 케이스에서도 일반적으로
 * 좋은 결과를 보여 줍니다.
 *
 * 활성화 조건:
 *   OCR_PROVIDER=openai
 *   OPENAI_API_KEY=...
 *   OPENAI_MODEL=gpt-4o-mini   (선택, 기본값)
 *
 * 시스템 프롬프트는 "라벨 텍스트만 그대로 추출"하도록 지시하며,
 * 번역이나 해설이 섞이지 않도록 가드합니다.
 */
const ENDPOINT = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT =
  "당신은 OCR 엔진입니다. 입력된 이미지에서 보이는 모든 텍스트(중국어 한자, 한글, 영어, 숫자, 퍼센트 기호 등)를 보이는 그대로 추출합니다. 행은 줄바꿈으로 구분하세요. 번역, 설명, 마크다운, 코드 블록은 절대 출력하지 말고 추출된 원문 텍스트만 반환하세요.";

const USER_PROMPT =
  "이 백주(중국 증류주) 병의 라벨에서 모든 텍스트를 그대로 추출해 주세요.";

interface OpenAIChatResponse {
  id?: string;
  model?: string;
  choices?: Array<{
    message?: { role?: string; content?: string };
    finish_reason?: string;
  }>;
  error?: { message?: string; type?: string };
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

function getApiKey(): string | undefined {
  const key = process.env.OPENAI_API_KEY;
  return key && key.trim() ? key.trim() : undefined;
}

function getModel(): string {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

export const openaiVisionProvider: OcrProvider = {
  name: "openai",

  isReady() {
    return Boolean(getApiKey());
  },

  async recognize(input: OcrInput): Promise<OcrResult> {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY 가 설정되지 않았습니다. selector 가 mock 으로 fallback 했어야 합니다.",
      );
    }

    const dataUrl = `data:${input.contentType};base64,${input.imageBase64}`;
    const model = getModel();

    const body = {
      model,
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: USER_PROMPT },
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
          ],
        },
      ],
    };

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(
        `OpenAI Vision API 호출 실패 (${res.status}): ${detail.slice(0, 200)}`,
      );
    }

    const json = (await res.json()) as OpenAIChatResponse;

    if (json.error) {
      throw new Error(
        `OpenAI API 에러: ${json.error.type ?? "unknown"} ${json.error.message ?? ""}`,
      );
    }

    const text = (json.choices?.[0]?.message?.content ?? "").trim();
    const blocks = text ? text.split(/\r?\n/).filter((b) => b.trim()) : undefined;

    return {
      text,
      blocks,
      provider: "openai",
      meta: {
        model: json.model ?? model,
        usage: json.usage,
      },
      receivedAt: new Date().toISOString(),
    };
  },
};
