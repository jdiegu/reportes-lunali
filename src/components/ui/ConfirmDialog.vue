<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0" style="background: rgba(0,0,0,0.35); backdrop-filter: blur(4px);" @click="cancel"></div>
        <div class="relative rounded-2xl border shadow-xl w-full max-w-md p-6" style="background: var(--bg-card); border-color: var(--border-color);">
          <div class="flex items-start gap-4">
            <div v-if="type === 'danger'" class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background: var(--error-bg);">
              <svg class="w-5 h-5" style="color: var(--error);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div v-else class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background: var(--rose-lighter);">
              <svg class="w-5 h-5" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-lg" style="color: var(--text-primary);">{{ title }}</h3>
              <p class="text-sm mt-1" style="color: var(--text-muted);">{{ message }}</p>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button @click="cancel" class="btn-secondary text-sm">Cancelar</button>
            <button @click="confirm" :disabled="loading" :class="[type === 'danger' ? 'btn-danger' : 'btn-primary', 'text-sm']">
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span v-if="loading">Procesando...</span>
              <span v-else>{{ confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: String,
  message: String,
  confirmText: { type: String, default: 'Confirmar' },
  type: { type: String, default: 'info' },
  loading: Boolean,
})

const emit = defineEmits(['confirm', 'cancel'])

function confirm() { emit('confirm') }
function cancel() { emit('cancel') }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
