import { Link } from "react-router-dom";
import { LogoMark } from "../components/Logo";

export default function NotFound() {
  return (
    <div className="fade-up mx-auto mt-16 flex max-w-sm flex-col items-center text-center">
      <LogoMark size={72} />
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">
        Error 404
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">This page got lost</h1>
      <p className="mt-2 text-sm text-gray-400">
        The link may be broken or the page was removed.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95"
      >
        Back to home
      </Link>
    </div>
  );
}