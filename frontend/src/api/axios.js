import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
});

let refreshing = null;

export const refreshSession = () => {
  refreshing ||= api.post("/users/refresh-token").finally(() => {
    refreshing = null;
  });
  return refreshing;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    if (
      error.response?.status !== 401 ||
      request?._retry ||
      request?.url?.includes("/users/refresh-token") ||
      request?.url?.includes("/users/current-user")
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
    await refreshSession();
    return api(request);
    } catch (refreshError) {
    window.dispatchEvent(new Event("auth:expired"));
      return Promise.reject(refreshError);
    }
  }
);

export default api;