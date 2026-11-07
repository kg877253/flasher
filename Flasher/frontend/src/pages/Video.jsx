import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/video.api";
import { timeAgo, formatViews } from "../utils/formatters";
import SuggestedVideos from "../components/SuggestedVideos";
import Comments from "../components/Comments";
import VideoOwner from "../components/VideoOwner";

export default function Video() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getVideoById(id);
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
      {/* Left side: player, details and comments */}
      <div className="min-w-0">
        <video
          className="aspect-video w-full rounded-xl bg-black"
          poster={video.thumbnail}
          src={video.videoFile}
          controls
        />

        <h1 className="mt-3 text-xl font-semibold">{video.title}</h1>

        <VideoOwner owner={video.owner} />

        <div className="mt-4 rounded-xl bg-white/10 p-3 text-sm">
          <p className="font-medium">
            {formatViews(video.views)} • {timeAgo(video.createdAt)}
          </p>
          <p className="mt-2 whitespace-pre-line text-gray-200">{video.description}</p>
        </div>

        <Comments videoId={id} />
      </div>

      {/* Right side: other videos */}
      <div className="min-w-0">
        <SuggestedVideos currentVideoId={id} />
      </div>
    </div>
  );
}