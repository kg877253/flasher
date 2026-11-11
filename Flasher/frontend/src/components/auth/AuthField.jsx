import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "../Icons";

// Icon input. type="password" gets a show/hide button and a Caps Lock warning.
export default function AuthField({ icon: Icon, label, hint, index = 0, ...inputProps }) {
  const [show, setShow] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const isPassword = inputProps.type === "password";

  return (
    <div className="fade-up" style={{ animationDelay: `${index * 70}ms` }}>
      <label htmlFor={inputProps.name} className="mb-1.5 block text-sm font-medium text-gray-300">
        {label}
      </label>

      <div className="group relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-400"
        />
        <input
          id={inputProps.name}
          {...inputProps}
          type={isPassword && show ? "text" : inputProps.type}
          onKeyUp={isPassword ? (e) => setCapsOn(e.getModifierState("CapsLock")) : undefined}
          onBlur={isPassword ? () => setCapsOn(false) : undefined}
          className={`w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 text-sm outline-none transition placeholder:text-gray-600 hover:border-white/20 focus:border-purple-400/70 focus:bg-white/[0.07] focus:ring-4 focus:ring-purple-500/15 ${
            isPassword ? "pr-11" : "pr-3"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
      </div>

      {capsOn && <p className="mt-1.5 text-xs text-amber-300">Caps Lock is on</p>}
      {hint}
    </div>
  );
}

export function AuthButton({ loading, loadingText, index = 0, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="fade-up flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-500 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {loading ? loadingText : children}
    </button>
  );
}

// The error is removed while loading, so it mounts again (and shakes) on every failed attempt
export function AuthError({ message }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="shake rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300"
    >
      {message}
    </p>
  );
}