// The hero block at the top of library pages (Liked videos, History, Subscribers)
// stats: [{ value, label }]
export default function PageHeader({ icon: Icon, eyebrow, title, description, stats = [] }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20 sm:p-8">
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
            <Icon size={25} />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-purple-300">{eyebrow}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">{description}</p>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="flex gap-6 border-t border-white/10 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}