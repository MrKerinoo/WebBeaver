import api from "./api";

const API_URL = import.meta.env.VITE_APP_API_URL;

// DELETE TRY CATCH AND ERRORS BEFORE RELEASE

export const getUsers = async () => {
  try {
    const response = await api.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post(`${API_URL}/users/`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (id, userData) => {
  try {
    const response = await api.post(`${API_URL}/profiles/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
