<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none w-80 max-w-[calc(100vw-2rem)]">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="['pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-card backdrop-blur-sm cursor-pointer', styleMap[toast.type]]"
          @click="toastStore.remove(toast.id)"
        >
          <div :class="['shrink-0 mt-0.5', iconColorMap[toast.type]]">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath(toast.type)" />
            </svg>
          </div>
          <p class="text-sm leading-snug flex-1">{{ toast.message }}</p>
          <button class="opacity-40 hover:opacity-70 transition-opacity shrink-0">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const styleMap = {
  success: 'bg-emerald-950/90 border-emerald-700/40 text-emerald-100',
  error:   'bg-rose-950/90 border-rose-700/40 text-rose-100',
  warning: 'bg-amber-950/90 border-amber-700/40 text-amber-100',
  info:    'bg-dark-900/90 border-rose-900/40 text-blush-100',
}

const iconColorMap = {
  success: 'text-emerald-400',
  error:   'text-rose-400',
  warning: 'text-amber-400',
  info:    'text-blush-400',
}

const iconPaths = {
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error:   'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const iconPath = (type) => iconPaths[type] || iconPaths.info
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(100%) scale(0.9); }
.toast-leave-to     { opacity: 0; transform: translateX(100%) scale(0.95); }
</style>