<template>
  <div class="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
    <div class="flex items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl">Reportes</h1>
        <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">
          {{ authStore.isAdmin ? 'Todos los reportes del sistema' : 'Tus reportes registrados' }}
        </p>
      </div>
      <button @click="sortAsc = !sortAsc" class="btn-ghost text-xs !px-3 !py-2 gap-1.5 shrink-0" :title="sortAsc ? 'Mas antiguos primero' : 'Mas recientes primero'" style="color: var(--rose-primary);">
        <ArrowUpDown class="w-4 h-4" />
        {{ sortAsc ? 'Antiguos' : 'Recientes' }}
      </button>
    </div>

    <div class="card p-3 sm:p-4 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5">
        <div class="relative flex-1 min-w-0">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--rose-primary);" />
          <input v-model="filters.search" @input="onSearch" type="text" placeholder="Buscar cuenta o persona..."
                 class="input-field pl-9 pr-9 text-sm" />
          <button
            v-if="filters.search"
            @click="clearSearch"
            title="Limpiar busqueda"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full transition-colors"
            style="color: var(--text-muted);"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        <button @click="onFilterChange" title="Aplicar filtros" class="btn-secondary text-xs !h-[38px] !px-3 shrink-0" style="color: var(--rose-primary);">
          <RefreshCw class="w-4 h-4" />
          <span class="hidden md:inline">Aplicar</span>
        </button>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div class="min-w-0">
          <p class="input-label !text-[10px] !mb-1.5">Estado</p>
          <select v-model="filters.status" @change="onFilterChange" class="input-field text-sm">
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En proceso</option>
            <option value="resolved">Resuelto</option>
          </select>
        </div>
        <div class="min-w-0">
          <p class="input-label !text-[10px] !mb-1.5">Plataforma</p>
          <select v-model="filters.platform" @change="onFilterChange" class="input-field text-sm">
            <option value="">Todas</option>
            <option v-for="p in platformsStore.platformNames" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
        <div class="min-w-0">
          <p class="input-label !text-[10px] !mb-1.5">Creado desde</p>
          <input v-model="filters.dateFrom" type="date" :max="filters.dateTo || undefined" @change="onFilterChange" class="input-field text-sm" />
        </div>
        <div class="min-w-0">
          <p class="input-label !text-[10px] !mb-1.5">Creado hasta</p>
          <input v-model="filters.dateTo" type="date" :min="filters.dateFrom || undefined" @change="onFilterChange" class="input-field text-sm" />
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <div v-if="loading" class="card p-4 sm:p-5 space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3">
          <div class="skeleton w-10 h-10 rounded-xl shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="skeleton h-4 w-36 rounded"></div>
            <div class="skeleton h-3 w-24 rounded"></div>
          </div>
        </div>
      </div>

      <template v-else>
        <div v-if="sortedReports.length === 0" class="card py-12 sm:py-16 text-center px-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--rose-lighter);">
            <FileText class="w-7 h-7" style="color: var(--rose-primary);" />
          </div>
          <p class="text-sm font-medium" style="color: var(--text-muted);">No se encontraron reportes</p>
          <p v-if="hasFilters" class="text-xs mt-1" style="color: var(--text-muted); opacity: 0.7;">Intenta ajustar los filtros</p>
        </div>
        <ReportRow
          v-for="report in sortedReports" :key="report._id"
          :report="report"
          :show-user="authStore.isAdmin"
          @click="router.push(`/app/reports/${report._id}`)"
        />
      </template>
    </div>

    <div v-if="sortedReports.length > 0" class="flex items-center justify-between pt-1">
      <p class="text-xs" style="color: var(--text-muted);">{{ sortedReports.length }} reporte(s)</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import { usePlatformsStore } from '../../store/platforms'
import ReportRow from '../../components/reports/ReportRow.vue'
import { ArrowUpDown, Search, RefreshCw, FileText, X } from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const platformsStore = usePlatformsStore()
const loading = ref(true)
const searchTimer = ref(null)
const sortAsc = ref(false)

const FILTERS_KEY = 'sarita.reportFilters'
const VALID_STATUS = ['pending', 'in_progress', 'resolved']

function loadSavedFilters() {
  try {
    const saved = JSON.parse(localStorage.getItem(FILTERS_KEY) || '{}')
    return {
      search: typeof saved.search === 'string' ? saved.search : '',
      status: VALID_STATUS.includes(saved.status) ? saved.status : '',
      platform: typeof saved.platform === 'string' ? saved.platform : '',
      dateFrom: typeof saved.dateFrom === 'string' ? saved.dateFrom : '',
      dateTo: typeof saved.dateTo === 'string' ? saved.dateTo : '',
    }
  } catch {
    return { search: '', status: '', platform: '', dateFrom: '', dateTo: '' }
  }
}

const savedFilters = loadSavedFilters()
const filters = ref({
  search: savedFilters.search,
  status: savedFilters.status,
  platform: savedFilters.platform,
  dateFrom: savedFilters.dateFrom,
  dateTo: savedFilters.dateTo,
})

watch(
  () => [filters.value.search, filters.value.status, filters.value.platform, filters.value.dateFrom, filters.value.dateTo],
  ([search, status, platform, dateFrom, dateTo]) => {
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify({ search, status, platform, dateFrom, dateTo }))
    } catch { }
  },
)

const hasFilters = computed(() => filters.value.search || filters.value.status || filters.value.platform || filters.value.dateFrom || filters.value.dateTo)

const sortedReports = computed(() => {
  let list = [...(reportsStore.reports || [])]
  const { search, status, platform, dateFrom, dateTo } = filters.value

  if (search) {
    const q = search.toLowerCase()
    list = list.filter(r => {
      const mail = (r.mail || '').toLowerCase()
      const platform = (r.platform || '').toLowerCase()
      const batchEmails = (r.batch_emails || []).map(e => (e || '').toLowerCase()).join(' ')
      const replacedMail = (r.resolution?.replaced_mail || '').toLowerCase()
      const replacedMails = (r.resolution?.replaced_mails || []).map(e => (e || '').toLowerCase()).join(' ')
      const username = (r.user?.username || '').toLowerCase()
      const name = (r.user?.name || '').toLowerCase()
      return mail.includes(q) || platform.includes(q) || batchEmails.includes(q)
        || replacedMail.includes(q) || replacedMails.includes(q)
        || username.includes(q) || name.includes(q)
    })
  }
  if (status) list = list.filter(r => r.status === status)
  if (platform) list = list.filter(r => r.platform === platform)
  if (dateFrom) {
    const from = new Date(`${dateFrom}T00:00:00`)
    list = list.filter(r => new Date(r.createdAt) >= from)
  }
  if (dateTo) {
    const to = new Date(`${dateTo}T23:59:59.999`)
    list = list.filter(r => new Date(r.createdAt) <= to)
  }

  list.sort((a, b) => sortAsc.value
    ? new Date(a.createdAt) - new Date(b.createdAt)
    : new Date(b.createdAt) - new Date(a.createdAt)
  )
  return list
})

function onSearch() {
  clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    filterReports()
  }, 300)
}

function clearSearch() {
  filters.value.search = ''
  onSearch()
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
    await platformsStore.fetch()
    if (authStore.isAdmin) {
      await reportsStore.fetchReports({})
    } else {
      await reportsStore.fetchMyReports({})
    }
  } catch { }
  loading.value = false
})
</script>
