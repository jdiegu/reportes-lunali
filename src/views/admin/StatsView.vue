<template>
  <div class="p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl">Estadisticas</h1>
        <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">
          Vista general del rendimiento
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="btn-icon"
          title="Actualizar datos"
          :disabled="loading"
          @click="refresh"
          style="color: var(--rose-primary);"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        </button>
        <button
          class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl btn-ghost transition-colors"
          style="color: var(--text-secondary);"
          @click="restoreDefaults"
        >
          <RotateCcw class="w-4 h-4" />
          Restaurar
        </button>
        <button class="btn-primary text-xs flex items-center gap-1.5 !py-2 !px-3" @click="toggleEditing">
          <LayoutGrid class="w-4 h-4" />
          {{ editing ? "Listo" : "Personalizar" }}
        </button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="editing" class="card p-3 sm:p-4 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted);">
              Widgets visibles
            </p>
            <p class="text-[11px] mt-0.5" style="color: var(--text-muted); opacity: 0.75;">
              Arrastra para mover, usa la esquina inferior para redimensionar
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="w in widgetOrder"
              :key="w.id"
              class="text-[11px] px-2.5 py-1.5 rounded-full font-medium transition-all duration-200 flex items-center gap-1.5"
              :style="
                visible.has(w.id)
                  ? { background: 'var(--rose-lighter)', color: 'var(--rose-primary)' }
                  : { background: 'var(--bg-surface)', color: 'var(--text-muted)', opacity: 0.55 }
              "
              @click="toggleWidget(w.id)"
            >
              <span
                class="w-3.5 h-3.5 rounded-full border flex items-center justify-center"
                :style="{
                  borderColor: visible.has(w.id) ? 'var(--rose-primary)' : 'var(--border-color)',
                }"
              >
                <svg
                  v-if="visible.has(w.id)"
                  class="w-2 h-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {{ w.label }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="error" class="card p-6 text-center">
      <p class="text-sm" style="color: var(--error);">{{ error }}</p>
      <button class="btn-primary mt-3 text-xs" @click="refresh">Reintentar</button>
    </div>

    <div v-if="!error" class="stats-shell">
      <GridStack
        ref="gridRef"
        :options="gridOptions"
        :components="{ StatWidget }"
        @change="onChange"
        @added="onChange"
        @removed="onChange"
      >
        <template #empty>
          <div class="card py-14 text-center">
            <p class="text-sm font-medium" style="color: var(--text-muted);">
              Sin widgets visibles
            </p>
            <p class="text-xs mt-1" style="color: var(--text-muted); opacity: 0.7;">
              Usa "Personalizar" para volver a mostrarlos
            </p>
          </div>
        </template>
      </GridStack>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, provide, onMounted, onBeforeUnmount, nextTick } from "vue";
import { GridStack } from "gridstack/dist/vue";
import { Utils } from "gridstack";
import "gridstack/dist/gridstack.css";
import { RefreshCw, RotateCcw, LayoutGrid } from "@lucide/vue";
import StatWidget from "../../components/stats/StatWidget.vue";
import { useStatsStore } from "../../store/stats";

const LAYOUT_KEY = "sarita.statsLayout.v2";
  const LEGACY_LAYOUT_KEY = "sarita.statsLayout";
const BASE_COLUMN = 12;
const BREAKPOINTS = [
  { width: 1200, column: 12 },
  { width: 640, column: 8 },
];

function columnFor(width) {
  for (const b of BREAKPOINTS) if (width >= b.width) return b.column;
  return 1;
}

function currentColumn() {
  return columnFor(window.innerWidth || 1280);
}

function cellHeightFor(column) {
  if (column === 1) return 60;
  return column >= 12 ? 72 : 64;
}

function scaledMinW(column) {
  return (id) => {
    const base = WIDGETS[id]?.minW || 2;
    return Math.max(1, Math.round((base * column) / 12));
  };
}

const WIDGETS = {
  kpis: { label: "Resumen general", w: 12, h: 4, minW: 6, minH: 3 },
  platforms: { label: "Reportes por plataforma", w: 4, h: 6, minW: 3, minH: 4 },
  status: { label: "Estado de reportes", w: 4, h: 6, minW: 3, minH: 4 },
  openPlatforms: { label: "Pendientes por plataforma", w: 4, h: 6, minW: 3, minH: 4 },
  reportsDay: { label: "Reportes por dia", w: 6, h: 6, minW: 4, minH: 4 },
  reportsByHour: { label: "Reportes por hora", w: 6, h: 6, minW: 4, minH: 4 },
  resolutionByDay: { label: "Tiempo de resolucion por dia", w: 6, h: 6, minW: 4, minH: 4 },
  resolutionPlatforms: { label: "Resolucion por plataforma", w: 6, h: 6, minW: 4, minH: 4 },
  top: { label: "Top cuentas por saldo", w: 6, h: 6, minW: 4, minH: 4 },
  reportsVsResolved: { label: "Reportes vs resueltos", w: 6, h: 6, minW: 4, minH: 4 },
};

