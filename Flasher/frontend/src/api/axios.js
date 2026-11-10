import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials:true,
});

let refreshing = null;

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
      refreshing ||= api.post("/users/refresh-token");
      await refreshing;
      refreshing = null;
      return api(request);
    } catch (refreshError) {
      refreshing = null;
      window.dispatchEvent(new Event("auth:expired"));
      return Promise.reject(refreshError);
    }
  }
);

export default api;