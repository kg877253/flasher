import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/video.api";
import { timeAgo } from "../utils/formatters";

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
    <div className="grid grid-cols-1 gap-4 grid-cols-1 md:grid-cols-[3fr_1.5fr] m-2">
      <div className="videosection flex flex-col gap-2">

        <video
          className="aspect-video w-full rounded-md bg-black"
          poster={video.thumbnail}
          src={video.videoFile}
          controls
        />
        <div className="videoinfo">
        <h1 className="mt-3 text-xl font-bold">{video.title}</h1>
        <p className="text-sm text-gray-400">
          {video.views.toLocaleString()} views • {timeAgo(video.createdAt)}
        </p>
        <p className="mt-3 text-sm">{video.description}</p>
        </div>
      </div>

      <div className="nextvideosection border-2 md:border-l md:border-gray-700">
        <h2 className="mb-3 text-lg font-semibold">Next Videos</h2>
      </div>
    </div>
  );
}