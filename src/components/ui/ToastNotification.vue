<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none sm:top-5 sm:right-5">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts" :key="toast.id"
          class="pointer-events-auto border rounded-xl shadow-xl overflow-hidden transition-all duration-300"
          :style="toastStyle(toast.type)"
        >
          <div class="flex items-start gap-3 p-3.5 sm:p-4">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                 :style="iconBg(toast.type)">
              <CheckCircle v-if="toast.type === 'success'" class="w-4.5 h-4.5" :style="{ color: 'var(--success)' }" />
              <AlertTriangle v-else-if="toast.type === 'error'" class="w-4.5 h-4.5" :style="{ color: 'var(--error)' }" />
              <AlertTriangle v-else-if="toast.type === 'warning'" class="w-4.5 h-4.5" :style="{ color: 'var(--warning)' }" />
              <Info v-else class="w-4.5 h-4.5" :style="{ color: 'var(--info)' }" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold leading-tight" style="color: var(--text-primary);">{{ toast.title }}</p>
              <p v-if="toast.message" class="text-xs mt-1 leading-relaxed" style="color: var(--text-muted);">{{ toast.message }}</p>
            </div>
            <button @click="dismiss(toast.id)" class="shrink-0 p-1 rounded-lg transition-colors btn-ghost mt-0.5">
              <X class="w-3.5 h-3.5" style="color: var(--text-muted);" />
            </button>
          </div>
          <div class="h-[2px] w-full" :style="{ background: progressColor(toast.type) }">
            <div class="h-full transition-all ease-linear"
                 :style="{ background: progressColor(toast.type), animation: `shrink ${toast._duration || 4000}ms linear forwards` }"></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '../../store/toast'
import { CheckCircle, AlertTriangle, Info, X } from '@lucide/vue'

const toastStore = useToastStore()
const toasts = computed(() => toastStore.toasts)

function dismiss(id) { toastStore.remove(id) }

function toastStyle(type) {
  const map = {
    success: { background: 'var(--success-bg)', borderColor: 'rgba(75,181,116,0.25)' },
    error:   { background: 'var(--error-bg)',   borderColor: 'rgba(212,74,74,0.25)' },
    warning: { background: 'var(--warning-bg)',  borderColor: 'rgba(234,179,8,0.25)' },
    info:    { background: 'var(--bg-card)',     borderColor: 'var(--border-color)' },
  }
  return map[type] || map.info
}

function iconBg(type) {
  const map = {
    success: 'rgba(75,181,116,0.12)',
    error:   'rgba(212,74,74,0.1)',
    warning: 'rgba(234,179,8,0.1)',
    info:    'var(--rose-lighter)',
  }
  return { background: map[type] || map.info }
}

function progressColor(type) {
  const map = {
    success: 'var(--success)',
    error:   'var(--error)',
    warning: 'var(--warning)',
    info:    'var(--rose-primary)',
  }
  return map[type] || map.info
}
</script>

<style scoped>
.toast-enter-active { transition: all 0.35s cubic-bezier(0.21, 1.02, 0.73, 1); }
.toast-enter-from { opacity: 0; transform: translateX(100%) scale(0.92); }
.toast-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 1, 1); }
.toast-leave-to { opacity: 0; transform: translateX(40%) scale(0.95); }
.toast-move { transition: transform 0.3s ease; }

@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}
</style>
