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

    <!-- KPI -->
    <div class="grid grid-cols-2 gap-3 sm:gap-4" :class="authStore.isAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4'">
      <StatWaveCard
        v-for="stat in stats" :key="stat.key" :stat="stat" :loading="loading"
        :class="{ 'col-span-2 lg:col-span-1': authStore.isAdmin && stat.key === 'resolved' }"
      />
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
        <button @click="exportXls" :disabled="exporting" title="Exportar todos los correos de los filtros activos" class="btn-secondary text-xs !h-[38px] !px-3 shrink-0" style="color: var(--rose-primary);">
          <Download class="w-4 h-4" />
          <span class="hidden md:inline">{{ exporting ? 'Exportando...' : 'Exportar' }}</span>
        </button>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div class="min-w-0 col-span-2 lg:col-span-1">
          <p class="input-label !text-[10px] !mb-1.5">Estado</p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="opt in STATUS_OPTIONS" :key="opt.value" type="button"
              @click="toggleStatus(opt.value)"
              class="px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer"
              :style="filters.status.includes(opt.value)
                ? { background: 'var(--rose-lighter)', borderColor: 'var(--rose-primary)', color: 'var(--rose-primary)' }
                : { borderColor: 'var(--border-color)', color: 'var(--text-muted)' }"
            >{{ opt.label }}</button>
          </div>
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
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <div v-for="i in 6" :key="i" class="card p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div class="skeleton h-5 w-20 rounded"></div>
            <div class="skeleton w-7 h-7 rounded-lg"></div>
          </div>
          <div class="flex items-center gap-2.5">
            <div class="skeleton w-10 h-10 rounded-xl shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="skeleton h-4 w-24 rounded"></div>
              <div class="skeleton h-3 w-32 rounded"></div>
            </div>
          </div>
          <div class="flex gap-1.5">
            <div class="skeleton h-4 w-16 rounded"></div>
            <div class="skeleton h-4 w-14 rounded"></div>
          </div>
          <div class="skeleton h-3 w-full rounded"></div>
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
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          <ReportCard
            v-for="report in sortedReports" :key="report._id"
            :report="report"
            :show-user="authStore.isAdmin"
            @navigate="router.push(`/app/reports/${report._id}`)"
            @resolve="openResolve"
            @edit-resolution="openEditResolution"
            @toggle-status="onToggleStatus"
          />
        </div>
      </template>
    </div>

    <div v-if="sortedReports.length > 0" class="flex items-center justify-between pt-1">
      <p class="text-xs" style="color: var(--text-muted);">{{ sortedReports.length }} reporte(s)</p>
    </div>

    <ResolvModal
      :visible="showResolveModal"
      :report="activeReport"
      @close="showResolveModal = false"
      @resolved="onResolved"
    />
    <ResolvModal
      :visible="showEditModal"
      :report="activeReport"
      :editing-resolution="activeReport?.resolution"
      @close="showEditModal = false"
      @resolved="onResolved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import { usePlatformsStore } from '../../store/platforms'
import ReportCard from '../../components/reports/ReportCard.vue'
import ResolvModal from '../../components/reports/ResolvModal.vue'
import StatWaveCard from '../../components/ui/StatWaveCard.vue'
import { useToastStore } from '../../store/toast'
import { ArrowUpDown, Search, RefreshCw, FileText, X, Download } from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const platformsStore = usePlatformsStore()
const toast = useToastStore()
const loading = ref(true)
const searchTimer = ref(null)
const sortAsc = ref(false)

const showResolveModal = ref(false)
const showEditModal = ref(false)
const activeReport = ref(null)

function openResolve(report) {
  activeReport.value = report
  showResolveModal.value = true
}

function openEditResolution(report) {
  activeReport.value = report
  showEditModal.value = true
}

async function onResolved() {
  showResolveModal.value = false
  showEditModal.value = false
  try { await filterReports() } catch { }
}

async function onToggleStatus(report) {
  try {
    const newStatus = report.status === 'pending' ? 'in_progress' : 'pending'
    await reportsStore.updateStatus(report._id, newStatus)
    toast.success('Estado actualizado', `Marcado como "${newStatus === 'in_progress' ? 'En proceso' : 'Pendiente'}"`)
    await filterReports()
  } catch {
    toast.error('Error', 'No se pudo actualizar el estado')
  }
}

const FILTERS_KEY = 'lunali.reportFilters'
const VALID_STATUS = ['pending', 'in_progress', 'resolved']
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En proceso' },
  { value: 'resolved', label: 'Resuelto' },
]

function normalizeStatuses(value) {
  if (Array.isArray(value)) return value.filter(s => VALID_STATUS.includes(s))
  if (VALID_STATUS.includes(value)) return [value]
  return []
}

function loadSavedFilters() {
  try {
    const saved = JSON.parse(localStorage.getItem(FILTERS_KEY) || '{}')
    return {
      search: typeof saved.search === 'string' ? saved.search : '',
      status: normalizeStatuses(saved.status),
      platform: typeof saved.platform === 'string' ? saved.platform : '',
      dateFrom: typeof saved.dateFrom === 'string' ? saved.dateFrom : '',
      dateTo: typeof saved.dateTo === 'string' ? saved.dateTo : '',
    }
  } catch {
    return { search: '', status: [], platform: '', dateFrom: '', dateTo: '' }
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
  () => [filters.value.search, filters.value.status.join(','), filters.value.platform, filters.value.dateFrom, filters.value.dateTo],
  ([search, status, platform, dateFrom, dateTo]) => {
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify({ search, status: filters.value.status, platform, dateFrom, dateTo }))
    } catch { }
  },
)

