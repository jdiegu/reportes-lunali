<template>
  <div class="p-4 lg:p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8 animate-fade-up">
      <h1 class="page-title">Panel de Administración</h1>
      <p class="page-subtitle">Gestión completa de reportes · Lunali Streaming</p>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="(stat, i) in stats"
        :key="stat.label"
        :class="['glass-card p-5 flex items-center gap-4 animate-fade-up opacity-0-init', `animate-delay-${(i+1)*100}`]"
      >
        <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shrink-0', stat.iconBg]">
          <svg class="w-5 h-5" :class="stat.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon"/>
          </svg>
        </div>
        <div>
          <p class="text-2xl font-display font-bold" :class="stat.iconColor">
            {{ stat.value }}
          </p>
          <p class="text-blush-500 text-xs">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Filters + table -->
    <div class="glass-card overflow-hidden animate-fade-up animate-delay-300 opacity-0-init">
      <!-- Toolbar -->
      <div class="p-4 border-b border-rose-900/30 flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <svg class="w-4 h-4 text-blush-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="reportsStore.filters.search"
            @input="debouncedFetch"
            type="text"
            class="input-field pl-10 text-sm"
            placeholder="Buscar por correo, plataforma, usuario..."
          />
        </div>
        <select v-model="reportsStore.filters.status" @change="doFetch" class="input-field sm:w-44 text-sm">
          <option value="">Todos los estados</option>
          <option value="pending">⏳ Pendientes</option>
          <option value="in_progress">🔄 En proceso</option>
          <option value="resolved">✅ Resueltos</option>
        </select>
        <button v-if="hasFilters" @click="clearFilters" class="btn-ghost text-xs whitespace-nowrap">
          Limpiar filtros
        </button>
      </div>

      <!-- Loading -->
      <div v-if="reportsStore.loading" class="p-4 space-y-3">
        <div v-for="i in 6" :key="i" class="skeleton h-14 rounded-xl"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="!reportsStore.reports.length" class="py-20 text-center">
        <div class="w-14 h-14 rounded-2xl bg-rose-900/20 border border-rose-900/30 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-blush-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <p class="text-blush-400 font-medium">Sin reportes</p>
        <p class="text-blush-600 text-sm mt-1">{{ hasFilters ? 'Ningún resultado con esos filtros.' : 'No hay reportes registrados aún.' }}</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Plataforma</th>
              <th>Cuenta</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th class="text-right pr-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reportsStore.reports" :key="report._id">
              <td>
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-rose-900/30 border border-rose-900/30 flex items-center justify-center text-rose-300 text-xs font-bold shrink-0">
                    {{ report.platform?.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-medium text-blush-100 whitespace-nowrap">{{ report.platform }}</span>
                </div>
              </td>
              <td class="font-mono text-xs text-blush-400 max-w-[160px] truncate">{{ report.mail }}</td>
              <td class="text-blush-300 whitespace-nowrap">{{ report.user?.name || '—' }}</td>
              <td>
                <span :class="statusBadge(report.status)">
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {{ statusLabel(report.status) }}
                </span>
              </td>
              <td class="text-blush-500 text-xs whitespace-nowrap">
                {{ report.platform_type === 'profile' ? '👥 Perfil' : '👤 Cuenta' }}
              </td>
              <td class="text-blush-500 text-xs whitespace-nowrap">{{ formatDate(report.createdAt) }}</td>
              <td class="text-right pr-2">
                <div class="flex items-center justify-end gap-1">
                  <!-- Ver detalle -->
                  <button
                    @click="router.push(`/reports/${report._id}`)"
                    class="btn-icon w-8 h-8"
                    title="Ver detalle"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>

                  <!-- Cambiar estado -->
                  <button
                    v-if="report.status === 'pending'"
                    @click="quickStatus(report, 'in_progress')"
                    class="btn-icon w-8 h-8 text-blue-400 border-blue-900/40 hover:border-blue-600/60 hover:bg-blue-900/20"
                    title="Marcar en proceso"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>

                  <!-- Resolver -->
                  <button
                    v-if="report.status !== 'resolved'"
                    @click="openResolve(report)"
                    class="btn-icon w-8 h-8 text-emerald-400 border-emerald-900/40 hover:border-emerald-600/60 hover:bg-emerald-900/20"
                    title="Resolver"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>

                  <!-- Editar resolución -->
                  <button
                    v-if="report.status === 'resolved'"
                    @click="openEdit(report)"
                    class="btn-icon w-8 h-8"
                    title="Editar resolución"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>

                  <!-- Eliminar -->
                  <button
                    @click="confirmDelete(report)"
                    class="btn-icon w-8 h-8 text-rose-500 border-rose-900/40 hover:border-rose-600/60 hover:bg-rose-900/20"
                    title="Eliminar"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="reportsStore.pagination.pages > 1" class="px-4 py-3 border-t border-rose-900/30 flex items-center justify-between">
        <p class="text-blush-500 text-xs">
          {{ reportsStore.reports.length }} de {{ reportsStore.pagination.total }} reportes
        </p>
        <div class="flex items-center gap-1">
          <button
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
            class="btn-icon w-8 h-8 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <span class="text-blush-400 text-xs px-2">
            {{ currentPage }} / {{ reportsStore.pagination.pages }}
          </span>
          <button
            :disabled="currentPage >= reportsStore.pagination.pages"
            @click="changePage(currentPage + 1)"
            class="btn-icon w-8 h-8 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ResolveModal
      v-model="showResolveModal"
      :report="selectedReport"
      :is-editing="false"
      @resolved="handleResolved"
    />
    <ResolveModal
      v-model="showEditModal"
      :report="selectedReport"
      :is-editing="true"
      @resolved="handleResolved"
    />
    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="Eliminar reporte"
      :message="`¿Eliminar el reporte de ${selectedReport?.platform} (${selectedReport?.mail})? Se borrarán también las imágenes.`"
      confirm-label="Sí, eliminar"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter }       from 'vue-router'
import { useReportsStore } from '../../store/reports'
import { useToastStore }   from '../../store/toast'
import ResolveModal  from '../../components/reports/ResolvModal.vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'

const router       = useRouter()
const reportsStore = useReportsStore()
const toast        = useToastStore()

const currentPage       = ref(1)
const selectedReport    = ref(null)
const showResolveModal  = ref(false)
const showEditModal     = ref(false)
const showDeleteConfirm = ref(false)
let searchTimeout       = null

// ── Stats ──────────────────────────────────────────────────────────────────────
const stats = computed(() => {
  const all = reportsStore.reports
  return [
    {
      label: 'Total reportes', value: reportsStore.pagination.total,
      icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
      iconBg: 'bg-rose-700/25', iconColor: 'text-rose-400',
    },
    {
      label: 'Pendientes', value: all.filter(r => r.status === 'pending').length,
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      iconBg: 'bg-amber-700/20', iconColor: 'text-amber-400',
    },
    {
      label: 'En proceso', value: all.filter(r => r.status === 'in_progress').length,
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      iconBg: 'bg-blue-700/20', iconColor: 'text-blue-400',
    },
    {
      label: 'Resueltos', value: all.filter(r => r.status === 'resolved').length,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      iconBg: 'bg-emerald-700/20', iconColor: 'text-emerald-400',
    },
  ]
})

const hasFilters = computed(() =>
  !!reportsStore.filters.status || !!reportsStore.filters.search
)

// ── Helpers ────────────────────────────────────────────────────────────────────
const statusBadge = (s) => ({
  pending: 'badge-pending', in_progress: 'badge-progress', resolved: 'badge-resolved',
}[s] || 'badge-pending')

const statusLabel = (s) => ({
  pending: 'Pendiente', in_progress: 'En proceso', resolved: 'Resuelto',
}[s] || s)

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Fetch / pagination ─────────────────────────────────────────────────────────
function doFetch() {
  currentPage.value = 1
  reportsStore.fetchReports(1)
}

function debouncedFetch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(doFetch, 400)
}

function clearFilters() {
  reportsStore.resetFilters()
  doFetch()
}

function changePage(page) {
  currentPage.value = page
  reportsStore.fetchReports(page)
}

// ── Actions ────────────────────────────────────────────────────────────────────
async function quickStatus(report, status) {
  const result = await reportsStore.updateStatus(report._id, status)
  if (result.success) toast.success('Estado actualizado.')
  else toast.error(result.message)
}

function openResolve(report) {
  selectedReport.value = report
  showResolveModal.value = true
}

function openEdit(report) {
  selectedReport.value = report
  showEditModal.value = true
}

function confirmDelete(report) {
  selectedReport.value = report
  showDeleteConfirm.value = true
}

function handleResolved(updated) {
  if (updated) reportsStore.fetchReports(currentPage.value)
}

async function handleDelete() {
  const result = await reportsStore.deleteReport(selectedReport.value._id)
  if (result.success) {
    toast.success('Reporte eliminado correctamente.')
    reportsStore.fetchReports(currentPage.value)
  } else {
    toast.error(result.message)
  }
}

// ── Init ───────────────────────────────────────────────────────────────────────
onMounted(() => reportsStore.fetchReports())
</script>