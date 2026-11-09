import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HistoryIcon, LikeIcon } from "../components/Icons";
import VideoRow from "../components/VideoRow";
import { formatViews } from "../utils/formatters";

export default function VideoCollection({ type, fetchVideos }) {
  const isLiked = type === "liked";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadVideos = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchVideos();
        if (!ignore) setVideos(data);
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || `Failed to load ${isLiked ? "liked videos" : "watch history"}`);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadVideos();
    return () => {
      ignore = true;
    };
  }, [fetchVideos, isLiked]);

  const totalViews = useMemo(
    () => videos.reduce((total, video) => total + (video.views || 0), 0),
    [videos]
  );
  const Icon = isLiked ? LikeIcon : HistoryIcon;
  const title = isLiked ? "Liked videos" : "Watch history";
  const description = isLiked
    ? "Your personal collection of videos you want to come back to."
    : "Pick up where you left off and revisit videos you have watched.";

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-44 rounded-2xl bg-white/10" />
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-28 rounded-xl bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="mt-12 text-center text-red-400">{error}</p>;

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20 sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
              <Icon size={25} />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-purple-300">Your library</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">{description}</p>
            </div>
          </div>
          <div className="flex gap-6 border-t border-white/10 pt-4 text-sm sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <div>
              <p className="text-2xl font-semibold text-white">{videos.length}</p>
              <p className="text-gray-500">{videos.length === 1 ? "video" : "videos"}</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{formatViews(totalViews).split(" ")[0]}</p>
              <p className="text-gray-500">total views</p>
            </div>
          </div>
        </div>
      </section>

      {videos.length === 0 ? (
        <div className="mx-auto mt-16 max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-gray-500">
            <Icon size={30} />
          </div>
          <h2 className="mt-5 text-xl font-semibold">
            {isLiked ? "No liked videos yet" : "Your history is empty"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {isLiked
              ? "Like videos while watching them and they will appear here."
              : "Videos you watch will appear here so you can easily find them again."}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            Explore videos
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{isLiked ? "Saved for later" : "Recently watched"}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {isLiked ? "Your latest liked videos" : "Your latest viewing activity"}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {videos.map((video, index) => (
              <div
                key={video._id}
                className="fade-up rounded-xl border border-transparent transition duration-200 hover:border-white/10 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-black/20"
                style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
              >
                <VideoRow video={video} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
