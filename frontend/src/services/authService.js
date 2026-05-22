import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const cleanBaseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
const API_URL = `${cleanBaseUrl}/api/auth`;

// Register user
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

// Get user profile
export const getUserProfile = async (token) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
