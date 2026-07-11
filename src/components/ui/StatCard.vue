<template>
  <div class="card p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
    <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
         :style="{ background: colorMap[stat.color]?.bg || 'var(--rose-lighter)' }">
      <svg class="w-5 h-5" :style="{ color: colorMap[stat.color]?.text || 'var(--rose-primary)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[stat.icon] || iconPaths.list" />
      </svg>
    </div>
    <div class="min-w-0">
      <div v-if="loading" class="skeleton h-6 sm:h-7 w-10 sm:w-12 rounded mb-1"></div>
      <p v-else class="text-xl sm:text-2xl font-display font-bold" :style="{ color: colorMap[stat.color]?.text || 'var(--rose-primary)' }">
        {{ stat.value }}
      </p>
      <p class="text-[11px] sm:text-xs" style="color: var(--text-muted);">{{ stat.label }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stat: Object,
  loading: Boolean
})

const colorMap = {
  rose:    { bg: 'var(--rose-lighter)',   text: 'var(--rose-primary)' },
  amber:   { bg: 'var(--warning-bg)',     text: 'var(--warning)' },
  blue:    { bg: 'var(--info-bg)',        text: 'var(--info)' },
  emerald: { bg: 'var(--success-bg)',     text: 'var(--success)' },
}

const iconPaths = {
  list:    'M4 6h16M4 10h16M4 14h16M4 18h16',
  clock:   'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  check:   'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
}
</script>
