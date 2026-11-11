import { Link } from "react-router-dom";
import Logo, { LogoMark } from "../Logo";
import { ArrowLeftIcon } from "../Icons";

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen bg-black text-white lg:grid-cols-[1.1fr_1fr]">
      {/* Brand side, desktop only */}
      <aside className="relative hidden overflow-hidden border-r border-white/10 bg-[#0a0a0a] p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -bottom-32 -right-32 opacity-[0.14]">
          <LogoMark size={620} />
        </div>
        <div className="sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/[0.05] to-transparent" />

        <div className="relative">
          <Logo size={36} textClassName="block" />
        </div>

        <div className="fade-up relative max-w-md">
          <h2 className="text-5xl font-extrabold leading-[1.05] tracking-tight">
            Share what you <span className="text-purple-300">make.</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-400">
            Upload videos, build playlists and grow a channel people can subscribe to.
          </p>
        </div>
      </aside>

      {/* Form side */}
      <main className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <Logo size={32} textClassName="block" />
          </div>
          <Link
            to="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeftIcon size={16} />
            Back to home
          </Link>
        </div>

        <div className="m-auto w-full max-w-sm py-8">{children}</div>
      </main>
    </div>
  );
}