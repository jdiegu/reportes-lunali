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
  "#e85c8c",
  "#f4b1c8",
  "#d8507d",
  "#eda2b9",
  "#f08aae",
  "#c03968",
  "#f0a2bd",
  "#e97b9f",
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
