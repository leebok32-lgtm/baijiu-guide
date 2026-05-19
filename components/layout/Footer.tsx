import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-cream-200 bg-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-navy-800">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 font-serif text-sm text-gold-400">
                高
              </span>
              <span className="font-serif text-base font-semibold text-navy-900">
                고량주가이드
              </span>
            </div>
            <p className="mt-3 text-navy-700/80">
              한국어 백주·바이주 정보 플랫폼.
              <br />
              사진으로 찾고, 향형으로 이해하고, 음식과 함께 즐기세요.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-navy-900">둘러보기</h4>
            <ul className="mt-3 space-y-1.5">
              <li><Link className="hover:text-gold-600" href="/products">제품찾기</Link></li>
              <li><Link className="hover:text-gold-600" href="/photo-search">사진으로 찾기</Link></li>
              <li><Link className="hover:text-gold-600" href="/aroma">향형사전</Link></li>
              <li><Link className="hover:text-gold-600" href="/pairing">음식페어링</Link></li>
              <li><Link className="hover:text-gold-600" href="/ranking">추천랭킹</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-navy-900">알려드립니다</h4>
            <ul className="mt-3 space-y-1.5 text-navy-700/80">
              <li>본 사이트는 주류 판매를 하지 않습니다.</li>
              <li>제품 정보는 ‘참고용’이며 판매처마다 가격이 다를 수 있습니다.</li>
              <li>잘못된 정보를 발견하셨다면 <Link href="/submit" className="text-gold-600 underline">제보하기</Link>로 알려주세요.</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-cream-200 pt-6 text-xs text-navy-700/70">
          © {new Date().getFullYear()} 고량주가이드. 정보 검수 중인 콘텐츠가 포함되어 있습니다.
        </div>
      </div>
    </footer>
  );
}
