import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-gray-700 bg-black p-4">
      <Link to="/" className="text-xl font-bold text-purple-400 p-1 rounded-[50%] bg-purple-300 flex items-center justify-center">
        Flasher
      </Link>

      <form role="search" className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-md border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-purple-400"
        />
      </form>

      <div className="flex items-center gap-3">
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/register" className="rounded-md bg-purple-500 px-3 py-1 text-white hover:bg-purple-600">
          Sign Up
        </Link>
      </div>
    </header>
  );
}