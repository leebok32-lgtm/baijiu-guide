import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-cream-200 bg-cream-50 px-6 py-16 text-center shadow-card">
      <span className="text-5xl">🍶</span>
      <h1 className="font-serif text-2xl font-bold text-navy-900">
        페이지를 찾을 수 없어요
      </h1>
      <p className="text-sm text-navy-700/80">
        원하시는 정보가 다른 곳에 있을 수도 있어요.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="rounded-full bg-navy-800 px-5 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-900"
        >
          홈으로
        </Link>
        <Link
          href="/products"
          className="rounded-full border border-cream-300 px-5 py-2 text-sm font-semibold text-navy-800 hover:border-navy-800"
        >
          제품 찾으러 가기
        </Link>
      </div>
    </div>
  );
}