const hasFilters = computed(() => filters.value.search || filters.value.status.length > 0 || filters.value.platform || filters.value.dateFrom || filters.value.dateTo)

const startOfMonth = () => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d }
const startOfLastMonth = () => { const d = new Date(); d.setMonth(d.getMonth() - 1); d.setDate(1); d.setHours(0,0,0,0); return d }
const endOfLastMonth = () => { const d = new Date(); d.setDate(0); d.setHours(23,59,59,999); return d }

const stats = computed(() => {
  const reports = reportsStore.reports || []
  const start = startOfMonth()
  const monthReports = reports.filter(r => new Date(r.createdAt) >= start)
  const total = monthReports.length
  const pending = monthReports.filter(r => r.status === 'pending').length
  const inProgress = monthReports.filter(r => r.status === 'in_progress').length
  const resolved = monthReports.filter(r => r.status === 'resolved').length
  const overdue = reports.filter(r => {
    if (r.status === 'resolved') return false
    const created = new Date(r.createdAt)
    return !isNaN(created.getTime()) && (Date.now() - created.getTime()) > 4 * 24 * 60 * 60 * 1000
  }).length
  const unresolved = reports.filter(r => r.status !== 'resolved').length
  const pctOf = (n, base) => (base > 0 ? (n / base) * 100 : 0)

  const totalLastMonth = reports.filter(r => {
    const d = new Date(r.createdAt)
    return d >= startOfLastMonth() && d <= endOfLastMonth()
  }).length

  const monthName = new Date().toLocaleDateString('es-ES', { month: 'long' })
  const list = [
    { key: 'total', label: `Total (${monthName})`, value: total, sub: `${total - totalLastMonth} vs. mes pasado`, trend: totalLastMonth > 0 ? Math.round(((total - totalLastMonth) / totalLastMonth) * 100) : 0, trendUp: total >= totalLastMonth, icon: 'list', color: 'rose', pct: 100 },
    { key: 'overdue', label: 'Atrasados', value: overdue, sub: '+4 días sin resolver', trend: 0, trendUp: false, icon: 'alert', color: 'red', pct: pctOf(overdue, unresolved) },
    { key: 'pending', label: 'Pendientes', value: pending, sub: 'Este mes', trend: 0, trendUp: true, icon: 'clock', color: 'amber', pct: pctOf(pending, total) },
    { key: 'in_progress', label: 'En proceso', value: inProgress, sub: 'Este mes', trend: 0, trendUp: false, icon: 'refresh', color: 'blue', pct: pctOf(inProgress, total) },
    { key: 'resolved', label: 'Resueltos', value: resolved, sub: 'Este mes', trend: 0, trendUp: true, icon: 'check', color: 'emerald', pct: pctOf(resolved, total) },
  ]
  return authStore.isAdmin ? list : list.filter(s => s.key !== 'overdue')
})

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
  if (status.length) list = list.filter(r => status.includes(r.status))
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

function toggleStatus(value) {
  const i = filters.value.status.indexOf(value)
  if (i === -1) filters.value.status.push(value)
  else filters.value.status.splice(i, 1)
  filterReports()
}

function onFilterChange() {
  filterReports()
}

const exporting = ref(false)

const pad2 = (n) => String(n).padStart(2, '0')

function xmlEsc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function exportXls() {
  const list = sortedReports.value
  if (exporting.value) return
  if (!list.length) {
    toast.info('Sin datos', 'No hay correos para exportar con los filtros actuales')
    return
  }
  exporting.value = true
  try {
    const rows = []
    for (const r of list) {
      const reporter = r.user?.name || r.user?.username || ''
      const emails = r.is_batch && r.batch_emails?.length ? r.batch_emails : [r.mail]
      for (const e of emails) rows.push([e || '', r.platform || '', reporter])
    }
    const tableRows = [['Correo', 'Plataforma', 'Reportado por'], ...rows]
      .map(row => `   <Row>${row.map(c => `<Cell><Data ss:Type="String">${xmlEsc(c)}</Data></Cell>`).join('')}</Row>`)
      .join('\n')
    const xml = `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n  <Worksheet ss:Name="Correos">\n    <Table>\n${tableRows}\n    </Table>\n  </Worksheet>\n</Workbook>`
    const blob = new Blob(['\uFEFF' + xml], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const now = new Date()
    a.href = url
    a.download = `correos_${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}.xls`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Exportado', `${rows.length} correo(s) exportado(s)`)
  } catch {
    toast.error('Error', 'No se pudo exportar')
  } finally {
    exporting.value = false
  }
}

async function filterReports() {
  const status = filters.value.status.join(',')
  if (authStore.isAdmin) {
    await reportsStore.fetchReports({ search: filters.value.search, status })
  } else {
    await reportsStore.fetchMyReports({ search: filters.value.search, status })
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
