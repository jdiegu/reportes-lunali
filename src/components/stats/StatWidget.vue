<template>
  <div class="widget">
    <div class="widget-header" :class="{ 'is-editing': editing }">
      <span class="widget-title">{{ title }}</span>
      <button
        v-if="editing"
        class="widget-remove"
        title="Ocultar widget"
        @click.stop="actions?.removeWidget(type)"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
    <div class="widget-body">
      <KpisWidget v-if="type === 'kpis'" :loading="loading" />
      <DonutWidget v-else-if="type === 'platforms'" :items="platformItems" :loading="loading" />
      <DonutWidget v-else-if="type === 'status'" :items="statusItems" :loading="loading" />
      <TopUsersWidget v-else-if="type === 'top'" :loading="loading" />
      <BarWidget
        v-else-if="type === 'reportsDay'"
        :categories="dayCategories"
        :values="reportValues"
        color-var="--rose-primary"
        prefix="Reportes"
        :loading="loading"
      />
      <BarWidget
        v-else-if="type === 'reportsByHour'"
        :categories="hourCategories"
        :values="hourValues"
        color-var="--info"
        prefix="Reportes"
        :loading="loading"
      />
      <BarWidget
        v-else-if="type === 'openPlatforms'"
        :categories="openPlatformCategories"
        :values="openPlatformValues"
        color-var="--warning"
        prefix="Pendientes"
        horizontal
        :loading="loading"
      />
      <AreaWidget
        v-else-if="type === 'resolutionByDay'"
        :categories="dayCategories"
        :values="resolutionDayValues"
        color-var="--info"
        prefix="Horas"
        fmt-prefix=""
        fmt-suffix=" hrs"
        :decimals="1"
        :loading="loading"
      />
      <StackedBarWidget
        v-else-if="type === 'resolutionPlatforms'"
        :categories="platformCategories"
        :series="platformSeries"
        :loading="loading"
      />
      <ComboWidget
        v-else-if="type === 'reportsVsResolved'"
        :categories="dayCategories"
        bar-name="Reportes"
        :bar-values="reportValues"
        line-name="Resueltos"
        :line-values="resolvedValues"
        color-var="--rose-primary"
        line-color-var="--success"
        :loading="loading"
      />
      <div v-else class="h-full flex items-center justify-center">
        <p class="text-xs" style="color: var(--text-muted);">Widget no disponible</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";
import { useStatsStore } from "../../store/stats";
import { useApexTheme } from "./apexTheme";
import { X } from "@lucide/vue";
import KpisWidget from "./widgets/KpisWidget.vue";
import DonutWidget from "./widgets/DonutWidget.vue";
import BarWidget from "./widgets/BarWidget.vue";
import AreaWidget from "./widgets/AreaWidget.vue";
import TopUsersWidget from "./widgets/TopUsersWidget.vue";
import ComboWidget from "./widgets/ComboWidget.vue";
import StackedBarWidget from "./widgets/StackedBarWidget.vue";

const props = defineProps({
  type: String,
});

const store = useStatsStore();
const theme = useApexTheme();
const editing = inject("statsEditing", false);
const actions = inject("statsActions", null);

const WIDGET_TITLES = {
  kpis: "Resumen general",
  platforms: "Reportes por plataforma",
  status: "Estado de reportes",
  top: "Top cuentas por saldo",
  reportsDay: "Reportes por dia",
  reportsByHour: "Reportes por hora",
  openPlatforms: "Pendientes por plataforma",
  resolutionByDay: "Tiempo de resolucion por dia",
  resolutionPlatforms: "Resolucion por plataforma",
  reportsVsResolved: "Reportes vs resueltos",
};

const title = computed(() => WIDGET_TITLES[props.type] || "Widget");
const loading = computed(() => store.loading);
const stats = computed(() => store.stats || {});

const platformItems = computed(() =>
  (stats.value.platforms || []).map((p) => ({ label: p.platform, value: p.count })),
);

const STATUS_META = {
  pending: { label: "Pendientes", var: "--warning" },
  in_progress: { label: "En proceso", var: "--info" },
  resolved: { label: "Resueltos", var: "--success" },
};
const STATUS_ORDER = ["pending", "in_progress", "resolved"];

const statusItems = computed(() =>
  (stats.value.statuses || []).map((s) => ({
    label: STATUS_META[s.status]?.label || s.status,
    value: s.count,
    color: STATUS_META[s.status] ? theme.value.resolve(STATUS_META[s.status].var) : undefined,
  })),
);

function buildDays() {
  const days = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    days.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`,
      label: d.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit" }),
    });
  }
  return days;
}

const DAYS = buildDays();

function sumByKey(rows, dateKey, valueOf) {
  const map = {};
  rows.forEach((r) => {
    const k = dateKey(r);
    map[k] = (map[k] || 0) + valueOf(r);
  });
  return DAYS.map((d) => map[d.key] || 0);
}

const dayCategories = computed(() => DAYS.map((d) => d.label));
const reportValues = computed(() =>
  sumByKey(stats.value.reportsByDay || [], (r) => r.date, (r) => r.count),
);
const resolvedValues = computed(() =>
  sumByKey(
    (stats.value.statusByDay || []).filter((r) => r.status === "resolved"),
    (r) => r.date,
    (r) => r.count,
  ),
);

const hourCategories = computed(() =>
  Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}h`),
);
const hourValues = computed(() => {
  const arr = Array(24).fill(0);
  (stats.value.reportsByHour || []).forEach((h) => {
    if (h.hour >= 0 && h.hour <= 23) arr[h.hour] += h.count;
  });
  return arr;
});

const openPlatformData = computed(() => {
  const map = {};
  (stats.value.platformStatus || []).forEach((r) => {
    if (r.status === "resolved") return;
    map[r.platform] = (map[r.platform] || 0) + r.count;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
});
const openPlatformCategories = computed(() => openPlatformData.value.map(([p]) => p));
const openPlatformValues = computed(() => openPlatformData.value.map(([, c]) => c));

const resolutionDayValues = computed(() => {
  const map = {};
  (stats.value.avgResolutionByDay || []).forEach((r) => {
    map[r.date] = r.avgMs;
  });
  return DAYS.map((d) =>
    map[d.key] ? Math.round((map[d.key] / 3600000) * 10) / 10 : 0,
  );
});

const platformCategories = computed(() =>
  (stats.value.platforms || []).slice(0, 6).map((p) => p.platform),
);

const platformSeries = computed(() => {
  const rows = stats.value.platformStatus || [];
  return STATUS_ORDER.map((st) => ({
    name: STATUS_META[st].label,
    colorVar: STATUS_META[st].var,
    data: platformCategories.value.map(
      (pl) => rows.find((r) => r.platform === pl && r.status === st)?.count || 0,
    ),
  }));
});
</script>

<style scoped>
.widget {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  user-select: none;
}

.widget-header.is-editing {
  cursor: grab;
}

.widget-header.is-editing:active {
  cursor: grabbing;
}

.widget-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.widget-remove {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease, color 0.15s ease;
}

.widget-remove:hover {
  background: var(--error-bg);
  color: var(--error);
}

.widget-body {
  flex: 1;
  min-height: 0;
  padding: 10px 14px 14px;
}
</style>
