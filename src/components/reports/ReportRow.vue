<template>
  <div class="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-rose-900/30 hover:bg-rose-900/10 cursor-pointer transition-all duration-200 group">
    <div class="w-9 h-9 rounded-lg bg-rose-900/25 border border-rose-900/30 flex items-center justify-center text-rose-400 shrink-0 text-xs font-mono font-medium group-hover:bg-rose-800/30 transition-colors">
      {{ platformInitial }}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5">
        <p class="text-blush-200 text-sm font-medium truncate">{{ report.platform }}</p>
        <span :class="statusBadgeClass">{{ statusLabel }}</span>
      </div>
      <p class="text-blush-600 text-xs truncate">{{ report.mail }}</p>
    </div>
    <div class="text-blush-600 text-xs shrink-0 hidden sm:block">{{ relativeDate }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ report: Object })

const platformInitial = computed(() => props.report.platform?.charAt(0).toUpperCase() || '?')

const statusBadgeClass = computed(() => ({
  pending: 'badge-pending',
  in_progress: 'badge-progress',
  resolved: 'badge-resolved',
}[props.report.status] || 'badge-pending'))

const statusLabel = computed(() => ({
  pending: 'Pendiente',
  in_progress: 'En proceso',
  resolved: 'Resuelto',
}[props.report.status] || props.report.status))

const relativeDate = computed(() => {
  const date = new Date(props.report.createdAt)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'Ahora'
  if (diff < 3600) return `${Math.floor(diff/60)}m`
  if (diff < 86400) return `${Math.floor(diff/3600)}h`
  return `${Math.floor(diff/86400)}d`
})
</script>