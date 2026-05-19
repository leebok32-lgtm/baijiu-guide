export function formatPrice(value: number | undefined): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "정보 없음";
  return `₩${value.toLocaleString("ko-KR")}`;
}

export type PriceTier =
  | "under-20k"
  | "20k-50k"
  | "50k-100k"
  | "100k-300k"
  | "over-300k";

export const PRICE_TIER_OPTIONS: Array<{ value: PriceTier; label: string }> = [
  { value: "under-20k", label: "2만원 미만" },
  { value: "20k-50k", label: "2~5만원" },
  { value: "50k-100k", label: "5~10만원" },
  { value: "100k-300k", label: "10~30만원" },
  { value: "over-300k", label: "30만원 이상" },
];

export function priceTierMatches(
  price: number | undefined,
  tier: PriceTier,
): boolean {
  if (typeof price !== "number") return false;
  switch (tier) {
    case "under-20k":
      return price < 20000;
    case "20k-50k":
      return price >= 20000 && price < 50000;
    case "50k-100k":
      return price >= 50000 && price < 100000;
    case "100k-300k":
      return price >= 100000 && price < 300000;
    case "over-300k":
      return price >= 300000;
  }
}
