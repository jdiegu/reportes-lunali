<template>
  <ChartBox type="donut" :options="opts" :series="series" :loading="loading" :empty="empty" />
</template>

<script setup>
import { computed } from "vue";
import ChartBox from "../ChartBox.vue";
import { useApexTheme } from "../apexTheme";

const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: Boolean,
});

const theme = useApexTheme();

const PALETTE = [
  "#e88aac",
  "#60a0d0",
  "#3cb870",
  "#e8b030",
  "#a78bfa",
  "#fb7185",
  "#2dd4bf",
  "#f97316",
];

const series = computed(() => props.items.map((i) => i.value));
const empty = computed(() => props.items.length === 0);
const total = computed(() => series.value.reduce((a, b) => a + b, 0));

const opts = computed(() => {
  const t = theme.value;
  return {
    chart: {
      type: "donut",
      background: "transparent",
      fontFamily: "inherit",
      toolbar: { show: false },
    },
    labels: props.items.map((i) => i.label),
    colors: props.items.map((i, idx) => i.color || PALETTE[idx % PALETTE.length]),
    legend: { position: "bottom", ...t.legend, itemMargin: { horizontal: 6, vertical: 2 } },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "74%",
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: "18px",
              fontWeight: 700,
              color: t.colors.text,
              formatter: (v) => Number(v).toLocaleString("es-MX"),
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "11px",
              color: t.colors.muted,
              formatter: () => total.value.toLocaleString("es-MX"),
            },
          },
        },
      },
    },
    stroke: { colors: [t.colors.card], width: 2 },
    tooltip: { theme: t.tooltipTheme },
    states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
  };
});
</script>
