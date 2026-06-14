import { defineStore } from "pinia";
import { ref } from "vue";
import { reportsApi } from "../api/axios";

export const useReportsStore = defineStore("reports", () => {
  const reports = ref([]);
  const currentReport = ref(null);

  const loading = ref(false);
  const error = ref(null);

  async function fetchReports() {
    loading.value = true;

    try {
      const { data } = await reportsApi.list();

      reports.value = data;
    } catch (err) {
      error.value = err.response?.data?.message || "Error al cargar reportes";
    } finally {
      loading.value = false;
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

  // ─────────────────────────────────────────────
  // CREATE REPORT
  // ─────────────────────────────────────────────

  async function createReport(formData) {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await reportsApi.create(formData);

      reports.value.unshift(data);

      return {
        success: true,
        data,
      };
    } catch (err) {
      error.value = err.response?.data?.message || "Error al crear reporte";

      return {
        success: false,
        message: error.value,
      };
    } finally {
      loading.value = false;
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE REPORT
  // ─────────────────────────────────────────────

  async function updateReport(id, payload) {
    try {
      const { data } = await reportsApi.update(id, payload);

      updateLocal(data);

      return {
        success: true,
        data,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error al actualizar reporte",
      };
    }
  }

  // ─────────────────────────────────────────────
  // RESOLVE REPORT
  // ─────────────────────────────────────────────

  async function resolveReport(id, payload) {
    try {
      const { data } = await reportsApi.resolve(id, payload);

      await fetchReports();

      return {
        success: true,
        data,
        message: data.message,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error al resolver reporte",
      };
    }
  }

  // ─────────────────────────────────────────────
  // DELETE REPORT
  // ─────────────────────────────────────────────

  async function deleteReport(id) {
    try {
      await reportsApi.delete(id);

      reports.value = reports.value.filter((r) => r._id !== id);

      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error al eliminar reporte",
      };
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE LOCAL STATE
  // ─────────────────────────────────────────────

  function updateLocal(updated) {
    const idx = reports.value.findIndex((r) => r._id === updated._id);

    if (idx !== -1) {
      reports.value[idx] = updated;
    }

    if (currentReport.value && currentReport.value._id === updated._id) {
      currentReport.value = updated;
    }
  }

  // ─────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────

  return {
    reports,
    currentReport,

    loading,
    error,

    fetchReports,
    fetchReport,

    createReport,
    updateReport,
    resolveReport,
    deleteReport,
  };
});
