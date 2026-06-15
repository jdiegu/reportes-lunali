<template>
  <div class="p-4 lg:p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl">Administración</h1>
        <p class="text-sm mt-0.5" style="color: var(--text-muted);">Gestiona usuarios y reportes del sistema</p>
      </div>
      <button @click="refresh" class="btn-secondary text-xs" :disabled="loading">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Actualizar
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <div class="p-5 border-b" style="border-color: var(--border-color);">
          <h2 class="text-lg">Usuarios</h2>
          <p class="text-xs mt-0.5" style="color: var(--text-muted);">{{ users.length }} registrados</p>
        </div>
        <div v-if="loading" class="p-5 space-y-3">
          <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 rounded-xl" style="background: var(--bg-surface);">
            <div class="skeleton w-10 h-10 rounded-xl"></div>
            <div class="flex-1 space-y-2">
              <div class="skeleton h-4 w-28 rounded"></div>
              <div class="skeleton h-3 w-20 rounded"></div>
            </div>
          </div>
        </div>
        <div v-else-if="users.length === 0" class="py-16 text-center">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--rose-lighter);">
            <svg class="w-7 h-7" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
            </svg>
          </div>
          <p class="text-sm font-medium" style="color: var(--text-muted);">No hay usuarios</p>
        </div>
        <div v-else class="divide-y" style="border-color: var(--border-color);">
          <div v-for="user in users" :key="user._id"
               class="flex items-center gap-3 px-5 py-3.5 transition-colors">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                 style="background: var(--rose-gradient); color: white;">
              {{ (user.name || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ user.name || 'Usuario' }}</p>
              <p class="text-xs truncate" style="color: var(--text-muted);">
                {{ user.role === 'admin' || user.role === 'boss' ? 'Admin' : 'Usuario' }}
                <span v-if="user.reportCount !== undefined"> · {{ user.reportCount }} reportes</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="p-5 border-b" style="border-color: var(--border-color);">
          <h2 class="text-lg">Pendientes</h2>
          <p class="text-xs mt-0.5" style="color: var(--text-muted);">{{ pendingList.length }} por resolver</p>
        </div>
        <div v-if="loading" class="p-5 space-y-3">
          <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 rounded-xl" style="background: var(--bg-surface);">
            <div class="skeleton w-10 h-10 rounded-xl"></div>
            <div class="flex-1 space-y-2">
              <div class="skeleton h-4 w-28 rounded"></div>
              <div class="skeleton h-3 w-20 rounded"></div>
            </div>
          </div>
        </div>
        <div v-else-if="pendingList.length === 0" class="py-16 text-center">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--rose-lighter);">
            <svg class="w-7 h-7" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-sm font-medium" style="color: var(--text-muted);">Todos resueltos</p>
        </div>
        <div v-else class="divide-y" style="border-color: var(--border-color);">
          <RouterLink v-for="report in pendingList" :key="report._id"
            :to="`/app/reports/${report._id}`"
            class="flex items-center gap-3 px-5 py-3.5 transition-colors no-underline"
            style="color: var(--text-secondary);"
            @mouseenter="e => e.currentTarget.style.background = 'var(--bg-surface)'"
            @mouseleave="e => e.currentTarget.style.background = 'transparent'">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                 style="background: var(--rose-lighter); color: var(--rose-primary);">
              {{ (report.platform || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.platform }}</p>
              <p class="text-xs truncate" style="color: var(--text-muted);">{{ report.mail }}</p>
            </div>
            <span :class="report.status === 'in_progress' ? 'badge badge-progress' : 'badge badge-pending'">
              {{ report.status === 'in_progress' ? 'En proceso' : 'Pendiente' }}
            </span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useReportsStore } from '../../store/reports'

const reportsStore = useReportsStore()
const loading = ref(true)
const users = ref([])
const pendingList = ref([])

async function refresh() {
  loading.value = true
  try {
    const [userData, reportData] = await Promise.all([
      reportsStore.fetchAdminUsers?.(),
      reportsStore.fetchAdminReports?.()
    ])
    if (userData) users.value = userData
    if (reportData) pendingList.value = reportData.filter(r => r.status !== 'resolved')
  } catch {
    users.value = []
    pendingList.value = []
  }
  loading.value = false
}

onMounted(refresh)
</script>
