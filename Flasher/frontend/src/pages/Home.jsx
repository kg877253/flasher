import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllVideos } from "../api/video.api";
import { searchUsers } from "../api/user.api";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import { Link } from "react-router-dom";

const LIMIT = 12;

export default function Home() {

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  // First page: runs on load and every time the search text changes
  useEffect(() => {
    let ignore = false; // ignores an old response if the search changed meanwhile

    const fetchFirstPage = async () => {
      setLoading(true);
      setError("");
      try {
        const [data, users] = await Promise.all([
          getAllVideos({ page: 1, limit: LIMIT, query }),
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
  }, [query]);

  // Next pages: adds the new videos below the old ones
  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const data = await getAllVideos({ page: page+1, limit: LIMIT, query });
      setVideos((current) => [...current, ...data.allvideos]);
      setPage(page + 1);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load more videos");
      setHasNextPage(false); // stop trying again and again after an error
    } finally {
      setLoadingMore(false);
    }
  }, [page, query]);

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

  const grid = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

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
    return (
      <div className="mx-auto mt-20 max-w-2xl">
        {query && channels.length > 0 ? (
          <ChannelResults channels={channels} query={query} />
        ) : (
          <div className="rounded-md border border-gray-500 p-6 text-center">
            <h1 className="text-2xl font-bold">
              {query ? `No results found for "${query}"` : "No Videos available"}
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {query ? "Try a different word." : "There are no videos here yet."}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {query && <h1 className="mb-4 text-lg font-semibold">Results for "{query}"</h1>}

      {query && channels.length > 0 && <ChannelResults channels={channels} query={query} />}

      <div className={grid}>
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
        {loadingMore &&
          Array.from({ length: 4 }, (_, i) => <VideoCardSkeleton key={`more-${i}`} />)}
      </div>

      {/* Invisible marker: when it appears on screen we load the next page */}
      <div ref={bottomRef} className="h-10" />

      {error && <p className="text-center text-red-400">{error}</p>}

    </div>
  );
}

function ChannelResults({ channels, query }) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-lg font-semibold">Channels matching "{query}"</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <Link
            key={channel._id}
            to={`/users/channel/${channel.username}`}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-purple-400/40 hover:bg-white/[0.07]"
          >
            <img
              src={channel.avatar}
              alt={channel.username}
              className="h-12 w-12 shrink-0 rounded-full bg-gray-700 object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold">{channel.fullname}</p>
              <p className="truncate text-sm text-gray-400">@{channel.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}