<template>
  <div class="glass-card p-5 flex items-center gap-4">
    <div :class="[
      'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
      colorMap[stat.color]?.bg || 'bg-rose-700/25'
    ]">
      <svg class="w-5 h-5" :class="colorMap[stat.color]?.text || 'text-rose-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
      </svg>
    </div>
    <div class="min-w-0">
      <div v-if="loading" class="skeleton h-7 w-12 rounded mb-1"></div>
      <p v-else class="text-2xl font-display font-bold" :class="colorMap[stat.color]?.text || 'text-rose-300'">
        {{ stat.value }}
      </p>
      <p class="text-blush-500 text-xs">{{ stat.label }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stat: Object,
  loading: Boolean
})

const colorMap = {
  rose:    { bg: 'bg-rose-700/25',    text: 'text-rose-400' },
  amber:   { bg: 'bg-amber-700/20',   text: 'text-amber-400' },
  blue:    { bg: 'bg-blue-700/20',    text: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-700/20', text: 'text-emerald-400' },
}

const iconPaths = {
  list:    'M4 6h16M4 10h16M4 14h16M4 18h16',
  clock:   'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  check:   'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
}

const iconPath = computed(() => iconPaths[props.stat.icon] || iconPaths.list)
</script>