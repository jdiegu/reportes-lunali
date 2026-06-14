<template>
  <div class="p-4 lg:p-8 max-w-6xl mx-auto">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7"
    >
      <div>
        <h1 class="page-title">Reportes</h1>

        <p class="page-subtitle">
          {{ filteredReports.length }} reportes en total
        </p>
      </div>

      <RouterLink
        v-if="!authStore.isAdmin"
        to="/reports/new"
        class="btn-primary self-start"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>

        Nuevo reporte
      </RouterLink>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="glass-card-light p-4">
        <p class="text-blush-500 text-sm">Pendientes</p>

        <h2 class="text-2xl font-bold text-yellow-400">
          {{ pendingReports }}
        </h2>
      </div>

      <div class="glass-card-light p-4">
        <p class="text-blush-500 text-sm">En proceso</p>

        <h2 class="text-2xl font-bold text-blue-400">
          {{ progressReports }}
        </h2>
      </div>

      <div class="glass-card-light p-4">
        <p class="text-blush-500 text-sm">Resueltos</p>

        <h2 class="text-2xl font-bold text-green-400">
          {{ resolvedReports }}
        </h2>
      </div>
    </div>

    <!-- Filters -->
    <div class="glass-card-light p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search -->
        <div class="flex-1 relative">
          <svg
            class="w-4 h-4 text-blush-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            v-model="search"
            type="text"
            class="input-field pl-10"
            placeholder="Buscar por correo o plataforma..."
          />
        </div>

        <!-- Status -->
        <select
          v-model="selectedStatus"
          class="input-field sm:w-44"
        >
          <option value="">Todos</option>
          <option value="pending">Pendientes</option>
          <option value="in_progress">En proceso</option>
          <option value="resolved">Resueltos</option>
        </select>

        <!-- Clear -->
        <button
          v-if="hasFilters"
          @click="clearFilters"
          class="btn-ghost text-xs"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="glass-card overflow-hidden">
      <!-- Loading -->
      <div
        v-if="reportsStore.loading"
        class="p-4 space-y-3"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="skeleton h-12 rounded-xl"
        />
      </div>

      <!-- Empty -->
      <div
        v-else-if="!filteredReports.length"
        class="py-20 text-center"
      >
        <div
          class="w-16 h-16 rounded-2xl bg-rose-900/20 border border-rose-900/30 flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-7 h-7 text-blush-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
            />
          </svg>
        </div>

        <p class="text-blush-400 font-medium">
          Sin reportes
        </p>

        <p class="text-blush-600 text-sm mt-1">
          {{
            hasFilters
              ? "Ningún reporte coincide con los filtros."
              : "Aún no hay reportes registrados."
          }}
        </p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Plataforma</th>
              <th>Correo</th>
              <th v-if="authStore.isAdmin">Usuario</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th class="w-10"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="report in filteredReports"
              :key="report._id"
              class="cursor-pointer hover:bg-rose-900/10 transition"
              @click="router.push(`/reports/${report._id}`)"
            >
              <!-- Plataforma -->
              <td>
                <div class="flex items-center gap-2">
                  <div
                    class="w-7 h-7 rounded-lg bg-rose-900/30 border border-rose-900/30 flex items-center justify-center text-rose-300 text-xs font-mono shrink-0"
                  >
                    {{ report.platform?.charAt(0).toUpperCase() }}
                  </div>

                  <span class="font-medium text-blush-100">
                    {{ report.platform }}
                  </span>
                </div>
              </td>

              <!-- Mail -->
              <td class="font-mono text-xs text-blush-400">
                {{ report.mail }}
              </td>

              <!-- Usuario -->
              <td
                v-if="authStore.isAdmin"
                class="text-blush-400"
              >
                {{ report.user?.name || "—" }}
              </td>

              <!-- Estado -->
              <td>
                <span :class="statusBadge(report.status)">
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-current"
                  />

                  {{ statusLabel(report.status) }}
                </span>
              </td>

              <!-- Tipo -->
              <td>
                <span
                  class="text-blush-500 text-xs capitalize"
                >
                  {{
                    report.platform_type === "profile"
                      ? "👥 Perfil"
                      : "👤 Cuenta"
                  }}
                </span>
              </td>

              <!-- Fecha -->
              <td class="text-blush-500 text-xs">
                {{ formatDate(report.createdAt) }}
              </td>

              <!-- Arrow -->
              <td>
                <svg
                  class="w-4 h-4 text-blush-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
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
import { RouterLink, useRouter } from "vue-router";

import { useAuthStore } from "../../store/auth";
import { useReportsStore } from "../../store/reports";

const authStore = useAuthStore();
const reportsStore = useReportsStore();

const router = useRouter();

const search = ref("");
const selectedStatus = ref("");

/*
|--------------------------------------------------------------------------
| FILTERS
|--------------------------------------------------------------------------
*/

const hasFilters = computed(() => {
  return !!search.value || !!selectedStatus.value;
});

const filteredReports = computed(() => {
  let data = [...reportsStore.reports];

  // Buscar
  if (search.value) {
    const term = search.value.toLowerCase();

    data = data.filter((report) => {
      return (
        report.mail?.toLowerCase().includes(term) ||
        report.platform?.toLowerCase().includes(term)
      );
    });
  }

  // Estado
  if (selectedStatus.value) {
    data = data.filter(
      (report) => report.status === selectedStatus.value
    );
  }

  return data;
});

function clearFilters() {
  search.value = "";
  selectedStatus.value = "";
}

/*
|--------------------------------------------------------------------------
| STATS
|--------------------------------------------------------------------------
*/

const pendingReports = computed(() => {
  return reportsStore.reports.filter(
    (r) => r.status === "pending"
  ).length;
});

const progressReports = computed(() => {
  return reportsStore.reports.filter(
    (r) => r.status === "in_progress"
  ).length;
});

const resolvedReports = computed(() => {
  return reportsStore.reports.filter(
    (r) => r.status === "resolved"
  ).length;
});

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const statusBadge = (s) =>
  ({
    pending: "badge-pending",
    in_progress: "badge-progress",
    resolved: "badge-resolved",
  })[s] || "badge-pending";

const statusLabel = (s) =>
  ({
    pending: "Pendiente",
    in_progress: "En proceso",
    resolved: "Resuelto",
  })[s] || s;

function formatDate(d) {
  return new Date(d).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  await reportsStore.fetchReports();
});
</script>