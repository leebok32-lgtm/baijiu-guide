import Link from "next/link";
import type { Pairing } from "@/types";
import { getProductsByIds } from "@/lib/products/getProductsByIds";
import { AromaBadge } from "@/components/common/AromaBadge";

export async function PairingCard({ pairing }: { pairing: Pairing }) {
  const all = await getProductsByIds(pairing.recommendedProductIds);
  const recommended = all.slice(0, 4);

  return (
    <article
      id={pairing.foodName}
      className="rounded-2xl border border-cream-200 bg-cream-50 p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-2xl font-semibold text-navy-900">
          🍽 {pairing.foodName}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {pairing.recommendedAromaTypes.map((a) => (
            <AromaBadge key={a} aromaType={a} />
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-navy-800">{pairing.description}</p>
      <div className="mt-3 rounded-xl bg-cream-100 px-3 py-2.5 text-sm text-navy-800">
        <span className="font-semibold text-gold-600">왜 잘 어울릴까요?</span>{" "}
        {pairing.reason}
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold text-navy-700/80">추천 제품</div>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {recommended.map((p) => (
            <li key={p.id}>
              <Link
                href={`/products/${p.slug}`}
                className="flex items-center justify-between rounded-xl border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-navy-800 hover:border-gold-400/40"
              >
                <span>
                  <span className="font-semibold text-navy-900">{p.nameKo}</span>
                  <span className="ml-1 text-xs text-navy-700/70">
                    {p.abv}% · {p.aromaType}
                  </span>
                </span>
                <span className="text-xs text-gold-600">상세 →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
