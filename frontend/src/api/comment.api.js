import api from "./axios";

export const getCommentsByVideoId = async (videoId, params) => {
  const res = await api.get(`/comments/${videoId}`, { params });
  return res.data.data; // { docs, totalDocs, page, hasNextPage, ... }
};

export const addComment = async (videoId, content) => {
  const res = await api.post(`/comments/${videoId}`, { content });
  return res.data.data;
};

export const updateComment = async (commentId, content) => {
  const res = await api.patch(`/comments/c/${commentId}`, { content });
  return res.data.data;
};

export const deleteComment = async (commentId) => {
  await api.delete(`/comments/c/${commentId}`);
};