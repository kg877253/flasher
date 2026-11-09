import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPlaylistById } from "../api/playlist.api";
import VideoRow from "../components/VideoRow";
import { formatViews, timeAgo } from "../utils/formatters";

export default function Playlist() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchPlaylist = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPlaylistById(playlistId);
        if (!ignore) setPlaylist(data);
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Failed to load playlist");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPlaylist();
    return () => {
      ignore = true;
    };
  }, [playlistId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 rounded-2xl bg-white/10" />
        <div className="mt-6 h-7 w-1/2 rounded bg-white/10" />
        <div className="mt-4 h-20 rounded-xl bg-white/10" />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-400">{error}</p>;
  if (!playlist) return null;

  const totalViews = playlist.videos.reduce((total, video) => total + (video.views || 0), 0);

  return (
    <div className="fade-up mx-auto max-w-5xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex rounded-lg px-2 py-1 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        ← Back to playlists
      </button>

      <section className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/20 sm:grid-cols-[280px_minmax(0,1fr)] sm:p-6">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-[#272727]">
          {playlist.videos[0]?.thumbnail ? (
            <img src={playlist.videos[0].thumbnail} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">No thumbnail</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute right-3 top-3 rounded-md bg-black/85 px-2.5 py-1.5 text-right text-xs font-medium leading-4 shadow-lg">
            <div>{playlist.videos.length} {playlist.videos.length === 1 ? "video" : "videos"}</div>
            <div className="text-gray-300">{formatViews(totalViews)}</div>
          </div>
          {playlist.videos.length > 0 && (
            <Link
              to={`/videos/${playlist.videos[0]._id}`}
              className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <span>▶</span> Play first video
            </Link>
          )}
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <p className="text-sm font-medium text-purple-300">Playlist</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{playlist.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">{playlist.description}</p>
          <p className="mt-5 text-sm text-gray-500">
            {playlist.videos.length} {playlist.videos.length === 1 ? "video" : "videos"}
            {" • "}
            {formatViews(totalViews)}
            {playlist.updatedAt && ` • Updated ${timeAgo(playlist.updatedAt)}`}
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">
          Videos in this playlist
          <span className="ml-2 text-sm font-normal text-gray-500">
            {playlist.videos.length} • {formatViews(totalViews)}
          </span>
        </h2>
        {playlist.videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-gray-400">
            This playlist does not have any published videos yet.
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {playlist.videos.map((video, index) => (
              <div
                key={video._id}
                className="fade-up rounded-xl border border-transparent transition hover:border-white/10 hover:bg-white/[0.04]"
                style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
              >
                <VideoRow video={video} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
