<template>
  <RouterLink
    :to="item.to"
    :class="[
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 no-underline group',
      isActive ? 'text-white shadow-md' : 'hover:bg-[var(--sidebar-hover-bg)]'
    ]"
    :style="isActive
      ? { background: 'var(--sidebar-active-bg)', color: 'white' }
      : { color: 'var(--text-secondary)' }"
    :title="!expanded ? item.label : undefined"
  >
    <svg class="w-[1.125rem] h-[1.125rem] shrink-0 transition-colors duration-200"
         :class="isActive ? 'text-white' : ''"
         :style="!isActive ? { color: 'var(--text-secondary)' } : {}"
         fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
    </svg>
    <Transition name="nav-text">
      <span v-show="expanded" class="transition-all duration-200 overflow-hidden whitespace-nowrap">
        {{ item.label }}
      </span>
    </Transition>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const props = defineProps({
  item: Object,
  expanded: Boolean
})

const route = useRoute()

const isActive = computed(() => {
  if (props.item.exact) return route.path === props.item.to
  return (route.path.startsWith(props.item.to) && props.item.to !== '/app') || (props.item.to === '/app' && route.path === '/app')
})

const icons = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  ticket: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  'plus-circle': 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
  shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  wallet: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  apps: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
}

const iconPath = computed(() => icons[props.item.icon] || icons.home)
</script>

<style scoped>
.nav-text-enter-active { transition: opacity 0.2s ease 0.05s, max-width 0.2s ease 0.05s; }
.nav-text-leave-active { transition: opacity 0.1s ease, max-width 0.15s ease; }
.nav-text-enter-from, .nav-text-leave-to { opacity: 0; }
</style>
