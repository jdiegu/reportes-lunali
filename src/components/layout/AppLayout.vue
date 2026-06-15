<template>
  <div class="flex h-screen overflow-hidden" style="background: var(--bg-page);">
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 border-r',
        sidebarOpen ? 'w-64' : 'w-0 lg:w-16',
        'overflow-hidden'
      ]"
      style="background: var(--bg-card); border-color: var(--border-color);"
    >
      <div class="flex items-center gap-3 px-4 h-16 border-b shrink-0" style="border-color: var(--border-color);">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
             style="background: linear-gradient(135deg, var(--rose-400), var(--rose-500));">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"/>
          </svg>
        </div>
        <span :class="['font-display font-bold text-lg transition-all duration-300', sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden lg:hidden']"
              style="color: var(--text-primary);">
          Lunali
        </span>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-2">
        <NavItem v-for="item in navItems" :key="item.to" :item="item" :expanded="sidebarOpen" />
      </nav>

      <div class="px-3 py-4 border-t shrink-0" style="border-color: var(--border-color);">
        <div class="flex items-center gap-3 mb-3 px-1">
          <button @click="toggleTheme" class="btn-icon w-full justify-start gap-2.5 text-xs rounded-xl px-2" style="color: var(--text-muted);"
                  :title="isDark ? 'Modo claro' : 'Modo oscuro'">
            <svg v-if="isDark" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
            <span :class="['transition-all duration-300', sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden lg:hidden']">
              {{ isDark ? 'Modo claro' : 'Modo oscuro' }}
            </span>
          </button>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
               style="background: linear-gradient(135deg, var(--rose-300), var(--rose-400)); color: white;">
            {{ userInitial }}
          </div>
          <div :class="['transition-all duration-300 overflow-hidden', sidebarOpen ? 'opacity-100 flex-1' : 'opacity-0 w-0']">
            <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ authStore.user?.name }}</p>
            <p class="text-xs capitalize" style="color: var(--text-muted);">{{ roleLabel }}</p>
          </div>
          <button v-if="sidebarOpen" @click="logout" class="btn-icon shrink-0" title="Cerrar sesi&oacute;n">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <div :class="['flex-1 flex flex-col min-w-0 transition-all duration-300', sidebarOpen ? 'lg:ml-64' : 'lg:ml-16']">
      <header class="h-16 flex items-center gap-4 px-4 lg:px-6 border-b shrink-0"
              style="background: var(--bg-card); border-color: var(--border-color);">
        <button @click="sidebarOpen = !sidebarOpen" class="btn-icon">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-display font-bold truncate" style="color: var(--text-primary);">{{ currentRouteName }}</p>
        </div>

        <button @click="toggleTheme" class="btn-icon hidden sm:flex" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
          <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>

        <RouterLink v-if="!authStore.isAdmin" to="/app/reports/new" class="btn-primary text-xs">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span class="hidden sm:inline">Nuevo reporte</span>
        </RouterLink>

        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
             style="background: linear-gradient(135deg, var(--rose-300), var(--rose-400)); color: white;">
          {{ userInitial }}
        </div>
      </header>

      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>

    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
      style="background: rgba(0,0,0,0.3);"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useTheme } from '../../composables/useTheme'
import NavItem from '../ui/NavItem.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { isDark, toggleTheme } = useTheme()

const sidebarOpen = ref(window.innerWidth >= 1024)

const userInitial = computed(() => authStore.user?.name?.charAt(0).toUpperCase() || '?')

const roleLabel = computed(() => {
  if (authStore.user?.role === 'admin') return 'Administrador'
  if (authStore.user?.role === 'superadmin') return 'Super Admin'
  return 'Usuario'
})

const currentRouteName = computed(() => {
  const names = {
    Dashboard: 'Inicio',
    Reports: 'Reportes',
    NewReport: 'Nuevo Reporte',
    ReportDetail: 'Detalle del Reporte',
    Admin: 'Panel de Administraci&oacute;n',
  }
  return names[route.name] || 'Lunali'
})

const navItems = computed(() => {
  const base = [
    { to: '/app', label: 'Inicio', icon: 'home', exact: true },
    { to: '/app/reports', label: 'Reportes', icon: 'ticket' },
  ]
  if (!authStore.isAdmin) {
    base.push({ to: '/app/reports/new', label: 'Nuevo Reporte', icon: 'plus-circle' })
  }
  if (authStore.isAdmin) {
    base.push({ to: '/app/admin', label: 'Administraci&oacute;n', icon: 'shield' })
  }
  return base
})

function logout() {
  authStore.logout()
  router.push('/')
}
</script>
