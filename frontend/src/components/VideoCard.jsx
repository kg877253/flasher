import { useState } from "react";
import { Link } from "react-router-dom";
import { timeAgo, formatDuration, formatViews } from "../utils/formatters";
import { imgAvatar, imgThumb } from "../utils/image";

export default function VideoCard({ video, index = 0 }) {
  // The thumbnail fades in once it has loaded
  const [loaded, setLoaded] = useState(false);

  return (
    // On click, go to the video page with the video id in the url
    <Link
      to={`/videos/${video._id}`}
      className="group fade-up block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-800 ring-1 ring-white/10 transition duration-300 group-hover:ring-purple-400/50">
        <img
          src={imgThumb(video.thumbnail)}
          alt={video.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-medium backdrop-blur-sm">
          {formatDuration(video.duration)}
        </span>
      </div>

      <div className="mt-3 flex gap-3">
        <img
          src={imgAvatar(video.owner?.avatar)}
          alt={video.owner?.username}
          className="h-9 w-9 shrink-0 rounded-full bg-gray-700 object-cover"
        />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug transition-colors group-hover:text-purple-300">
            {video.title}
          </h3>
          <p className="mt-1 truncate text-sm text-gray-400">{video.owner?.username}</p>
          <p className="text-xs text-gray-500">
            {formatViews(video.views)} • {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}