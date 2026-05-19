"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils/cn";

export function PhotoUploadBox({
  previewUrl,
  onFile,
  onClear,
}: {
  previewUrl: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed",
          previewUrl
            ? "border-gold-500/40 bg-cream-50"
            : "border-cream-300 bg-cream-100/70",
        )}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="업로드한 백주 사진 미리보기"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="px-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream-200 text-2xl">
              📷
            </div>
            <p className="mt-3 text-sm font-semibold text-navy-900">
              백주 병 사진을 업로드하세요
            </p>
            <p className="mt-1 text-xs text-navy-700/80">
              JPG/PNG · 가능하면 라벨이 잘 보이는 사진이 좋아요
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
        className="sr-only"
        aria-label="백주 사진 업로드"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={openPicker}
          className="rounded-full bg-navy-800 px-4 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-900"
        >
          {previewUrl ? "다른 사진 선택" : "사진 선택"}
        </button>
        {previewUrl && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-cream-300 px-4 py-2 text-sm font-medium text-navy-800 hover:border-navy-800"
          >
            초기화
          </button>
        )}
      </div>
    </div>
  );
}
