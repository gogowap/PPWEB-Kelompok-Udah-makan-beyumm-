export default function LoadingSkeleton({ title = 'Memuat data inventaris...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-6 animate-pulse"
    >
      <span className="sr-only">{title}</span>

      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-slate-200" />
        <div className="h-4 w-72 rounded-md bg-slate-200/80" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[190px_minmax(0,1fr)]">
        <div className="h-32 rounded-xl border border-slate-200 bg-white p-4 space-y-4">
          <div className="h-3.5 w-28 rounded bg-slate-200" />
          <div className="flex items-end justify-between pt-2">
            <div className="h-9 w-16 rounded bg-slate-200" />
            <div className="h-9 w-9 rounded-lg bg-slate-100" />
          </div>
        </div>

        <div className="h-64 rounded-xl border border-slate-200 bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="h-6 w-48 rounded bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[230px_minmax(0,1fr)] pt-2">
            <div className="space-y-3">
              <div className="h-10 rounded-lg bg-slate-100" />
              <div className="h-16 rounded-lg bg-slate-100" />
              <div className="h-16 rounded-lg bg-slate-100" />
            </div>
            <div className="h-44 rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-72 rounded-xl border border-slate-200 bg-white p-4 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="h-4 w-36 rounded bg-slate-200" />
              <div className="h-5 w-16 rounded-full bg-slate-100" />
            </div>
            <div className="space-y-3 pt-1">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
