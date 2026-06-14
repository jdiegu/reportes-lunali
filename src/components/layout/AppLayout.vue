<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300',
        'border-r border-rose-900/30',
        sidebarOpen ? 'w-64' : 'w-0 lg:w-16',
        'overflow-hidden'
      ]"
      style="background: rgba(26,15,21,0.95); backdrop-filter: blur(20px);"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 h-16 border-b border-rose-900/30 shrink-0">
        <div class="w-8 h-8 rounded-lg bg-rose-600/25 border border-rose-600/40 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"/>
          </svg>
        </div>
        <span :class="['font-display font-bold text-blush-50 text-lg transition-all duration-300', sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden lg:hidden']">
          Lunali
        </span>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 overflow-y-auto py-4 px-2">
        <NavItem v-for="item in navItems" :key="item.to" :item="item" :expanded="sidebarOpen" />
      </nav>

      <!-- User info -->
      <div class="px-3 py-4 border-t border-rose-900/30 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-rose-700/30 border border-rose-600/30 flex items-center justify-center text-rose-300 font-medium text-xs shrink-0">
            {{ userInitial }}
          </div>
          <div :class="['transition-all duration-300 overflow-hidden', sidebarOpen ? 'opacity-100 flex-1' : 'opacity-0 w-0']">
            <p class="text-blush-200 text-sm font-medium truncate">{{ authStore.user?.name }}</p>
            <p class="text-blush-500 text-xs capitalize">{{ authStore.user?.role }}</p>
          </div>
          <button v-if="sidebarOpen" @click="logout" class="btn-icon shrink-0" title="Cerrar sesión">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <div :class="['flex-1 flex flex-col min-w-0 transition-all duration-300', sidebarOpen ? 'lg:ml-64' : 'lg:ml-16']">
      <!-- Topbar -->
      <header class="h-16 flex items-center gap-4 px-4 lg:px-6 border-b border-rose-900/30 shrink-0"
              style="background: rgba(26,15,21,0.8); backdrop-filter: blur(12px);">
        <button @click="sidebarOpen = !sidebarOpen" class="btn-icon">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <div class="flex-1 min-w-0">
          <h2 class="text-blush-200 text-sm font-medium truncate">{{ currentRouteName }}</h2>
        </div>

        <!-- Quick actions -->
        <RouterLink v-if="!authStore.isAdmin" to="/reports/new" class="btn-primary text-xs">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span class="hidden sm:inline">Nuevo reporte</span>
        </RouterLink>

        <div class="w-8 h-8 rounded-full bg-rose-700/30 border border-rose-600/30 flex items-center justify-center text-rose-300 font-medium text-xs">
          {{ userInitial }}
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-dark-950/60 backdrop-blur-sm lg:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import NavItem from '../ui/NavItem.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(window.innerWidth >= 1024)

const userInitial = computed(() => authStore.user?.name?.charAt(0).toUpperCase() || '?')

const currentRouteName = computed(() => {
  const names = { Dashboard: 'Inicio', Reports: 'Reportes', NewReport: 'Nuevo Reporte', ReportDetail: 'Detalle del Reporte', Admin: 'Panel de Administración' }
  return names[route.name] || 'Lunali'
})

const navItems = computed(() => {
  const base = [
    { to: '/', label: 'Inicio', icon: 'home', exact: true },
    { to: '/reports', label: 'Reportes', icon: 'ticket' },
  ]
  if (!authStore.isAdmin) {
    base.push({ to: '/reports/new', label: 'Nuevo Reporte', icon: 'plus-circle' })
  }
  if (authStore.isAdmin) {
    base.push({ to: '/admin', label: 'Administración', icon: 'shield' })
  }
  return base
})

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>