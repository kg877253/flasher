import api from "./axios";

export const getUserPlaylists = async (userId) => {
  const res = await api.get(`/playlists/user/${userId}`);
  return res.data.data; // [ { _id, name, description, videos: [ { _id, thumbnail, title, duration, views } ], updatedAt } ]
};

export const getPlaylistById = async (playlistId) => {
  const res = await api.get(`/playlists/${playlistId}`);
  return res.data.data; // { _id, name, description, owner: { _id, username, fullname, avatar }, videos: [...], updatedAt }
};

export const updatePlaylist = async (playlistId, data) => {
  const res = await api.patch(`/playlists/${playlistId}`, data); // data: { name, description }
  return res.data.data; // updated playlist (videos are only ids here)
};

// Careful: the backend route order is videoId first, then playlistId
export const removeVideoFromPlaylist = async (videoId, playlistId) => {
  const res = await api.patch(`/playlists/remove/${videoId}/${playlistId}`);
  return res.data.data;
};

export const deletePlaylist = async (playlistId) => {
  const res = await api.delete(`/playlists/${playlistId}`);
  return res.data.data;
};

export const createPlaylist = async (data) => {
  const res = await api.post("/playlists", data); // data: { name, description }
  return res.data.data; // { _id, name, description, owner, videos: [] }
};

// Careful: the backend route order is videoId first, then playlistId
export const addVideoToPlaylist = async (videoId, playlistId) => {
  const res = await api.patch(`/playlists/add/${videoId}/${playlistId}`);
  return res.data.data;
};