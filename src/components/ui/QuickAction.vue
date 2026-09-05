<template>
  <RouterLink :to="to" class="no-underline card p-3 sm:p-4 flex flex-col gap-2.5 no-underline hover:card-hover transition-all duration-200"
              style="color: var(--text-secondary); text-decoration: none;">
    <div class="flex items-center justify-between gap-2">
      <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" :style="{ background: iconBg }">
        <Icon :icon="icon" class="w-4 h-4 sm:w-5 sm:h-5" :style="{ color: iconColor }" />
      </div>
      <ChevronRight class="w-4 h-4 shrink-0" style="color: var(--text-muted);" />
    </div>
    <p class="text-sm sm:text-base font-semibold leading-tight" style="color: var(--text-primary);">{{ label }}</p>
    <p class="text-[10px] sm:text-xs" style="color: var(--text-muted);">{{ subtitle }}</p>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { ChevronRight } from '@lucide/vue'

const props = defineProps({
  to: String,
  label: String,
  subtitle: String,
  icon: String,
  color: String
})

const colorMaps = {
  rose:    { bg: 'var(--rose-lighter)',   text: 'var(--rose-primary)' },
  amber:   { bg: 'var(--warning-bg)',     text: 'var(--warning)' },
  blue:    { bg: 'var(--info-bg)',        text: 'var(--info)' },
  emerald: { bg: 'var(--success-bg)',     text: 'var(--success)' },
}

const cmap = colorMaps[props.color] || colorMaps.blue
const iconBg = cmap.bg
const iconColor = cmap.text
</script>