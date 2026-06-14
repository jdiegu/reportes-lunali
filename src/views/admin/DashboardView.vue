<template>
  <div class="p-4 lg:p-8 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8 animate-fade-up">
      <h1 class="page-title">
        Hola, <span class="text-rose-400">{{ firstName }}</span> 👋
      </h1>
      <p class="page-subtitle">
        {{ authStore.isAdmin ? 'Panel de control · Revisa los reportes pendientes' : 'Bienvenido · Consulta el estado de tus reportes' }}
      </p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        v-for="(stat, i) in stats"
        :key="stat.label"
        :stat="stat"
        :loading="reportsStore.loading"
        :class="`animate-fade-up animate-delay-${(i+1)*100} opacity-0-init`"
      />
    </div>

    <!-- Content grid -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Recent reports -->
      <div class="lg:col-span-2 glass-card p-6 animate-fade-up animate-delay-300 opacity-0-init">
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-display text-lg font-bold text-blush-100">Reportes recientes</h2>
          <RouterLink to="/reports" class="btn-ghost text-xs">Ver todos →</RouterLink>
        </div>

        <div v-if="reportsStore.loading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="skeleton h-14 rounded-xl"></div>
        </div>

        <div v-else-if="!recentReports.length" class="text-center py-12 text-blush-600">
          <svg class="w-10 h-10 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="text-sm">Sin reportes aún</p>
        </div>

        <div v-else class="space-y-2">
          <ReportRow
            v-for="report in recentReports"
            :key="report._id"
            :report="report"
            @click="router.push(`/reports/${report._id}`)"
          />
        </div>
      </div>

      <!-- Quick actions / info panel -->
      <div class="space-y-4">
        <!-- Quick action card -->
        <div class="glass-card p-5 animate-fade-up animate-delay-400 opacity-0-init">
          <h3 class="font-display text-base font-bold text-blush-100 mb-4">Acciones rápidas</h3>
          <div class="space-y-2">
            <RouterLink v-if="!authStore.isAdmin" to="/reports/new" class="btn-primary w-full">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Crear nuevo reporte
            </RouterLink>
            <RouterLink to="/reports" class="btn-secondary w-full">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              Ver todos los reportes
            </RouterLink>
            <RouterLink v-if="authStore.isAdmin" to="/admin" class="btn-secondary w-full">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
              </svg>
              Panel de admin
            </RouterLink>
          </div>
        </div>

        <!-- Status legend -->
        <div class="glass-card p-5 animate-fade-up animate-delay-500 opacity-0-init">
          <h3 class="font-display text-base font-bold text-blush-100 mb-4">Estados</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <span class="badge-pending">Pendiente</span>
              <span class="text-blush-500 text-xs">En espera de revisión</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="badge-progress">En proceso</span>
              <span class="text-blush-500 text-xs">Siendo atendido</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="badge-resolved">Resuelto</span>
              <span class="text-blush-500 text-xs">Solución aplicada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import StatCard from '../../components/ui/StatCard.vue'
import ReportRow from '../../components/reports/ReportRow.vue'

const authStore = useAuthStore()
const reportsStore = useReportsStore()
const router = useRouter()

const firstName = computed(() => authStore.user?.name?.split(' ')[0] || 'Usuario')
const recentReports = computed(() => reportsStore.reports.slice(0, 5))

const stats = computed(() => {
  const all = reportsStore.reports
  return [
    { label: 'Total', value: reportsStore.total, icon: 'list', color: 'rose' },
    { label: 'Pendientes', value: all.filter(r => r.status === 'pending').length, icon: 'clock', color: 'amber' },
    { label: 'En proceso', value: all.filter(r => r.status === 'in_progress').length, icon: 'refresh', color: 'blue' },
    { label: 'Resueltos', value: all.filter(r => r.status === 'resolved').length, icon: 'check', color: 'emerald' },
  ]
})

onMounted(() => {
  reportsStore.fetchReports()
})
</script>