// Top of a library page: icon + big title on the left, numbers and the main action on the right
// stats: [{ value, label }]
export default function PageHeader({ icon: Icon, title, subtitle, stats = [], actions }) {
  return (
    <header className="relative flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
      {/* Slanted accent on the divider, same angle as the logo cut */}
      <span
        aria-hidden="true"
        className="absolute -bottom-px left-0 h-0.5 w-28 -skew-x-35 bg-purple-400"
      />

      <div className="flex min-w-0 items-center gap-4">
        {Icon && <Icon size={40} className="hidden shrink-0 text-purple-300 sm:block" />}
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-gray-400">{subtitle}</p>}
        </div>
      </div>

      {(stats.length > 0 || actions) && (
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          {stats.length > 0 && (
            <div className="flex gap-8 lg:border-l lg:border-white/10 lg:pl-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold tabular-nums tracking-tight">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
          {actions}
        </div>
      )}
    </header>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="border-b border-white/10 pb-6">
      <div className="h-10 w-64 rounded bg-white/10 sm:h-12" />
      <div className="mt-3 h-4 w-32 rounded bg-white/10" />
    </div>
  );
}