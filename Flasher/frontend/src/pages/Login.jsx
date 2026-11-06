import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = form;
    // backend email ya username alag leta hai
    const payload = identifier.includes("@")
      ? { email: identifier, password }
      : { username: identifier, password };

    const res = await api.post("/users/login", payload);
    if (res.status === 200) {
      navigate("/");
    }
    console.log(res);
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
        <input
          name="identifier"
          type="text"
          placeholder="Username or email"
          value={form.identifier}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <button className="rounded-md bg-purple-500 py-2 font-semibold hover:bg-purple-600 cursor-pointer">
          Login
        </button>
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