import type { Product } from "@/types";

export function ProductStorySection({ product }: { product: Product }) {
  return (
    <section
      className="rounded-2xl border border-cream-200 bg-cream-50 p-4 shadow-card sm:p-6"
      aria-labelledby="product-story"
    >
      <h2
        id="product-story"
        className="font-serif text-xl font-semibold text-navy-900"
      >
        이 술만의 이야기
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-navy-800 sm:text-base">
        {product.story.split("\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
