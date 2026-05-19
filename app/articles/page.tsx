import type { Metadata } from "next";
import { articles } from "@/data/articles";
import { GuideArticleCard } from "@/components/common/GuideArticleCard";

export const metadata: Metadata = {
  title: "백주 이야기 | 한국어 백주 칼럼",
  description:
    "백주를 더 깊이 즐기기 위한 한국어 칼럼과 가이드를 모았습니다.",
};

export default function ArticlesIndexPage() {
  const sorted = [...articles].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          백주 이야기
        </h1>
        <p className="mt-2 text-sm text-navy-700/80 sm:text-base">
          백주를 더 깊이 즐기기 위한 한국어 칼럼.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((a) => (
          <GuideArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
