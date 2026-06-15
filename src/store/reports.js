import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { reportsApi, authApi } from "../api/axios";
import { useAuthStore } from "./auth";

export const useReportsStore = defineStore("reports", () => {
  const reports = ref([]);
  const currentReport = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const filters = reactive({
    search: "",
    status: "",
  });

  const pagination = reactive({
    total: 0,
    pages: 1,
    page: 1,
  });

  const total = computed(() => pagination.total);

  async function fetchReports(page = 1) {
    loading.value = true;
    error.value = null;
    try {
      const authStore = useAuthStore();
      const params = {
        page,
        search: filters.search,
        status: filters.status,
        userid: authStore.user?._id,
        role: authStore.user?.role,
      };
      const { data } = await reportsApi.list(params);
      reports.value = data.reports || data;
      pagination.total = data.total ?? reports.value.length;
      pagination.pages = data.pages ?? 1;
      pagination.page = page;
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
      const query = { page: params.page || 1, search: params.search || filters.search, status: params.status || filters.status, userid: authStore.user?._id };
      const { data } = await reportsApi.list(query);
      reports.value = data.reports || data;
      pagination.total = data.total ?? reports.value.length;
      pagination.pages = data.pages ?? 1;
      pagination.page = query.page;
    } catch (err) {
      error.value = err.response?.data?.message || "Error al cargar reportes";
    } finally {
      loading.value = false;
    }
  }

  async function fetchAdminUsers() {
    try {
      const { data } = await authApi.me();
      return [];
    } catch {
      return [];
    }
  }

  async function fetchAdminReports() {
    try {
      const { data } = await reportsApi.list({ all: true });
      return data.reports || data || [];
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
      await fetchReports(pagination.page);
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
      await fetchReports(pagination.page);
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
    if (idx !== -1) {
      reports.value[idx] = updated;
    }
    if (currentReport.value && currentReport.value._id === updated._id) {
      currentReport.value = updated;
    }
  }

  function updateLocalStatus(id, status) {
    const idx = reports.value.findIndex((r) => r._id === id);
    if (idx !== -1) {
      reports.value[idx].status = status;
    }
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
