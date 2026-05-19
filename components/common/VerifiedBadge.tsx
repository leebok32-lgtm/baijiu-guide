export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
        검수 완료
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-2 py-0.5 text-[11px] font-semibold text-navy-800/80">
      정보 검수 중
    </span>
  );
}
