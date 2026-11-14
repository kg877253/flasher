import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getChannelSubscribers } from "../api/subscription.api";
import { SearchIcon, SubscribersIcon, UserIcon } from "../components/Icons";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import SegmentedControl from "../components/SegmentedControl";
import EmptyState from "../components/channel/EmptyState";
import { timeAgo } from "../utils/formatters";
import { imgAvatar } from "../utils/image";

const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "name", label: "A–Z" },
];

const WEEK = 7 * 24 * 60 * 60 * 1000;

export default function Subscribers() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [sortId, setSortId] = useState("newest");
  const [now] = useState(() => Date.now()); // fixed once, so render stays pure

  useEffect(() => {
    let ignore = false;

    const fetchSubscribers = async () => {
      if (!user?._id) return;
      setLoading(true);
      setError("");
      try {
        const data = await getChannelSubscribers(user._id);
        // subscriberDetails is missing if that user was deleted, so skip those
        if (!ignore) setSubscribers(data.filter((item) => item.subscriberDetails));
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Failed to load subscribers");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchSubscribers();
    return () => {
      ignore = true;
    };
  }, [user?._id, reloadKey]);

  const newThisWeek = useMemo(
    () => subscribers.filter((item) => now - new Date(item.createdAt) < WEEK).length,
    [subscribers, now]
  );

  const visibleSubscribers = useMemo(() => {
    const search = query.trim().toLowerCase();
    const list = subscribers.filter(
      ({ subscriberDetails: person }) =>
        !search ||
        [person.fullname, person.username].some((value) => value?.toLowerCase().includes(search))
    );

    if (sortId === "name") {
      list.sort((a, b) =>
        a.subscriberDetails.fullname.localeCompare(b.subscriberDetails.fullname)
      );
    } else {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      if (sortId === "newest") list.reverse();
    }
    return list;
  }, [subscribers, query, sortId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-44 rounded-2xl bg-white/10" />
        <div className="mt-6 h-10 w-full rounded-full bg-white/10 sm:w-80" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-24 rounded-xl bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState icon={SubscribersIcon} title="Something went wrong" text={error}>
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
        icon={SubscribersIcon}
        title="Subscribers"
        stats={[
          { value: subscribers.length, label: subscribers.length === 1 ? "subscriber" : "subscribers" },
          { value: `+${newThisWeek}`, label: "this week" },
        ]}
      />

      {subscribers.length === 0 ? (
        <EmptyState
          icon={SubscribersIcon}
          title="No subscribers yet"
          text="Share your channel and your first subscribers will appear here."
        />
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search subscribers..."
              className="sm:w-80"
            />
            <SegmentedControl
              label="Sort subscribers"
              options={SORTS}
              value={sortId}
              onChange={setSortId}
              className="sm:w-80"
            />
          </div>

          {query && (
            <p className="mt-4 text-sm text-gray-500">
              Showing {visibleSubscribers.length} of {subscribers.length}
            </p>
          )}

          {visibleSubscribers.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No matches"
              text={`No subscriber matches "${query.trim()}".`}
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
            // key={sortId}: the cards fade in again every time the sort changes
            <div key={sortId} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleSubscribers.map(({ subscriberDetails: person, createdAt }, index) => (
                <Link
                  key={person._id}
                  to={`/users/channel/${person.username}`}
                  className="fade-up group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/40 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-purple-950/20 focus-visible:ring-2 focus-visible:ring-purple-400"
                  style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
                >
                  <img
                    src={imgAvatar(person.avatar)}
                    alt={person.username}
                    className="h-14 w-14 shrink-0 rounded-full bg-gray-700 object-cover ring-2 ring-white/10 transition duration-300 group-hover:ring-purple-400/60"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold transition-colors group-hover:text-purple-300">
                      {person.fullname}
                    </h3>
                    <p className="truncate text-sm text-gray-400">@{person.username}</p>
                    <p className="mt-1 text-xs text-gray-500">Subscribed {timeAgo(createdAt)}</p>
                  </div>
                  <UserIcon
                    size={18}
                    className="shrink-0 text-gray-500 transition-colors group-hover:text-purple-300"
                  />
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}