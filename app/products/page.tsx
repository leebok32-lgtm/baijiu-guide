import type { Metadata } from "next";
import { getProducts } from "@/lib/products/getProducts";
import { ProductsExplorer } from "./ProductsExplorer";

export const metadata: Metadata = {
  title: "제품찾기 | 한국어 백주·바이주 데이터베이스",
  description:
    "이름, 향형, 도수, 가격대, 추천 음식으로 백주를 찾아보세요. 한국어로 정리된 백주 데이터베이스.",
};

export default async function ProductsPage() {
  const products = await getProducts();
  const foodOptions = Array.from(
    new Set(products.flatMap((p) => p.recommendedFoods)),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          제품찾기
        </h1>
        <p className="mt-2 text-sm text-navy-700/80 sm:text-base">
          한글·중국어·영어·병음·별칭으로 모두 검색할 수 있어요. 향형과 음식으로
          필터하면 더 빨라요.
        </p>
      </header>
      <ProductsExplorer products={products} foodOptions={foodOptions} />
    </div>
  );
}
