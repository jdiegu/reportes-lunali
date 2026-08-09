import axios from "axios";
import { STORAGE_KEYS } from "../config/constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (credentials) => api.post("/auth/register", credentials),
  me: () => api.get("/auth/me"),
};

export const reportsApi = {
  list: (params = {}) => api.post("/reports/list", params),
  get: (id) => api.get(`/reports/${id}`),
  stats: () => api.get("/reports/stats"),
  create: (formData) =>
    api.post("/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data, config) => api.put(`/reports/${id}`, data, config),
  resolve: (id, data) => api.put(`/reports/${id}/resolve`, data),
  delete: (id) => api.delete(`/reports/${id}`),
};

export const usersApi = {
  list: () => api.get("/users"),
  get: (id) => api.get(`/users/${id}`),
  updateOwn: (data) => api.put("/users/me", data),
  adminUpdate: (id, data) => api.put(`/users/${id}`, data),
  adminResetPassword: (id, newPassword) => api.put(`/users/${id}`, { password: newPassword }),
  updateBalance: (id, amount, operation) =>
    api.patch(`/users/${id}/balance`, { amount, operation }),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`),
  deactivate: (id) => api.put(`/users/${id}/deactivate`),
  activate: (id) => api.put(`/users/${id}/activate`),
};

export const platformsApi = {
  list: () => api.get("/platforms"),
  listAll: () => api.get("/platforms/all"),
  create: (data) => api.post("/platforms", data),
  update: (id, data) => api.put(`/platforms/${id}`, data),
  delete: (id) => api.delete(`/platforms/${id}`),
};

export const notificationsApi = {
  list: () => api.get("/notifications"),
  unreadCount: () => api.get("/notifications/unread"),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};

export default api;
