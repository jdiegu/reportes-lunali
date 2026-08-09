<template>
  <ChartBox type="bar" :options="opts" :series="series" :loading="loading" :empty="empty" />
</template>

<script setup>
import { computed } from "vue";
import ChartBox from "../ChartBox.vue";
import { useApexTheme } from "../apexTheme";

const props = defineProps({
  categories: { type: Array, default: () => [] },
  series: {
    type: Array,
    default: () => [],
  },
  loading: Boolean,
});

const theme = useApexTheme();

const empty = computed(() => props.categories.length === 0 || props.series.length === 0);

const opts = computed(() => {
  const t = theme.value;
  return {
    chart: {
      type: "bar",
      background: "transparent",
      fontFamily: "inherit",
      toolbar: { show: false },
      stacked: true,
    },
    colors: props.series.map((s) => t.resolve(s.colorVar)),
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
    grid: t.grid,
    xaxis: {
      categories: props.categories,
      labels: { ...t.axisLabels, style: { ...t.axisLabels.style, fontSize: "9px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { ...t.axisLabels, formatter: (v) => Number(v).toLocaleString("es-MX") },
    },
    dataLabels: { enabled: false },
    legend: { position: "bottom", ...t.legend, itemMargin: { horizontal: 8, vertical: 2 } },
    tooltip: { theme: t.tooltipTheme },
  };
});
</script>
