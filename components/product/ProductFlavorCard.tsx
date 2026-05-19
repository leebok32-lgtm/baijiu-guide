import type { Product } from "@/types";

const RATING_LABELS: Array<{
  key: keyof NonNullable<Product["rating"]>;
  label: string;
}> = [
  { key: "aromaIntensity", label: "향의 강도" },
  { key: "alcoholImpact", label: "알코올 자극" },
  { key: "sweetness", label: "단맛" },
  { key: "beginnerFriendly", label: "입문자 친화도" },
  { key: "foodPairing", label: "음식 궁합" },
  { key: "valueForMoney", label: "가성비" },
];

function Bar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, (value / 5) * 100));
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-gold-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ProductFlavorCard({ product }: { product: Product }) {
  return (
    <section
      className="rounded-2xl border border-cream-200 bg-cream-50 p-4 shadow-card sm:p-6"
      aria-labelledby="product-flavor"
    >
      <h2
        id="product-flavor"
        className="font-serif text-xl font-semibold text-navy-900"
      >
        맛 특징
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {product.flavorNotes.map((note) => (
          <span
            key={note}
            className="rounded-full bg-cream-100 px-3 py-1 text-sm text-navy-800"
          >
            {note}
          </span>
        ))}
      </div>

      {product.rating ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {RATING_LABELS.map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-navy-800">
                <span>{label}</span>
                <span className="font-semibold text-navy-900">
                  {product.rating?.[key]}/5
                </span>
              </div>
              <Bar value={product.rating?.[key] ?? 0} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
