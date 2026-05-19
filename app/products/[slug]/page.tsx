import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products/getProducts";
import { getProductBySlug } from "@/lib/products/getProductBySlug";
import { getProductsByAroma } from "@/lib/products/getProductsByAroma";
import { ProductDetailHeader } from "@/components/product/ProductDetailHeader";
import { ProductInfoTable } from "@/components/product/ProductInfoTable";
import { ProductFlavorCard } from "@/components/product/ProductFlavorCard";
import { ProductPairingCard } from "@/components/product/ProductPairingCard";
import { ProductPriceCard } from "@/components/product/ProductPriceCard";
import { ProductStorySection } from "@/components/product/ProductStorySection";
import { RelatedProductsSection } from "@/components/product/RelatedProductsSection";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "제품을 찾을 수 없어요" };
  return {
    title: `${product.nameKo} 정보 | 향형, 도수, 맛, 추천 음식`,
    description: `${product.nameKo}의 분류, 향형, 도수, 산지, 원료, 맛 특징, 추천 음식, 입문 난이도와 가격 정보를 확인해보세요.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [sameAromaAll, allProducts] = await Promise.all([
    getProductsByAroma(product.aromaType),
    getProducts(),
  ]);

  const sameAroma = sameAromaAll.filter((p) => p.id !== product.id);

  const similarBeginner = allProducts
    .filter(
      (p) => p.id !== product.id && p.beginnerLevel === product.beginnerLevel,
    )
    .slice(0, 4);

  const similarPrice = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        typeof p.regularPrice === "number" &&
        typeof product.regularPrice === "number" &&
        Math.abs(p.regularPrice - product.regularPrice) <
          product.regularPrice * 0.5 + 20000,
    )
    .slice(0, 4);

  return (
    <article className="space-y-6">
      <ProductDetailHeader product={product} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductInfoTable product={product} />
        <ProductFlavorCard product={product} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductPairingCard product={product} />
        <ProductPriceCard product={product} />
      </div>

      <ProductStorySection product={product} />

      <RelatedProductsSection
        title="비슷한 가격대의 술"
        description="비슷한 가격대에서 함께 고려해 볼 만한 술들이에요."
        products={similarPrice}
      />

      <RelatedProductsSection
        title={`같은 향형의 술 · ${product.aromaType}`}
        description={`${product.aromaType}을 좋아하신다면 이런 술도 추천해요.`}
        products={sameAroma}
      />

      <RelatedProductsSection
        title={`입문 ${product.beginnerLevel} 단계의 다른 술`}
        description="비슷한 난이도의 술들이에요."
        products={similarBeginner}
      />
    </article>
  );
}
