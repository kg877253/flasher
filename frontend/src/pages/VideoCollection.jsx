import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HistoryIcon, LikeIcon, SearchIcon } from "../components/Icons";
import SearchInput from "../components/SearchInput";
import SegmentedControl from "../components/SegmentedControl";
import EmptyState from "../components/channel/EmptyState";
import VideoRow from "../components/VideoRow";
import PageHeader, { PageHeaderSkeleton } from "../components/PageHeader";
import { formatViews } from "../utils/formatters";

const SORTS = [
  { id: "recent", label: "Recent" },
  { id: "oldest", label: "Oldest" },
  { id: "views", label: "Most viewed" },
];

// Everything that differs between Liked videos and Watch history lives here
const CONTENT = {
  liked: {
    icon: LikeIcon,
    eyebrow: "Your library",
    title: "Liked videos",
    description: "Your personal collection of videos you want to come back to.",
    searchPlaceholder: "Search liked videos...",
    emptyTitle: "No liked videos yet",
    emptyText: "Like videos while watching them and they will appear here.",
    errorText: "Failed to load liked videos",
  },
  history: {
    icon: HistoryIcon,
    eyebrow: "Your library",
    title: "Watch history",
    description: "Pick up where you left off and revisit videos you have watched.",
    searchPlaceholder: "Search watch history...",
    emptyTitle: "Your history is empty",
    emptyText: "Videos you watch will appear here so you can easily find them again.",
    errorText: "Failed to load watch history",
  },
};

function RowSkeleton() {
  return (
    <div className="flex gap-3 p-1.5">
      <div className="aspect-video w-44 shrink-0 rounded-lg bg-white/10" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 w-4/5 rounded bg-white/10" />
        <div className="h-3 w-1/3 rounded bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function VideoCollection({ type, fetchVideos }) {
  const content = CONTENT[type];
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [sortId, setSortId] = useState("recent");

  useEffect(() => {
    let ignore = false;

    const loadVideos = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchVideos();
        if (!ignore) setVideos(data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || content.errorText);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadVideos();
    return () => {
      ignore = true;
    };
  }, [fetchVideos, content.errorText, reloadKey]);

  const totalViews = useMemo(
    () => videos.reduce((total, video) => total + (video.views || 0), 0),
    [videos]
  );

  // The backend sends the newest first, so "Oldest" is just the reverse
  const visibleVideos = useMemo(() => {
    const search = query.trim().toLowerCase();
    let list = videos.filter(
      (video) =>
        !search ||
        [video.title, video.owner?.username, video.owner?.fullname].some((value) =>
          value?.toLowerCase().includes(search)
        )
    );
    if (sortId === "oldest") list = [...list].reverse();
    if (sortId === "views") list = [...list].sort((a, b) => (b.views || 0) - (a.views || 0));
    return list;
  }, [videos, query, sortId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse">
        <PageHeaderSkeleton />
        <div className="mt-6 h-10 w-full rounded-full bg-white/10 sm:w-80" />
        <div className="mt-6 grid gap-2 md:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <RowSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState icon={content.icon} title="Something went wrong" text={error}>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95"
        >
          Try again
        </button>
      </EmptyState>
    );
  }

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageHeader
        icon={content.icon}
        title={content.title}
        stats={[
          { value: videos.length, label: videos.length === 1 ? "video" : "videos" },
          { value: formatViews(totalViews).split(" ")[0], label: "total views" },
        ]}
      />

      {videos.length === 0 ? (
        <EmptyState icon={content.icon} title={content.emptyTitle} text={content.emptyText}>
          <Link
            to="/"
            className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95"
          >
            Explore videos
          </Link>
        </EmptyState>
      ) : (
        <>
          {/* Toolbar: search + sort */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={content.searchPlaceholder}
              className="sm:w-80"
            />
            <SegmentedControl
              label="Sort videos"
              options={SORTS}
              value={sortId}
              onChange={setSortId}
              className="sm:w-80"
            />
          </div>

          {query && (
            <p className="mt-4 text-sm text-gray-500">
              Showing {visibleVideos.length} of {videos.length}
            </p>
          )}

          {visibleVideos.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No matches"
              text={`Nothing matches "${query.trim()}".`}
            >
              <button
                type="button"
                onClick={() => setQuery("")}
                className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10 active:scale-95"
              >
                Clear search
              </button>
            </EmptyState>
          ) : (
            // key={sortId}: the list fades in again every time the sort changes
            <div key={sortId} className="mt-4 grid gap-2 md:grid-cols-2">
              {visibleVideos.map((video, index) => (
                <div
                  key={video._id}
                  className="fade-up"
                  style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
                >
                  <VideoRow video={video} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}