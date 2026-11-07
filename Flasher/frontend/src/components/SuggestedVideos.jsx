import { useEffect, useState } from "react";
import { getAllVideos } from "../api/video.api";
import VideoRow from "./VideoRow";

export default function SuggestedVideos({ currentVideoId }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get videos from the backend once
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getAllVideos({ limit: 10 });
        setVideos(data.allvideos);
      } catch (err) {
        console.error("Failed to load suggested videos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading...</p>;
  }

  // Remove the video that is already playing
  const otherVideos = videos.filter((video) => video._id !== currentVideoId);

  if (otherVideos.length === 0) {
    return <p className="text-gray-400">No more videos</p>;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {otherVideos.map((video) => (
        <VideoRow key={video._id} video={video} />
      ))}
    </div>
  );
}