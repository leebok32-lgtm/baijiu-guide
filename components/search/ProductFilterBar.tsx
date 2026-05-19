"use client";

import type { BeginnerLevel, ProductFilters, SortKey } from "@/types";
import { aromaTypes } from "@/data/aromaTypes";
import { PRICE_TIER_OPTIONS } from "@/lib/utils/formatPrice";
import { cn } from "@/lib/utils/cn";

const BEGINNER_LEVELS: BeginnerLevel[] = [
  "쉬움",
  "보통",
  "어려움",
  "전문가용",
];

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "beginner", label: "입문자 추천순" },
  { value: "name", label: "이름순" },
  { value: "abvAsc", label: "도수 낮은순" },
  { value: "abvDesc", label: "도수 높은순" },
  { value: "priceAsc", label: "가격 낮은순" },
  { value: "priceDesc", label: "가격 높은순" },
];

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-navy-800 bg-navy-800 text-cream-50"
          : "border-cream-300 bg-cream-50 text-navy-800 hover:border-navy-800",
      )}
    >
      {label}
    </button>
  );
}

function toggle<T>(arr: T[] | undefined, value: T): T[] {
  const list = arr ?? [];
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function ProductFilterBar({
  filters,
  sortKey,
  foodOptions,
  onChangeFilters,
  onChangeSort,
  onReset,
}: {
  filters: ProductFilters;
  sortKey: SortKey;
  foodOptions: string[];
  onChangeFilters: (next: ProductFilters) => void;
  onChangeSort: (next: SortKey) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-cream-200 bg-cream-50 p-4 shadow-card sm:p-5">
      <div>
        <h3 className="text-xs font-semibold text-navy-700/80">향형</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {aromaTypes.map((a) => (
            <Chip
              key={a.id}
              active={(filters.aromaTypes ?? []).includes(a.nameKo)}
              label={a.nameKo}
              onClick={() =>
                onChangeFilters({
                  ...filters,
                  aromaTypes: toggle(filters.aromaTypes, a.nameKo),
                })
              }
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-navy-700/80">입문 난이도</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {BEGINNER_LEVELS.map((level) => (
            <Chip
              key={level}
              active={(filters.beginnerLevels ?? []).includes(level)}
              label={level}
              onClick={() =>
                onChangeFilters({
                  ...filters,
                  beginnerLevels: toggle(filters.beginnerLevels, level),
                })
              }
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-navy-700/80">가격대</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRICE_TIER_OPTIONS.map((p) => (
            <Chip
              key={p.value}
              active={(filters.priceTiers ?? []).includes(p.value)}
              label={p.label}
              onClick={() =>
                onChangeFilters({
                  ...filters,
                  priceTiers: toggle(filters.priceTiers, p.value),
                })
              }
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-navy-700/80">도수</h3>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <label className="text-xs text-navy-800">
            최소(%)
            <input
              type="number"
              min={0}
              max={100}
              value={filters.abvMin ?? ""}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  abvMin: e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className="mt-1 w-full rounded-md border border-cream-300 bg-cream-50 px-2 py-1.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
            />
          </label>
          <label className="text-xs text-navy-800">
            최대(%)
            <input
              type="number"
              min={0}
              max={100}
              value={filters.abvMax ?? ""}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  abvMax: e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className="mt-1 w-full rounded-md border border-cream-300 bg-cream-50 px-2 py-1.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-navy-700/80">추천 음식</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {foodOptions.map((food) => (
            <Chip
              key={food}
              active={(filters.foods ?? []).includes(food)}
              label={food}
              onClick={() =>
                onChangeFilters({
                  ...filters,
                  foods: toggle(filters.foods, food),
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-3">
        <label className="text-xs text-navy-800">
          정렬
          <select
            value={sortKey}
            onChange={(e) => onChangeSort(e.target.value as SortKey)}
            className="ml-2 rounded-md border border-cream-300 bg-cream-50 px-2 py-1.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-cream-300 px-4 py-1.5 text-xs font-medium text-navy-800 hover:border-navy-800"
        >
          필터 초기화
        </button>
      </div>
    </div>
  );
}
