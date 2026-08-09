import { defineStore } from "pinia";
import { ref } from "vue";
import { reportsApi } from "../api/axios";

export const useStatsStore = defineStore("stats", () => {
  const stats = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchStats() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await reportsApi.stats();
      stats.value = data;
      return data;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error al cargar las estadisticas";
      return null;
    } finally {
      loading.value = false;
    }
  }

  return { stats, loading, error, fetchStats };
});
