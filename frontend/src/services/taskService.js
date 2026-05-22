import axios from 'axios';

const API_URL = '/api/tasks';

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Get all tasks
export const getTasks = async (token) => {
  const response = await axios.get(API_URL, getConfig(token));
  return response.data;
};

// Create a task
export const createTask = async (taskData, token) => {
  const response = await axios.post(API_URL, taskData, getConfig(token));
  return response.data;
};

// Update a task
export const updateTask = async (id, taskData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData, getConfig(token));
  return response.data;
};

// Delete a task
export const deleteTask = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, getConfig(token));
  return response.data;
};
