import api from "./axios";

export const getAllVideos = async (params) => {
  const res = await api.get("/videos", { params });
  return res.data.data; // { allvideos, page, hasNextPage, ... }
};