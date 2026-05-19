import Link from "next/link";
import type { Product } from "@/types";

export function ProductPairingCard({ product }: { product: Product }) {
  return (
    <section
      className="rounded-2xl border border-cream-200 bg-cream-50 p-4 shadow-card sm:p-6"
      aria-labelledby="product-pairing"
    >
      <h2
        id="product-pairing"
        className="font-serif text-xl font-semibold text-navy-900"
      >
        추천 음식
      </h2>
      <p className="mt-1 text-sm text-navy-700/80">
        이 술과 함께 즐기면 좋은 음식들입니다.
      </p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {product.recommendedFoods.map((food) => (
          <li key={food}>
            <Link
              href={`/pairing#${encodeURIComponent(food)}`}
              className="flex items-center justify-between rounded-xl border border-cream-200 bg-cream-100/50 px-3 py-2.5 text-sm text-navy-800 transition hover:border-gold-400/40 hover:bg-cream-100"
            >
              <span>🍽 {food}</span>
              <span className="text-xs text-navy-700/70">페어링 보기 →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
