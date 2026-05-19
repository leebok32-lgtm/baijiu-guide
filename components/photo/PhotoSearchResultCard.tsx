import Link from "next/link";
import type { ProductMatch } from "@/lib/ocr/matchProduct";
import { AromaBadge } from "@/components/common/AromaBadge";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { ProductImage } from "@/components/common/ProductImage";

export function PhotoSearchResultCard({
  match,
  rank,
}: {
  match: ProductMatch;
  rank: number;
}) {
  const { product, score, confidence, reasons } = match;
  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex items-stretch gap-3 rounded-2xl border border-cream-200 bg-cream-50 p-3 shadow-card transition hover:border-gold-400/40 hover:shadow-cardHover sm:p-4"
    >
      <div className="w-20 flex-shrink-0 sm:w-28">
        <ProductImage nameKo={product.nameKo} imageUrl={product.imageUrl} />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[11px] font-semibold text-gold-600">
              후보 #{rank}
            </div>
            <h3 className="font-serif text-lg font-semibold text-navy-900">
              {product.nameKo}
            </h3>
            <p className="text-xs text-navy-700/80">
              {product.nameCn} · {product.abv}%
            </p>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-navy-700/70">유사도</div>
            <div className="text-sm font-bold text-navy-900">{confidence}%</div>
            <div className="text-[10px] text-navy-700/60">score {score}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <AromaBadge aromaType={product.aromaType} />
          <DifficultyBadge level={product.beginnerLevel} />
        </div>

        {reasons.length > 0 && (
          <ul className="space-y-0.5 text-[11px] text-navy-700/80">
            {reasons.slice(0, 3).map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
