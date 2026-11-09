import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserPlaylists } from "../../api/playlist.api";
import { formatViews, timeAgo } from "../../utils/formatters";
import EmptyState from "./EmptyState";
import { FolderIcon } from "../Icons";

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
      {playlists.map((playlist, i) => {
        const firstVideo = playlist.videos?.[0];
        const videoCount = playlist.videos?.length || 0;
        const totalViews = playlist.videos?.reduce((total, video) => total + (video.views || 0), 0) || 0;

        return (
          <Link
            to={`/playlists/${playlist._id}`}
            key={playlist._id}
            className="fade-up group block rounded-xl pt-3 outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
          >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-[#272727] shadow-md transition duration-300 group-hover:shadow-xl group-hover:shadow-black/30">
              {firstVideo?.thumbnail ? (
                <img
                  src={firstVideo.thumbnail}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  <FolderIcon size={34} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-white text-lg text-black shadow-xl transition-transform duration-300 group-hover:scale-100">
                  ▶
                </span>
              </div>
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                <div className="translate-y-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
                  Open playlist
                </div>
                <div className="rounded-md bg-black/85 px-2.5 py-1.5 text-right text-xs font-medium leading-4 shadow-lg">
                  <div>{videoCount} {videoCount === 1 ? "video" : "videos"}</div>
                  <div className="text-gray-300">{formatViews(totalViews)}</div>
                </div>
              </div>
            </div>

            <h3 className="mt-3 line-clamp-1 font-semibold transition-colors group-hover:text-purple-300">{playlist.name}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-gray-400">{playlist.description}</p>
            <p className="mt-1 text-xs text-gray-500">
              {videoCount} {videoCount === 1 ? "video" : "videos"} • {formatViews(totalViews)} • Updated {timeAgo(playlist.updatedAt)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}