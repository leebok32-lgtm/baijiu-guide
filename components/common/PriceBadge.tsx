export function PriceBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-gold-500/40 bg-gold-400/10 px-2 py-0.5 text-xs font-medium text-gold-600">
      {label}
    </span>
  );
}
