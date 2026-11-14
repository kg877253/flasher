import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubscribedChannels } from "../../api/subscription.api";
import EmptyState from "./EmptyState";
import { SubscribersIcon } from "../Icons";
import { imgAvatar } from "../../utils/image";

const grid = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";

export default function FollowingTab({ channelId }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchFollowing = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getSubscribedChannels(channelId);
        // channelDetails can be missing if that user was deleted, so skip those
        if (!ignore) setChannels(data.filter((item) => item.channelDetails));
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Failed to load channels");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchFollowing();
    return () => {
      ignore = true;
    };
  }, [channelId]);

  if (loading) {
    return (
      <div className={grid}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-44 shimmer rounded-2xl bg-gray-800" />
        ))}
      </div>
    );
  }

  if (error) return <p className="mt-10 text-center text-red-400">{error}</p>;

  if (channels.length === 0) {
    return (
      <EmptyState
        icon={SubscribersIcon}
        title="Not following anyone"
        text="This channel has not subscribed to any channels yet."
      />
    );
  }

  return (
    <div className={grid}>
      {channels.map((item, i) => {
        const c = item.channelDetails;
        return (
          <Link
            key={c._id}
            to={`/users/channel/${c.username}`}
            className="fade-up group flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
            style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
          >
            <img
              src={imgAvatar(c.avatar)}
              alt={c.username}
              className="h-20 w-20 rounded-full bg-gray-700 object-cover ring-2 ring-white/10 transition group-hover:ring-white/40"
            />
            <p className="mt-3 w-full truncate font-medium">{c.fullname}</p>
            <p className="w-full truncate text-sm text-gray-400">@{c.username}</p>
          </Link>
        );
      })}
    </div>
  );
}