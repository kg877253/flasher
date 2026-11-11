import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  addVideoToPlaylist,
  createPlaylist,
  getUserPlaylists,
  removeVideoFromPlaylist,
} from "../api/playlist.api";
import { CheckIcon, FolderIcon, PlusIcon } from "./Icons";
import Modal from "./Modal";
import PlaylistForm from "./PlaylistForm";

function SaveModal({ videoId, onClose }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchPlaylists = async () => {
      try {
        const data = await getUserPlaylists(user._id);
        if (!ignore) setPlaylists(data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Failed to load your playlists");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPlaylists();
    return () => {
      ignore = true;
    };
  }, [user._id]);

  const hasVideo = (playlist) => playlist.videos.some((video) => video?._id === videoId);

  // Click a playlist: add the video if it is not there, remove it if it is
  const handleToggle = async (playlist) => {
    if (busyId) return;
    setBusyId(playlist._id);
    setError("");
    try {
      if (hasVideo(playlist)) {
        await removeVideoFromPlaylist(videoId, playlist._id);
        setPlaylists((prev) =>
          prev.map((item) =>
            item._id === playlist._id
              ? { ...item, videos: item.videos.filter((video) => video?._id !== videoId) }
              : item
          )
        );
      } else {
        await addVideoToPlaylist(videoId, playlist._id);
        setPlaylists((prev) =>
          prev.map((item) =>
            item._id === playlist._id
              ? { ...item, videos: [...item.videos, { _id: videoId }] }
              : item
          )
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setBusyId(null);
    }
  };

  // New playlist from this dialog: create it, then save the video into it straight away
  const handleCreate = async (values) => {
    const created = await createPlaylist(values);
    setPlaylists((prev) => [...prev, { ...created, videos: [] }]);
    await addVideoToPlaylist(videoId, created._id);
    setPlaylists((prev) =>
      prev.map((item) =>
        item._id === created._id ? { ...item, videos: [{ _id: videoId }] } : item
      )
    );
    setCreating(false);
  };

  return (
    <Modal title={creating ? "New playlist" : "Save to playlist"} onClose={onClose}>
      {creating ? (
        <PlaylistForm
          submitLabel="Create and save"
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      ) : (
        <>
          {loading ? (
            <div className="animate-pulse space-y-2">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="h-12 rounded-xl bg-white/10" />
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <div className="py-6 text-center text-gray-400">
              <FolderIcon size={28} className="mx-auto mb-2 text-gray-500" />
              <p className="text-sm">You do not have any playlists yet.</p>
            </div>
          ) : (
            <div className="-mx-2 max-h-64 space-y-0.5 overflow-y-auto px-2">
              {playlists.map((playlist) => {
                const saved = hasVideo(playlist);
                return (
                  <button
                    key={playlist._id}
                    type="button"
                    onClick={() => handleToggle(playlist)}
                    disabled={busyId === playlist._id}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5 disabled:opacity-60"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        saved ? "border-purple-500 bg-purple-500" : "border-white/30"
                      }`}
                    >
                      <CheckIcon
                        size={14}
                        strokeWidth={3}
                        className={`transition-all duration-200 ${
                          saved ? "scale-100 opacity-100" : "scale-50 opacity-0"
                        }`}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{playlist.name}</span>
                      <span className="block text-xs text-gray-500">
                        {playlist.videos.length} {playlist.videos.length === 1 ? "video" : "videos"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-purple-300 transition hover:bg-purple-500/10 active:scale-95"
            >
              <PlusIcon size={16} />
              New playlist
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95"
            >
              Done
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

export default function SaveToPlaylist({ videoId }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20 active:scale-95"
      >
        <FolderIcon size={20} />
        Save
      </button>
      {open && <SaveModal videoId={videoId} onClose={() => setOpen(false)} />}
    </>
  );
}