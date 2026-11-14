import { Link } from "react-router-dom";
import { timeAgo, formatDuration, formatViews } from "../utils/formatters";
import { PlayIcon } from "./Icons";
import { imgThumb } from "../utils/image";

// index: optional number shown on the left (used in playlists)
// action: optional button shown on hover at the right. It sits outside the Link,
// because a button inside a link is invalid HTML.
export default function VideoRow({ video, index, action }) {
  return (
    <div className="group relative">
      <Link
        to={`/videos/${video._id}`}
        className={`flex items-start gap-3 rounded-xl p-1.5 outline-none transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-purple-400 ${action ? "pr-12" : ""
          }`}
      >
        {index !== undefined && (
          <span className="w-6 shrink-0 self-center text-center text-sm text-gray-500 transition-colors group-hover:text-white">
            {index}
          </span>
        )}

        {/* Thumbnail with duration badge */}
        <div className="relative aspect-video w-44 shrink-0 overflow-hidden rounded-lg bg-gray-800">
          <img
            src={imgThumb(video.thumbnail, 560)}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-9 w-9 scale-90 items-center justify-center rounded-full bg-white/90 text-black transition-transform duration-300 group-hover:scale-100">
              <PlayIcon size={16} />
            </span>
          </span>
          <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-xs font-medium">
            {formatDuration(video.duration)}
          </span>
        </div>

        {/* Details: takes all the remaining width */}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-purple-300">
            {video.title}
          </h3>
          <p className="mt-1 text-sm text-gray-400">{video.owner?.username}</p>
          <p className="text-sm text-gray-400">
            {formatViews(video.views)} • {timeAgo(video.createdAt)}
          </p>
        </div>
      </Link>

      {action && (
        <div className="absolute right-2 top-2 opacity-100 transition-opacity focus-within:opacity-100 md:opacity-0 md:group-hover:opacity-100">
          {action}
        </div>
      )}
    </div>
  );
}