<template>
  <article
    class="stat-card group relative overflow-hidden rounded-2xl border p-4 sm:p-5"
    :style="cardStyle"
  >
    <!-- Decorative waves -->
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-20 overflow-hidden">
      <svg class="w-full h-full" viewBox="0 0 240 80" preserveAspectRatio="none">
        <path d="M0 52 C 40 20 80 68 120 48 S 200 18 240 42 L240 80 L0 80 Z" :style="{ fill: colorText }" opacity="0.07" />
        <path d="M0 64 C 50 42 92 76 142 58 S 210 38 240 56 L240 80 L0 80 Z" :style="{ fill: colorText }" opacity="0.11" />
      </svg>
    </div>

    <!-- Glow -->
    <div class="pointer-events-none absolute -right-8 -top-10 w-28 h-28 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-35"
         :style="{ background: colorText }"></div>

    <!-- Watermark icon -->
    <svg class="pointer-events-none absolute -right-3 -top-2 w-24 h-24 opacity-[0.06] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
         fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" :style="{ color: colorText }">
      <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
    </svg>

    <div class="relative z-10 flex flex-col h-full">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
               :style="{ background: iconGradient, boxShadow: iconShadow }">
            <svg class="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
            </svg>
          </div>
          <p class="text-[10px] sm:text-xs font-semibold leading-tight" style="color: var(--text-secondary);">{{ label }}</p>
        </div>
      </div>

      <div v-if="loading" class="mt-4 space-y-2">
        <div class="skeleton h-8 w-16 rounded"></div>
        <div class="skeleton h-3 w-24 rounded"></div>
        <div class="skeleton h-1.5 w-full rounded-full mt-3"></div>
      </div>

      <template v-else>
        <div class="mt-3 sm:mt-4 flex items-end justify-between gap-2">
          <p class="text-[30px] sm:text-4xl font-display font-bold leading-none tabular-nums tracking-tight"
             :style="{ color: colorText }">{{ value }}</p>
          <span v-if="showTrend" class="text-[10px] font-bold px-1.5 py-0.5 rounded-md mb-0.5 shrink-0"
                :style="{ background: trendBg, color: trendColor }">
            {{ trend >= 0 ? '↑' : '↓' }}{{ Math.abs(trend) }}%
          </span>
          <span v-else-if="showPct" class="text-[10px] font-bold px-1.5 py-0.5 rounded-md mb-0.5 shrink-0"
                :style="{ background: chipBg, color: colorText, border: '1px solid ' + chipBorder }">{{ pct }}%</span>
        </div>

        <p v-if="sub" class="text-[10px] sm:text-xs mt-1.5 truncate" style="color: var(--text-muted);">{{ sub }}</p>

        <div class="relative mt-3 h-1.5 rounded-full overflow-hidden" :style="{ background: trackBg }">
          <div class="h-full rounded-full transition-all duration-500" :style="{ width: pctWidth, background: barGradient }"></div>
        </div>
      </template>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stat: Object,
  loading: Boolean,
})

const iconPaths = {
  list:    'M4 6h16M4 10h16M4 14h16M4 18h16',
  clock:   'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  check:   'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  alert:   'M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const colorMaps = {
  rose:    { text: 'var(--rose-primary)' },
  amber:   { text: 'var(--warning)' },
  blue:    { text: 'var(--info)' },
  emerald: { text: 'var(--success)' },
  red:     { text: 'var(--error)' },
}

const stat = computed(() => props.stat || {})
const value = computed(() => stat.value.value)
const label = computed(() => stat.value.label)
const sub = computed(() => stat.value.sub)
const iconPath = computed(() => iconPaths[stat.value.icon || 'list'] || iconPaths.list)

const colorText = computed(() => (colorMaps[stat.value.color] || colorMaps.rose).text)

const cardStyle = computed(() => ({
  borderColor: `color-mix(in srgb, ${colorText.value} 22%, var(--border-color))`,
  background: `linear-gradient(150deg, color-mix(in srgb, ${colorText.value} 15%, var(--bg-card)) 0%, var(--bg-card) 62%)`,
}))
const iconGradient = computed(() => `linear-gradient(135deg, ${colorText.value} 0%, color-mix(in srgb, ${colorText.value} 62%, #000) 100%)`)
const iconShadow = computed(() => `0 8px 18px color-mix(in srgb, ${colorText.value} 32%, transparent)`)
const chipBg = computed(() => `color-mix(in srgb, ${colorText.value} 14%, transparent)`)
const chipBorder = computed(() => `color-mix(in srgb, ${colorText.value} 25%, transparent)`)
const trackBg = computed(() => `color-mix(in srgb, ${colorText.value} 14%, transparent)`)
const barGradient = computed(() => `linear-gradient(90deg, color-mix(in srgb, ${colorText.value} 55%, transparent), ${colorText.value})`)

const trend = computed(() => stat.value.trend ?? 0)
const showTrend = computed(() => typeof stat.value.trend === 'number' && stat.value.trend !== 0)
const trendBg = computed(() => (trend.value >= 0 ? 'var(--success-bg)' : 'var(--error-bg)'))
const trendColor = computed(() => (trend.value >= 0 ? 'var(--success)' : 'var(--error)'))

const pct = computed(() => {
  const raw = stat.value.pct
  if (typeof raw !== 'number' || isNaN(raw)) return null
  return Math.max(0, Math.min(100, Math.round(raw)))
})
const showPct = computed(() => pct.value !== null && stat.value.key !== 'total')
const pctWidth = computed(() => `${pct.value ?? 0}%`)
</script>

<style scoped>
.stat-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--card-shadow-hover);
}
</style>
