import type { Metadata } from "next";
import { SubmitForm } from "@/components/common/SubmitForm";

export const metadata: Metadata = {
  title: "제보하기 | 등록되지 않은 백주를 알려주세요",
  description:
    "사이트에 없는 백주를 발견하셨다면 제보해 주세요. 검수 후 데이터베이스에 추가됩니다.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
          제보하기
        </h1>
        <p className="mt-2 text-sm text-navy-700/80 sm:text-base">
          사이트에 아직 없는 백주를 발견하셨다면 알려주세요. 검수 후 데이터에
          반영해 더 많은 분들이 정보를 얻을 수 있도록 도울게요.
        </p>
        <p className="mt-1 text-xs text-navy-700/70">
          초기 버전은 콘솔 출력으로만 처리되며 실제 저장은 추후 지원됩니다.
        </p>
      </header>

      <SubmitForm />
    </div>
  );
}
