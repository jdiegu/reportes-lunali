<template>
  <div class="flex h-screen overflow-hidden" style="background: var(--bg-page);">
    <aside
      :class="['fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 border-r overflow-hidden',
        sidebarOpen ? 'w-64' : 'w-16']"
      style="background: var(--bg-card); border-color: var(--border-color);"
    >
      <div class="flex items-center h-16 px-4 border-b shrink-0 gap-3" style="border-color: var(--border-color);">
        <div class="w-8 h-8 min-w-[2rem] rounded-xl flex items-center justify-center" style="background: var(--rose-gradient);">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"/>
          </svg>
        </div>
        <span v-show="sidebarOpen" class="font-display font-bold text-lg whitespace-nowrap" style="color: var(--text-primary);">Lunali</span>
      </div>

      <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <NavItem v-for="item in navItems" :key="item.to" :item="item" :expanded="sidebarOpen" />
      </nav>

      <div class="border-t shrink-0 px-3 py-3 space-y-2" style="border-color: var(--border-color);">
        <button @click="toggleTheme" class="flex items-center gap-3 w-full rounded-xl px-3 py-2 text-xs font-medium transition-colors btn-ghost justify-start">
          <svg v-if="isDark" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <svg v-else class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
          <span v-show="sidebarOpen">{{ isDark ? 'Modo claro' : 'Modo oscuro' }}</span>
        </button>

        <div class="flex items-center gap-3 px-1">
          <div class="w-8 h-8 min-w-[2rem] rounded-full flex items-center justify-center text-xs font-bold"
               style="background: var(--rose-gradient); color: white;">
            {{ userInitial }}
          </div>
          <div v-show="sidebarOpen" class="min-w-0 flex-1">
            <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ displayName }}</p>
            <p class="text-xs capitalize truncate" style="color: var(--text-muted);">{{ roleLabel }}</p>
          </div>
          <button v-show="sidebarOpen" @click="logout" class="btn-icon shrink-0" title="Cerrar sesión">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <div :class="['flex-1 flex flex-col min-w-0 transition-all duration-300', sidebarOpen ? 'lg:ml-64' : 'lg:ml-16']">
      <header class="h-16 flex items-center gap-3 px-4 lg:px-6 border-b shrink-0"
              style="background: var(--bg-card); border-color: var(--border-color);">
        <button @click="sidebarOpen = !sidebarOpen" class="btn-icon">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-display font-bold truncate" style="color: var(--text-primary);">{{ pageTitle }}</p>
        </div>

        <div class="flex items-center gap-1">
          <button v-if="!authStore.isAdmin" @click="router.push('/app/reports/new')" class="btn-primary text-xs">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="hidden sm:inline">Nuevo</span>
          </button>

          <button @click="toggleTheme" class="btn-icon hidden sm:flex" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
            <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>

          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold sm:hidden"
               style="background: var(--rose-gradient); color: white;">
            {{ userInitial }}
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>

    <div v-if="sidebarOpen" @click="sidebarOpen = false"
         class="fixed inset-0 z-40 backdrop-blur-sm lg:hidden" style="background: rgba(0,0,0,0.3);">
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useTheme } from '../../composables/useTheme'
import NavItem from '../ui/NavItem.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { isDark, toggleTheme } = useTheme()

const sidebarOpen = ref(window.innerWidth >= 1024)

const userInitial = computed(() => authStore.user?.name?.charAt(0).toUpperCase() || authStore.user?.username?.charAt(0).toUpperCase() || '?')

const displayName = computed(() => authStore.user?.name || authStore.user?.username || 'Usuario')

const roleLabel = computed(() => {
  if (authStore.user?.role === 'boss') return 'Super Admin'
  if (authStore.user?.role === 'admin') return 'Administrador'
  return 'Usuario'
})

const pageTitle = computed(() => {
  const map = {
    Dashboard: 'Inicio',
    Reports: 'Reportes',
    NewReport: 'Nuevo Reporte',
    ReportDetail: 'Detalle del Reporte',
    Admin: 'Administración',
  }
  return map[route.name] || 'Lunali'
})

const navItems = computed(() => {
  const base = [
    { to: '/app', label: 'Inicio', icon: 'home', exact: true },
    { to: '/app/reports', label: 'Reportes', icon: 'ticket' },
  ]
  if (!authStore.isAdmin) {
    base.push({ to: '/app/reports/new', label: 'Nuevo', icon: 'plus-circle' })
  }
  if (authStore.isAdmin) {
    base.push({ to: '/app/admin', label: 'Admin', icon: 'shield' })
  }
  return base
})

function logout() {
  authStore.logout()
  router.push('/')
}
</script>
