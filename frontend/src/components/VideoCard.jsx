import { Link } from "react-router-dom";
import { timeAgo, formatDuration } from "../utils/formatters";

export default function VideoCard({ video }) {
  return (
    //on clicking the video card, it will navigate to the video page with the video id in the url
    <Link to={`/videos/${video._id}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-md bg-gray-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition group-hover:scale-103"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-xs">
          {formatDuration(video.duration)}
        </span>
      </div>

      <div className="mt-2 flex gap-2">
        <img
          src={video.owner?.avatar}
          alt={video.owner?.username}
          className="h-9 w-9 shrink-0 rounded-full bg-gray-700 object-cover"
        />
        <div>
          <h3 className="line-clamp-2 font-semibold">{video.title}</h3>
          <p className="text-sm text-gray-400">{video.owner?.username}</p>
          <p className="text-sm text-gray-400">
            {video.views.toLocaleString()} views • {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}