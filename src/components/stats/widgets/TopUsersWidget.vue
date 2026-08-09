<template>
  <ChartBox type="bar" :options="opts" :series="series" :loading="loading" :empty="empty" />
</template>

<script setup>
import { computed } from "vue";
import ChartBox from "../ChartBox.vue";
import { useApexTheme } from "../apexTheme";
import { useStatsStore } from "../../../store/stats";

defineProps({ loading: Boolean });

const store = useStatsStore();
const theme = useApexTheme();

const users = computed(() => store.stats?.topUsers || []);
const empty = computed(() => users.value.length === 0);

const names = computed(() => users.value.map((u) => u.name || u.username || "Usuario"));
const balances = computed(() => users.value.map((u) => Number(u.balance || 0)));

const series = computed(() => [{ name: "Saldo", data: balances.value }]);

const opts = computed(() => {
  const t = theme.value;
  return {
    chart: {
      type: "bar",
      background: "transparent",
      fontFamily: "inherit",
      toolbar: { show: false },
    },
    colors: [t.colors.info],
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "60%" } },
    grid: t.grid,
    xaxis: {
      categories: names.value,
      labels: { ...t.axisLabels, formatter: (v) => `$${Number(v).toFixed(0)}` },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { ...t.axisLabels, style: { ...t.axisLabels.style, fontSize: "10px" } } },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      theme: t.tooltipTheme,
      y: { formatter: (v) => `$${Number(v).toFixed(2)}` },
    },
  };
});
</script>
