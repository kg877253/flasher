import { useState } from "react";
import { toggleVideoLike } from "../api/like.api";
import { LikeIcon } from "./Icons";
import { toast } from "sonner";

export default function LikeButton({ videoId, initialLiked, initialCount }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  const handleLike = async () => {
    if (busy) return;

    setBusy(true);
    try {
      const { isLiked } = await toggleVideoLike(videoId);
      setLiked(isLiked);
      setCount(count + (isLiked ? 1 : -1));
      toast.success(isLiked ? "Added to your liked videos" : "Removed from your liked videos");
    } catch (err) {
      console.error("Failed to like the video", err);
      toast.error("Could not update your like. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={busy}
      className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium disabled:opacity-60 ${
        liked ? "bg-purple-500 hover:bg-purple-600" : "bg-white/10 hover:bg-white/20"
      }`}
    >
      <LikeIcon size={20} fill={liked ? "currentColor" : "none"} />
      {count}
    </button>
  );
}