"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/guide", label: "입문가이드" },
  { href: "/photo-search", label: "사진으로 찾기" },
  { href: "/products", label: "제품찾기" },
  { href: "/aroma", label: "향형사전" },
  { href: "/pairing", label: "음식페어링" },
  { href: "/ranking", label: "추천랭킹" },
  { href: "/articles", label: "백주 이야기" },
  { href: "/submit", label: "제보하기" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 font-serif text-base text-gold-400">
            高
          </span>
          <span className="font-serif text-lg font-semibold text-navy-900">
            고량주가이드
          </span>
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-navy-800 transition hover:bg-navy-800 hover:text-cream-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-300 text-navy-800 lg:hidden"
        >
          <span className="sr-only">메뉴</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      <div
        className={cn(
          "border-t border-cream-200 bg-cream-50 lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-800 hover:bg-cream-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
