<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts" :key="toast.id"
        class="pointer-events-auto border rounded-xl shadow-lg p-4 transition-all duration-300"
        :class="toast.type === 'error' ? 'bg-red-50 dark:bg-red-900/20' : toast.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-gray-800'"
        :style="{ borderColor: toast.type === 'error' ? 'rgba(232,138,138,0.3)' : toast.type === 'success' ? 'rgba(75,181,116,0.3)' : 'var(--border-color)' }"
      >
        <div class="flex items-start gap-3">
          <svg v-if="toast.type === 'success'" class="w-5 h-5 mt-0.5 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-5 h-5 mt-0.5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-else class="w-5 h-5 mt-0.5 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium" style="color: var(--text-primary);">{{ toast.title || toast.message }}</p>
            <p v-if="toast.title && toast.message" class="text-xs mt-0.5" style="color: var(--text-secondary);">{{ toast.message }}</p>
          </div>
          <button @click="dismiss(toast.id)" class="shrink-0 transition-colors btn-ghost p-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '../../store/toast'

const toastStore = useToastStore()
const toasts = computed(() => toastStore.toasts)

function dismiss(id) { toastStore.remove(id) }
</script>

<style scoped>
.toast-enter-active { opacity: 0; transform: translateX(100%) scale(0.96); }
.toast-enter-to { opacity: 1; transform: translateX(0) scale(1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-leave-to { opacity: 0; transform: translateX(100%) scale(0.96); }
</style>
