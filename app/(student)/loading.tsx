export default function StudentLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded-lg" />
          <div className="h-4 w-48 bg-gray-100 rounded-lg mt-2" />
        </div>
        <div className="hidden sm:flex gap-3">
          <div className="h-12 w-32 bg-gray-100 rounded-xl" />
        </div>
      </div>

      {/* Banner skeleton */}
      <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl" />

      {/* Cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white rounded-xl border border-gray-200 p-4">
            <div className="h-4 w-12 bg-gray-100 rounded-full mb-3" />
            <div className="h-6 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-1.5 w-full bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-gray-200" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-white rounded-xl border border-gray-200" />
          <div className="h-36 bg-white rounded-xl border border-gray-200" />
        </div>
      </div>
    </div>
  );
}
