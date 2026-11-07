import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getUserChannelProfile } from "../api/user.api";
import { toggleSubscription } from "../api/subscription.api";
import { formatSubscribers } from "../utils/formatters";

export default function VideoOwner({ owner }) {
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // Get the subscribers count and subscribe status of this channel
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const data = await getUserChannelProfile(owner.username);
        setChannel(data);
      } catch (err) {
        console.error("Failed to load channel info", err);
      }
    };

    fetchChannel();
  }, [owner.username]);

  const handleSubscribe = async () => {
    if (busy) return;

    setBusy(true);
    setError(null);
    try {
      const { isSubscribed } = await toggleSubscription(owner._id);
      setChannel({
        ...channel,
        isSubscribed,
        subscribersCount: channel.subscribersCount + (isSubscribed ? 1 : -1),
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  // The backend does not allow subscribing to your own channel
  const isOwnChannel = user?._id === owner._id;

  return (
    <div className="">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={owner.avatar}
            alt={owner.username}
            className="h-10 w-10 shrink-0 rounded-full bg-gray-700 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-medium">{owner.fullname}</p>
            <p className="text-sm text-gray-400">
              {channel ? formatSubscribers(channel.subscribersCount) : `@${owner.username}`}
            </p>
          </div>
        </div>

        {channel && !isOwnChannel && (
          <button
            onClick={handleSubscribe}
            disabled={busy}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium disabled:opacity-60 ${
              channel.isSubscribed
                ? "bg-white/10 hover:bg-white/20"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {channel.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}