import api from "./api";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const uploadFile = async (formData) => {
  try {
    const response = await api.post(
      `${API_URL}/files/upload/picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
