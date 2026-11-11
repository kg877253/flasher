import api from "./axios";

export const toggleSubscription = async (channelId) => {
  const res = await api.post(`/subscriptions/c/${channelId}`);
  return res.data.data; // { isSubscribed }
};

export const getSubscribedChannels = async (subscriberId) => {
  const res = await api.get(`/subscriptions/u/${subscriberId}`);
  return res.data.data.subscribedChannels; // [ { subscriber, channel, channelDetails: { _id, username, fullname, avatar } } ]
};

export const getChannelSubscribers = async (channelId) => {
  const res = await api.get(`/subscriptions/c/${channelId}`);
  return res.data.data.subscribers;
};