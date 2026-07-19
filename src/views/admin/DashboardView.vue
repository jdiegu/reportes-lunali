<template>
  <div class="p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6">
    <div class="flex items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl">Inicio</h1>
        <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">Bienvenido, {{ authStore.user?.name || authStore.user?.username }}</p>
      </div>
      <RouterLink v-if="!authStore.isAdmin" to="/app/reports/new" class="btn-primary text-xs sm:text-sm !py-2 !px-3 sm:!px-4 shrink-0">
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        <span class="hidden sm:inline">Nuevo reporte</span>
        <span class="sm:hidden">Nuevo</span>
      </RouterLink>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard v-for="stat in stats" :key="stat.label" :stat="stat" :loading="loading" />
    </div>

    <RouterLink v-if="!authStore.isAdmin" to="/app/balance"
      class="card p-4 sm:p-5 flex items-center gap-4 no-underline transition-all duration-200 card-hover"
      style="color: var(--text-secondary);">
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
           style="background: var(--success-bg);">
        <svg class="w-6 h-6" style="color: var(--success);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Mi saldo</p>
        <p class="text-xl sm:text-2xl font-display font-bold" style="color: var(--success);">${{ (authStore.balance || 0).toFixed(2) }}</p>
      </div>
      <svg class="w-4 h-4 shrink-0" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
      </svg>
    </RouterLink>

    <div class="card">
      <div class="p-4 sm:p-5 border-b flex items-center justify-between" :style="{ borderColor: 'var(--border-color)' }">
        <h2 class="text-base sm:text-lg">{{ authStore.isAdmin ? 'Ultimos reportes' : 'Tus reportes recientes' }}</h2>
        <RouterLink to="/app/reports" class="text-xs font-medium no-underline transition-colors" style="color: var(--rose-primary);">
          Ver todos &rarr;
        </RouterLink>
      </div>

      <div v-if="loading" class="p-4 sm:p-5 space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3">
          <div class="skeleton w-10 h-10 rounded-xl shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="skeleton h-4 w-36 rounded"></div>
            <div class="skeleton h-3 w-24 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="recentList.length === 0" class="py-12 sm:py-16 text-center px-4">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--rose-lighter);">
          <svg class="w-7 h-7" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="text-sm font-medium" style="color: var(--text-muted);">No hay reportes aun</p>
        <RouterLink v-if="!authStore.isAdmin" to="/app/reports/new" class="btn-primary text-xs mt-4 inline-flex">Crear primer reporte</RouterLink>
      </div>

      <div v-else class="divide-y" :style="{ borderColor: 'var(--border-color)' }">
        <RouterLink
          v-for="report in recentList" :key="report._id"
          :to="`/app/reports/${report._id}`"
          class="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 transition-colors no-underline"
          style="color: var(--text-secondary);"
          @mouseenter="e => e.currentTarget.style.background = 'var(--bg-surface)'"
          @mouseleave="e => e.currentTarget.style.background = 'transparent'">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
               style="background: var(--rose-lighter); color: var(--rose-primary);">
            {{ report.platform?.charAt(0).toUpperCase() || '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.platform }}</p>
            <p class="text-xs truncate" style="color: var(--text-muted);">{{ report.mail }}</p>
          </div>
          <div class="text-right shrink-0">
            <span :class="statusBadge(report.status)">{{ statusLabel(report.status) }}</span>
            <p class="text-[10px] mt-0.5" style="color: var(--text-muted);">{{ dateAgo(report.createdAt) }}</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import StatCard from '../../components/ui/StatCard.vue'

const authStore = useAuthStore()
const reportsStore = useReportsStore()
const loading = ref(true)
const allReports = ref([])

const recentList = computed(() => {
  return [...allReports.value]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(0, 5)
})

const stats = computed(() => [
  { label: 'Total', value: allReports.value.length, icon: 'list', color: 'rose' },
  { label: 'Pendientes', value: allReports.value.filter(r => r.status === 'pending').length, icon: 'clock', color: 'amber' },
  { label: 'En proceso', value: allReports.value.filter(r => r.status === 'in_progress').length, icon: 'refresh', color: 'blue' },
  { label: 'Resueltos', value: allReports.value.filter(r => r.status === 'resolved').length, icon: 'check', color: 'emerald' },
])

function dateAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60) return 'Ahora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

function statusBadge(status) {
  return { pending: 'badge badge-pending', in_progress: 'badge badge-progress', resolved: 'badge badge-resolved' }[status] || 'badge badge-pending'
}

function statusLabel(status) {
  return { pending: 'Pendiente', in_progress: 'En proceso', resolved: 'Resuelto' }[status] || status
}

onMounted(async () => {
  loading.value = true
  try {
    if (authStore.isAdmin) {
      await reportsStore.fetchReports({})
    } else {
      await reportsStore.fetchMyReports({})
    }
    allReports.value = reportsStore.reports || []
  } catch {
    allReports.value = []
  }
  loading.value = false
})
</script>
