import api from "./axios";

export const getUserPlaylists = async (userId) => {
  const res = await api.get(`/playlists/user/${userId}`);
  return res.data.data; // [ { _id, name, description, videos: [videoIds], createdAt, updatedAt } ]
};