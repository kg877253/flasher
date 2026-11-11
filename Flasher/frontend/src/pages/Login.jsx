import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AuthLayout from "../components/auth/AuthLayout";
import AuthField, { AuthButton, AuthError } from "../components/auth/AuthField";
import { LockIcon, UserIcon } from "../components/Icons";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
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
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "credentials went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="fade-up">
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-400">Log in to continue to Flasher.</p>
        </div>

        <AuthField
          index={1}
          icon={UserIcon}
          label="Username or email"
          name="identifier"
          type="text"
          placeholder="kartik or kartik@email.com"
          autoComplete="username"
          autoFocus
          value={form.identifier}
          onChange={handleChange}
          required
        />
        <AuthField
          index={2}
          icon={LockIcon}
          label="Password"
          name="password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <AuthError message={error} />

        <AuthButton index={3} loading={loading} loadingText="Logging in...">
          Login
        </AuthButton>

        <p className="fade-up text-sm text-gray-400" style={{ animationDelay: "280ms" }}>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-purple-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}