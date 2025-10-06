export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <div className="animate-pulse space-y-8">
        {/* Page heading skeleton */}
        <div className="space-y-3">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-64"></div>
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-full max-w-2xl"></div>
        </div>

        {/* Component skeletons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="border dark:border-zinc-800 border-zinc-200 rounded-lg p-8 space-y-4"
          >
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-48"></div>
            <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
        ))}
      </div>
    </main>
  );
}
