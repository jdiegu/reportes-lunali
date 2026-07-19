<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center h-14 sm:h-16 px-4 border-b shrink-0 gap-3" :style="{ borderColor: 'var(--sidebar-border)' }">
      <div class="sidebar-logo min-w-[2.5rem]">
        <div class="sidebar-logo-ring">
          <div class="sidebar-logo-inner">
            <img src="/icon.png" alt="Lunali" class="sidebar-logo-img" />
          </div>
        </div>
      </div>
      <Transition name="fade-text">
        <span v-show="expanded" class="font-display font-bold text-lg whitespace-nowrap" style="color: var(--text-primary);">Lunali</span>
      </Transition>
    </div>

    <nav class="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
      <NavItem v-for="item in navItems" :key="item.to" :item="item" :expanded="expanded" />
    </nav>

    <div class="border-t shrink-0 px-3 py-3 space-y-1" :style="{ borderColor: 'var(--sidebar-border)' }">
      <button @click="$emit('toggleTheme')" class="flex items-center gap-3 w-full rounded-xl px-3 py-2 text-xs font-medium transition-colors btn-ghost justify-start">
        <svg v-if="isDark" class="w-[1.125rem] h-[1.125rem] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
        <svg v-else class="w-[1.125rem] h-[1.125rem] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
        <Transition name="fade-text">
          <span v-show="expanded" class="whitespace-nowrap">{{ isDark ? 'Modo claro' : 'Modo oscuro' }}</span>
        </Transition>
      </button>

      <div class="flex items-center gap-3 px-2 py-2">
        <div class="w-8 h-8 min-w-[2rem] rounded-full flex items-center justify-center text-xs font-bold shrink-0" style="background: var(--rose-gradient); color: white;">
          {{ userInitial }}
        </div>
        <Transition name="fade-text">
          <div v-show="expanded" class="min-w-0 flex-1">
            <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ displayName }}</p>
            <p class="text-[11px] capitalize truncate" style="color: var(--text-muted);">{{ roleLabel }}</p>
          </div>
        </Transition>
        <Transition name="fade-text">
          <button v-show="expanded" @click="$emit('logout')" class="btn-icon shrink-0 !w-8 !h-8" title="Cerrar sesion" style="color: var(--error);">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavItem from '../ui/NavItem.vue'

defineProps({
  expanded: Boolean,
  isDark: Boolean,
  userInitial: String,
  displayName: String,
  roleLabel: String,
  navItems: Array,
})

defineEmits(['toggleTheme', 'logout'])
</script>

<style scoped>
.fade-text-enter-active { transition: opacity 0.2s ease 0.05s; }
.fade-text-leave-active { transition: opacity 0.1s ease; }
.fade-text-enter-from, .fade-text-leave-to { opacity: 0; }

.sidebar-logo { width: 2.5rem; height: 2.5rem; position: relative; }
.sidebar-logo-ring {
  width: 100%; height: 100%;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #e88aac, #d46a8a, #b84a6a);
}
.sidebar-logo-inner {
  width: 100%; height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: var(--sidebar-bg);
}
.sidebar-logo-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>
