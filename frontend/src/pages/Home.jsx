import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllVideos } from "../api/video.api";
import { searchUsers } from "../api/user.api";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import SegmentedControl from "../components/SegmentedControl";
import EmptyState from "../components/channel/EmptyState";
import { SearchIcon, VideoIcon } from "../components/Icons";
import { imgAvatar } from "../utils/image";

const LIMIT = 12;

const SORT_OPTIONS = [
  { id: "latest", label: "Latest" },
  { id: "popular", label: "Popular" },
];

// Latest is the backend default (newest first), Popular sorts by views
const sortParams = (sort) =>
  sort === "popular" ? { sortBy: "views", sortType: "desc" } : {};

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [sort, setSort] = useState("latest");
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  // First page: runs on load and every time the search text or sort changes
  useEffect(() => {
    let ignore = false; // ignores an old response if the search changed meanwhile

    const fetchFirstPage = async () => {
      setLoading(true);
      setError("");
      try {
        const [data, users] = await Promise.all([
          getAllVideos({ page: 1, limit: LIMIT, query, ...sortParams(sort) }),
          query ? searchUsers(query) : Promise.resolve([]),
        ]);
        if (ignore) return;
        setVideos(data.allvideos);
        setChannels(users);
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
  }, [query, sort]);

  // Next pages: adds the new videos below the old ones
  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const data = await getAllVideos({
        page: page + 1,
        limit: LIMIT,
        query,
        ...sortParams(sort),
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
  }, [page, query, sort]);

  // Watches the empty div at the bottom: when it comes on screen, load more
  useEffect(() => {
    const bottom = bottomRef.current;
    if (!bottom || !hasNextPage || loading || loadingMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    });
    observer.observe(bottom);

    return () => observer.disconnect();
  }, [hasNextPage, loading, loadingMore, loadMore]);

  const grid =
    "grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const title = query
    ? `Results for "${query}"`
    : sort === "popular"
      ? "Popular videos"
      : "Latest videos";

  const renderContent = () => {
    if (loading) {
      return (
        <div className={grid}>
          {Array.from({ length: 10 }, (_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error && videos.length === 0) {
      return <p className="mt-20 text-center text-red-400">{error}</p>;
    }

    if (videos.length === 0) {
      if (query && channels.length > 0) {
        return <ChannelResults channels={channels} query={query} />;
      }
      return query ? (
        <EmptyState
          icon={SearchIcon}
          title={`No results for "${query}"`}
          text="Try a different word or check the spelling."
        />
      ) : (
        <EmptyState
          icon={VideoIcon}
          title="No videos yet"
          text="There are no videos here yet. Check back soon."
        />
      );
    }

    return (
      <>
        {query && channels.length > 0 && (
          <ChannelResults channels={channels} query={query} />
        )}

        <div className={grid}>
          {videos.map((video, i) => (
            <VideoCard key={video._id} video={video} index={i % LIMIT} />
          ))}
          {loadingMore &&
            Array.from({ length: 4 }, (_, i) => (
              <VideoCardSkeleton key={`more-${i}`} />
            ))}
        </div>

        {/* Invisible marker: when it appears on screen we load the next page */}
        <div ref={bottomRef} className="h-10" />

        {error && <p className="text-center text-red-400">{error}</p>}
      </>
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-xl font-bold tracking-tight">{title}</h1>
        <SegmentedControl
          label="Sort videos"
          options={SORT_OPTIONS}
          value={sort}
          onChange={setSort}
          className="w-full sm:w-56"
        />
      </div>

      {renderContent()}
    </div>
  );
}



function ChannelResults({ channels, query }) {
  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <h2 className="font-semibold">
          Channels matching <span className="text-gray-400">"{query}"</span>
        </h2>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3 xl:grid-cols-4">
        {channels.map((channel) => (
          <Link
            key={channel._id}
            to={`/users/channel/${channel.username}`}
            className="group flex min-h-24 items-center gap-4 rounded-xl border border-white/10 bg-black/20 p-4 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/50 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-purple-950/20 focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <img
              src={imgAvatar(channel.avatar)}
              alt={channel.username}
              className="h-14 w-14 shrink-0 rounded-full bg-gray-700 object-cover ring-2 ring-white/10 transition group-hover:ring-purple-400/60"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold transition-colors group-hover:text-purple-300">
                {channel.fullname}
              </p>
              <p className="truncate text-sm text-gray-400">@{channel.username}</p>
              <p className="mt-1 text-xs text-gray-500">View channel →</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}