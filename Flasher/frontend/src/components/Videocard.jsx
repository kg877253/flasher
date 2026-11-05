import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video._id}`} className="group block">
      <div className="aspect-video overflow-hidden rounded-md bg-gray-800">
        {video.thumbnail && (
          <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover group-hover:scale-105 transition" />
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 font-semibold">{video.title}</h3>
      <p className="text-sm text-gray-400">
        {video.views.toLocaleString()} views
      </p>
    </Link>
  );
}