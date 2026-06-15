<template>
  <div class="p-4 lg:p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-display font-bold" style="color: var(--text-primary);">Reportes</h1>
        <p class="text-sm mt-0.5" style="color: var(--text-muted);">
          {{ authStore.isAdmin ? 'Todos los reportes del sistema' : 'Tus reportes registrados' }}
        </p>
      </div>
      <RouterLink v-if="!authStore.isAdmin" to="/app/reports/new" class="btn-primary text-xs">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nuevo reporte
      </RouterLink>
    </div>

    <div class="card p-4">
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-[200px]">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="filters.search" @input="onSearch" type="text" placeholder="Buscar por correo o plataforma..."
                 class="input-field pl-9" />
        </div>
        <select v-model="filters.status" @change="onFilterChange" class="input-field w-auto">
          <option value="">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="in_progress">En proceso</option>
          <option value="resolved">Resuelto</option>
        </select>
        <select v-if="authStore.isAdmin" v-model="filters.userId" @change="onFilterChange" class="input-field w-auto">
          <option value="">Todos los usuarios</option>
          <option v-for="u in users" :key="u._id" :value="u._id">{{ u.name }}</option>
        </select>
        <select v-model="filters.platform" @change="onFilterChange" class="input-field w-auto">
          <option value="">Todas</option>
          <option v-for="p in platforms" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
    </div>

    <div class="space-y-2">
      <div v-if="loading" class="card p-4 space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3">
          <div class="skeleton w-9 h-9 rounded-lg shrink-0"></div>
          <div class="flex-1">
            <div class="skeleton h-4 w-32 rounded mb-2"></div>
            <div class="skeleton h-3 w-24 rounded"></div>
          </div>
        </div>
      </div>

      <template v-else>
        <ReportRow
          v-for="report in reportsStore.reports" :key="report._id"
          :report="report"
          @click="router.push(`/app/reports/${report._id}`)"
        />
        <div v-if="(reportsStore.reports?.length || 0) === 0" class="card py-12 text-center">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style="background: var(--rose-lighter);">
            <svg class="w-6 h-6" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="text-sm font-medium" style="color: var(--text-muted);">No se encontraron reportes</p>
          <p v-if="hasActiveFilters" class="text-xs mt-1" style="color: var(--text-muted); opacity: 0.7;">
            Intenta ajustar los filtros
          </p>
        </div>
      </template>
    </div>

    <div v-if="reportsStore.total > 0" class="flex items-center justify-between">
      <p class="text-xs" style="color: var(--text-muted);">
        Mostrando {{ reportsStore.reports?.length || 0 }} de {{ reportsStore.total }} reportes
      </p>
      <div class="flex items-center gap-2">
        <button @click="prevPage" :disabled="(reportsStore.pagination?.page || 1) <= 1" class="btn-secondary text-xs">
          Anterior
        </button>
        <span class="text-xs" style="color: var(--text-muted);">
          P&aacute;gina {{ reportsStore.pagination?.page || 1 }}
        </span>
        <button @click="nextPage" :disabled="(reportsStore.pagination?.page || 1) * (reportsStore.pagination?.limit || 10) >= reportsStore.total" class="btn-secondary text-xs">
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import ReportRow from '../../components/reports/ReportRow.vue'

const router = useRouter()
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const loading = ref(true)
const users = ref([])
const searchTimer = ref(null)
const filters = ref({ search: '', status: '', userId: '', platform: '' })

const platforms = ['Netflix', 'Spotify', 'HBO', 'Disney+', 'Prime Video', 'Crunchyroll', 'YouTube Premium', 'Otro']
const hasActiveFilters = computed(() => filters.value.search || filters.value.status || filters.value.platform)

function onSearch() {
  clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => onFilterChange(), 400)
}

function onFilterChange() {
  reportsStore.filters = { ...filters.value }
  loadReports(1)
}

function prevPage() {
  const page = (reportsStore.pagination?.page || 1) - 1
  if (page >= 1) loadReports(page)
}

function nextPage() {
  const page = (reportsStore.pagination?.page || 1) + 1
  loadReports(page)
}

async function loadReports(page = 1) {
  loading.value = true
  try {
    if (authStore.isAdmin) {
      await reportsStore.fetchReports({ ...filters.value, page })
    } else {
      await reportsStore.fetchMyReports({ ...filters.value, page })
    }
  } catch {
    // handled by store
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  reportsStore.resetFilters()
  filters.value = { search: '', status: '', userId: '', platform: '' }
  await loadReports()
  if (authStore.isAdmin) {
    try {
      const res = await reportsStore.fetchAdminUsers?.()
      if (res) users.value = res
    } catch { /* ignore */ }
  }
})
</script>
