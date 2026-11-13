import { useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  changePassword,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "../api/user.api";
import { CheckIcon, SettingsIcon, UploadIcon } from "../components/Icons";
import PageHeader from "../components/PageHeader";

const inputClass =
  "mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition focus:border-purple-400/60 focus:bg-white/10";

function Notice({ message, error = false }) {
  if (!message) return null;
  return (
    <p className={`mt-3 text-sm ${error ? "text-red-400" : "text-emerald-400"}`}>
      {message}
    </p>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="grid gap-4 py-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-10">
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
  });
  const [profileState, setProfileState] = useState({ loading: false, message: "", error: "" });
  const [password, setPassword] = useState({ oldPassword: "", newPassword: "" });
  const [passwordState, setPasswordState] = useState({ loading: false, message: "", error: "" });
  const [imageState, setImageState] = useState({ loading: "", message: "", error: "" });

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileState({ loading: true, message: "", error: "" });
    try {
      const updatedUser = await updateAccountDetails(profile);
      updateUser(updatedUser);
      setProfileState({ loading: false, message: "Profile updated successfully.", error: "" });
    } catch (error) {
      setProfileState({
        loading: false,
        message: "",
        error: error.response?.data?.message || "Could not update your profile.",
      });
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setPasswordState({ loading: true, message: "", error: "" });
    try {
      await changePassword(password);
      setPassword({ oldPassword: "", newPassword: "" });
      setPasswordState({ loading: false, message: "Password changed successfully.", error: "" });
    } catch (error) {
      setPasswordState({
        loading: false,
        message: "",
        error: error.response?.data?.message || "Could not change your password.",
      });
    }
  };

  const saveImage = async (type, file) => {
    if (!file) return;
    setImageState({ loading: type, message: "", error: "" });
    try {
      const updatedUser = type === "avatar" ? await updateAvatar(file) : await updateCoverImage(file);
      updateUser(updatedUser);
      setImageState({
        loading: "",
        message: `${type === "avatar" ? "Avatar" : "Cover image"} updated successfully.`,
        error: "",
      });
    } catch (error) {
      setImageState({
        loading: "",
        message: "",
        error: error.response?.data?.message || `Could not update your ${type}.`,
      });
    }
  };

  return (
    <div className="fade-up mx-auto max-w-5xl">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        subtitle="Profile, channel images and password."
      />

      <div className="divide-y divide-white/10">
        <Section title="Profile details" description="Keep the information on your channel up to date.">
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-gray-400">
              Full name
              <input
                className={inputClass}
                value={profile.fullname}
                onChange={(event) => setProfile({ ...profile, fullname: event.target.value })}
                required
              />
            </label>
            <label className="text-sm text-gray-400">
              Email
              <input
                type="email"
                className={inputClass}
                value={profile.email}
                onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                required
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={profileState.loading}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckIcon size={16} />
                {profileState.loading ? "Saving..." : "Save changes"}
              </button>
              <Notice message={profileState.message || profileState.error} error={Boolean(profileState.error)} />
            </div>
          </form>
        </Section>

        <Section title="Channel appearance" description="Use clear images so people recognize your channel.">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
            <div className="relative h-32 sm:h-44">
              {user?.coverImage ? (
                <img src={user.coverImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-white/10 to-white/[0.04]" />
              )}
            </div>
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4 z-10">
                <img
                  src={user?.avatar}
                  alt={user?.username}
                  className="-mt-10 h-16 w-16 shrink-0 rounded-full border-4 border-black bg-gray-700 object-cover sm:-mt-12 sm:h-20 sm:w-20"
                />
                <div className="min-w-0">
                  <p className="font-semibold">{user?.fullname}</p>
                  <p className="text-sm text-gray-400">@{user?.username}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-sm transition hover:bg-white/10">
                  <UploadIcon size={16} />
                  {imageState.loading === "avatar" ? "Uploading..." : "Avatar"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={Boolean(imageState.loading)}
                    onChange={(event) => saveImage("avatar", event.target.files?.[0])}
                  />
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-sm transition hover:bg-white/10">
                  <UploadIcon size={16} />
                  {imageState.loading === "coverImage" ? "Uploading..." : "Cover image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={Boolean(imageState.loading)}
                    onChange={(event) => saveImage("coverImage", event.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          </div>
          <Notice message={imageState.message || imageState.error} error={Boolean(imageState.error)} />
        </Section>

        <Section title="Password" description="Use a strong password that you do not reuse elsewhere.">
          <form onSubmit={savePassword} className="max-w-xl space-y-4">
            <label className="block text-sm text-gray-400">
              Current password
              <input
                type="password"
                className={inputClass}
                value={password.oldPassword}
                onChange={(event) => setPassword({ ...password, oldPassword: event.target.value })}
                required
              />
            </label>
            <label className="block text-sm text-gray-400">
              New password
              <input
                type="password"
                minLength={8}
                className={inputClass}
                value={password.newPassword}
                onChange={(event) => setPassword({ ...password, newPassword: event.target.value })}
                required
              />
            </label>
            <button
              type="submit"
              disabled={passwordState.loading}
              className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {passwordState.loading ? "Updating..." : "Change password"}
            </button>
            <Notice message={passwordState.message || passwordState.error} error={Boolean(passwordState.error)} />
          </form>
        </Section>
      </div>
    </div>
  );
}
