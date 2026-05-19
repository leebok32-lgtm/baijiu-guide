import type { Metadata } from "next";
import { getProducts } from "@/lib/products/getProducts";
import { PhotoSearchExperience } from "./PhotoSearchExperience";

export const metadata: Metadata = {
  title: "사진으로 찾기 | 백주 라벨 인식",
  description:
    "백주 병 사진을 업로드하면 라벨 정보를 분석해 해당 제품 후보를 보여드립니다.",
};

export default async function PhotoSearchPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          사진으로 백주 찾기
        </h1>
        <p className="mt-2 text-sm text-navy-700/80 sm:text-base">
          백주 병 사진을 업로드하면 라벨을 분석해 가장 가까운 제품 후보 3개를
          보여드려요.
          <br className="hidden sm:block" />
          (초기 버전은 mock OCR로 동작하며, 추후 실제 OCR API로 교체됩니다.)
        </p>
      </header>
      <PhotoSearchExperience products={products} />
    </div>
  );
}
