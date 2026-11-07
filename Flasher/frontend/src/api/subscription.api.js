import api from "./axios";

export const toggleSubscription = async (channelId) => {
  const res = await api.post(`/subscriptions/c/${channelId}`);
  return res.data.data; // { isSubscribed }
};