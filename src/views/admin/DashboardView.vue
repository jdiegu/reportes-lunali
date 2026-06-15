<template>
  <div class="p-4 lg:p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-display font-bold" style="color: var(--text-primary);">
          {{ authStore.isAdmin ? 'Panel de Control' : 'Mis Reportes' }}
        </h1>
        <p class="text-sm mt-0.5" style="color: var(--text-muted);">
          Bienvenido, {{ authStore.user?.name }}
        </p>
      </div>
      <RouterLink v-if="!authStore.isAdmin" to="/app/reports/new" class="btn-primary text-xs">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nuevo reporte
      </RouterLink>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard v-for="stat in stats" :key="stat.label" :stat="stat" :loading="loading" />
    </div>

    <div class="card">
      <div class="p-5 border-b flex items-center justify-between" style="border-color: var(--border-color);">
        <h2 class="font-display font-bold" style="color: var(--text-primary);">
          {{ authStore.isAdmin ? '&Uacute;ltimos reportes' : 'Tus reportes recientes' }}
        </h2>
        <RouterLink to="/app/reports" class="text-xs font-medium transition-colors no-underline" style="color: var(--rose-primary);">
          Ver todos &rarr;
        </RouterLink>
      </div>

      <div v-if="loading" class="p-5 space-y-3">
        <div v-for="i in 4" :key="i" class="flex items-center gap-3">
          <div class="skeleton w-9 h-9 rounded-lg shrink-0"></div>
          <div class="flex-1">
            <div class="skeleton h-4 w-32 rounded mb-2"></div>
            <div class="skeleton h-3 w-24 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="recentReports.length === 0" class="py-12 text-center">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style="background: var(--rose-lighter);">
          <svg class="w-6 h-6" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="text-sm font-medium" style="color: var(--text-muted);">No hay reportes</p>
        <RouterLink v-if="!authStore.isAdmin" to="/app/reports/new" class="btn-primary text-xs mt-4 inline-flex">
          Crear primer reporte
        </RouterLink>
      </div>

      <div v-else class="divide-y" style="border-color: var(--border-color);">
        <RouterLink
          v-for="report in recentReports" :key="report._id"
          :to="`/app/reports/${report._id}`"
          class="flex items-center gap-3 px-5 py-3.5 transition-colors no-underline"
          style="color: var(--text-secondary);"
          @mouseenter="e => e.currentTarget.style.background = 'var(--bg-surface)'"
          @mouseleave="e => e.currentTarget.style.background = 'transparent'">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium shrink-0"
               style="background: var(--rose-lighter); color: var(--rose-primary);">
            {{ report.platform?.charAt(0).toUpperCase() || '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.platform }}</p>
            <p class="text-xs truncate" style="color: var(--text-muted);">{{ report.mail }}</p>
          </div>
          <div class="text-right shrink-0">
            <span :class="statusBadge(report.status)">{{ statusLabel(report.status) }}</span>
            <p class="text-xs mt-0.5" style="color: var(--text-muted);">{{ dateAgo(report.createdAt) }}</p>
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
const reports = ref([]) // local copy for reactivity

const recentReports = computed(() => reports.value.slice(0, 5))

const stats = computed(() => [
  { label: 'Total reportes', value: reports.value.length, icon: 'list', color: 'rose' },
  { label: 'Pendientes', value: reports.value.filter(r => r.status === 'pending').length, icon: 'clock', color: 'amber' },
  { label: 'En proceso', value: reports.value.filter(r => r.status === 'in_progress').length, icon: 'refresh', color: 'blue' },
  { label: 'Resueltos', value: reports.value.filter(r => r.status === 'resolved').length, icon: 'check', color: 'emerald' },
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
      await reportsStore.fetchReports({ status: '' })
    } else {
      await reportsStore.fetchMyReports()
    }
    reports.value = reportsStore.reports || []
  } catch {
    reports.value = []
  } finally {
    loading.value = false
  }
})
</script>
