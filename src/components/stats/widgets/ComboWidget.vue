<template>
  <ChartBox type="bar" :options="opts" :series="series" :loading="loading" :empty="empty" />
</template>

<script setup>
import { computed } from "vue";
import ChartBox from "../ChartBox.vue";
import { useApexTheme } from "../apexTheme";

const props = defineProps({
  categories: { type: Array, default: () => [] },
  barName: { type: String, default: "Reportes" },
  barValues: { type: Array, default: () => [] },
  lineName: { type: String, default: "Resueltos" },
  lineValues: { type: Array, default: () => [] },
  colorVar: { type: String, default: "--rose-primary" },
  lineColorVar: { type: String, default: "--success" },
  loading: Boolean,
});

const theme = useApexTheme();

const series = computed(() => [
  { name: props.barName, type: "bar", data: props.barValues },
  { name: props.lineName, type: "line", data: props.lineValues },
]);
const empty = computed(() => props.barValues.length === 0);

const opts = computed(() => {
  const t = theme.value;
  return {
    chart: {
      type: "bar",
      background: "transparent",
      fontFamily: "inherit",
      toolbar: { show: false },
      stacked: false,
    },
    colors: [t.resolve(props.colorVar), t.resolve(props.lineColorVar)],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "45%" } },
    stroke: { width: [0, 2.5], curve: "smooth" },
    grid: t.grid,
    xaxis: {
      categories: props.categories,
      labels: t.axisLabels,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        seriesName: props.barName,
        labels: { ...t.axisLabels, formatter: (v) => Number(v).toLocaleString("es-MX") },
        axisBorder: { show: false },
      },
      {
        seriesName: props.lineName,
        opposite: true,
        labels: { ...t.axisLabels, formatter: (v) => Number(v).toLocaleString("es-MX") },
        axisBorder: { show: false },
      },
    ],
    dataLabels: { enabled: false },
    legend: { position: "bottom", ...t.legend, itemMargin: { horizontal: 8, vertical: 2 } },
    tooltip: { theme: t.tooltipTheme },
  };
});
</script>
