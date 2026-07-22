<template>
  <div class="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
    <div class="flex items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl">Administracion</h1>
        <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">Gestiona permisos y usuarios del sistema</p>
      </div>
      <button @click="refresh" class="btn-secondary text-xs sm:text-sm shrink-0" :disabled="loading">
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span class="hidden sm:inline">Actualizar</span>
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div class="card p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Total</p>
        <p class="text-xl sm:text-2xl font-bold" style="color: var(--text-primary);">{{ users.length }}</p>
      </div>
      <div class="card p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Admins</p>
        <p class="text-xl sm:text-2xl font-bold" style="color: var(--rose-primary);">{{ adminCount }}</p>
      </div>
      <div class="card p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Usuarios</p>
        <p class="text-xl sm:text-2xl font-bold" style="color: var(--info);">{{ userCount }}</p>
      </div>
      <div class="card p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Saldo total</p>
        <p class="text-xl sm:text-2xl font-bold font-mono" style="color: var(--success);">${{ totalBalance.toFixed(2) }}</p>
      </div>
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

    <div class="card">
      <div class="p-4 sm:p-5 border-b" :style="{ borderColor: 'var(--border-color)' }">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base sm:text-lg">Usuarios</h2>
            <p class="text-xs mt-0.5" style="color: var(--text-muted);">{{ filteredUsers.length }} registrados</p>
          </div>
          <div class="flex items-center gap-2 text-[10px] sm:text-xs" style="color: var(--text-muted);">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full" style="background: var(--rose-primary);"></span> Admin</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full" style="background: var(--info);"></span> Usuario</span>
          </div>
        </div>
      </div>
      <div v-if="loading" class="p-4 sm:p-5 space-y-3">
        <div v-for="i in 6" :key="i" class="flex items-center gap-3 p-3 rounded-xl" style="background: var(--bg-surface);">
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
        <div v-for="u in filteredUsers" :key="u._id"
          class="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 transition-colors"
          style="color: var(--text-secondary);"
          @mouseenter="e => e.currentTarget.style.background = 'var(--bg-surface)'"
          @mouseleave="e => e.currentTarget.style.background = 'transparent'">
          <RouterLink :to="`/app/admin/users/${u._id}`" class="flex items-center gap-3 flex-1 min-w-0 no-underline" style="color: var(--text-secondary);">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
                 :style="{
                   background: u.role === 'admin' || u.role === 'boss' ? 'var(--rose-gradient)' : 'var(--bg-surface)',
                   color: u.role === 'admin' || u.role === 'boss' ? 'white' : 'var(--text-muted)',
                 }">
              {{ (u.username || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ u.username }}</p>
              <p class="text-xs truncate" style="color: var(--text-muted);">
                <span v-if="u.role === 'boss'" class="font-semibold" style="color: var(--rose-primary);">Boss</span>
                <span v-else-if="u.role === 'admin'" class="font-semibold" style="color: var(--info);">Admin</span>
                <span v-else>Usuario</span>
                <span v-if="u.phone"> &middot; {{ u.phone }}</span>
              </p>
            </div>
          </RouterLink>

          <div class="flex items-center gap-3 shrink-0">
            <p class="text-sm font-mono font-semibold hidden sm:block" style="color: var(--success);">${{ (u.balance || 0).toFixed(2) }}</p>

            <button
              v-if="u.role !== 'boss' && authStore.user?._id !== u._id"
              @click.stop="toggleRole(u)"
              :disabled="togglingRole === u._id"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none"
              :style="{
                background: (u.role === 'admin' || u.role === 'boss') ? 'var(--rose-primary)' : 'var(--border-color)',
              }"
              :title="(u.role === 'admin' || u.role === 'boss') ? 'Quitar admin' : 'Hacer admin'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm"
                :style="{ transform: (u.role === 'admin' || u.role === 'boss') ? 'translateX(22px)' : 'translateX(2px)' }"
              />
            </button>
            <span v-if="u.role === 'boss'" class="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style="background: var(--rose-lighter); color: var(--rose-primary);">
              Boss
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useToastStore } from '../../store/toast'
import { usersApi } from '../../api/axios'

const authStore = useAuthStore()
const toast = useToastStore()
const loading = ref(true)
const users = ref([])
const searchQuery = ref('')
const togglingRole = ref(null)

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u => u.username?.toLowerCase().includes(q) || u.phone?.includes(q))
})

const adminCount = computed(() => users.value.filter(u => u.role === 'admin' || u.role === 'boss').length)
const userCount = computed(() => users.value.filter(u => u.role === 'user').length)
const totalBalance = computed(() => users.value.reduce((sum, u) => sum + (u.balance || 0), 0))

async function toggleRole(u) {
  if (u.role === 'boss' || authStore.user?._id === u._id) return
  const newRole = u.role === 'admin' ? 'user' : 'admin'
  togglingRole.value = u._id
  try {
    await usersApi.updateRole(u._id, newRole)
    u.role = newRole
    toast.success('Rol actualizado', `${u.username} ahora es ${newRole === 'admin' ? 'administrador' : 'usuario'}`)
  } catch (e) {
    toast.error('Error', e.response?.data?.message || 'No se pudo cambiar el rol')
  } finally {
    togglingRole.value = null
  }
}

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
