import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  toggleTweetLike,
  updateTweet,
} from "../../api/tweet.api";
import { timeAgo } from "../../utils/formatters";
import EmptyState from "./EmptyState";
import { LikeIcon, PencilIcon, TrashIcon, UserIcon } from "../Icons";
import { imgAvatar } from "../../utils/image";

const MAX_LENGTH = 80;

export default function TweetsTab({ channel }) {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [busyId, setBusyId] = useState(null);
  const isOwnChannel = user?._id === channel._id;

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

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!text.trim() || busyId) return;
    setBusyId("create");
    setError("");
    try {
      const tweet = await createTweet(text.trim());
      setTweets((current) => [tweet, ...current]);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create tweet");
    } finally {
      setBusyId(null);
    }
  };

  const handleEdit = async (tweetId) => {
    if (!editText.trim() || busyId) return;
    setBusyId(tweetId);
    setError("");
    try {
      const updated = await updateTweet(tweetId, editText.trim());
      setTweets((current) =>
        current.map((tweet) => (tweet._id === tweetId ? { ...tweet, content: updated.content } : tweet))
      );
      setEditingId(null);
      setEditText("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update tweet");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (tweetId) => {
    if (busyId || !window.confirm("Delete this tweet?")) return;
    setBusyId(tweetId);
    setError("");
    try {
      await deleteTweet(tweetId);
      setTweets((current) => current.filter((tweet) => tweet._id !== tweetId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete tweet");
    } finally {
      setBusyId(null);
    }
  };

  const handleLike = async (tweetId) => {
    if (busyId) return;
    setBusyId(tweetId);
    setError("");
    try {
      const result = await toggleTweetLike(tweetId);
      setTweets((current) =>
        current.map((tweet) =>
          tweet._id === tweetId
            ? { ...tweet, isLiked: result.isLiked }
            : tweet
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update tweet like");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      {isOwnChannel && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <textarea
            value={text}
            maxLength={MAX_LENGTH}
            onChange={(event) => setText(event.target.value)}
            placeholder="Share an update with your audience..."
            rows={3}
            className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-gray-500"
          />
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-xs text-gray-500">{text.length}/{MAX_LENGTH}</span>
            <button
              type="submit"
              disabled={busyId === "create" || !text.trim()}
              className="cursor-pointer rounded-full bg-purple-500 px-4 py-2 text-sm font-medium hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busyId === "create" ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {tweets.length === 0 ? (
        <EmptyState
          icon={UserIcon}
          title={isOwnChannel ? "No tweets yet" : "No tweets yet"}
          text={isOwnChannel ? "Share your first update with your audience." : "This channel has not posted any tweets."}
        />
      ) : (
        tweets.map((tweet, index) => {
          const editing = editingId === tweet._id;
          return (
            <article
              key={tweet._id}
              className="fade-up rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/[0.07]"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <div className="flex items-center gap-3">
                <img src={imgAvatar(channel.avatar)} alt={channel.username} className="h-9 w-9 shrink-0 rounded-full bg-gray-700 object-cover" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium">{channel.fullname}</p>
                  <p className="text-gray-400">@{channel.username} • {timeAgo(tweet.createdAt)}</p>
                </div>
                {isOwnChannel && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(tweet._id);
                        setEditText(tweet.content);
                      }}
                      className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                      aria-label="Edit tweet"
                    >
                      <PencilIcon size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tweet._id)}
                      className="rounded-full p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-300"
                      aria-label="Delete tweet"
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                )}
              </div>
              {editing ? (
                <div className="mt-3">
                  <textarea
                    autoFocus
                    value={editText}
                    maxLength={MAX_LENGTH}
                    onChange={(event) => setEditText(event.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-purple-400"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button type="button" onClick={() => setEditingId(null)} className="rounded-full px-3 py-1.5 text-xs hover:bg-white/10">
                      Cancel
                    </button>
                    <button type="button" onClick={() => handleEdit(tweet._id)} disabled={!editText.trim() || busyId === tweet._id} className="rounded-full bg-purple-500 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
                      {busyId === tweet._id ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 whitespace-pre-wrap break-words">{tweet.content}</p>
              )}
              <button
                type="button"
                onClick={() => handleLike(tweet._id)}
                disabled={busyId === tweet._id}
                className={`mt-3 inline-flex cursor-pointer items-center gap-1 text-xs transition hover:text-white ${tweet.isLiked ? "text-purple-300" : "text-gray-400"}`}
              >
                <LikeIcon size={15} />
                {tweet.isLiked ? "Liked" : "Like"}
              </button>
            </article>
          );
        })
      )}
    </div>
  );
}
