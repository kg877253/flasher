import api from "./axios";

export const getCommentsByVideoId = async (videoId) => {
  const res = await api.get(`/comments/${videoId}`);
  return res.data.data;
};