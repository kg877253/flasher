import api from "./axios";

export const getUserTweets = async (userId) => {
  const res = await api.get(`/tweets/user/${userId}`);
  return res.data.data; // [ { _id, content, owner, createdAt, updatedAt } ]
};