import type { Metadata } from "next";
import Link from "next/link";
import { getAromaTypes } from "@/lib/aroma/getAromaTypes";

export const metadata: Metadata = {
  title: "향형사전 | 청향·농향·장향·미향·겸향",
  description:
    "백주의 향형(香型)을 한국어로 친절하게 설명합니다. 각 향형의 특징, 대표 향, 추천 음식과 대표 제품을 확인하세요.",
};

export default async function AromaIndexPage() {
  const aromaTypes = await getAromaTypes();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          향형사전
        </h1>
        <p className="mt-2 text-sm text-navy-700/80 sm:text-base">
          향형(香型)은 백주를 분류하는 가장 큰 기준이에요. 향형을 알면 처음 보는
          백주도 어떤 맛일지 가늠할 수 있어요.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aromaTypes.map((a) => (
          <Link
            key={a.id}
            href={`/aroma/${a.slug}`}
            className="flex flex-col gap-3 rounded-2xl border border-cream-200 bg-cream-50 p-5 shadow-card transition hover:-translate-y-0.5 hover:border-gold-400/40 hover:shadow-cardHover"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl font-semibold text-navy-900">
                {a.nameKo}
              </h2>
              <span className="text-xs text-navy-700/70">{a.nameCn}</span>
            </div>
            <p className="text-sm leading-relaxed text-navy-800/90 line-clamp-3">
              {a.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {a.typicalFlavor.slice(0, 3).map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs text-navy-800"
                >
                  {f}
                </span>
              ))}
            </div>
            <span className="mt-auto text-xs font-semibold text-gold-600">
              자세히 보기 →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
