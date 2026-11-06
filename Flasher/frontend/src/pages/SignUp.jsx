import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!avatar) return setError("Avatar is required");

    setLoading(true);
    setError(null);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    data.append("avatar", avatar);
    if (coverImage) data.append("coverImage", coverImage);

    try {
      await api.post("/users/register", data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-purple-400";
  const fileClass =
    "w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-purple-500 file:px-3 file:py-1 file:text-white";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black py-10 text-white">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-gray-700 p-6"
      >
        <h1 className="text-2xl font-bold">Sign Up</h1>

        <input name="fullname" type="text" placeholder="Full name"
          value={form.fullname} onChange={handleChange} className={inputClass} required />
        <input name="username" type="text" placeholder="Username"
          value={form.username} onChange={handleChange} className={inputClass} required />
        <input name="email" type="email" placeholder="Email"
          value={form.email} onChange={handleChange} className={inputClass} required />
        <input name="password" type="password" placeholder="Password"
          value={form.password} onChange={handleChange} className={inputClass} required />

        <label className="text-sm text-gray-400">Avatar (required)</label>
        <input type="file" accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])} className={fileClass} />

        <label className="text-sm text-gray-400">Cover image (optional)</label>
        <input type="file" accept="image/*"
          onChange={(e) => setCoverImage(e.target.files[0])} className={fileClass} />

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-purple-500 py-2 font-semibold hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}