import axios from 'axios';

const api = axios.create({
  baseURL: '/task-lists',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTaskLists = async () => {
  const response = await api.get('');
  return response.data;
};

export const getTaskList = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createTaskList = async (data) => {
  const response = await api.post('', data);
  return response.data;
};

export const updateTaskList = async (id, data) => {
  const response = await api.put(`/${id}`, data);
  return response.data;
};

export const deleteTaskList = async (id) => {
  await api.delete(`/${id}`);
};

export const getTasks = async (taskListId) => {
  const response = await api.get(`/${taskListId}/tasks`);
  return response.data;
};

export const getTask = async (taskListId, taskId) => {
  const response = await api.get(`/${taskListId}/tasks/${taskId}`);
  return response.data;
};

export const createTask = async (taskListId, data) => {
  const response = await api.post(`/${taskListId}/tasks`, data);
  return response.data;
};

export const updateTask = async (taskListId, taskId, data) => {
  const response = await api.put(`/${taskListId}/tasks/${taskId}`, data);
  return response.data;
};

export const deleteTask = async (taskListId, taskId) => {
  await api.delete(`/${taskListId}/tasks/${taskId}`);
};

export default api;

