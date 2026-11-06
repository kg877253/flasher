import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    const { identifier, password } = form;
    // The backend expects either email or username
    const credentials = identifier.includes("@")
      ? { email: identifier, password }
      : { username: identifier, password };

    try {
      await login(credentials);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "credentials went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-purple-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-gray-700 p-6"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <input name="identifier" type="text" placeholder="Username or email"
          value={form.identifier} onChange={handleChange} className={inputClass} required />
        <input name="password" type="password" placeholder="Password"
          value={form.password} onChange={handleChange} className={inputClass} required />

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-purple-500 py-2 font-semibold hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}