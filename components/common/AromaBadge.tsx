import { cn } from "@/lib/utils/cn";

const AROMA_STYLES: Record<string, string> = {
  청향형: "bg-emerald-50 text-emerald-800 border-emerald-200",
  농향형: "bg-amber-50 text-amber-800 border-amber-200",
  장향형: "bg-rose-50 text-rose-800 border-rose-200",
  미향형: "bg-sky-50 text-sky-800 border-sky-200",
  겸향형: "bg-violet-50 text-violet-800 border-violet-200",
  "기타 향형": "bg-cream-100 text-navy-800 border-cream-300",
};

export function AromaBadge({
  aromaType,
  className,
}: {
  aromaType: string;
  className?: string;
}) {
  const style = AROMA_STYLES[aromaType] ?? AROMA_STYLES["기타 향형"];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style,
        className,
      )}
    >
      {aromaType}
    </span>
  );
}
