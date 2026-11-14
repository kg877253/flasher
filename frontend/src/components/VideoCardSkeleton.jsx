export default function VideoCardSkeleton() {
  return (
    <div className="shimmer">
      <div className="aspect-video rounded-xl bg-gray-800" />
      <div className="mt-3 flex gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gray-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-11/12 rounded bg-gray-800" />
          <div className="h-3 w-1/3 rounded bg-gray-800" />
          <div className="h-3 w-1/2 rounded bg-gray-800" />
        </div>
      </div>
    </div>
  );
}