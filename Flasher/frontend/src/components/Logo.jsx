import { Link } from "react-router-dom";
import { BoltIcon } from "./Icons";

export default function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500 text-white">
        <BoltIcon size={18} fill="currentColor" />
      </span>
      <span className="hidden text-xl font-bold tracking-tight sm:block">Flasher</span>
    </Link>
  );
}