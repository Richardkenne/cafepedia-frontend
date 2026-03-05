export function CardSkeleton() {
  return (
    <div className="flex gap-4 py-4 border-b border-[var(--surface)] animate-pulse">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 flex-shrink-0" />
      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-56 bg-gray-100 rounded-xl mb-6" />
      <div className="h-6 bg-gray-100 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-6" />
      <div className="h-8 bg-gray-100 rounded w-1/4 mb-4" />
      <div className="h-4 bg-gray-100 rounded w-full mb-2" />
      <div className="h-4 bg-gray-100 rounded w-5/6 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-2/3" />
    </div>
  );
}
