import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils/formatPrice";

export function ProductPriceCard({ product }: { product: Product }) {
  return (
    <section
      className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-cream-100 to-cream-50 p-4 shadow-card sm:p-6"
      aria-labelledby="product-price"
    >
      <h2
        id="product-price"
        className="font-serif text-xl font-semibold text-navy-900"
      >
        가격 정보
      </h2>

      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <span className="text-2xl font-bold text-gold-600">
          {product.priceLabel}
        </span>
        {typeof product.regularPrice === "number" && (
          <span className="text-sm text-navy-700/80">
            정가 기준 {formatPrice(product.regularPrice)}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-navy-800/80">{product.priceNote}</p>
      <p className="mt-3 text-xs text-navy-700/70">
        ※ 가격은 판매처에 따라 다를 수 있으며, 이 사이트는 주류 판매를 하지 않습니다.
      </p>
    </section>
  );
}