const DEFAULT_LAYOUT = [
  { id: "kpis", x: 0, y: 0, w: 12, h: 4 },
  { id: "platforms", x: 0, y: 4, w: 4, h: 6 },
  { id: "status", x: 4, y: 4, w: 4, h: 6 },
  { id: "openPlatforms", x: 8, y: 4, w: 4, h: 6 },
  { id: "reportsDay", x: 0, y: 10, w: 6, h: 6 },
  { id: "reportsByHour", x: 6, y: 10, w: 6, h: 6 },
  { id: "resolutionByDay", x: 0, y: 16, w: 6, h: 6 },
  { id: "resolutionPlatforms", x: 6, y: 16, w: 6, h: 6 },
  { id: "top", x: 0, y: 22, w: 6, h: 6 },
  { id: "reportsVsResolved", x: 6, y: 22, w: 6, h: 6 },
];

function scaleLayout(items, fromCol, toCol) {
  return items.map((w) => {
    const minW = Math.max(1, Math.round(((WIDGETS[w.id]?.minW || 2) * toCol) / 12));
    const minH = Math.max(1, Math.round(((WIDGETS[w.id]?.minH || 1) * toCol) / 12));
    const ww = Math.max(
      minW,
      Math.round(((typeof w.w === "number" ? w.w : minW) * toCol) / fromCol),
    );
    return {
      ...w,
      x: Math.min(
        Math.round(((typeof w.x === "number" ? w.x : 0) * toCol) / fromCol),
        Math.max(0, toCol - ww),
      ),
      w: ww,
      h: typeof w.h === "number" ? w.h : minH,
    };
  });
}

function loadLayout() {
  try {
    const raw = JSON.parse(
      localStorage.getItem(LAYOUT_KEY) ||
        localStorage.getItem(LEGACY_LAYOUT_KEY) ||
        "null",
    );
    let layouts = null;
    let hidden = new Set();
    if (raw && !Array.isArray(raw)) {
      hidden = new Set(raw.hidden || []);
      if (raw.layouts && typeof raw.layouts === "object") layouts = raw.layouts;
      else if (Array.isArray(raw.layout)) layouts = { [BASE_COLUMN]: raw.layout };
    } else if (Array.isArray(raw)) {
      layouts = { [BASE_COLUMN]: raw };
    }
    if (layouts) {
      const col = currentColumn();
      const candidates = [
        layouts[col],
        layouts[BASE_COLUMN],
        ...Object.keys(layouts).map((k) => layouts[k]),
      ].filter((l) => Array.isArray(l) && l.length > 0);
      const saved = candidates[0];
      if (saved) {
        const srcIsExact = candidates[0] === layouts[col];
        const ids = saved.map((r) => r.id);
        const minFor = (id, dim, c) =>
          Math.max(1, Math.round(((WIDGETS[id][dim] || 1) * c) / 12));
        let items = saved
          .filter((r) => WIDGETS[r.id] && !hidden.has(r.id) && typeof r.x === "number")
          .map((r) => ({
            id: r.id,
            x: r.x,
            y: typeof r.y === "number" ? r.y : 0,
            w: typeof r.w === "number" ? r.w : minFor(r.id, "minW", col),
            h: typeof r.h === "number" ? r.h : minFor(r.id, "minH", col),
          }));
        if (!srcIsExact) items = scaleLayout(items, BASE_COLUMN, col);
        const missing = Object.keys(WIDGETS).filter(
          (id) => !ids.includes(id) && !hidden.has(id),
        );
        missing.forEach((id, i) => {
          items.push({
            id,
            x: 0,
            y: 100 + i,
            w: WIDGETS[id].w,
            h: WIDGETS[id].h,
          });
        });
        return items;
      }
    }
  } catch {}
  return DEFAULT_LAYOUT.map((w) => ({ ...w }));
}

const layout = loadLayout();

