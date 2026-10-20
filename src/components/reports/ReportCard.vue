<template>
  <div
    class="report-card group relative rounded-2xl border cursor-pointer flex flex-col"
    :style="cardStyle"
    @click="emit('navigate')"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Decorations -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <div class="absolute inset-x-0 top-0 h-[2px]"
           style="background: linear-gradient(90deg, color-mix(in srgb, var(--text-muted) 28%, transparent), transparent);"></div>

      <Icon :icon="iconId"
            class="absolute -right-3 -bottom-4 w-24 h-24 opacity-[0.04] transition-transform duration-500 group-hover:scale-105"
            style="color: var(--text-muted);" />

      <svg class="absolute inset-x-0 bottom-0 h-16 w-full" viewBox="0 0 240 80" preserveAspectRatio="none">
        <path d="M0 52 C 40 20 80 68 120 48 S 200 18 240 42 L240 80 L0 80 Z" style="fill: var(--text-muted);" opacity="0.03" />
        <path d="M0 64 C 50 42 92 76 142 58 S 210 38 240 56 L240 80 L0 80 Z" style="fill: var(--text-muted);" opacity="0.05" />
      </svg>
    </div>

    <span v-if="showAgePill" class="float-pill" style="background: var(--rose-gradient); color: #ffffff;">
      <Clock class="w-3 h-3 shrink-0" />
      {{ ageLabel }}
    </span>

    <div class="relative z-10 flex flex-col h-full">
      <div class="flex items-start justify-between gap-2">
        <div class="flex flex-wrap items-center gap-1.5 min-w-0">
          <span class="tag" :style="{ background: statusBg, color: statusColor }">
            <span class="w-1.5 h-1.5 rounded-full" :style="{ background: statusColor }"></span>
            {{ statusLabel }}
          </span>
          <span v-if="isStale" class="tag" :style="{ background: statusBg, color: statusColor }">
            <AlertTriangle class="w-3 h-3 shrink-0" />
            {{ staleDays }} días sin resolver
          </span>
          <span v-else-if="isNew" class="tag" :style="{ background: statusBg, color: statusColor }">
            <span class="w-1.5 h-1.5 rounded-full" :style="{ background: statusColor }"></span>
            Nuevo
          </span>
          <span v-if="report.is_batch" class="tag" style="background: var(--warning-bg); color: var(--warning);">Lote</span>
          <span v-else class="tag" :style="{ background: typeBg, color: typeColor }">
            {{ report.platform_type === 'profile' ? 'Perfil' : 'Cuenta' }}
          </span>
        </div>

        <div class="menu-wrap relative shrink-0 -mt-1 -mr-1" @click.stop>
          <button
            @click="menuOpen = !menuOpen"
            class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            :style="{ background: menuOpen ? 'var(--rose-lighter)' : 'transparent', color: menuOpen ? 'var(--rose-primary)' : 'var(--text-muted)' }"
            title="Opciones"
          >
            <MoreVertical class="w-4 h-4" />
          </button>
          <Transition name="menu-pop">
            <div
              v-if="menuOpen"
              class="absolute right-0 top-8 z-30 rounded-xl border p-1 min-w-[175px]"
              style="background: var(--bg-card); border-color: var(--border-color); box-shadow: 0 8px 24px rgba(0,0,0,0.14);"
            >
              <button class="menu-item" @click.stop="goDetail">
                <Eye class="w-3.5 h-3.5" /> Ver detalle
              </button>
              <template v-if="canManage">
                <button v-if="report.status !== 'resolved'" class="menu-item" @click.stop="onResolve">
                  <CheckCircle class="w-3.5 h-3.5" /> Resolver
                </button>
                <button v-if="report.status !== 'resolved'" class="menu-item" @click.stop="onToggleStatus">
                  <RefreshCw class="w-3.5 h-3.5" />
                  {{ report.status === 'pending' ? 'Marcar en proceso' : 'Marcar pendiente' }}
                </button>
                <button v-else class="menu-item" @click.stop="onEditResolution">
                  <Pencil class="w-3.5 h-3.5" /> Editar resolución
                </button>
              </template>
            </div>
          </Transition>
        </div>
      </div>

      <div class="flex items-center gap-3 mt-3 mb-2.5 min-w-0">
        <div class="card-icon shrink-0 transition-all duration-300" :style="iconStyle">
          <Icon :icon="iconId" class="w-6 h-6" :style="{ color: platformColor }" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-base font-bold truncate leading-tight" style="color: var(--text-primary);">{{ report.platform }}</p>
          <p class="text-xs truncate mt-0.5" style="color: var(--text-muted);">{{ report.is_batch ? `${batchCount} cuentas en lote` : report.mail }}</p>
        </div>
      </div>

      <div v-if="resolutionChip" class="flex flex-wrap items-center gap-1.5 mb-3">
        <span class="tag max-w-full" :style="resolutionChip.style">
          <component :is="resolutionChip.icon" class="w-3 h-3 shrink-0" />
          <span class="truncate">{{ resolutionChip.label }}</span>
        </span>
      </div>

      <div class="mt-auto pt-3 border-t flex items-center justify-between gap-2" style="border-color: var(--border-color);">
        <p v-if="showUser && report.user" class="text-[11px] flex items-center gap-1 min-w-0 truncate" style="color: var(--text-muted);">
          <User class="w-3 h-3 shrink-0" />
          <span class="truncate">{{ report.user.username }}</span>
        </p>
        <span v-else></span>
        <p class="text-[11px] flex items-center gap-1 shrink-0" style="color: var(--text-muted);">
          <Calendar class="w-3 h-3" />
          {{ createdDate }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MoreVertical, Eye, CheckCircle, RefreshCw, Pencil, User, Calendar, ArrowRight, DollarSign, XCircle, AlertTriangle, RotateCcw, Clock } from '@lucide/vue'
