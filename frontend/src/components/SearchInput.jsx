import { CloseIcon, SearchIcon } from "./Icons";

export default function SearchInput({ value, onChange, placeholder, className = "" }) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{placeholder}</span>
      <SearchIcon
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onChange("");
        }}
        placeholder={placeholder}
        className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm outline-none transition placeholder:text-gray-500 focus:border-purple-400/60 focus:bg-white/10"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          <CloseIcon size={16} />
        </button>
      )}
    </label>
  );
}