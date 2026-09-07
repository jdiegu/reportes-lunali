<template>
  <div
    class="report-row group rounded-xl border cursor-pointer transition-all duration-200"
    :style="rowStyle"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="report-row-accent" :style="{ background: accentColor }"></div>

    <div class="report-row-inner">
      <div class="report-row-icon shrink-0 transition-all duration-200" :style="iconStyle">
        <Icon :icon="iconId" class="w-5 h-5 sm:w-5.5 sm:h-5.5" :style="{ color: platformColor }" />
      </div>

      <!-- Mobile -->
      <div class="flex-1 min-w-0 sm:hidden">
        <div class="flex items-center gap-2 mb-0.5">
          <p class="text-sm font-semibold truncate" style="color: var(--text-primary);">{{ report.platform }}</p>
          <span v-if="report.is_batch" class="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
                style="background: var(--warning-bg); color: var(--warning);">Lote</span>
          <span v-else class="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
                :style="{ background: typeBg, color: typeColor }">
            {{ report.platform_type === 'profile' ? 'Perfil' : 'Cuenta' }}
          </span>
        </div>
        <p class="text-xs truncate mb-1" style="color: var(--text-muted);">{{ report.is_batch ? `${batchCount} cuentas` : report.mail }}</p>
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span v-if="resolutionChip" :style="resolutionChip.style"
                class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md max-w-full">
            <component :is="resolutionChip.icon" class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate">{{ resolutionChip.label }}</span>
          </span>
          <span :class="statusBadgeClass">{{ statusLabel }}</span>
          <p v-if="showUser && report.user" class="text-[11px] flex items-center gap-1" style="color: var(--text-muted);">
            <User class="w-3 h-3 shrink-0" />
            {{ report.user.username }}
          </p>
          <p class="text-[11px] flex items-center gap-1" style="color: var(--text-muted);">
            <Calendar class="w-3 h-3 shrink-0" />
            {{ createdDate }}
          </p>
        </div>
      </div>

      <!-- Desktop -->
      <div class="hidden sm:flex flex-1 min-w-0 items-center gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <p class="text-sm font-semibold truncate" style="color: var(--text-primary);">{{ report.platform }}</p>
            <span v-if="report.is_batch" class="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
                  style="background: var(--warning-bg); color: var(--warning);">Lote</span>
            <span v-else class="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
                  :style="{ background: typeBg, color: typeColor }">
              {{ report.platform_type === 'profile' ? 'Perfil' : 'Cuenta' }}
            </span>
          </div>
          <p class="text-xs truncate" style="color: var(--text-muted);">{{ report.is_batch ? `${batchCount} cuentas en lote` : report.mail }}</p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <p v-if="showUser && report.user" class="text-xs flex items-center gap-1.5 whitespace-nowrap" style="color: var(--text-muted);">
            <User class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate max-w-[120px]">{{ report.user.username }}</span>
          </p>
          <p class="text-xs flex items-center gap-1.5 whitespace-nowrap" style="color: var(--text-muted);">
            <Calendar class="w-3.5 h-3.5 shrink-0" />
            {{ createdDate }}
          </p>
        </div>

        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <span v-if="resolutionChip" :style="resolutionChip.style"
                class="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md max-w-[150px]">
            <component :is="resolutionChip.icon" class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate">{{ resolutionChip.label }}</span>
          </span>
          <span :class="statusBadgeClass">{{ statusLabel }}</span>
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-medium whitespace-nowrap" style="color: var(--text-muted);">{{ relativeDate }}</span>
            <ChevronRight
              class="w-3.5 h-3.5 transition-all duration-200"
              :style="{ color: hover ? 'var(--rose-primary)' : 'var(--text-muted)', opacity: hover ? 1 : 0.4 }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronRight, User, Calendar, ArrowRight, DollarSign, XCircle } from '@lucide/vue'
import { Icon } from '@iconify/vue'
import { LOCALE } from '../../config/constants'
import { getPlatformIconId, getPlatformColor } from '../../utils/platformIcons'
import { usePlatformsStore } from '../../store/platforms'

const props = defineProps({
  report: Object,
  showUser: { type: Boolean, default: false }
})

const platformsStore = usePlatformsStore()

onMounted(() => platformsStore.fetch())

const hover = ref(false)

const batchCount = computed(() => {
  const emails = props.report.batch_emails || []
  const mail = props.report.mail
  if (mail && !emails.includes(mail)) return emails.length + 1
  return emails.length
})

const iconId = computed(() => platformsStore.getIconId(props.report.platform))
const platformColor = computed(() => platformsStore.getColor(props.report.platform))

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
  ? 'rgba(216,80,125,0.12)' : 'rgba(196,90,122,0.1)')
const typeColor = computed(() => props.report.platform_type === 'profile'
  ? '#D8507D' : 'var(--rose-primary)')

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

const createdDate = computed(() => {
  if (!props.report.createdAt) return ''
  const d = new Date(props.report.createdAt)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  const opts = { day: 'numeric', month: 'short' }
  if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric'
  return d.toLocaleDateString(LOCALE, opts)
})

const resolutionChip = computed(() => {
  const res = props.report.resolution
  if (props.report.status !== 'resolved' || !res || !res.type) return null

  let icon, label
  if (res.type === 'replace') {
    icon = ArrowRight
    if (res.replaced_mail) label = res.replaced_mail
    else if (res.replaced_mails && res.replaced_mails.length > 0) {
      label = res.replaced_mails.length === 1
        ? res.replaced_mails[0]
        : `${res.replaced_mails.length} nuevos correos`
    } else {
      label = 'Reemplazo'
    }
    return { icon, label, style: { background: 'var(--info-bg)', color: 'var(--info)' } }
  }
  if (res.type === 'credit') {
    icon = DollarSign
    label = `$${Number(res.credit_amount || 0).toFixed(2)}`
    return { icon, label, style: { background: 'var(--success-bg)', color: 'var(--success)' } }
  }
  if (res.type === 'reject') {
    icon = XCircle
    label = 'No procede'
    return { icon, label, style: { background: 'var(--error-bg)', color: 'var(--error)' } }
  }
  return null
})
</script>

<style scoped>
.report-row { display: flex; overflow: hidden; }
.report-row-accent { width: 3px; flex-shrink: 0; border-radius: 3px 0 0 3px; transition: width 0.2s ease; }
.report-row:hover .report-row-accent { width: 4px; }
.report-row-inner { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1rem; flex: 1; min-width: 0; }
@media (min-width: 640px) { .report-row-inner { gap: 1rem; padding: 1rem 1.25rem; } }
.report-row-icon { width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
@media (min-width: 640px) { .report-row-icon { width: 2.75rem; height: 2.75rem; } }
</style>
