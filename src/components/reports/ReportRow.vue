<template>
  <div
    class="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all duration-200 card-hover"
    :style="{ borderColor: 'transparent', color: 'var(--text-secondary)' }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-all duration-200"
         :style="{ background: hover ? 'var(--rose-gradient)' : 'var(--rose-lighter)', color: hover ? 'white' : 'var(--rose-primary)' }">
      {{ platformInitial }}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5 flex-wrap">
        <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.platform }}</p>
        <span :class="statusBadgeClass">{{ statusLabel }}</span>
      </div>
      <p class="text-xs truncate" style="color: var(--text-muted);">{{ report.mail }}</p>
    </div>
    <div class="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
      <span class="text-xs font-medium" style="color: var(--text-muted);">{{ report.platform_type === 'profile' ? 'Perfil' : 'Cuenta' }}</span>
      <span class="text-[10px]" style="color: var(--text-muted); opacity: 0.6;">{{ relativeDate }}</span>
    </div>
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
