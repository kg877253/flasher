import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/video.api";

export default function Video() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    // fetch video by id
    const fetchVideo = async () => {
      try {
        const res = await getVideoById(id);
        setVideo(res.data.data.videoFile);
        console.log("video data", res.data.data.videoFile);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    }
    fetchVideo();
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold">Video id : {id}</h1>
      <video className="w-fit h-[500px]" src={video} controls></video>
    </>
  )

}