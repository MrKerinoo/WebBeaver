import api from "./api";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const uploadPicture = async (formData) => {
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

export const uploadInvoice = async (fileData) => {
  try {
    const response = await api.post(
      `${API_URL}/files/upload/invoice`,
      fileData,
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

export const getFiles = async (userData) => {
  try {
    const response = await api.post(`${API_URL}/uploads/files`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInvoices = async () => {
  try {
    const response = await api.get(`${API_URL}/uploads/files`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateInvoice = async (id, userData) => {
  try {
    const response = await api.put(`${API_URL}/invoices/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteInvoice = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
