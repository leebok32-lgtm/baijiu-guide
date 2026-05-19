import Link from "next/link";
import { getProducts } from "@/lib/products/getProducts";
import { aromaTypes } from "@/data/aromaTypes";
import { articles } from "@/data/articles";
import { pairings } from "@/data/pairings";
import { ProductCard } from "@/components/product/ProductCard";
import { GuideArticleCard } from "@/components/common/GuideArticleCard";

export default async function HomePage() {
  const products = await getProducts();

  const beginnerPicks = products
    .filter((p) => p.beginnerLevel === "쉬움" || p.beginnerLevel === "보통")
    .slice(0, 4);

  const aromaShowcase = aromaTypes.slice(0, 4).map((a) => ({
    aroma: a,
    sample: products.find((p) => p.aromaType === a.nameKo),
  }));

  const latestArticles = [...articles]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 3);

  const pairingHighlights = pairings.slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-cream-200 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 px-5 py-10 text-cream-50 shadow-card sm:px-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 px-3 py-1 text-xs font-semibold text-gold-400">
            한국어 백주·바이주 가이드
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-5xl">
            고량주, 어렵지 않게 시작하세요.
          </h1>
          <p className="mt-4 text-base text-cream-200/90 sm:text-lg">
            연태고량주부터 마오타이까지, 향형·도수·가격대·음식 궁합으로
            <br className="hidden sm:block" />
            쉽게 비교하는 한국어 백주 가이드.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-400"
            >
              제품 둘러보기
            </Link>
            <Link
              href="/photo-search"
              className="rounded-full border border-cream-200/40 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-cream-50/10"
            >
              📷 사진으로 찾기
            </Link>
          </div>
        </div>
      </section>

      {/* 주요 기능 카드 */}
      <section>
        <h2 className="font-serif text-2xl font-semibold text-navy-900">
          이렇게 사용하세요
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <FeatureCard
            href="/photo-search"
            emoji="📷"
            title="사진으로 백주 찾기"
            description="병 사진을 올리면 비슷한 제품 후보 3개를 보여드려요."
          />
          <FeatureCard
            href="/aroma"
            emoji="🌾"
            title="향형으로 이해하기"
            description="청향, 농향, 장향… 한국어로 친절하게 풀어 설명해요."
          />
          <FeatureCard
            href="/pairing"
            emoji="🍽"
            title="음식과 어울리는 술 찾기"
            description="양꼬치, 마라탕, 훠궈에 잘 맞는 백주를 추천해요."
          />
        </div>
      </section>

      {/* 입문자 추천 제품 */}
      <section>
        <SectionHeader
          title="입문자 추천 제품"
          subtitle="처음 백주를 접하는 분께 부담 없는 술들을 골랐어요."
          link={{ href: "/ranking#beginner", label: "전체 랭킹 보기" }}
        />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {beginnerPicks.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 향형별 대표 */}
      <section>
        <SectionHeader
          title="향형별 대표 제품"
          subtitle="향형의 차이를 가장 잘 보여주는 술들로 시작해 보세요."
          link={{ href: "/aroma", label: "향형사전 보기" }}
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aromaShowcase.map(({ aroma, sample }) => (
            <Link
              key={aroma.id}
              href={`/aroma/${aroma.slug}`}
              className="flex flex-col gap-2 rounded-2xl border border-cream-200 bg-cream-50 p-5 shadow-card hover:border-gold-400/40 hover:shadow-cardHover"
            >
              <div className="text-xs font-semibold text-gold-600">
                {aroma.nameCn}
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy-900">
                {aroma.nameKo}
              </h3>
              <p className="text-sm leading-relaxed text-navy-800/90 line-clamp-3">
                {aroma.description}
              </p>
              {sample && (
                <div className="mt-3 rounded-xl bg-cream-100 px-3 py-2 text-xs text-navy-800">
                  대표: <span className="font-semibold">{sample.nameKo}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* 최신 백주 이야기 */}
      <section>
        <SectionHeader
          title="최신 백주 이야기"
          subtitle="가볍게 읽기 좋은 백주 가이드와 칼럼."
          link={{ href: "/articles", label: "전체 글 보기" }}
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((a) => (
            <GuideArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* 음식 페어링 */}
      <section>
        <SectionHeader
          title="음식 페어링 추천"
          subtitle="이 음식엔 어떤 술? 자주 묻는 페어링부터 보여드려요."
          link={{ href: "/pairing", label: "전체 페어링 보기" }}
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pairingHighlights.map((p) => (
            <Link
              key={p.id}
              href={`/pairing#${encodeURIComponent(p.foodName)}`}
              className="rounded-2xl border border-cream-200 bg-cream-50 p-4 shadow-card hover:border-gold-400/40"
            >
              <div className="text-2xl">🍽</div>
              <h3 className="mt-2 font-serif text-lg font-semibold text-navy-900">
                {p.foodName}
              </h3>
              <p className="mt-1 text-xs text-navy-700/80 line-clamp-2">
                {p.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  href,
  emoji,
  title,
  description,
}: {
  href: string;
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 rounded-2xl border border-cream-200 bg-cream-50 p-5 shadow-card transition hover:-translate-y-0.5 hover:border-gold-400/40 hover:shadow-cardHover"
    >
      <span className="text-3xl">{emoji}</span>
      <h3 className="font-serif text-lg font-semibold text-navy-900">{title}</h3>
      <p className="text-sm text-navy-800/90">{description}</p>
    </Link>
  );
}

function SectionHeader({
  title,
  subtitle,
  link,
}: {
  title: string;
  subtitle?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-navy-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-navy-700/80">{subtitle}</p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-sm font-semibold text-gold-600 hover:text-gold-500"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
