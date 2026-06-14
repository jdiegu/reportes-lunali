import axios from "axios";
import { useAuthStore } from "../store/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lunali_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("lunali_token");
      localStorage.removeItem("lunali_user");

      window.location.href = "/login";
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
  list: () => {
    const authStore = useAuthStore();

    return api.post("/reports/list", {
      userid: authStore.user?._id,
      role: authStore.user?.role,
    });
  },

  get: (id) => api.get(`/reports/${id}`),

  create: (formData) =>
    api.post("/reports", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  update: (id, data) => api.put(`/reports/${id}`, data),

  resolve: (id, data) => api.patch(`/reports/${id}`, data),

  delete: (id) => api.delete(`/reports/${id}`),
};
// ─────────────────────────────────────────────

export default api;
