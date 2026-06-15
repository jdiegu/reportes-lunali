<template>
  <div class="p-4 lg:p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl">Reportes</h1>
        <p class="text-sm mt-0.5" style="color: var(--text-muted);">
          {{ authStore.isAdmin ? 'Todos los reportes del sistema' : 'Tus reportes registrados' }}
        </p>
      </div>
    </div>

    <div class="card p-4">
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative flex-1 min-w-[180px]">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="filters.search" @input="onSearch" type="text" placeholder="Buscar..."
                 class="input-field pl-9 text-sm" />
        </div>
        <select v-model="filters.status" @change="onFilterChange" class="input-field w-auto text-sm">
          <option value="">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="in_progress">En proceso</option>
          <option value="resolved">Resuelto</option>
        </select>
        <select v-model="filters.platform" @change="onFilterChange" class="input-field w-auto text-sm">
          <option value="">Plataformas</option>
          <option v-for="p in platforms" :key="p" :value="p">{{ p }}</option>
        </select>
        <button @click="onFilterChange" class="btn-secondary text-xs h-[38px]">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="space-y-2">
      <div v-if="loading" class="card p-5 space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3">
          <div class="skeleton w-10 h-10 rounded-xl shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="skeleton h-4 w-36 rounded"></div>
            <div class="skeleton h-3 w-24 rounded"></div>
          </div>
        </div>
      </div>

      <template v-else>
        <div v-if="sortedReports.length === 0" class="card py-16 text-center">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--rose-lighter);">
            <svg class="w-7 h-7" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="text-sm font-medium" style="color: var(--text-muted);">No se encontraron reportes</p>
          <p v-if="hasFilters" class="text-xs mt-1" style="color: var(--text-muted); opacity: 0.7;">Intenta ajustar los filtros</p>
        </div>
        <ReportRow
          v-for="report in sortedReports" :key="report._id"
          :report="report"
          @click="router.push(`/app/reports/${report._id}`)"
        />
      </template>
    </div>

    <div v-if="sortedReports.length > 0" class="flex items-center justify-between pt-2">
      <p class="text-xs" style="color: var(--text-muted);">{{ sortedReports.length }} reporte(s)</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import ReportRow from '../../components/reports/ReportRow.vue'

const router = useRouter()
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const loading = ref(true)
const searchTimer = ref(null)
const filters = ref({ search: '', status: '', platform: '' })

const platforms = ['Netflix', 'Spotify', 'HBO', 'Disney+', 'Prime Video', 'Crunchyroll', 'YouTube Premium', 'Otro']
const hasFilters = computed(() => filters.value.search || filters.value.status || filters.value.platform)

const sortedReports = computed(() => {
  let list = [...(reportsStore.reports || [])]
  const { search, status, platform } = filters.value

  if (search) {
    const q = search.toLowerCase()
    list = list.filter(r => r.mail?.toLowerCase().includes(q) || r.platform?.toLowerCase().includes(q))
  }
  if (status) list = list.filter(r => r.status === status)
  if (platform) list = list.filter(r => r.platform === platform)

  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return list
})

function onSearch() {
  clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    filterReports()
  }, 300)
}

function onFilterChange() {
  filterReports()
}

async function filterReports() {
  if (authStore.isAdmin) {
    await reportsStore.fetchReports({ search: filters.value.search, status: filters.value.status })
  } else {
    await reportsStore.fetchMyReports({ search: filters.value.search, status: filters.value.status })
  }
}

onMounted(async () => {
  reportsStore.resetFilters()
  loading.value = true
  try {
    if (authStore.isAdmin) {
      await reportsStore.fetchReports({})
    } else {
      await reportsStore.fetchMyReports({})
    }
  } catch { }
  loading.value = false
})
</script>
