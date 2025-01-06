import api from "./api";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const loginUser = async (userData) => {
  try {
    const response = await api.post(`${API_URL}/auth/login`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await api.delete(`${API_URL}/auth/logout`);
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post(`${API_URL}/auth/refresh-token`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateAccessToken = async (userData) => {
  try {
    const response = await api.post(`${API_URL}/auth/validate-token`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
