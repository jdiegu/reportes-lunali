<template>
  <ChartBox type="area" :options="opts" :series="series" :loading="loading" :empty="empty" />
</template>

<script setup>
import { computed } from "vue";
import ChartBox from "../ChartBox.vue";
import { useApexTheme } from "../apexTheme";

const props = defineProps({
  categories: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  colorVar: { type: String, default: "--success" },
  prefix: { type: String, default: "" },
  fmtPrefix: { type: String, default: "$" },
  fmtSuffix: { type: String, default: "" },
  decimals: { type: Number, default: 2 },
  loading: Boolean,
});

const theme = useApexTheme();

const series = computed(() => [{ name: props.prefix || "Valor", data: props.values }]);
const empty = computed(() => props.values.length === 0);

const fmt = (v) => `${props.fmtPrefix}${Number(v).toLocaleString("es-MX", {
  maximumFractionDigits: props.decimals,
})}${props.fmtSuffix}`;

const opts = computed(() => {
  const t = theme.value;
  const color = t.resolve(props.colorVar);
  return {
    chart: {
      type: "area",
      background: "transparent",
      fontFamily: "inherit",
      toolbar: { show: false },
    },
    colors: [color],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
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
        formatter: (v) => fmt(v),
      },
      tooltip: { enabled: true },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      theme: t.tooltipTheme,
      y: { formatter: (v) => fmt(v) },
    },
  };
});
</script>
