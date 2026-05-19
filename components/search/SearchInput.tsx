"use client";

import { cn } from "@/lib/utils/cn";

export function SearchInput({
  value,
  onChange,
  placeholder = "한글, 중국어, 영어, 별칭으로 검색",
  className,
  ariaLabel = "제품 검색",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full rounded-full border border-cream-300 bg-cream-50 py-3 pl-11 pr-4 text-sm text-navy-900 placeholder:text-navy-700/50 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-700/60"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="20" y1="20" x2="16.65" y2="16.65" />
      </svg>
    </div>
  );
}
