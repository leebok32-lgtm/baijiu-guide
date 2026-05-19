"use client";

import { useMemo, useState } from "react";
import type { Product, ProductFilters, SortKey } from "@/types";
import { filterProducts, sortProducts } from "@/lib/search/filterProducts";
import { SearchInput } from "@/components/search/SearchInput";
import { ProductFilterBar } from "@/components/search/ProductFilterBar";
import { ProductCard } from "@/components/product/ProductCard";

const DEFAULT_FILTERS: ProductFilters = {};
const DEFAULT_SORT: SortKey = "beginner";

export function ProductsExplorer({
  products,
  foodOptions,
}: {
  products: Product[];
  foodOptions: string[];
}) {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>(DEFAULT_SORT);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const matched = filterProducts(products, filters);
    return sortProducts(matched, sortKey);
  }, [products, filters, sortKey]);

  const reset = () => {
    setFilters(DEFAULT_FILTERS);
    setSortKey(DEFAULT_SORT);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={filters.query ?? ""}
          onChange={(v) => setFilters({ ...filters, query: v })}
          className="flex-1"
          placeholder="예: 마오타이, Moutai, 茅台, 양꼬치, 청향형"
        />
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="rounded-full border border-cream-300 px-4 py-2.5 text-sm font-medium text-navy-800 hover:border-navy-800 sm:hidden"
          aria-expanded={showFilters}
        >
          {showFilters ? "필터 닫기" : "필터 열기"}
        </button>
      </div>

      <div className={showFilters ? "block sm:block" : "hidden sm:block"}>
        <ProductFilterBar
          filters={filters}
          sortKey={sortKey}
          foodOptions={foodOptions}
          onChangeFilters={setFilters}
          onChangeSort={setSortKey}
          onReset={reset}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-navy-800">
          총 <span className="font-semibold">{filtered.length}</span>개의 제품
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-100/40 px-4 py-12 text-center">
          <p className="text-sm text-navy-800">
            조건에 맞는 제품을 찾지 못했어요.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 rounded-full bg-navy-800 px-4 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-900"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
