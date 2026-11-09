import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserChannelProfile } from "../api/user.api.js";
import { formatSubscribers } from "../utils/formatters.js";
import SpecularButton from "../components/SpecularButton.jsx";

const Channel = () => {
    const { username } = useParams();
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChannel = async () => {
            // Reset the state when we move from one channel to another
            setLoading(true);
            setError(null);
            setChannel(null);

            try {
                const data = await getUserChannelProfile(username);
                setChannel(data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError("Channel not found");
                } else {
                    setError(err.response?.data?.message || "Something went wrong");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchChannel();
    }, [username]);

    if (loading) {
        return (
            <div>
                <div className="h-32 animate-pulse rounded-xl bg-white/10 sm:h-48" />
                <div className="flex items-start gap-4 px-2 pt-3 sm:px-4">
                    <div className="-mt-10 h-20 w-20 shrink-0 animate-pulse rounded-full border-4 border-black bg-white/10 sm:-mt-14 sm:h-32 sm:w-32" />
                    <div className="flex-1 space-y-2">
                        <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
                        <div className="h-4 w-64 animate-pulse rounded bg-white/10" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-60 items-center justify-center">
                <p className="text-lg text-gray-400">{error}</p>
            </div>
        );
    }

    return (
        <div>
            {channel.coverImage ? (
                <img
                    src={channel.coverImage}
                    alt="Cover"
                    className="h-32 w-full rounded-xl object-cover sm:h-58"
                />
            ) : (
                <div className="h-32 w-full rounded-xl bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 sm:h-48" />
            )}

            {/* Info row: avatar overlaps the cover with a negative margin, text stays below it */}
            <div className="flex items-start gap-6 px-2 pt-3 sm:px-4">
                <img
                    src={channel.avatar}
                    alt={channel.username}
                    className="-mt-10 h-20 w-20 shrink-0 rounded-full border-4 border-black bg-gray-700 object-cover sm:-mt-14 sm:h-36 sm:w-36"
                />

                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-2xl font-semibold sm:text-3xl">
                        {channel.fullname}
                    </h1>
                    <p className="truncate text-sm text-gray-400 bg-red">@{channel.username}</p>
                    <p className="mt-1 text-sm text-gray-400">
                        {formatSubscribers(channel.subscribersCount)} •{" "}
                        {channel.subscribedToChannelsCount} subscribed
                    </p>
                </div>
                <div className="subscribebutton">
                    <SpecularButton
                        size="lg"
                        radius={999}
                        lineColor="#fb2c36"
                        baseColor="#fb2c36"
                        followMouse
                        proximity={250}
                    >
                        Subscribe
                    </SpecularButton>
                </div>
            </div>
        </div>
    );
};

export default Channel;