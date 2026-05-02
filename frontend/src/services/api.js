import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Called after Firebase register — creates Supabase profile
  register: (profileData) => api.post('/auth/register', profileData),
  // Called after Firebase login — returns existing Supabase profile (404 if missing)
  login: () => api.post('/auth/login'),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  saveProfile: (data) => api.post('/users/profile', data),
};

export const stepService = {
  getAll: () => api.get('/steps'),
  getProgress: () => api.get('/steps/progress'),
  updateProgress: (stepId, data) => api.put(`/steps/progress/${stepId}`, data),
};

export const vacancyService = {
  getAll: (params) => api.get('/vacancies', { params }),
  getOne: (id) => api.get(`/vacancies/${id}`),
  getMine: () => api.get('/vacancies/mine'),
  create: (data) => api.post('/vacancies', data),
  update: (id, data) => api.put(`/vacancies/${id}`, data),
  close: (id) => api.delete(`/vacancies/${id}`),
};

export const applicationService = {
  apply: (data) => api.post('/applications', data),
  getMine: () => api.get('/applications/mine'),
  getForVacancy: (vacancyId) => api.get(`/applications/vacancy/${vacancyId}`),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};

export default api;
