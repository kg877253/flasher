import api from "./axios";

export const getAllVideos = async (params) => {
  const res = await api.get("/videos", { params });
  return res.data.data; // { allvideos, page, hasNextPage, ... }
};

export const getVideoById = async (id) => {
  const res = await api.get(`/videos/${id}`);

  return res.data.data; // { videoFile, title, description, ... }
}