import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lunali_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
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
  list: (params = {}) => api.post("/reports/list", params),
  get: (id) => api.get(`/reports/${id}`),
  create: (formData) =>
    api.post("/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) => api.put(`/reports/${id}`, data),
  resolve: (id, data) => api.put(`/reports/${id}/resolve`, data),
  delete: (id) => api.delete(`/reports/${id}`),
};

export const usersApi = {
  list: () => api.get("/users"),
  get: (id) => api.get(`/users/${id}`),
  updateBalance: (id, amount, operation) =>
    api.patch(`/users/${id}/balance`, { amount, operation }),
};

export default api;
