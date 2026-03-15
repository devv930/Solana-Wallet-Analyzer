export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
      <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
      <div className="h-60 animate-pulse rounded-2xl bg-white/5" />
      <div className="h-56 animate-pulse rounded-2xl bg-white/5" />
    </div>
  );
}
