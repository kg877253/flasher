import api from "./axios";

export const registerUser = async (formData) => {
  const res = await api.post("/users/register", formData);
  return res.data.data;
};

export const loginUser = async (credentials) => {
  const res = await api.post("/users/login", credentials);
  return res.data.data; // { user, accessToken, refreshToken }
};

export const logoutUser = async () => {
  await api.post("/users/logout");
};

export const getCurrentUser = async () => {
  const res = await api.get("/users/current-user");
  return res.data.data;
};

export const getUserChannelProfile = async (username) => {
  const res = await api.get(`/users/channel/${username}`);
  return res.data.data; // { fullname, username, avatar, subscribersCount, isSubscribed, ... }
};

export const searchUsers = async (query) => {
  const res = await api.get("/users/search", { params: { query } });
  return res.data.data;
};

export const getWatchHistory = async () => {
  const res = await api.get("/users/watch-history");
  return res.data.data;
};

export const changePassword = async (data) => {
  const res = await api.post("/users/change-password", data);
  return res.data.data;
};

export const updateAccountDetails = async (data) => {
  const res = await api.patch("/users/update-account-details", data);
  return res.data.data;
};

export const updateAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await api.patch("/users/update-avatar", formData);
  return res.data.data;
};

export const updateCoverImage = async (file) => {
  const formData = new FormData();
  formData.append("coverImage", file);
  const res = await api.patch("/users/update-cover-image", formData);
  return res.data.data;
};