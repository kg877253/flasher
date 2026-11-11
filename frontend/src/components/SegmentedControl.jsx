// Same sliding glass pill as the channel tabs, reusable for sort options.
// options: [{ id, label }], value: the active id, onChange(id)
export default function SegmentedControl({ options, value, onChange, label, className = "" }) {
  const count = options.length;
  const activeIndex = Math.max(
    options.findIndex((option) => option.id === value),
    0
  );

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`relative grid rounded-full border border-white/10 bg-white/5 p-1 ${className}`}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      <div
        className="absolute inset-y-1 left-1 rounded-full border border-white/20 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-transform duration-300 ease-out"
        style={{
          width: `calc((100% - 0.5rem) / ${count})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          onClick={() => onChange(option.id)}
          className={`relative z-10 cursor-pointer whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors ${
            value === option.id ? "text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}