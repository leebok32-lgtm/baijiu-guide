import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "고량주가이드 | 한국어 백주·바이주 정보 플랫폼",
    template: "%s | 고량주가이드",
  },
  description:
    "연태고량주부터 마오타이까지, 향형·도수·가격대·음식 궁합으로 쉽게 비교하는 한국어 고량주 정보 사이트입니다.",
  keywords: [
    "고량주",
    "백주",
    "바이주",
    "연태고량주",
    "마오타이",
    "수정방",
    "오량액",
    "분주",
    "공부가주",
    "이과두주",
    "고량주 추천",
    "양꼬치 술",
  ],
  openGraph: {
    title: "고량주가이드 | 한국어 백주·바이주 정보 플랫폼",
    description:
      "사진으로 찾고, 향형으로 이해하고, 음식과 함께 즐기는 한국어 백주 가이드.",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF8F1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
