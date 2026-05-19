import type { Product } from "@/types";
import { AromaBadge } from "@/components/common/AromaBadge";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { ProductImage } from "@/components/common/ProductImage";

export function ProductDetailHeader({ product }: { product: Product }) {
  return (
    <header className="grid gap-6 rounded-2xl border border-cream-200 bg-cream-50 p-4 shadow-card sm:p-6 md:grid-cols-[280px_1fr]">
      <div className="mx-auto w-full max-w-xs md:max-w-none">
        <ProductImage nameKo={product.nameKo} imageUrl={product.imageUrl} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <AromaBadge aromaType={product.aromaType} />
          <DifficultyBadge level={product.beginnerLevel} />
          <VerifiedBadge verified={product.verified} />
        </div>

        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
            {product.nameKo}
          </h1>
          <p className="mt-1 text-sm text-navy-700/80">
            {product.nameCn}
            {product.nameEn ? ` · ${product.nameEn}` : ""}
            {product.pinyin ? ` · ${product.pinyin}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="rounded-lg bg-navy-800 px-3 py-1.5 font-semibold text-cream-50">
            {product.abv}% vol
          </span>
          {product.volumeMl ? (
            <span className="text-navy-800">{product.volumeMl}ml</span>
          ) : null}
          <span className="text-navy-800">{product.category}</span>
        </div>

        <p className="text-base leading-relaxed text-navy-800">
          {product.oneLineReview}
        </p>
      </div>
    </header>
  );
}
