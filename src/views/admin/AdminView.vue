<template>
  <div class="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
    <div class="flex items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl">Administracion</h1>
        <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">Gestiona usuarios y reportes del sistema</p>
      </div>
      <button @click="refresh" class="btn-secondary text-xs sm:text-sm shrink-0" :disabled="loading">
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span class="hidden sm:inline">Actualizar</span>
      </button>
    </div>

    <div class="card p-3 sm:p-4">
      <div class="relative">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Buscar usuario por nombre..."
               class="input-field pl-10 text-sm" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
      <div class="card">
        <div class="p-4 sm:p-5 border-b" :style="{ borderColor: 'var(--border-color)' }">
          <h2 class="text-base sm:text-lg">Usuarios</h2>
          <p class="text-xs mt-0.5" style="color: var(--text-muted);">{{ filteredUsers.length }} registrados</p>
        </div>
        <div v-if="loading" class="p-4 sm:p-5 space-y-3">
          <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 rounded-xl" style="background: var(--bg-surface);">
            <div class="skeleton w-10 h-10 rounded-xl"></div>
            <div class="flex-1 space-y-2">
              <div class="skeleton h-4 w-28 rounded"></div>
              <div class="skeleton h-3 w-20 rounded"></div>
            </div>
          </div>
        </div>
        <div v-else-if="filteredUsers.length === 0" class="py-12 sm:py-16 text-center px-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--rose-lighter);">
            <svg class="w-7 h-7" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
            </svg>
          </div>
          <p class="text-sm font-medium" style="color: var(--text-muted);">{{ searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios' }}</p>
        </div>
        <div v-else class="divide-y" :style="{ borderColor: 'var(--border-color)' }">
          <RouterLink v-for="u in filteredUsers" :key="u._id"
            :to="`/app/admin/users/${u._id}`"
            class="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 transition-colors no-underline"
            style="color: var(--text-secondary);"
            @mouseenter="e => e.currentTarget.style.background = 'var(--bg-surface)'"
            @mouseleave="e => e.currentTarget.style.background = 'transparent'">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
                 style="background: var(--rose-gradient); color: white;">
              {{ (u.username || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ u.username }}</p>
              <p class="text-xs truncate" style="color: var(--text-muted);">
                {{ u.role === 'admin' || u.role === 'boss' ? 'Admin' : 'Usuario' }}
                <span v-if="u.phone"> · {{ u.phone }}</span>
              </p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-mono font-semibold" style="color: var(--success);">${{ (u.balance || 0).toFixed(2) }}</p>
              <p class="text-[10px]" style="color: var(--text-muted);">saldo</p>
            </div>
          </RouterLink>
        </div>
      </div>

      <div class="card">
        <div class="p-4 sm:p-5 border-b" :style="{ borderColor: 'var(--border-color)' }">
          <h2 class="text-base sm:text-lg">Reportes pendientes</h2>
          <p class="text-xs mt-0.5" style="color: var(--text-muted);">{{ pendingList.length }} por resolver</p>
        </div>
        <div v-if="loading" class="p-4 sm:p-5 space-y-3">
          <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 rounded-xl" style="background: var(--bg-surface);">
            <div class="skeleton w-10 h-10 rounded-xl"></div>
            <div class="flex-1 space-y-2">
              <div class="skeleton h-4 w-28 rounded"></div>
              <div class="skeleton h-3 w-20 rounded"></div>
            </div>
          </div>
        </div>
        <div v-else-if="pendingList.length === 0" class="py-12 sm:py-16 text-center px-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--success-bg);">
            <svg class="w-7 h-7" style="color: var(--success);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-sm font-medium" style="color: var(--text-muted);">Todos resueltos</p>
        </div>
        <div v-else class="divide-y" :style="{ borderColor: 'var(--border-color)' }">
          <RouterLink v-for="report in pendingList" :key="report._id"
            :to="`/app/reports/${report._id}`"
            class="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 transition-colors no-underline"
            style="color: var(--text-secondary);"
            @mouseenter="e => e.currentTarget.style.background = 'var(--bg-surface)'"
            @mouseleave="e => e.currentTarget.style.background = 'transparent'">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
                 style="background: var(--rose-lighter); color: var(--rose-primary);">
              {{ (report.platform || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.platform }}</p>
              <p class="text-xs truncate" style="color: var(--text-muted);">{{ report.mail }}</p>
            </div>
            <span :class="report.status === 'in_progress' ? 'badge badge-progress' : 'badge badge-pending'" class="shrink-0">
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
import { usersApi } from '../../api/axios'

const reportsStore = useReportsStore()
const loading = ref(true)
const users = ref([])
const pendingList = ref([])
const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u => u.username?.toLowerCase().includes(q) || u.phone?.includes(q))
})

async function refresh() {
  loading.value = true
  try {
    const [userData, reportData] = await Promise.all([
      usersApi.list().then(r => r.data),
      reportsStore.fetchAdminReports?.()
    ])
    users.value = userData || []
    if (reportData) pendingList.value = reportData.filter(r => r.status !== 'resolved')
  } catch {
    users.value = []
    pendingList.value = []
  }
  loading.value = false
}

onMounted(refresh)
</script>
