<template>
  <div ref="boxEl" class="chart-box">
    <VueApexCharts
      v-if="!loading && !empty"
      :type="type"
      :height="height"
      :options="options"
      :series="series"
    />
    <div v-else-if="loading" class="h-full flex items-center justify-center px-6">
      <div class="skeleton w-full h-2/3 rounded-xl"></div>
    </div>
    <div v-else class="h-full flex flex-col items-center justify-center gap-2">
      <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: var(--bg-surface);">
        <svg class="w-5 h-5" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13l3-3 3 3 4-5 5 6 3-2" />
        </svg>
      </div>
      <p class="text-xs" style="color: var(--text-muted);">Sin datos por el momento</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import VueApexCharts from "vue3-apexcharts";

defineProps({
  type: String,
  options: Object,
  series: Array,
  loading: Boolean,
  empty: Boolean,
});

const boxEl = ref(null);
const height = ref(260);
let ro = null;

onMounted(() => {
  if (boxEl.value) {
    height.value = Math.max(140, boxEl.value.clientHeight - 8);
    ro = new ResizeObserver(() => {
      if (boxEl.value) height.value = Math.max(140, boxEl.value.clientHeight - 8);
    });
    ro.observe(boxEl.value);
  }
});

onBeforeUnmount(() => ro?.disconnect());
</script>

<style scoped>
.chart-box {
  height: 100%;
  min-height: 0;
  width: 100%;
}
</style>
