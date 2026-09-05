<template>
  <div class="rounded-xl border p-4 sm:p-5 relative overflow-hidden group"
       :style="{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />
    <div class="relative z-10 flex flex-col">
      <div class="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
        <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
             :style="{ background: colorBg }">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" :style="{ color: colorText }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
          </svg>
        </div>
        <span class="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-md shrink-0 z-10"
              :style="{ background: trendBg, color: trendColor }">
          {{ trend >= 0 ? '↑ ' + trend + '%' : '↓ ' + Math.abs(trend) + '%' }}
        </span>
      </div>
      <div v-if="loading" class="skeleton h-6 sm:h-7 w-10 sm:w-12 rounded mb-1" />
      <p v-else class="text-2xl sm:text-3xl font-display font-bold leading-none tabular-nums" style="color: var(--text-primary);">{{ value }}</p>
      <p class="text-xs sm:text-sm mt-1 sm:mt-1.5 leading-tight" style="color: var(--text-secondary);">{{ label }}</p>
      <p v-if="sub" class="text-[10px] sm:text-xs mt-0.5" style="color: var(--text-muted);">{{ sub }}</p>
      <div class="absolute bottom-0 left-0 right-0 h-[2px] z-0" :style="{ background: colorText + '22' }">
        <div class="h-full rounded-full" :style="{ width: '100%', background: colorText }" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stat: Object,
  loading: Boolean
})
const iconPaths = {
  list:    'M4 6h16M4 10h16M4 14h16M4 18h16',
  clock:   'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  check:   'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
}

const colorMaps = {
  rose:    { bg: 'var(--rose-lighter)',   text: 'var(--rose-primary)' },
  amber:   { bg: 'var(--warning-bg)',     text: 'var(--warning)' },
  blue:    { bg: 'var(--info-bg)',        text: 'var(--info)' },
  emerald: { bg: 'var(--success-bg)',     text: 'var(--success)' },
}

const stat = props.stat || {}
const value = stat.value
const label = stat.label
const sub = stat.sub
const color = stat.color || 'rose'
const cmap = colorMaps[color] || colorMaps.rose
const colorBg = cmap.bg
const colorText = cmap.text
const iconPath = iconPaths[stat.icon || 'list'] || iconPaths.list
const trend = stat.trend ?? 0
const trendBg = trend >= 0 ? 'var(--success-bg)' : 'var(--error-bg)'
const trendColor = trend >= 0 ? 'var(--success)' : 'var(--error)'
</script>