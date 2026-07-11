import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { reportsApi } from "../api/axios";
import { useAuthStore } from "./auth";

export const useReportsStore = defineStore("reports", () => {
  const reports = ref([]);
  const currentReport = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const filters = reactive({ search: "", status: "" });
  const pagination = reactive({ total: 0, pages: 1, page: 1 });
  const total = computed(() => pagination.total);

  async function fetchReports(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const authStore = useAuthStore();
      const queryParams = {
        page: params.page || 1,
        search: params.search || "",
        status: params.status || "",
        userid: authStore.user?._id,
        role: authStore.user?.role,
      };
      const { data } = await reportsApi.list(queryParams);
      reports.value = Array.isArray(data) ? data : data?.reports || [];
      pagination.total = reports.value.length;
      pagination.pages = Math.ceil(reports.value.length / 50) || 1;
      pagination.page = queryParams.page;
    } catch (err) {
      error.value = err.response?.data?.message || "Error al cargar reportes";
    } finally {
      loading.value = false;
    }
  }

  async function fetchMyReports(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const authStore = useAuthStore();
      const query = {
        page: params.page || 1,
        search: params.search || filters.search,
        status: params.status || filters.status,
        userid: authStore.user?._id,
      };
      const { data } = await reportsApi.list(query);
      reports.value = Array.isArray(data) ? data : data?.reports || [];
      pagination.total = reports.value.length;
      pagination.pages = Math.ceil(reports.value.length / 50) || 1;
      pagination.page = query.page;
    } catch (err) {
      error.value = err.response?.data?.message || "Error al cargar reportes";
    } finally {
      loading.value = false;
    }
  }

  async function fetchAdminUsers() {
    try {
      const { data } = await reportsApi.list({ all: true, role: "admin" });
      const reports = Array.isArray(data) ? data : [];
      const userIds = new Map();
      reports.forEach((r) => {
        if (r.user?._id) {
          if (!userIds.has(r.user._id)) {
            userIds.set(r.user._id, {
              _id: r.user._id,
              name: r.user.name || r.user.username || "Usuario",
              role: r.user.role || "user",
              reportCount: 0,
            });
          }
          userIds.get(r.user._id).reportCount++;
        }
      });
      return Array.from(userIds.values());
    } catch {
      return [];
    }
  }

  async function fetchAdminReports() {
    try {
      const authStore = useAuthStore();
      const { data } = await reportsApi.list({ all: true, role: authStore.user?.role });
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  async function fetchReport(id) {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await reportsApi.get(id);
      currentReport.value = data;
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || "Reporte no encontrado";
      currentReport.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createReport(formData) {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await reportsApi.create(formData);
      reports.value.unshift(data);
      return { success: true, data };
    } catch (err) {
      error.value = err.response?.data?.message || "Error al crear reporte";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function updateReport(id, payload) {
    try {
      const { data } = await reportsApi.update(id, payload);
      updateLocal(data);
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error al actualizar reporte",
      };
    }
  }

  async function updateStatus(id, status) {
    try {
      await reportsApi.update(id, { status });
      updateLocalStatus(id, status);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error al actualizar estado",
      };
    }
  }

  async function resolveReport(id, payload) {
    try {
      await reportsApi.resolve(id, payload);
      await fetchReports({ page: pagination.page });
      if (currentReport.value && currentReport.value._id === id) {
        await fetchReport(id);
      }
      return { success: true, message: "Reporte resuelto correctamente." };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error al resolver reporte",
      };
    }
  }

  async function updateResolution(id, payload) {
    try {
      await reportsApi.resolve(id, payload);
      await fetchReports({ page: pagination.page });
      if (currentReport.value && currentReport.value._id === id) {
        await fetchReport(id);
      }
      return { success: true, message: "Resolución actualizada." };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error al actualizar resolución",
      };
    }
  }

  async function deleteReport(id) {
    try {
      await reportsApi.delete(id);
      reports.value = reports.value.filter((r) => r._id !== id);
      if (currentReport.value && currentReport.value._id === id) {
        currentReport.value = null;
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error al eliminar reporte",
      };
    }
  }

  function updateLocal(updated) {
    const idx = reports.value.findIndex((r) => r._id === updated._id);
    if (idx !== -1) reports.value[idx] = updated;
    if (currentReport.value && currentReport.value._id === updated._id) {
      currentReport.value = updated;
    }
  }

  function updateLocalStatus(id, status) {
    const idx = reports.value.findIndex((r) => r._id === id);
    if (idx !== -1) reports.value[idx].status = status;
    if (currentReport.value && currentReport.value._id === id) {
      currentReport.value.status = status;
    }
  }

  function resetFilters() {
    filters.search = "";
    filters.status = "";
  }

  return {
    reports,
    currentReport,
    loading,
    error,
    filters,
    pagination,
    total,
    fetchReports,
    fetchMyReports,
    fetchAdminUsers,
    fetchAdminReports,
    fetchReport,
    createReport,
    updateReport,
    updateStatus,
    resolveReport,
    updateResolution,
    deleteReport,
    resetFilters,
  };
});
