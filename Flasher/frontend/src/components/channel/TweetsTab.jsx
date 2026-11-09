import { useEffect, useState } from "react";
import { getUserTweets } from "../../api/tweet.api";
import { timeAgo } from "../../utils/formatters";
import EmptyState from "./EmptyState";
import { UserIcon } from "../Icons";

// The backend does not populate the tweet owner, so we use the channel info we already have
export default function TweetsTab({ channel }) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchTweets = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getUserTweets(channel._id);
        if (!ignore) setTweets(data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Failed to load tweets");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchTweets();
    return () => {
      ignore = true;
    };
  }, [channel._id]);

  if (loading) {
    return (
      <div className="max-w-2xl space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-800" />
        ))}
      </div>
    );
  }

  if (error) return <p className="mt-10 text-center text-red-400">{error}</p>;

  if (tweets.length === 0) {
    return (
      <EmptyState
        icon={UserIcon}
        title="No tweets yet"
        text="This channel has not posted any tweets."
      />
    );
  }

  return (
    <div className="max-w-2xl space-y-3">
      {tweets.map((tweet, i) => (
        <article
          key={tweet._id}
          className="fade-up rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/[0.07]"
          style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
        >
          <div className="flex items-center gap-3">
            <img
              src={channel.avatar}
              alt={channel.username}
              className="h-9 w-9 shrink-0 rounded-full bg-gray-700 object-cover"
            />
            <div className="min-w-0 text-sm">
              <span className="font-medium">{channel.fullname}</span>
              <span className="text-gray-400">
                {" "}
                @{channel.username} • {timeAgo(tweet.createdAt)}
              </span>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap break-words">{tweet.content}</p>
        </article>
      ))}
    </div>
  );
}