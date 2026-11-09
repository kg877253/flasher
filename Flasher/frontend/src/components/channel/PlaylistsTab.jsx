import { useEffect, useState } from "react";
import { getUserPlaylists } from "../../api/playlist.api";
import { timeAgo } from "../../utils/formatters";
import EmptyState from "./EmptyState";
import { FolderIcon } from "../Icons";

// Playlists have no thumbnail in the backend, so every card gets one of these gradients
const GRADIENTS = [
  "from-pink-500 via-orange-400 to-purple-500",
  "from-purple-500 via-fuchsia-500 to-pink-500",
  "from-blue-500 via-purple-500 to-pink-400",
];

const grid = "grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function PlaylistsTab({ channelId }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchPlaylists = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getUserPlaylists(channelId);
        if (!ignore) setPlaylists(data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Failed to load playlists");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPlaylists();
    return () => {
      ignore = true;
    };
  }, [channelId]);

  if (loading) {
    return (
      <div className={grid}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="animate-pulse pt-3">
            <div className="aspect-video rounded-xl bg-gray-800" />
            <div className="mt-3 h-4 w-3/4 rounded bg-gray-800" />
            <div className="mt-2 h-3 w-1/2 rounded bg-gray-800" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="mt-10 text-center text-red-400">{error}</p>;

  if (playlists.length === 0) {
    return (
      <EmptyState
        icon={FolderIcon}
        title="No playlists yet"
        text="This channel has not created any playlists."
      />
    );
  }

  return (
    <div className={grid}>
      {playlists.map((playlist, i) => (
        <div
          key={playlist._id}
          className="fade-up group pt-3"
          style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
        >
          {/* Stacked-cards look: two layers behind the main card lift a little on hover */}
          <div className="relative aspect-video">
            <div className="absolute inset-x-5 -top-2 h-full rounded-xl bg-white/10 transition-transform duration-300 group-hover:-translate-y-1" />
            <div className="absolute inset-x-2.5 -top-1 h-full rounded-xl bg-white/20 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <div
              className={`relative flex h-full items-end justify-end rounded-xl bg-gradient-to-br p-3 ${GRADIENTS[i % GRADIENTS.length]}`}
            >
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium backdrop-blur">
                {playlist.videos.length} {playlist.videos.length === 1 ? "video" : "videos"}
              </span>
            </div>
          </div>

          <h3 className="mt-3 line-clamp-1 font-semibold">{playlist.name}</h3>
          <p className="line-clamp-2 text-sm text-gray-400">{playlist.description}</p>
          <p className="mt-1 text-xs text-gray-500">Updated {timeAgo(playlist.updatedAt)}</p>
        </div>
      ))}
    </div>
  );
}