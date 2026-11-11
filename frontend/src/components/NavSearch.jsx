import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, CloseIcon, SearchIcon } from "./Icons";

function SearchBox({ initialText }) {
  const navigate = useNavigate();
  const [text, setText] = useState(initialText);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopInputRef = useRef(null);

  // Press "/" anywhere (outside inputs) to jump to search
  useEffect(() => {
    const onKeyDown = (e) => {
      const el = document.activeElement;
      const typing =
        el?.tagName === "INPUT" || el?.tagName === "TEXTAREA" || el?.isContentEditable;
      if (e.key !== "/" || typing) return;

      e.preventDefault();
      if (window.matchMedia("(min-width: 768px)").matches) {
        desktopInputRef.current?.focus();
      } else {
        setMobileOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    // encodeURIComponent keeps spaces and special characters safe in the URL
    navigate(trimmed ? `/?query=${encodeURIComponent(trimmed)}` : "/");
    document.activeElement?.blur(); // closes the mobile keyboard
    setMobileOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Escape") return;
    if (text) {
      setText("");
    } else {
      e.currentTarget.blur();
      setMobileOpen(false);
    }
  };

  const renderField = ({ inputRef, autoFocus = false } = {}) => (
    <form role="search" onSubmit={handleSubmit} className="relative w-full">
      <SearchIcon
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
      />
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        autoComplete="off"
        enterKeyHint="search"
        aria-label="Search videos and channels"
        placeholder="Search videos and channels"
        className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-10 text-sm outline-none transition placeholder:text-gray-500 focus:border-purple-400/60 focus:bg-white/10 focus:ring-4 focus:ring-purple-500/15"
      />

      {text ? (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // keep focus inside the input
          onClick={() => setText("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          <CloseIcon size={16} />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/15 px-1.5 text-xs text-gray-500 lg:block">
          /
        </kbd>
      )}
    </form>
  );

  return (
    <>
      {/* Tablet and desktop: inline search bar */}
      <div className="hidden w-full max-w-xl md:block">
        {renderField({ inputRef: desktopInputRef })}
      </div>

      {/* Mobile: only an icon, the bar opens over the whole navbar */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open search"
        className="cursor-pointer rounded-full p-2 text-gray-300 transition hover:bg-white/10 md:hidden"
      >
        <SearchIcon size={22} />
      </button>

      {mobileOpen && (
        <div className="fade-in absolute inset-0 z-20 flex items-center gap-2 bg-black px-3 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close search"
            className="cursor-pointer rounded-full p-2 text-gray-300 transition hover:bg-white/10"
          >
            <ArrowLeftIcon size={22} />
          </button>
          {renderField({ autoFocus: true })}
        </div>
      )}
    </>
  );
}

export default function NavSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  // key remounts the box when the URL query changes (for example clicking the logo),
  // so the input always matches the URL without an extra effect
  return <SearchBox key={query} initialText={query} />;
}