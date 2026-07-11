<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none sm:top-5 sm:right-5">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts" :key="toast.id"
        class="pointer-events-auto border rounded-xl shadow-lg p-3.5 sm:p-4 transition-all duration-300"
        :style="{
          background: toast.type === 'error' ? 'var(--error-bg)' : toast.type === 'success' ? 'var(--success-bg)' : 'var(--bg-card)',
          borderColor: toast.type === 'error' ? 'rgba(212,74,74,0.25)' : toast.type === 'success' ? 'rgba(75,181,116,0.25)' : 'var(--border-color)',
        }"
      >
        <div class="flex items-start gap-3">
          <div v-if="toast.type === 'success'" class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
               style="background: rgba(75,181,116,0.12);">
            <svg class="w-4 h-4" style="color: var(--success);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div v-else-if="toast.type === 'error'" class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
               style="background: rgba(212,74,74,0.1);">
            <svg class="w-4 h-4" style="color: var(--error);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div v-else class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
               style="background: var(--rose-lighter);">
            <svg class="w-4 h-4" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium" style="color: var(--text-primary);">{{ toast.title || toast.message }}</p>
            <p v-if="toast.title && toast.message" class="text-xs mt-0.5" style="color: var(--text-muted);">{{ toast.message }}</p>
          </div>
          <button @click="dismiss(toast.id)" class="shrink-0 transition-colors btn-ghost p-1 rounded-lg">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
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
.toast-enter-active { transition: all 0.3s cubic-bezier(0.21, 1.02, 0.73, 1); }
.toast-enter-from { opacity: 0; transform: translateX(100%) scale(0.95); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-leave-to { opacity: 0; transform: translateX(100%) scale(0.95); }
</style>
