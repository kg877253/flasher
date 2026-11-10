import { useCallback, useEffect, useRef, useState } from "react";
import { getAllVideos } from "../../api/video.api";
import VideoCard from "../VideoCard";
import VideoCardSkeleton from "../VideoCardSkeleton";
import EmptyState from "./EmptyState";
import { VideoIcon } from "../Icons";

const LIMIT = 12;

// sortBy / sortType values are the ones the backend getAllVideos allows
const SORTS = [
  { id: "latest", label: "Latest", sortBy: "createdAt", sortType: "desc" },
  { id: "popular", label: "Popular", sortBy: "views", sortType: "desc" },
  { id: "oldest", label: "Oldest", sortBy: "createdAt", sortType: "asc" },
];

const grid = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function VideosTab({ channelId }) {
  const [sortId, setSortId] = useState("latest");
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const sort = SORTS.find((s) => s.id === sortId);

  // First page: runs on load and every time the sort changes
  useEffect(() => {
    let ignore = false;

    const fetchFirstPage = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getAllVideos({
          page: 1,
          limit: LIMIT,
          userId: channelId,
          sortBy: sort.sortBy,
          sortType: sort.sortType,
        });
        if (ignore) return;
        setVideos(data.allvideos);
        setPage(1);
        setHasNextPage(data.hasNextPage);
      } catch (err) {
        if (ignore) return;
        setError(err.response?.data?.message || "Failed to load videos");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchFirstPage();
    return () => {
      ignore = true;
    };
  }, [channelId, sort]);

  // Next pages: adds the new videos below the old ones
  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const data = await getAllVideos({
        page: page + 1,
        limit: LIMIT,
        userId: channelId,
        sortBy: sort.sortBy,
        sortType: sort.sortType,
      });
      setVideos((current) => [...current, ...data.allvideos]);
      setPage(page + 1);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load more videos");
      setHasNextPage(false); // stop trying again and again after an error
    } finally {
      setLoadingMore(false);
    }
  }, [page, channelId, sort]);

  // When the empty div at the bottom comes on screen, load the next page
  useEffect(() => {
    const bottom = bottomRef.current;
    if (!bottom || !hasNextPage || loading || loadingMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    });
    observer.observe(bottom);

    return () => observer.disconnect();
  }, [hasNextPage, loading, loadingMore, loadMore]);

  return (
    <div>
      {/* Sort chips */}
      <div className="mb-4 flex gap-2">
        {SORTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSortId(s.id)}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition active:scale-95 ${sortId === s.id
                ? "bg-white text-black"
                : "bg-white/10 text-gray-200 hover:bg-white/20"
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={grid}>
          {Array.from({ length: 8 }, (_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : error && videos.length === 0 ? (
        <p className="mt-10 text-center text-red-400">{error}</p>
      ) : videos.length === 0 ? (
        <EmptyState
          icon={VideoIcon}
          title="No videos uploaded"
          text="This channel has not published any videos yet."
        />
      ) : (
        <>
          <div className={grid}>
            {videos.map((video, i) => (
              <div
                key={video._id}
                className="fade-up"
                style={{ animationDelay: `${(i % LIMIT) * 40}ms` }}
              >
                <VideoCard video={video} />
              </div>
            ))}
            {loadingMore &&
              Array.from({ length: 4 }, (_, i) => (
                <VideoCardSkeleton key={`more-${i}`} />
              ))}
          </div>

          <div ref={bottomRef} className="h-10" />
          {error && <p className="text-center text-red-400">{error}</p>}
        </>
      )}
    </div>
  );
}