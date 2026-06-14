<template>
  <RouterLink
    :to="item.to"
    :exact="item.exact"
    :class="[
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1',
      isActive
        ? 'bg-rose-600/25 text-rose-300 border border-rose-600/30'
        : 'text-blush-400 hover:text-blush-200 hover:bg-rose-900/20'
    ]"
    :title="!expanded ? item.label : undefined"
  >
    <component :is="iconComponent" class="w-4 h-4 shrink-0" />
    <span :class="['transition-all duration-300 overflow-hidden whitespace-nowrap', expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:hidden']">
      {{ item.label }}
    </span>
  </RouterLink>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const props = defineProps({
  item: Object,
  expanded: Boolean
})

const route = useRoute()

const isActive = computed(() => {
  if (props.item.exact) return route.path === props.item.to
  return route.path.startsWith(props.item.to) && props.item.to !== '/'
    || (props.item.to === '/' && route.path === '/')
})

// Inline SVG icons
const icons = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  ticket: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  'plus-circle': 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
  shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
}

const iconComponent = computed(() => ({
  render() {
    return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4 shrink-0' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: icons[props.item.icon] || icons.home })
    ])
  }
}))
</script>