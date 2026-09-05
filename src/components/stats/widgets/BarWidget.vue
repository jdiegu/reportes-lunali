<template>
  <ChartBox type="bar" :options="opts" :series="series" :loading="loading" :empty="empty" />
</template>

<script setup>
import { computed } from "vue";
import ChartBox from "../ChartBox.vue";
import { useApexTheme } from "../apexTheme";

const props = defineProps({
  categories: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  colorVar: { type: String, default: "--rose-primary" },
  prefix: { type: String, default: "" },
  horizontal: Boolean,
  loading: Boolean,
});

const theme = useApexTheme();

const series = computed(() => [{ name: props.prefix || "Valor", data: props.values }]);
const empty = computed(() => props.values.length === 0);

const opts = computed(() => {
  const t = theme.value;
  return {
    chart: {
      type: "bar",
      background: "transparent",
      fontFamily: "inherit",
      toolbar: { show: false },
    },
    colors: [t.resolve(props.colorVar)],
    plotOptions: {
      bar: { borderRadius: 4, horizontal: props.horizontal, columnWidth: "55%" },
    },
    grid: t.grid,
    xaxis: {
      categories: props.categories,
      labels: t.axisLabels,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        ...t.axisLabels,
        formatter: props.horizontal ? undefined : (v) => Number(v).toLocaleString("es-MX"),
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      theme: t.tooltipTheme,
      y: { formatter: (v) => Number(v).toLocaleString("es-MX") },
    },
  };
});
</script>