const gridOptions = reactive({
  column: currentColumn(),
  cellHeight: 72,
  margin: 6,
  float: false,
  animate: true,
  staticGrid: true,
  draggable: { handle: ".widget-header", scroll: false },
  resizable: { handles: "se" },
  children: layout.map((w) => ({
    id: w.id,
    x: w.x,
    y: w.y,
    w: w.w,
    h: w.h,
    component: "StatWidget",
    props: { type: w.id },
    minW: WIDGETS[w.id].minW,
    minH: WIDGETS[w.id].minH,
  })),
});

const gridRef = ref(null);
const statsStore = useStatsStore();
const loading = computed(() => statsStore.loading);
const error = computed(() => statsStore.error);
const editing = ref(false);
const visible = ref(new Set(layout.map((w) => w.id)));
let resizeObserver = null;

provide("statsEditing", editing);
provide("statsActions", { removeWidget: (id) => toggleWidget(id) });

const widgetOrder = Object.keys(WIDGETS).map((id) => ({ id, label: WIDGETS[id].label }));

function getGrid() {
  return gridRef.value?.getGrid() || null;
}

function scaleMinW() {
  const g = getGrid();
  if (!g) return;
  const column = g.getColumn();
  const getMinW = scaledMinW(column);
  g.engine.nodes.forEach((n) => {
    if (n.id && WIDGETS[n.id]) n.minW = getMinW(n.id);
  });
}

function applyResponsive() {
  const g = getGrid();
  if (!g) return;
  const width = window.innerWidth || g.el?.clientWidth || 0;
  const column = columnFor(width);
  if (column !== g.getColumn()) g.column(column, "moveScale");
  scaleMinW();
  const h = cellHeightFor(column);
  if (Math.abs((g.getCellHeight() || 0) - h) > 1) g.cellHeight(h);
}

function persist() {
  const g = getGrid();
  if (!g) return;
  const hidden = Object.keys(WIDGETS).filter(
    (id) => !g.engine.nodes.some((n) => n.id === id),
  );
  let layouts = {};
  try {
    const raw = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "null");
    if (raw && !Array.isArray(raw) && raw.layouts && typeof raw.layouts === "object") {
      layouts = { ...raw.layouts };
    }
  } catch {}
  const saved = g.save(false);
  const list = Array.isArray(saved) ? saved : saved?.children || [];
  layouts[String(g.getColumn())] = list
    .map((w) => ({ id: w.id, x: w.x, y: w.y, w: w.w, h: w.h }))
    .filter((w) => w.id);
  localStorage.setItem(LAYOUT_KEY, JSON.stringify({ hidden, layouts }));
}

function syncVisible() {
  const g = getGrid();
  if (!g) return;
  visible.value = new Set(g.engine.nodes.map((n) => n.id));
}

function onChange() {
  persist();
  syncVisible();
}

function toggleWidget(id) {
  const g = getGrid();
  if (!g) return;
  if (visible.value.has(id)) {
    const node = Utils.findInGrid(g, id, true);
    if (node?.el) g.removeWidget(node.el);
  } else {
    const def = WIDGETS[id];
    g.addWidget({
      id,
      component: "StatWidget",
      props: { type: id },
      autoPosition: true,
      w: Math.min(def.w, g.getColumn()),
      h: def.h,
      minW: Math.min(def.minW, g.getColumn()),
      minH: def.minH,
    });
    scaleMinW();
  }
}

function restoreDefaults() {
  const g = getGrid();
  if (!g) return;
  localStorage.removeItem(LAYOUT_KEY);
  const current = g.getColumn();
  if (current !== BASE_COLUMN) g.column(BASE_COLUMN);
  g.load(
    DEFAULT_LAYOUT.map((w) => ({
      id: w.id,
      x: w.x,
      y: w.y,
      w: w.w,
      h: w.h,
      component: "StatWidget",
      props: { type: w.id },
      minW: WIDGETS[w.id].minW,
      minH: WIDGETS[w.id].minH,
    })),
  );
  syncVisible();
  persist();
  if (current !== BASE_COLUMN) applyResponsive();
}

function toggleEditing() {
  editing.value = !editing.value;
  getGrid()?.setStatic(!editing.value);
}

async function refresh() {
  await statsStore.fetchStats();
}

onMounted(async () => {
  refresh();
  await nextTick();
  const g = getGrid();
  const el = g?.el;
  if (el) {
    applyResponsive();
    resizeObserver = new ResizeObserver(() => applyResponsive());
    resizeObserver.observe(el);
    window.addEventListener("resize", applyResponsive);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("resize", applyResponsive);
});
</script>

<style scoped>
.stats-shell {
  min-height: 320px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
