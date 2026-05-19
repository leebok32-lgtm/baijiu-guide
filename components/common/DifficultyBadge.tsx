import type { BeginnerLevel } from "@/types";
import { cn } from "@/lib/utils/cn";

const STYLES: Record<BeginnerLevel, string> = {
  쉬움: "bg-green-100 text-green-800 border-green-200",
  보통: "bg-yellow-100 text-yellow-800 border-yellow-200",
  어려움: "bg-orange-100 text-orange-800 border-orange-200",
  전문가용: "bg-red-100 text-red-800 border-red-200",
};

export function DifficultyBadge({
  level,
  className,
}: {
  level: BeginnerLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STYLES[level],
        className,
      )}
    >
      입문 {level}
    </span>
  );
}