import { Icon } from '@iconify/vue'
import { LOCALE } from '../../config/constants'
import { useAuthStore } from '../../store/auth'
import { usePlatformsStore } from '../../store/platforms'

const props = defineProps({
  report: Object,
  showUser: { type: Boolean, default: false },
})

const emit = defineEmits(['navigate', 'resolve', 'edit-resolution', 'toggle-status'])

const authStore = useAuthStore()
const platformsStore = usePlatformsStore()

const hover = ref(false)
const menuOpen = ref(false)

const canManage = computed(() => authStore.isAdmin)

function onDocClick(e) {
  if (!e.target.closest('.menu-wrap')) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

function goDetail() {
  menuOpen.value = false
  emit('navigate')
}
function onResolve() {
  menuOpen.value = false
  emit('resolve')
}
function onEditResolution() {
  menuOpen.value = false
  emit('edit-resolution')
}
function onToggleStatus() {
  menuOpen.value = false
  emit('toggle-status')
}

const batchCount = computed(() => {
  const emails = props.report.batch_emails || []
  const mail = props.report.mail
  if (mail && !emails.includes(mail)) return emails.length + 1
  return emails.length
})

const iconId = computed(() => platformsStore.getIconId(props.report.platform))
const platformColor = computed(() => platformsStore.getColor(props.report.platform))

const statusLabel = computed(() => ({
  pending: 'Pendiente',
  in_progress: 'En proceso',
  resolved: 'Resuelto',
}[props.report.status] || props.report.status))

const statusColor = computed(() => ({
  pending: '#f59e0b',
  in_progress: '#3b82f6',
  resolved: '#10b981',
}[props.report.status] || '#f59e0b'))

const statusBg = computed(() => ({
  pending: 'rgba(245, 158, 11, 0.14)',
  in_progress: 'rgba(59, 130, 246, 0.14)',
  resolved: 'rgba(16, 185, 129, 0.14)',
}[props.report.status] || 'rgba(245, 158, 11, 0.14)'))

const cardStyle = computed(() => ({
  borderColor: hover.value
    ? 'color-mix(in srgb, var(--text-muted) 35%, var(--border-color))'
    : 'var(--border-color)',
  background: 'linear-gradient(155deg, color-mix(in srgb, var(--text-muted) 4%, var(--bg-card)) 0%, var(--bg-card) 58%)',
  boxShadow: hover.value ? '0 8px 22px rgba(0, 0, 0, 0.08)' : 'var(--card-shadow)',
  transform: hover.value ? 'translateY(-2px)' : 'none',
}))

const iconStyle = computed(() => ({
  background: 'color-mix(in srgb, var(--text-muted) 6%, var(--bg-card))',
  border: '1px solid var(--border-color)',
  transform: hover.value ? 'scale(1.04)' : 'none',
}))

const typeBg = computed(() => props.report.platform_type === 'profile'
  ? 'rgba(216,80,125,0.12)' : 'rgba(196,90,122,0.1)')
const typeColor = computed(() => props.report.platform_type === 'profile'
  ? '#D8507D' : 'var(--rose-primary)')

const createdDate = computed(() => {
  if (!props.report.createdAt) return ''
  const d = new Date(props.report.createdAt)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  const opts = { day: 'numeric', month: 'short' }
  if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric'
  return d.toLocaleDateString(LOCALE, opts)
})

const isStale = computed(() => {
  if (props.report.status === 'resolved') return false
  const created = new Date(props.report.createdAt)
  if (isNaN(created.getTime())) return false
  return (Date.now() - created.getTime()) > 4 * 24 * 60 * 60 * 1000
})

const staleDays = computed(() => {
  if (!isStale.value) return 0
  const created = new Date(props.report.createdAt)
  return Math.floor((Date.now() - created.getTime()) / (24 * 60 * 60 * 1000))
})

const ageDays = computed(() => {
  const created = new Date(props.report.createdAt)
  if (isNaN(created.getTime())) return 0
  return Math.floor((Date.now() - created.getTime()) / (24 * 60 * 60 * 1000))
})

const showAgePill = computed(() => authStore.isAdmin && props.report.status !== 'resolved' && ageDays.value >= 3)

const isNew = computed(() => {
  const created = new Date(props.report.createdAt)
  if (isNaN(created.getTime())) return false
  const now = new Date()
  return created.getFullYear() === now.getFullYear()
    && created.getMonth() === now.getMonth()
    && created.getDate() === now.getDate()
    && props.report.status !== 'resolved'
})

const ageLabel = computed(() => {
  if (ageDays.value === 0) return 'Hoy'
  return `Hace ${ageDays.value} ${ageDays.value === 1 ? 'día' : 'días'}`
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
  if (res.type === 'reactivated') {
    icon = RotateCcw
    label = 'Reactivada'
    return { icon, label, style: { background: 'var(--success-bg)', color: 'var(--success)' } }
  }
  return null
})
</script>

<style scoped>
.report-card {
  padding: 0.875rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
@media (min-width: 640px) {
  .report-card { padding: 1rem; }
}
.card-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.float-pill {
  position: absolute;
  top: -0.7rem;
  right: 0.875rem;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  pointer-events: none;
}
.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.55rem;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  background: transparent;
  border: none;
  text-align: left;
  transition: background 0.15s ease, color 0.15s ease;
}
.menu-item:hover {
  background: var(--rose-lighter);
  color: var(--rose-primary);
}
.menu-pop-enter-active,
.menu-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
