import type { Metadata } from "next";
import { getProducts } from "@/lib/products/getProducts";
import { sortProducts } from "@/lib/search/filterProducts";
import { RankingSection } from "@/components/common/RankingSection";

export const metadata: Metadata = {
  title: "추천랭킹 | 입문자·가성비·선물용 백주",
  description:
    "입문자에게 좋은 백주, 양꼬치 페어링, 선물용, 가성비, 고급 백주 등 상황별 추천 랭킹입니다.",
};

export default async function RankingPage() {
  const products = await getProducts();

  const beginnerRanking = sortProducts(
    products.filter(
      (p) => p.beginnerLevel === "쉬움" || p.beginnerLevel === "보통",
    ),
    "beginner",
  );

  const yangkkochiRanking = products.filter((p) =>
    p.recommendedFoods.includes("양꼬치"),
  );

  const giftRanking = products
    .filter(
      (p) =>
        ["선물용", "회식 안주"].some((f) => p.recommendedFoods.includes(f)) ||
        p.searchKeywords.includes("선물용") ||
        p.searchKeywords.includes("프리미엄"),
    )
    .slice(0, 5);

  const valueRanking = sortProducts(
    products.filter((p) =>
      p.searchKeywords.some((k) => ["가성비", "입문", "저가"].includes(k)),
    ),
    "priceAsc",
  );

  const luxuryRanking = sortProducts(
    products.filter((p) => (p.regularPrice ?? 0) >= 80000),
    "priceDesc",
  );

  const lowAbvRanking = sortProducts(products, "abvAsc");
  const highAbvRanking = sortProducts(products, "abvDesc");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          추천 랭킹
        </h1>
        <p className="mt-2 text-sm text-navy-700/80 sm:text-base">
          상황과 취향에 따라 골라보는 백주 랭킹이에요.
        </p>
      </header>

      <div id="beginner" className="scroll-mt-24">
        <RankingSection
          title="입문자 추천 고량주"
          description="처음 백주를 접하는 분께 추천하는 부드럽고 친근한 술들."
          products={beginnerRanking}
        />
      </div>

      <RankingSection
        title="양꼬치와 어울리는 고량주"
        description="한국에서 가장 자주 만나는 페어링, 양꼬치와의 궁합이 좋은 백주."
        products={yangkkochiRanking}
      />

      <RankingSection
        title="선물용 고량주"
        description="이름값과 풍미를 모두 갖춘 선물하기 좋은 백주들."
        products={giftRanking}
      />

      <RankingSection
        title="가성비 좋은 고량주"
        description="가격 대비 만족도가 좋은 백주를 모았어요."
        products={valueRanking}
      />

      <RankingSection
        title="고급 백주 추천"
        description="특별한 자리, 천천히 음미하기 좋은 프리미엄 백주."
        products={luxuryRanking}
      />

      <RankingSection
        title="도수 낮은 고량주"
        description="알코올 자극이 덜한 백주부터 시작해 보세요."
        products={lowAbvRanking}
      />

      <RankingSection
        title="도수 높은 백주"
        description="진한 한 잔을 원하실 때 고려할 만한 고도주."
        products={highAbvRanking}
      />
    </div>
  );
}
