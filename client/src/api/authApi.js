import api from "./api";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const loginUser = async (userData) => {
  try {
    const response = await api.post(`${API_URL}auth/login`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const authToken = async () => {
  try {
    await api.post(`${API_URL}auth/token`);
  } catch (error) {
    throw error;
  }
};
