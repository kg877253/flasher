import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/user.api";
import AuthLayout from "../components/auth/AuthLayout";
import AuthField, { AuthButton, AuthError } from "../components/auth/AuthField";
import { AvatarPicker, CoverPicker } from "../components/auth/ImagePickers";
import { AtIcon, CheckIcon, LockIcon, MailIcon, UserIcon } from "../components/Icons";
import useAuth from "../hooks/useAuth";
import GoogleButton, { OrDivider } from "../components/auth/GoogleButton";
import { toast } from "sonner";

export default function SignUp() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
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
      await registerUser(data);
      toast.success("Account created. Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credential) => {
    setError(null);
    try {
      await loginWithGoogle(credential);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-in failed");
    }
  };

  // The backend stores usernames in lowercase
  const usernamePreview = form.username.trim().toLowerCase() || "username";
  const passwordOk = form.password.length >= 8;

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="fade-up">
          <h1 className="text-3xl font-extrabold tracking-tight">Create your channel</h1>
          <p className="mt-2 text-sm text-gray-400">
            Pick a photo and a username, and you are in.
          </p>
        </div>
        <div className="fade-up" style={{ animationDelay: "70ms" }}>
          <GoogleButton
            text="signup_with"
            onCredential={handleGoogle}
            onError={() => setError("Google sign-in failed")}
          />
        </div>
        <OrDivider />

        <AvatarPicker index={1} onChange={setAvatar} invalid={!!error && !avatar} />

        <AuthField
          index={2}
          icon={UserIcon}
          label="Full name"
          name="fullname"
          type="text"
          placeholder="Kartik Gupta"
          autoComplete="name"
          value={form.fullname}
          onChange={handleChange}
          required
        />
        <AuthField
          index={3}
          icon={AtIcon}
          label="Username"
          name="username"
          type="text"
          placeholder="kartik"
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          required
          hint={
            <p className="mt-1.5 truncate text-xs text-gray-500">
              {window.location.host}/users/channel/
              <span className="text-purple-300">{usernamePreview}</span>
            </p>
          }
        />
        <AuthField
          index={4}
          icon={MailIcon}
          label="Email"
          name="email"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <AuthField
          index={5}
          icon={LockIcon}
          label="Password"
          name="password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          required
          hint={
            <p
              className={`mt-1.5 flex items-center gap-1.5 text-xs transition-colors ${passwordOk ? "text-green-400" : "text-gray-500"
                }`}
            >
              <CheckIcon size={14} />
              At least 8 characters
            </p>
          }
        />

        <CoverPicker index={6} onChange={setCoverImage} />

        <AuthError message={error} />

        <AuthButton index={7} loading={loading} loadingText="Creating account...">
          Sign Up
        </AuthButton>

        <p className="fade-up text-sm text-gray-400" style={{ animationDelay: "560ms" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}