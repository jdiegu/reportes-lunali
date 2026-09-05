<template>
  <div class="p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6">
    <div class="flex items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl">Inicio</h1>
        <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">Bienvenido, {{ authStore.user?.name || authStore.user?.username }}</p>
      </div>
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
        <div class="flex items-center gap-2.5">
          <h2 class="text-base sm:text-lg">{{ authStore.isAdmin ? 'Reportes sin resolver' : 'Tus reportes pendientes' }}</h2>
          
        </div>
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

      <div v-else-if="pendingList.length === 0" class="py-12 sm:py-16 text-center px-4">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--success-bg);">
          <svg class="w-7 h-7" style="color: var(--success);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-sm font-medium" style="color: var(--text-muted);">Todo resuelto</p>
        <p class="text-xs mt-1" style="color: var(--text-muted); opacity: 0.7;">No hay reportes pendientes ni en proceso</p>
      </div>

      <div v-else class="space-y-2">
        <RouterLink
          v-for="report in pendingList" :key="report._id"
          :to="`/app/reports/${report._id}`"
          class="block no-underline"
          style="color: var(--text-secondary);"
        >
          <ReportRow :report="report" :show-user="authStore.isAdmin" />
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
import ReportRow from '../../components/reports/ReportRow.vue'

const authStore = useAuthStore()
const reportsStore = useReportsStore()
const loading = ref(true)
const allReports = ref([])

const pendingList = computed(() => {
  return allReports.value
    .filter(r => r.status === 'pending' || r.status === 'in_progress')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(0, 8)
})

const stats = computed(() => [
  { label: 'Total', value: allReports.value.length, icon: 'list', color: 'rose' },
  { label: 'Pendientes', value: allReports.value.filter(r => r.status === 'pending').length, icon: 'clock', color: 'amber' },
  { label: 'En proceso', value: allReports.value.filter(r => r.status === 'in_progress').length, icon: 'refresh', color: 'blue' },
  { label: 'Resueltos', value: allReports.value.filter(r => r.status === 'resolved').length, icon: 'check', color: 'emerald' },
])

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
