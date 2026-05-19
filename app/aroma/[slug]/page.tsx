import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { aromaTypes, getAromaTypeBySlug } from "@/data/aromaTypes";
import { getProductsByAroma } from "@/lib/products/getProductsByAroma";
import { getProductsByIds } from "@/lib/products/getProductsByIds";
import { ProductCard } from "@/components/product/ProductCard";

export function generateStaticParams() {
  return aromaTypes.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const aroma = getAromaTypeBySlug(slug);
  if (!aroma) return { title: "향형을 찾을 수 없어요" };
  return {
    title: `${aroma.nameKo} (${aroma.nameCn}) 향형 가이드`,
    description: `${aroma.nameKo}의 특징, 대표적인 향, 어울리는 음식, 대표 제품을 정리했습니다.`,
  };
}

export default async function AromaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const aroma = getAromaTypeBySlug(slug);
  if (!aroma) notFound();

  const [reps, all] = await Promise.all([
    getProductsByIds(aroma.representativeProductIds),
    getProductsByAroma(aroma.nameKo),
  ]);

  return (
    <article className="space-y-8">
      <header className="rounded-3xl border border-cream-200 bg-cream-50 p-6 shadow-card sm:p-8">
        <p className="text-sm font-semibold text-gold-600">{aroma.nameCn}</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          {aroma.nameKo}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-navy-800">
          {aroma.description}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <div className="text-xs font-semibold text-navy-700/80">
              입문 난이도
            </div>
            <div className="mt-1 text-base font-semibold text-navy-900">
              {aroma.beginnerLevel}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-navy-700/80">
              대표적인 향
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {aroma.typicalFlavor.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs text-navy-800"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-navy-700/80">
              어울리는 음식
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {aroma.recommendedFoods.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs text-navy-800"
                >
                  #{f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {reps.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl font-semibold text-navy-900">
            대표 제품
          </h2>
          <p className="mt-1 text-sm text-navy-700/80">
            이 향형을 처음 만난다면 이 술들로 시작해 보세요.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {reps.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {all.length > reps.length && (
        <section>
          <h2 className="font-serif text-2xl font-semibold text-navy-900">
            이 향형의 모든 제품
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {all.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
