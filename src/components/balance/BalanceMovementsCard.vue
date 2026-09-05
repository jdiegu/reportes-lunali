<template>
  <div class="card overflow-hidden">
    <div class="p-5 sm:p-6 border-b" :style="{ borderColor: 'var(--border-color)' }">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p class="text-sm font-semibold flex items-center gap-2" style="color: var(--text-primary);">
            <TrendingUp class="w-4 h-4" style="color: var(--rose-primary);" />
            Movimientos de saldo
          </p>
          <p class="text-xs mt-0.5" style="color: var(--text-muted);">Evolucion del saldo y todos los movimientos registrados</p>
        </div>
      </div>
    </div>

    <div class="p-5 sm:p-6 space-y-5">
      <!-- Balance evolution chart -->
      <div v-if="loading" class="skeleton h-56 rounded-xl"></div>
      <div v-else-if="movements.length === 0" class="h-56 flex flex-col items-center justify-center gap-2 rounded-xl" style="background: var(--bg-surface);">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background: var(--bg-card);">
          <TrendingUp class="w-6 h-6" style="color: var(--text-muted);" />
        </div>
        <p class="text-sm" style="color: var(--text-muted);">Sin movimientos de saldo por el momento</p>
      </div>
      <div v-else>
        <VueApexCharts type="area" height="230" :options="chartOptions" :series="chartSeries" />
      </div>

      <!-- Summary chips -->
      <div v-if="movements.length" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="rounded-xl border p-4 text-center" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
          <p class="text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Total mov.</p>
          <p class="text-lg font-bold font-mono" style="color: var(--text-primary);">{{ movements.length }}</p>
        </div>
        <div class="rounded-xl border p-4 text-center" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
          <p class="text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Ingresos</p>
          <p class="text-lg font-bold font-mono" style="color: var(--success);">+${{ totalIn.toFixed(2) }}</p>
        </div>
        <div class="rounded-xl border p-4 text-center" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
          <p class="text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Egresos</p>
          <p class="text-lg font-bold font-mono" style="color: var(--error);">-${{ totalOut.toFixed(2) }}</p>
        </div>
        <div class="rounded-xl border p-4 text-center" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
          <p class="text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Saldo final</p>
          <p class="text-lg font-bold font-mono" style="color: var(--rose-primary);">${{ currentBalance.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Movements table -->
      <div class="overflow-x-auto rounded-xl border" :style="{ borderColor: 'var(--border-color)' }">
        <table class="w-full text-sm">
          <thead>
            <tr :style="{ background: 'var(--bg-surface)' }">
              <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Fecha</th>
              <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Concepto</th>
              <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Saldo previo</th>
              <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Movimiento</th>
              <th class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Nuevo saldo</th>
              <th v-if="canSeeAdmin" class="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Admin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in movements" :key="m._id" class="border-t" :style="{ borderColor: 'var(--border-color)' }">
              <td class="px-4 py-3 whitespace-nowrap" style="color: var(--text-muted);">{{ formatDate(m.createdAt) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold"
                      :style="{ color: m.amount >= 0 ? 'var(--success)' : 'var(--error)' }">
                  {{ typeLabel(m.type) }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-mono" style="color: var(--text-secondary);">${{ Number(m.previousBalance).toFixed(2) }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-mono font-semibold"
                  :style="{ color: m.amount >= 0 ? 'var(--success)' : 'var(--error)' }">
                {{ m.amount >= 0 ? '+' : '' }}${{ Number(m.amount).toFixed(2) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-mono font-semibold" style="color: var(--text-primary);">${{ Number(m.newBalance).toFixed(2) }}</td>
              <td v-if="canSeeAdmin" class="px-4 py-3 whitespace-nowrap" style="color: var(--text-muted);">{{ adminName(m.admin) }}</td>
            </tr>
            <tr v-if="!movements.length">
              <td :colspan="canSeeAdmin ? 6 : 5" class="px-4 py-8 text-center text-sm" style="color: var(--text-muted);">
                No hay movimientos registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { balanceMovementsApi } from "../../api/axios";
import { useApexTheme } from "../stats/apexTheme";
import { LOCALE } from "../../config/constants";
import { useAuthStore } from "../../store/auth";
import { TrendingUp } from "@lucide/vue";

const props = defineProps({
  userId: { type: String, default: "" },
});

const authStore = useAuthStore();
const canSeeAdmin = computed(() => authStore.isAdmin);

const loading = ref(true);
const movements = ref([]);

const theme = useApexTheme();

const typeLabels = {
  add: "Carga",
  subtract: "Descuento",
  credit: "Credito",
  adjustment: "Ajuste",
};

const fmt = (v) => `$${Number(v || 0).toLocaleString("es-MX", { maximumFractionDigits: 2 })}`;

const sortedByDate = computed(() =>
  [...movements.value].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
);

const chartSeries = computed(() => [
  {
    name: "Saldo",
    data: sortedByDate.value.map((m) => [new Date(m.createdAt).getTime(), Number(m.newBalance)]),
  },
]);

const chartOptions = computed(() => {
  const t = theme.value;
  return {
    chart: {
      type: "area",
      background: "transparent",
      fontFamily: "inherit",
      toolbar: { show: false },
    },
    colors: [t.resolve("--rose-primary")],
    stroke: { curve: "straight", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 90, 100] },
    },
    grid: t.grid,
    xaxis: {
      type: "datetime",
      labels: { ...t.axisLabels, datetimeUTC: false, format: "dd MMM" },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { ...t.axisLabels, formatter: (v) => fmt(v) },
      tooltip: { enabled: true },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { theme: t.tooltipTheme, x: { format: "dd MMM yyyy" }, y: { formatter: (v) => fmt(v) } },
  };
});

const totalIn = computed(() =>
  movements.value.filter((m) => m.amount > 0).reduce((s, m) => s + Number(m.amount), 0),
);
const totalOut = computed(() =>
  movements.value.filter((m) => m.amount < 0).reduce((s, m) => s + Math.abs(Number(m.amount)), 0),
);
const currentBalance = computed(() => movements.value[0]?.newBalance ?? 0);

function typeLabel(type) {
  return typeLabels[type] || (type || "").charAt(0).toUpperCase() + (type || "").slice(1);
}

function adminName(admin) {
  if (!admin) return "Sistema";
  return admin.username || "Desconocido";
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function loadMovements() {
  loading.value = true;
  try {
    const { data } = await balanceMovementsApi.byUser(props.userId);
    movements.value = data || [];
  } catch (e) {
    if (e.response?.status === 403 && props.userId) {
      try {
        const { data } = await balanceMovementsApi.my();
        movements.value = data || [];
      } catch {
        movements.value = [];
      }
    } else {
      movements.value = [];
    }
  } finally {
    loading.value = false;
  }
}

onMounted(loadMovements);
</script>
