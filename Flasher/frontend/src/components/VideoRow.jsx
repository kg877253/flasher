import { Link } from "react-router-dom";
import { timeAgo, formatDuration, formatViews } from "../utils/formatters";

export default function VideoRow({ video }) {
  return (
    <Link
      to={`/videos/${video._id}`}
      className="flex gap-3 rounded-xl p-1.5 hover:bg-white/5"
    >
      {/* Thumbnail with duration badge */}
      <div className="relative aspect-video w-44 shrink-0 overflow-hidden rounded-lg bg-gray-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-xs font-medium">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Details: takes all the remaining width */}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug">
          {video.title}
        </h3>
        <p className="mt-1 text-sm text-gray-400">{video.owner?.username}</p>
        <p className="text-sm text-gray-400">
          {formatViews(video.views)} • {timeAgo(video.createdAt)}
        </p>
      </div>
    </Link>
  );
}