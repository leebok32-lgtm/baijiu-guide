import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export function ProductImage({
  nameKo,
  imageUrl,
  className,
}: {
  nameKo: string;
  imageUrl?: string;
  className?: string;
}) {
  const initial = nameKo.charAt(0) || "酒";

  return (
    <div
      className={cn(
        "relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cream-100 via-cream-50 to-cream-200",
        className,
      )}
      aria-label={`${nameKo} 이미지`}
      role="img"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${nameKo} 이미지`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          className="object-contain p-3"
        />
      ) : (
        <>
          <div className="pointer-events-none absolute inset-x-4 top-4 h-2 rounded-full bg-cream-300/60" />
          <div className="pointer-events-none absolute inset-x-6 bottom-4 h-1 rounded-full bg-cream-300/60" />

          <div className="flex h-full w-2/5 flex-col items-center justify-center rounded-md bg-navy-800 px-2 py-4 text-center shadow-card">
            <div className="text-[10px] font-medium tracking-wider text-gold-400">
              BAIJIU
            </div>
            <div className="my-2 h-px w-full bg-gold-400/40" />
            <div className="font-serif text-3xl text-cream-50 sm:text-4xl">
              {initial}
            </div>
            <div className="mt-2 text-[10px] text-cream-200/80">고량주가이드</div>
          </div>
        </>
      )}
    </div>
  );
}
