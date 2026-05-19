import Link from "next/link";
import type { Product } from "@/types";
import { AromaBadge } from "@/components/common/AromaBadge";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";

export function RankingSection({
  title,
  description,
  products,
}: {
  title: string;
  description?: string;
  products: Product[];
}) {
  if (products.length === 0) return null;
  return (
    <section className="rounded-2xl border border-cream-200 bg-cream-50 p-5 shadow-card sm:p-6">
      <header className="mb-4">
        <h2 className="font-serif text-xl font-semibold text-navy-900 sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-navy-700/80">{description}</p>
        )}
      </header>

      <ol className="space-y-2.5">
        {products.slice(0, 5).map((p, idx) => (
          <li key={p.id}>
            <Link
              href={`/products/${p.slug}`}
              className="flex items-center gap-3 rounded-xl border border-cream-200 bg-cream-50 p-3 transition hover:border-gold-400/40 hover:bg-cream-100/60"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-navy-800 font-serif text-base font-bold text-gold-400">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="truncate text-sm font-semibold text-navy-900 sm:text-base">
                    {p.nameKo}
                  </h3>
                  <span className="text-xs text-navy-800">{p.abv}%</span>
                </div>
                <p className="truncate text-xs text-navy-700/70">
                  {p.oneLineReview}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <AromaBadge aromaType={p.aromaType} />
                  <DifficultyBadge level={p.beginnerLevel} />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
