import api from "./axios";

export const getUserPlaylists = async (userId) => {
  const res = await api.get(`/playlists/user/${userId}`);
  return res.data.data; // [ { _id, name, description, videos: [videoIds], createdAt, updatedAt } ]
};

export const getPlaylistById = async (playlistId) => {
  const res = await api.get(`/playlists/${playlistId}`);
  return res.data.data;
};