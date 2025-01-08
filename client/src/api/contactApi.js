import api from "./api";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getContactForm = async () => {
  try {
    const response = await api.get(`${API_URL}/contact`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendContactForm = async (formData) => {
  try {
    const response = await api.post(`${API_URL}/contact`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
