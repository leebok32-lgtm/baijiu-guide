"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import {
  MATCH_CONFIDENCE_THRESHOLD,
  matchProducts,
  type ProductMatch,
} from "@/lib/ocr/matchProduct";
import { PhotoUploadBox } from "@/components/photo/PhotoUploadBox";
import { PhotoSearchResultCard } from "@/components/photo/PhotoSearchResultCard";

type Stage = "idle" | "analyzing" | "done" | "low-confidence" | "no-match";

type OcrProviderName = "mock" | "google" | "openai";

interface OcrApiResponse {
  text: string;
  blocks?: string[];
  provider: OcrProviderName;
  fallbackFrom: OcrProviderName | null;
  receivedAt: string;
  meta?: Record<string, unknown>;
}

interface OcrApiError {
  error: string;
  provider?: OcrProviderName;
}

interface AnalysisResult {
  text: string;
  provider: OcrProviderName;
  fallbackFrom: OcrProviderName | null;
  matches: ProductMatch[];
}

const PROVIDER_LABELS: Record<OcrProviderName, string> = {
  mock: "Mock OCR (개발용)",
  google: "Google Cloud Vision",
  openai: "OpenAI Vision",
};

async function callOcrApi(file: File): Promise<OcrApiResponse> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch("/api/ocr", { method: "POST", body: form });
  if (!res.ok) {
    let detail: OcrApiError | null = null;
    try {
      detail = (await res.json()) as OcrApiError;
    } catch {
      // ignore
    }
    throw new Error(detail?.error ?? `OCR 요청 실패 (${res.status})`);
  }
  return (await res.json()) as OcrApiResponse;
}

export function PhotoSearchExperience({ products }: { products: Product[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (f: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStage("idle");
    setResult(null);
    setErrorMsg(null);
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setStage("idle");
    setResult(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setStage("analyzing");
    setResult(null);
    setErrorMsg(null);

    try {
      const ocr = await callOcrApi(file);
      const matches = matchProducts(ocr.text, products, 3);
      const next: AnalysisResult = {
        text: ocr.text,
        provider: ocr.provider,
        fallbackFrom: ocr.fallbackFrom,
        matches,
      };
      setResult(next);

      if (matches.length === 0) {
        setStage("no-match");
      } else if (matches[0].score < MATCH_CONFIDENCE_THRESHOLD) {
        setStage("low-confidence");
      } else {
        setStage("done");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg);
      setStage("no-match");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <section className="space-y-4">
        <PhotoUploadBox
          previewUrl={previewUrl}
          onFile={handleFile}
          onClear={handleClear}
        />

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!previewUrl || stage === "analyzing"}
          className="w-full rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-navy-900 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {stage === "analyzing" ? "분석 중..." : "✨ 분석하기"}
        </button>

        <div className="rounded-xl border border-cream-200 bg-cream-100/60 px-4 py-3 text-xs leading-relaxed text-navy-800">
          <p className="font-semibold text-navy-900">개인정보 안내</p>
          <p className="mt-1 text-navy-700/90">
            업로드하신 사진은 <strong>제품 분석 용도로만 사용</strong>되며{" "}
            <strong>서버에 저장되지 않습니다</strong>. 분석이 끝나면 메모리에서
            즉시 폐기됩니다.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        {stage === "idle" && !result && !errorMsg && (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-cream-300 bg-cream-100/40 px-4 py-12 text-center">
            <p className="text-sm text-navy-800">
              사진을 업로드하고 <strong>분석하기</strong>를 누르면 후보 제품이
              여기 표시돼요.
            </p>
          </div>
        )}

        {stage === "analyzing" && (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-cream-200 bg-cream-50 px-4 py-12 text-center shadow-card">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cream-300 border-t-gold-500" />
            <p className="text-sm font-medium text-navy-800">
              라벨을 읽고 가장 비슷한 제품을 찾고 있어요…
            </p>
          </div>
        )}

        {result && (stage === "done" || stage === "low-confidence") && (
          <div className="space-y-3">
            <div className="space-y-2 rounded-xl border border-cream-200 bg-cream-100/60 px-4 py-3 text-sm text-navy-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">인식 결과:</span>
                <code className="rounded bg-cream-200 px-1.5 py-0.5 text-xs text-navy-900">
                  {result.text || "(빈 응답)"}
                </code>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-navy-700/90">
                <span className="rounded-full bg-cream-200 px-2 py-0.5 font-medium">
                  {PROVIDER_LABELS[result.provider]}
                </span>
                {result.fallbackFrom && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-900">
                    ⚠ {PROVIDER_LABELS[result.fallbackFrom]} 키 없음 → mock fallback
                  </span>
                )}
              </div>
            </div>

            {stage === "low-confidence" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                정확한 제품을 찾지 못했어요. 아래는 가능성 있는 후보지만,
                일치도가 낮을 수 있어요. 정보가 없다면{" "}
                <Link
                  href="/submit"
                  className="font-semibold underline underline-offset-2"
                >
                  제보하기
                </Link>
                로 알려주세요.
              </div>
            )}

            <div className="space-y-3">
              {result.matches.map((m, i) => (
                <PhotoSearchResultCard key={m.product.id} match={m} rank={i + 1} />
              ))}
            </div>
          </div>
        )}

        {stage === "no-match" && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
            <h3 className="font-serif text-lg font-semibold text-red-900">
              정확한 제품을 찾지 못했어요
            </h3>
            <p className="mt-2 text-sm text-red-900/80">
              {errorMsg
                ? errorMsg
                : "저희 DB에 아직 없는 백주일 수 있어요. 제보해 주시면 확인 후 데이터에 추가할게요."}
            </p>
            <Link
              href="/submit"
              className="mt-4 inline-block rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-red-50 hover:bg-red-800"
            >
              제보하기 →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
