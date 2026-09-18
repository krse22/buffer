export function PostPreviewSkeleton() {
  return (
    <div className="flex gap-3 p-3 border border-gray-200 rounded-lg animate-pulse">
      <div className="flex gap-1 flex-shrink-0">
        <div className="w-12 h-12 bg-gray-200 rounded" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="flex items-center gap-3">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-20 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export function PostPreviewListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <PostPreviewSkeleton />
      <PostPreviewSkeleton />
      <PostPreviewSkeleton />
    </div>
  );
}
