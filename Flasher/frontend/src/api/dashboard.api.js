import api from "./axios";

export const getChannelStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data.data; // { totalVideos, totalViews, totalSubscribers, totalLikes }
};

// Own videos, published and unpublished
export const getChannelVideos = async () => {
  const res = await api.get("/dashboard/videos");
  return res.data.data;
};