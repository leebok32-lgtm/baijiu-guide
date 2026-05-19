import type { Product } from "@/types";

export function ProductInfoTable({ product }: { product: Product }) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "분류", value: product.category },
    { label: "향형", value: product.aromaType },
    { label: "도수", value: `${product.abv}%` },
    {
      label: "용량",
      value: product.volumeMl ? `${product.volumeMl}ml` : "정보 없음",
    },
    { label: "산지", value: `${product.originCountry} · ${product.originRegion}` },
    {
      label: "제조사",
      value: product.manufacturer ?? "정보 없음",
    },
    { label: "원료", value: product.ingredients.join(", ") },
    { label: "입문 난이도", value: product.beginnerLevel },
  ];

  return (
    <section
      className="rounded-2xl border border-cream-200 bg-cream-50 p-4 shadow-card sm:p-6"
      aria-labelledby="product-basic-info"
    >
      <h2
        id="product-basic-info"
        className="font-serif text-xl font-semibold text-navy-900"
      >
        기본 정보
      </h2>
      <dl className="mt-4 divide-y divide-cream-200">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-3 gap-3 py-2.5 text-sm sm:grid-cols-4"
          >
            <dt className="text-navy-700/80">{row.label}</dt>
            <dd className="col-span-2 font-medium text-navy-900 sm:col-span-3">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
