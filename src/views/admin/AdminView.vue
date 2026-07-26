<template>
  <div class="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
    <div class="flex items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl">Usuarios</h1>
        <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">{{ users.length }} registrados</p>
      </div>
      <button @click="refresh" class="btn-secondary text-xs sm:text-sm shrink-0" :disabled="loading">
        <RefreshCw class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span class="hidden sm:inline">Actualizar</span>
      </button>
    </div>

    <div class="card p-3 sm:p-4">
      <div class="relative">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" />
        <input v-model="searchQuery" type="text" placeholder="Buscar por username o telefono..."
               class="input-field pl-10 text-sm" />
      </div>
    </div>

    <div class="card">
      <div v-if="loading" class="p-4 sm:p-5 space-y-3">
        <div v-for="i in 6" :key="i" class="flex items-center gap-3 p-3 rounded-xl" style="background: var(--bg-surface);">
          <div class="skeleton w-10 h-10 rounded-xl"></div>
          <div class="flex-1 space-y-2"><div class="skeleton h-4 w-28 rounded"></div><div class="skeleton h-3 w-20 rounded"></div></div>
        </div>
      </div>
      <div v-else-if="filteredUsers.length === 0" class="py-12 sm:py-16 text-center px-4">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--rose-lighter);">
          <Users class="w-7 h-7" style="color: var(--rose-primary);" />
        </div>
        <p class="text-sm font-medium" style="color: var(--text-muted);">{{ searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios' }}</p>
      </div>
      <div v-else class="divide-y" :style="{ borderColor: 'var(--border-color)' }">
        <RouterLink v-for="u in filteredUsers" :key="u._id" :to="`/app/admin/users/${u._id}`"
          class="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 transition-colors no-underline group"
          style="color: var(--text-secondary);"
          @mouseenter="e => e.currentTarget.style.background = 'var(--bg-surface)'"
          @mouseleave="e => e.currentTarget.style.background = 'transparent'">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
               :style="{
                 background: u.role === 'boss' ? 'var(--rose-gradient)' : u.role === 'admin' ? 'rgba(196,90,122,0.1)' : 'var(--bg-surface)',
                 color: u.role === 'boss' ? 'white' : u.role === 'admin' ? 'var(--rose-primary)' : 'var(--text-muted)',
               }">
            {{ (u.username || '?').charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ u.username }}</p>
              <span v-if="u.role === 'boss'" class="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style="background: var(--rose-gradient); color: white;">BOSS</span>
              <span v-else-if="u.role === 'admin'" class="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style="background: var(--info-bg); color: var(--info);">ADMIN</span>
            </div>
            <p class="text-[11px] sm:text-xs" style="color: var(--text-muted);">
              {{ u.phone || 'Sin telefono' }}
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <p class="text-sm font-mono font-semibold" style="color: var(--success);">${{ (u.balance || 0).toFixed(2) }}</p>
            <ChevronRight class="w-4 h-4 transition-colors" style="color: var(--text-muted);" />
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { usersApi } from '../../api/axios'
import { RefreshCw, Search, Users, ChevronRight } from '@lucide/vue'

const loading = ref(true)
const users = ref([])
const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u => u.username?.toLowerCase().includes(q) || u.phone?.includes(q))
})

async function refresh() {
  loading.value = true
  try {
    const { data } = await usersApi.list()
    users.value = data || []
  } catch {
    users.value = []
  }
  loading.value = false
}

onMounted(refresh)
</script>
