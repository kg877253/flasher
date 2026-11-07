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