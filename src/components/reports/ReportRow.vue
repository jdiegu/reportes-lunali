<template>
  <div
    class="report-row group rounded-xl border cursor-pointer transition-all duration-200"
    :style="rowStyle"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="report-row-accent" :style="{ background: accentColor }"></div>

    <div class="report-row-inner">
      <!-- Icon -->
      <div class="report-row-icon shrink-0 transition-all duration-200"
           :style="iconStyle">
        <span class="text-sm sm:text-base font-bold">{{ platformInitial }}</span>
      </div>

      <!-- Mobile layout (< sm) -->
      <div class="flex-1 min-w-0 sm:hidden">
        <div class="flex items-center gap-2 mb-0.5">
          <p class="text-sm font-semibold truncate" style="color: var(--text-primary);">{{ report.platform }}</p>
          <span class="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
                :style="{ background: typeBg, color: typeColor }">
            {{ report.platform_type === 'profile' ? 'Perfil' : 'Cuenta' }}
          </span>
        </div>
        <p class="text-xs truncate mb-1" style="color: var(--text-muted);">{{ report.mail }}</p>
        <div class="flex items-center gap-2 flex-wrap">
          <span :class="statusBadgeClass">{{ statusLabel }}</span>
          <p v-if="showUser && report.user" class="text-[11px] flex items-center gap-1" style="color: var(--text-muted);">
            <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            {{ report.user.name || report.user.username }}
          </p>
          <p class="text-[11px] flex items-center gap-1" style="color: var(--text-muted);">
            <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ deliveryDate }}
          </p>
        </div>
      </div>

      <!-- Desktop layout (>= sm) - 3 columns -->
      <div class="hidden sm:flex flex-1 min-w-0 items-center gap-4">
        <!-- Left: Platform + mail -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <p class="text-sm font-semibold truncate" style="color: var(--text-primary);">{{ report.platform }}</p>
            <span class="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
                  :style="{ background: typeBg, color: typeColor }">
              {{ report.platform_type === 'profile' ? 'Perfil' : 'Cuenta' }}
            </span>
          </div>
          <p class="text-xs truncate" style="color: var(--text-muted);">{{ report.mail }}</p>
        </div>

        <!-- Center: User + delivery date -->
        <div class="flex items-center gap-3 shrink-0">
          <p v-if="showUser && report.user" class="text-xs flex items-center gap-1.5 whitespace-nowrap" style="color: var(--text-muted);">
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="truncate max-w-[120px]">{{ report.user.name || report.user.username }}</span>
          </p>
          <p class="text-xs flex items-center gap-1.5 whitespace-nowrap" style="color: var(--text-muted);">
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ deliveryDate }}
          </p>
        </div>

        <!-- Right: Status + time + arrow -->
        <div class="flex items-center gap-3 shrink-0">
          <span :class="statusBadgeClass">{{ statusLabel }}</span>
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-medium whitespace-nowrap" style="color: var(--text-muted);">{{ relativeDate }}</span>
            <svg class="w-3.5 h-3.5 transition-all duration-200"
                 :style="{ color: hover ? 'var(--rose-primary)' : 'var(--text-muted)', opacity: hover ? 1 : 0.4 }"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { LOCALE } from '../../config/constants'

const props = defineProps({
  report: Object,
  showUser: { type: Boolean, default: false }
})

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

const accentColor = computed(() => ({
  pending: 'var(--warning)',
  in_progress: 'var(--info)',
  resolved: 'var(--success)',
}[props.report.status] || 'var(--warning)'))

const typeBg = computed(() => props.report.platform_type === 'profile'
  ? 'rgba(139,92,246,0.1)' : 'rgba(196,90,122,0.1)')
const typeColor = computed(() => props.report.platform_type === 'profile'
  ? '#8b5cf6' : 'var(--rose-primary)')

const rowStyle = computed(() => ({
  borderColor: hover.value ? 'rgba(196,90,122,0.15)' : 'var(--border-color)',
  background: hover.value ? 'var(--bg-surface)' : 'var(--bg-card)',
  boxShadow: hover.value ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
}))

const iconStyle = computed(() => ({
  background: hover.value ? 'var(--rose-gradient)' : 'var(--rose-lighter)',
  color: hover.value ? 'white' : 'var(--rose-primary)',
  boxShadow: hover.value ? '0 4px 12px rgba(196,90,122,0.3)' : 'none',
}))

const relativeDate = computed(() => {
  const date = new Date(props.report.createdAt)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'Ahora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return date.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' })
})

const deliveryDate = computed(() => {
  if (!props.report.delivery_date) return ''
  const d = new Date(props.report.delivery_date)
  return d.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' })
})
</script>

<style scoped>
.report-row {
  display: flex;
  overflow: hidden;
}
.report-row-accent {
  width: 3px;
  flex-shrink: 0;
  border-radius: 3px 0 0 3px;
  transition: width 0.2s ease;
}
.report-row:hover .report-row-accent {
  width: 4px;
}
.report-row-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  flex: 1;
  min-width: 0;
}
@media (min-width: 640px) {
  .report-row-inner {
    gap: 1rem;
    padding: 1rem 1.25rem;
  }
}
.report-row-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (min-width: 640px) {
  .report-row-icon {
    width: 2.75rem;
    height: 2.75rem;
  }
}
</style>
