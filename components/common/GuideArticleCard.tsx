import Link from "next/link";
import type { Article } from "@/types";

export function GuideArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="flex flex-col gap-2 rounded-2xl border border-cream-200 bg-cream-50 p-5 shadow-card transition hover:-translate-y-0.5 hover:border-gold-400/40 hover:shadow-cardHover"
    >
      <div className="flex items-center gap-2 text-xs text-navy-700/80">
        <span className="rounded-full bg-cream-200 px-2 py-0.5 font-medium text-navy-800">
          {article.tag}
        </span>
        <time dateTime={article.publishedAt}>{article.publishedAt}</time>
      </div>
      <h3 className="font-serif text-lg font-semibold text-navy-900">
        {article.title}
      </h3>
      <p className="text-sm leading-relaxed text-navy-800/90">
        {article.excerpt}
      </p>
      <span className="mt-auto text-xs font-semibold text-gold-600">
        자세히 읽기 →
      </span>
    </Link>
  );
}
