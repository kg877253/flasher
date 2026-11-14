import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  deletePlaylist,
  getPlaylistById,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../api/playlist.api";
import SpecularButton from "../components/SpecularButton";
import Modal from "../components/Modal";
import VideoRow from "../components/VideoRow";
import EmptyState from "../components/channel/EmptyState";
import {
  CloseIcon,
  FolderIcon,
  PencilIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
  VideoIcon,
} from "../components/Icons";
import { formatViews, timeAgo } from "../utils/formatters";
import { imgAvatar, imgThumb } from "../utils/image";
import { toast } from "sonner";

const formatTotalDuration = (seconds = 0) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} hr ${minutes} min`;
  if (minutes > 0) return `${minutes} min`;
  return `${Math.floor(seconds)} sec`;
};

const ghostButton =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 active:scale-95";

function EditPlaylistModal({ playlist, onClose, onSaved }) {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const unchanged = name.trim() === playlist.name && description.trim() === playlist.description;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Name and description are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const updated = await updatePlaylist(playlist._id, {
        name: name.trim(),
        description: description.trim(),
      });
      onSaved(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update the playlist");
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit playlist" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-gray-400">Name</span>
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition focus:border-purple-400/60 focus:bg-white/10"
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-400">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={500}
            className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition focus:border-purple-400/60 focus:bg-white/10"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={ghostButton}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || unchanged}
            className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DeletePlaylistModal({ playlist, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await deletePlaylist(playlist._id);
      onDeleted();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete the playlist");
      setDeleting(false);
    }
  };

  return (
    <Modal title="Delete playlist?" onClose={onClose}>
      <p className="text-sm leading-6 text-gray-400">
        “{playlist.name}” will be deleted for good. The videos inside it are not deleted, they
        stay on their channels.
      </p>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-6 flex justify-end gap-2">
        <button type="button" autoFocus onClick={onClose} className={ghostButton}>
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="cursor-pointer rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

export default function Playlist() {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [leavingId, setLeavingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchPlaylist = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPlaylistById(playlistId);
        if (!ignore) setPlaylist(data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Failed to load playlist");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPlaylist();
    return () => {
      ignore = true;
    };
  }, [playlistId, reloadKey]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="h-4 w-36 rounded bg-white/10" />
        <div className="mt-5 grid gap-6 rounded-2xl border border-white/10 p-4 sm:grid-cols-[300px_minmax(0,1fr)] sm:p-6">
          <div className="aspect-video rounded-xl bg-white/10" />
          <div className="space-y-3 py-2">
            <div className="h-3 w-16 rounded bg-white/10" />
            <div className="h-8 w-2/3 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-1/2 rounded bg-white/10" />
          </div>
        </div>
        <div className="mt-8 grid gap-2 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex gap-3 p-1.5">
              <div className="aspect-video w-44 shrink-0 rounded-lg bg-white/10" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-4/5 rounded bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState icon={FolderIcon} title="Could not open the playlist" text={error}>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95"
          >
            Try again
          </button>
          <Link to="/" className={ghostButton}>
            Home
          </Link>
        </div>
      </EmptyState>
    );
  }

  if (!playlist) return null;

  const owner = playlist.owner;
  const videos = playlist.videos.filter(Boolean);
  const cover = videos[0]?.thumbnail;
  const totalViews = videos.reduce((total, video) => total + (video.views || 0), 0);
  const totalSeconds = videos.reduce((total, video) => total + (video.duration || 0), 0);
  const isOwner = Boolean(user?._id && owner?._id === user._id);
  const backTo = owner ? `/users/channel/${owner.username}?tab=playlists` : "/";

  const handlePlay = () => navigate(`/videos/${videos[0]._id}`);
  const handleShuffle = () => {
    const random = videos[Math.floor(Math.random() * videos.length)];
    navigate(`/videos/${random._id}`);
  };

  const handleSaved = (updated) => {
    // The update route returns videos as plain ids, so only take the changed fields
    setPlaylist((prev) => ({
      ...prev,
      name: updated.name,
      description: updated.description,
      updatedAt: updated.updatedAt,
    }));
    setEditing(false);
    toast.success("Playlist updated");
  };

  const handleRemove = async (videoId) => {
    if (leavingId) return;
    setActionError("");
    try {
      await removeVideoFromPlaylist(videoId, playlist._id);
      toast.success("Removed from playlist");
      setLeavingId(videoId); // plays the exit animation first
      setTimeout(() => {
        setPlaylist((prev) => ({
          ...prev,
          videos: prev.videos.filter((video) => video && video._id !== videoId),
        }));
        setLeavingId(null);
      }, 250);
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not remove the video");
    }
  };

  return (
    <div className="fade-up mx-auto max-w-5xl">
      <Link
        to={backTo}
        className="mb-5 inline-flex rounded-lg px-2 py-1 text-sm text-gray-400 outline-none transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        ← Back to playlists
      </Link>

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/20 sm:p-6">
        {/* Soft glow made from the first thumbnail */}
        {cover && (
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-125 bg-cover bg-center opacity-25 blur-3xl"
            style={{ backgroundImage: `url(${imgThumb(cover, 200)})` }}
          />
        )}

        <div className="relative grid gap-6 sm:grid-cols-[300px_minmax(0,1fr)]">
          {/* Cover: two layers behind it give the stacked-playlist look */}
          <div className="pt-3">
            <div className="relative aspect-video">
              <div className="absolute inset-x-5 -top-2 h-full rounded-xl bg-white/10" />
              <div className="absolute inset-x-2.5 -top-1 h-full rounded-xl bg-white/20" />
              <div className="relative h-full overflow-hidden rounded-xl bg-[#272727] shadow-xl shadow-black/40">
                {cover ? (
                  <img src={imgThumb(cover)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    <FolderIcon size={36} />
                  </div>
                )}
                {videos.length > 0 && (
                  <Link
                    to={`/videos/${videos[0]._id}`}
                    aria-label="Play the first video"
                    className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 outline-none transition duration-300 hover:bg-black/45 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-purple-400"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-xl">
                      <PlayIcon size={22} fill="currentColor" />
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-purple-300">
              Playlist
            </p>
            <h1 className="mt-2 break-words text-2xl font-bold sm:text-3xl">{playlist.name}</h1>

            {owner && (
              <Link
                to={`/users/channel/${owner.username}`}
                className="group mt-3 inline-flex w-fit max-w-full items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <img
                  src={imgAvatar(owner.avatar)}
                  alt={owner.username}
                  className="h-8 w-8 rounded-full bg-gray-700 object-cover ring-2 ring-white/10 transition group-hover:ring-purple-400/60"
                />
                <span className="truncate text-sm font-medium transition-colors group-hover:text-purple-300">
                  {owner.fullname}
                </span>
              </Link>
            )}

            <p className="mt-3 max-w-2xl whitespace-pre-wrap break-words text-sm leading-6 text-gray-400">
              {playlist.description}
            </p>

            <p className="mt-4 text-sm text-gray-500">
              {videos.length} {videos.length === 1 ? "video" : "videos"} • {formatViews(totalViews)}
              {videos.length > 0 && ` • ${formatTotalDuration(totalSeconds)}`}
              {playlist.updatedAt && ` • Updated ${timeAgo(playlist.updatedAt)}`}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {videos.length > 0 && (
                <>
                  <SpecularButton
                    size="lg"
                    radius={999}
                    tint="#a855f7"
                    tintOpacity={0.85}
                    baseColor="#d8b4fe"
                    lineColor="#ffffff"
                    idleIntensity={0.45}
                    shineSize={12}
                    followMouse
                    proximity={250}
                    onClick={handlePlay}
                  >
                    <span className="inline-flex items-center gap-2">
                      <PlayIcon size={16} fill="currentColor" />
                      Play
                    </span>
                  </SpecularButton>
                  <button type="button" onClick={handleShuffle} className={ghostButton}>
                    <ShuffleIcon size={18} />
                    Shuffle
                  </button>
                </>
              )}

              {isOwner && (
                <>
                  <button type="button" onClick={() => setEditing(true)} className={ghostButton}>
                    <PencilIcon size={17} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(true)}
                    className={`${ghostButton} hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300`}
                  >
                    <TrashIcon size={17} />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">
          Videos
          <span className="ml-2 text-sm font-normal text-gray-500">{videos.length}</span>
        </h2>

        {actionError && <p className="mb-3 text-sm text-red-400">{actionError}</p>}

        {videos.length === 0 ? (
          <EmptyState
            icon={VideoIcon}
            title="No videos in this playlist"
            text={
              isOwner
                ? "Videos you add to this playlist will show up here."
                : "This playlist does not have any published videos yet."
            }
          />
        ) : (
          <div className="grid gap-x-4 gap-y-1 md:grid-cols-2">
            {videos.map((video, index) => (
              <div
                key={video._id}
                className="fade-up"
                style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
              >
                {/* The exit animation sits on this inner div, because .fade-up keeps its own opacity */}
                <div
                  className={`transition duration-300 ${
                    leavingId === video._id ? "scale-95 opacity-0" : ""
                  }`}
                >
                  <VideoRow
                    video={video}
                    index={index + 1}
                    action={
                      isOwner && (
                        <button
                          type="button"
                          onClick={() => handleRemove(video._id)}
                          aria-label={`Remove ${video.title} from playlist`}
                          title="Remove from playlist"
                          className="cursor-pointer rounded-full bg-black/70 p-2 text-gray-300 backdrop-blur transition hover:bg-red-500/80 hover:text-white active:scale-90"
                        >
                          <CloseIcon size={16} />
                        </button>
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {editing && (
        <EditPlaylistModal
          playlist={playlist}
          onClose={() => setEditing(false)}
          onSaved={handleSaved}
        />
      )}
      {deleting && (
        <DeletePlaylistModal
          playlist={playlist}
          onClose={() => setDeleting(false)}
          onDeleted={() => {
            toast.success("Playlist deleted");
            navigate(backTo, { replace: true });
          }}
        />
      )}
    </div>
  );
}