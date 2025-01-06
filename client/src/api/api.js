import axios from "axios";
import { refreshToken } from "./authApi";

const API_URL = import.meta.env.VITE_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    // Try to refresh the token only once
    if (error?.response?.status === 401 && !originalRequest?.sent) {
      originalRequest.sent = true;
      try {
        await refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
