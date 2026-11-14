import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/video.api";
import { timeAgo, formatViews } from "../utils/formatters";
import SuggestedVideos from "../components/SuggestedVideos";
import Comments from "../components/Comments";
import VideoOwner from "../components/VideoOwner";
import LikeButton from "../components/LikeButton";
import SaveToPlaylist from "../components/SaveToPlaylist";

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

  if (loading)
    return (
      <div className="grid shimmer grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0">
          <div className="aspect-video w-full rounded-xl bg-gray-800" />
          <div className="mt-3 h-6 w-3/4 rounded bg-gray-800" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gray-800" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-gray-800" />
                <div className="h-3 w-20 rounded bg-gray-800" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 rounded-full bg-gray-800" />
              <div className="h-9 w-20 rounded-full bg-gray-800" />
            </div>
          </div>
          <div className="mt-4 space-y-2 rounded-xl bg-white/5 p-3">
            <div className="h-4 w-1/3 rounded bg-gray-800" />
            <div className="h-3 w-full rounded bg-gray-800" />
            <div className="h-3 w-2/3 rounded bg-gray-800" />
          </div>
          <div className="mt-6 space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-gray-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-gray-800" />
                  <div className="h-3 w-full rounded bg-gray-800" />
                  <div className="h-3 w-3/4 rounded bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="min-w-0 space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="aspect-video w-40 shrink-0 rounded-lg bg-gray-800" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-full rounded bg-gray-800" />
                <div className="h-3 w-2/3 rounded bg-gray-800" />
                <div className="h-3 w-1/2 rounded bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

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

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <VideoOwner owner={video.owner} />
          <div className="flex items-center gap-2">
            <LikeButton
              videoId={video._id}
              initialLiked={video.isLiked}
              initialCount={video.likesCount}
            />
            <SaveToPlaylist videoId={video._id} />
          </div>
        </div>

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