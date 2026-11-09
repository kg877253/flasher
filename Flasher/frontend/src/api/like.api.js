import api from "./axios";

export const toggleVideoLike = async (videoId) => {
  const res = await api.post(`/likes/toggle/v/${videoId}`);
  return res.data.data; // { isLiked }
};

export const getLikedVideos = async () => {
  const res = await api.get("/likes/videos");
  return res.data.data;
};