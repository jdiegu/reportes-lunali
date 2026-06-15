<template>
  <div
    class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200"
    :style="{ borderColor: 'transparent', color: 'var(--text-secondary)' }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-medium shrink-0 transition-colors"
         :style="{ background: hover ? 'var(--rose-light)' : 'var(--rose-lighter)', color: 'var(--rose-primary)' }">
      {{ platformInitial }}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5">
        <p class="text-sm font-medium truncate" :style="{ color: 'var(--text-primary)' }">{{ report.platform }}</p>
        <span :class="statusBadgeClass">{{ statusLabel }}</span>
      </div>
      <p class="text-xs truncate" :style="{ color: 'var(--text-muted)' }">{{ report.mail }}</p>
    </div>
    <div class="text-xs shrink-0 hidden sm:block" :style="{ color: 'var(--text-muted)' }">{{ relativeDate }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ report: Object })
const hover = ref(false)

const platformInitial = computed(() => props.report.platform?.charAt(0).toUpperCase() || '?')

const statusBadgeClass = computed(() => ({
  pending: 'badge badge-pending',
  in_progress: 'badge badge-progress',
  resolved: 'badge badge-resolved',
}[props.report.status] || 'badge badge-pending'))

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
