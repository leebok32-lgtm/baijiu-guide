import Link from "next/link";
import type { Product } from "@/types";
import { AromaBadge } from "@/components/common/AromaBadge";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { PriceBadge } from "@/components/common/PriceBadge";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { ProductImage } from "@/components/common/ProductImage";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 shadow-card transition hover:-translate-y-0.5 hover:border-gold-400/40 hover:shadow-cardHover"
    >
      <div className="relative">
        <ProductImage nameKo={product.nameKo} imageUrl={product.imageUrl} />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <AromaBadge aromaType={product.aromaType} />
        </div>
        <div className="absolute right-3 top-3">
          <VerifiedBadge verified={product.verified} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif text-lg font-semibold text-navy-900 group-hover:text-gold-600">
              {product.nameKo}
            </h3>
            <span className="text-sm font-semibold text-navy-800">
              {product.abv}%
            </span>
          </div>
          <p className="mt-0.5 text-xs text-navy-700/70">
            {product.nameCn} · {product.category}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <DifficultyBadge level={product.beginnerLevel} />
          <PriceBadge label={product.priceLabel} />
        </div>

        <p className="text-sm leading-relaxed text-navy-800/90">
          {product.oneLineReview}
        </p>

        {product.recommendedFoods.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-1">
            {product.recommendedFoods.slice(0, 3).map((f) => (
              <span
                key={f}
                className="rounded-md bg-cream-100 px-2 py-0.5 text-[11px] text-navy-800/80"
              >
                #{f}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
