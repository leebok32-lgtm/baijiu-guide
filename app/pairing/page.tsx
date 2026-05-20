import type { Metadata } from "next";
import { getPairings } from "@/lib/pairing/getPairings";
import { PairingCard } from "@/components/common/PairingCard";

export const metadata: Metadata = {
  title: "음식페어링 | 양꼬치·마라탕·훠궈와 어울리는 백주",
  description:
    "양꼬치, 마라탕, 훠궈, 동파육 등 자주 즐기는 음식과 어울리는 백주를 한국어로 추천해 드립니다.",
};

export default async function PairingPage() {
  const pairings = await getPairings();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          음식 페어링
        </h1>
        <p className="mt-2 text-sm text-navy-700/80 sm:text-base">
          이 음식에는 어떤 술? 가장 자주 묻는 페어링부터 정리해드려요.
        </p>
      </header>

      <nav
        aria-label="페어링 음식 바로가기"
        className="-mx-1 flex flex-wrap gap-1.5"
      >
        {pairings.map((p) => (
          <a
            key={p.id}
            href={`#${p.foodName}`}
            className="rounded-full border border-cream-300 bg-cream-50 px-3 py-1.5 text-xs font-medium text-navy-800 hover:border-navy-800"
          >
            {p.foodName}
          </a>
        ))}
      </nav>

      <div className="space-y-5">
        {pairings.map((p) => (
          <PairingCard key={p.id} pairing={p} />
        ))}
      </div>
    </div>
  );
}
