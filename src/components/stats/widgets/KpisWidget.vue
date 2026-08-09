<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 h-full items-stretch">
    <StatCard v-for="s in kpis" :key="s.label" :stat="s" :loading="loading" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import StatCard from "../../ui/StatCard.vue";
import { useStatsStore } from "../../../store/stats";

defineProps({ loading: Boolean });

const store = useStatsStore();

const kpis = computed(() => {
  const totals = store.stats?.totals || {};
  return [
    { label: "Reportes", value: totals.reports ?? 0, icon: "list", color: "rose" },
    { label: "Pendientes", value: totals.pending ?? 0, icon: "clock", color: "amber" },
    { label: "Resueltos", value: totals.resolved ?? 0, icon: "check", color: "emerald" },
    {
      label: "Creditos otorgados",
      value: `$${Number(totals.credits_awarded || 0).toFixed(2)}`,
      icon: "wallet",
      color: "blue",
    },
  ];
});
</script>
