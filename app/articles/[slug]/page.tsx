import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticleBySlug } from "@/data/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "글을 찾을 수 없어요" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-3 border-b border-cream-200 pb-6">
        <div className="flex items-center gap-2 text-xs text-navy-700/80">
          <span className="rounded-full bg-cream-200 px-2.5 py-0.5 font-medium text-navy-800">
            {article.tag}
          </span>
          <time dateTime={article.publishedAt}>{article.publishedAt}</time>
        </div>
        <h1 className="font-serif text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
          {article.title}
        </h1>
        <p className="text-base text-navy-700/80">{article.excerpt}</p>
      </header>

      <div className="space-y-4 text-base leading-relaxed text-navy-800 sm:text-lg">
        {article.body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="pt-6">
        <Link
          href="/articles"
          className="text-sm font-semibold text-gold-600 hover:text-gold-500"
        >
          ← 글 목록으로
        </Link>
      </div>
    </article>
  );
}
