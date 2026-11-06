import { useEffect, useState } from "react";
import { getAllVideos } from "../api/video.api";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getAllVideos({ page: 1, limit: 12 });
        setVideos(data.allvideos);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);
  
  const grid = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  if (loading) {
    return (
      <div className={grid}>
        {Array.from({ length: 8 }, (_, i) => <VideoCardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return <p className="mt-20 text-center text-red-400">{error}</p>;
  }

  if (videos.length === 0) {
    return (
      <div className="mx-auto mt-20 max-w-md rounded-md border border-gray-500 p-6 text-center">
        <h1 className="text-2xl font-bold">No Videos available</h1>
        <p className="mt-2 text-sm text-gray-400">
          There are no videos here. Try searching for something else.
        </p>
      </div>
    );
  }

  return (
    <div className={grid}>
      {videos.map((v) => <VideoCard key={v._id} video={v} />)}
    </div>
  );
}