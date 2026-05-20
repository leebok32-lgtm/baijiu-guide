import type { Metadata } from "next";
import Link from "next/link";
import { getAromaTypes } from "@/lib/aroma/getAromaTypes";

export const metadata: Metadata = {
  title: "입문가이드 | 백주가 처음이라면",
  description:
    "고량주·백주·바이주가 처음인 분을 위한 5분 가이드. 향형, 도수, 마시는 법, 추천 음식을 한국어로 정리했습니다.",
};

const STEPS = [
  {
    title: "1. 백주가 뭔가요?",
    body: "백주(白酒)는 중국 전통의 곡물 증류주를 통칭합니다. 한국에서는 '고량주(高粱酒)'라고도 하지만, 거의 같은 술을 가리킨다고 보셔도 됩니다. 수수·쌀·옥수수·밀 등 곡물을 발효시킨 뒤 증류해 만들며, 보통 40~60도 사이의 도수입니다.",
  },
  {
    title: "2. 도수가 너무 높은 게 부담된다면?",
    body: "30~40도대의 저도수 라인부터 시작해 보세요. 연태고량주(34%), 공부가주(39%) 같은 저도수 라인이 입문용으로 사랑받습니다.",
  },
  {
    title: "3. 향형을 알면 고르기가 쉬워져요",
    body: "백주는 '향형(香型)'에 따라 풍미가 크게 달라집니다. 가벼운 청향형부터 농향형, 묵직한 장향형까지 다양해요.",
  },
  {
    title: "4. 음식과 함께 마셔보세요",
    body: "양꼬치엔 청향형, 마라탕·훠궈엔 농향형, 동파육엔 장향형. 음식과 술의 페어링이 백주를 더 맛있게 만들어 줍니다.",
  },
  {
    title: "5. 한 모금씩, 천천히",
    body: "백주는 작은 잔으로 한 모금씩 천천히 즐기는 술이에요. 처음엔 입에서 가볍게 굴리며 향을 느껴보세요.",
  },
];

export default async function GuidePage() {
  const aromaTypes = await getAromaTypes();

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          5분 입문가이드
        </h1>
        <p className="mt-2 text-sm text-navy-700/80 sm:text-base">
          백주가 처음이신가요? 가장 자주 묻는 다섯 가지를 모았어요.
        </p>
      </header>

      <ol className="space-y-4">
        {STEPS.map((step) => (
          <li
            key={step.title}
            className="rounded-2xl border border-cream-200 bg-cream-50 p-5 shadow-card sm:p-6"
          >
            <h2 className="font-serif text-xl font-semibold text-navy-900">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-800 sm:text-base">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <section>
        <h2 className="font-serif text-2xl font-semibold text-navy-900">
          향형 빠르게 훑어보기
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aromaTypes.map((a) => (
            <Link
              key={a.id}
              href={`/aroma/${a.slug}`}
              className="rounded-2xl border border-cream-200 bg-cream-50 p-4 hover:border-gold-400/40"
            >
              <div className="text-xs text-gold-600">{a.nameCn}</div>
              <div className="mt-0.5 font-serif text-lg font-semibold text-navy-900">
                {a.nameKo}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-navy-800/90 line-clamp-2">
                {a.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/products"
          className="rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-navy-900"
        >
          제품 둘러보기
        </Link>
        <Link
          href="/pairing"
          className="rounded-full border border-cream-300 px-5 py-2.5 text-sm font-semibold text-navy-800 hover:border-navy-800"
        >
          음식 페어링 보기
        </Link>
      </div>
    </div>
  );
}
