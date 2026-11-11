import api from "./axios";

export const getUserTweets = async (userId) => {
  const res = await api.get(`/tweets/user/${userId}`);
  return res.data.data; // [ { _id, content, owner, createdAt, updatedAt } ]
};

export const createTweet = async (content) => {
  const res = await api.post("/tweets", { content });
  return res.data.data;
};

export const updateTweet = async (tweetId, content) => {
  const res = await api.patch(`/tweets/${tweetId}`, { content });
  return res.data.data;
};

export const deleteTweet = async (tweetId) => {
  await api.delete(`/tweets/${tweetId}`);
};

export const toggleTweetLike = async (tweetId) => {
  const res = await api.post(`/likes/toggle/t/${tweetId}`);
  return res.data.data;
};