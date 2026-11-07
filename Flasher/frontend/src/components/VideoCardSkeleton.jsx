export default function VideoCardSkeleton() {

  return (

    <div className="animate-pulse">
      <div className="aspect-video rounded-md bg-gray-800" />
      <div className="mt-2 flex gap-2">
        <div className="h-9 w-9 rounded-full bg-gray-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-800" />
          <div className="h-3 w-1/2 rounded bg-gray-800" />
        </div>
      </div>
    </div>
    
  );
}