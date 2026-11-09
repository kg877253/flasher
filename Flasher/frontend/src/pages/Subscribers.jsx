import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getChannelSubscribers } from "../api/subscription.api";
import { SubscribersIcon, UserIcon } from "../components/Icons";
import { timeAgo } from "../utils/formatters";

export default function Subscribers() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchSubscribers = async () => {
      if (!user?._id) return;
      setLoading(true);
      setError("");
      try {
        const data = await getChannelSubscribers(user._id);
        const validSubscribers = data.filter((item) => item.subscriberDetails);
        if (!ignore) setSubscribers(validSubscribers);
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Failed to load subscribers");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchSubscribers();
    return () => {
      ignore = true;
    };
  }, [user?._id]);

  const visibleSubscribers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return subscribers;
    return subscribers.filter(({ subscriberDetails: subscriber }) =>
      [subscriber.fullname, subscriber.username].some((value) =>
        value?.toLowerCase().includes(search)
      )
    );
  }, [query, subscribers]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-44 rounded-2xl bg-white/10" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              <SubscribersIcon size={25} />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-purple-300">Your community</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">Subscribers</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                People who chose to follow your channel and keep up with your content.
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <p className="text-2xl font-semibold">{subscribers.length}</p>
            <p className="text-sm text-gray-500">
              {subscribers.length === 1 ? "subscriber" : "subscribers"}
            </p>
          </div>
        </div>
      </section>

      {subscribers.length === 0 ? (
        <div className="mx-auto mt-16 max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-gray-500">
            <SubscribersIcon size={30} />
          </div>
          <h2 className="mt-5 text-xl font-semibold">No subscribers yet</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Share your channel and your first subscribers will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your subscribers</h2>
              <p className="mt-1 text-sm text-gray-500">
                {query ? `${visibleSubscribers.length} matching people` : "Everyone following your channel"}
              </p>
            </div>
            <label className="relative block sm:w-72">
              <span className="sr-only">Search subscribers</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search subscribers..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition placeholder:text-gray-500 focus:border-purple-400/60 focus:bg-white/10"
              />
            </label>
          </div>

          {visibleSubscribers.length === 0 ? (
            <p className="mt-12 text-center text-gray-500">No subscribers match your search.</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleSubscribers.map(({ subscriberDetails: subscriber, createdAt }, index) => (
                <Link
                  key={subscriber._id}
                  to={`/users/channel/${subscriber.username}`}
                  className="fade-up group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/40 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-purple-950/20 focus-visible:ring-2 focus-visible:ring-purple-400"
                  style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
                >
                  <img
                    src={subscriber.avatar}
                    alt={subscriber.username}
                    className="h-14 w-14 shrink-0 rounded-full bg-gray-700 object-cover ring-2 ring-white/10 transition duration-300 group-hover:ring-purple-400/60"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold group-hover:text-purple-300">{subscriber.fullname}</h3>
                    <p className="truncate text-sm text-gray-400">@{subscriber.username}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {createdAt ? `Following since ${timeAgo(createdAt)}` : "View channel"}
                    </p>
                  </div>
                  <UserIcon size={18} className="shrink-0 text-gray-500 transition group-hover:text-purple-300" />
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
