import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

export function RelatedProductsSection({
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
    <section className="rounded-2xl border border-cream-200 bg-cream-50 p-4 shadow-card sm:p-6">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="font-serif text-xl font-semibold text-navy-900">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-navy-700/80">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
