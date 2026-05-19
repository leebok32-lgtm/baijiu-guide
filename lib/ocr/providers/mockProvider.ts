import type { OcrInput, OcrProvider, OcrResult } from "./types";

/**
 * 개발용 mock provider.
 *
 * 업로드된 이미지를 실제로 분석하지 않고, 미리 정의된 라벨 후보 중 하나를
 * 무작위로 반환합니다. 환경변수가 없을 때 기본으로 활성화됩니다.
 */
const MOCK_OCR_CANDIDATES = [
  "烟台古酿 34%",
  "贵州茅台酒 Kweichow Moutai 53%",
  "汾酒 Fenjiu 53%",
  "五粮液 Wuliangye 52%",
  "泸州老窖 Luzhou Laojiao 52%",
];

export const mockOcrProvider: OcrProvider = {
  name: "mock",
  isReady() {
    return true;
  },
  async recognize(_input: OcrInput): Promise<OcrResult> {
    // 실제 네트워크 호출 대신 짧은 지연으로 분석 UX 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 900));
    const text =
      MOCK_OCR_CANDIDATES[
        Math.floor(Math.random() * MOCK_OCR_CANDIDATES.length)
      ];
    return {
      text,
      blocks: [text],
      provider: "mock",
      meta: { candidatePool: MOCK_OCR_CANDIDATES.length },
      receivedAt: new Date().toISOString(),
    };
  },
};

export { MOCK_OCR_CANDIDATES };
