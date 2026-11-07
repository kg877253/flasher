import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/video.api";
import { timeAgo, formatViews } from "../utils/formatters";
import SuggestedVideos from "../components/SuggestedVideos";
import {getCommentsByVideoId} from "../api/comment.api";

export default function Video() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getVideoById(id);
        const commentsData = await getCommentsByVideoId(id);
        setComments(commentsData);
        console.log("Comments data:", commentsData);
        setVideo(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* Left side: player, details and comments  */}
      <div className="min-w-0">
        <video
          className="aspect-video w-full rounded-xl bg-black"
          poster={video.thumbnail}
          src={video.videoFile}
          controls
        />

        <h1 className="mt-3 text-xl font-semibold">{video.title}</h1>

        <div className="mt-3 flex items-center gap-3">
          <img
            src={video.owner?.avatar}
            alt={video.owner?.username}
            className="h-10 w-10 rounded-full bg-gray-700 object-cover"
          />
          <div>
            <p className="font-medium">{video.owner?.fullname}</p>
            <p className="text-sm text-gray-400">@{video.owner?.username}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-white/10 p-3 text-sm">
          <p className="font-medium">
            {formatViews(video.views)} • {timeAgo(video.createdAt)}
          </p>
          <p className="mt-2 whitespace-pre-line text-gray-200">{video.description}</p>
        </div>

        <div className="comments">
          <h2 className="mt-6 text-lg font-semibold">Comments</h2>
          {comments.length === 0 ? (
            <p className="mt-2 text-gray-400">No comments yet.</p>
          ) : (
            <ul className="mt-2 space-y-4">
              {comments.map((comment) => (
                <li key={comment._id} className="flex gap-3">
                  <img
                    src={comment.owner?.avatar}
                    alt={comment.owner?.username}
                    className="h-8 w-8 rounded-full bg-gray-700 object-cover"
                  />
                  <div>
                    <p className="font-medium">{comment.owner?.fullname}</p>
                    <p className="text-sm text-gray-400">@{comment.owner?.username}</p>
                    <p className="mt-1 text-gray-200">{comment.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right side: other videos */}
      <div className="min-w-0">
        <SuggestedVideos currentVideoId={id} />
      </div>
    </div>
  );
}