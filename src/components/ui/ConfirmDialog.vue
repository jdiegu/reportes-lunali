<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0" style="background: rgba(0,0,0,0.4); backdrop-filter: blur(6px);" @click="cancel"></div>
        <div class="relative rounded-2xl border shadow-xl w-full max-w-sm sm:max-w-md p-5 sm:p-6"
             style="background: var(--bg-card); border-color: var(--border-color); box-shadow: var(--shadow-lg);">
          <div class="flex items-start gap-4">
            <div v-if="type === 'danger'" class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                 style="background: var(--error-bg);">
              <AlertTriangle class="w-5 h-5" style="color: var(--error);" />
            </div>
            <div v-else class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                 style="background: var(--rose-lighter);">
              <Info class="w-5 h-5" style="color: var(--rose-primary);" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-base sm:text-lg" style="color: var(--text-primary);">{{ title }}</h3>
              <p class="text-sm mt-1 leading-relaxed" style="color: var(--text-muted);">{{ message }}</p>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t" :style="{ borderColor: 'var(--border-color)' }">
            <button @click="cancel" class="btn-secondary text-sm !px-5">Cancelar</button>
            <button @click="confirm" :disabled="loading"
                    :class="[type === 'danger' ? 'btn-danger' : 'btn-primary', 'text-sm !px-5']">
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
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
import { AlertTriangle, Info, Loader2 } from '@lucide/vue'

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
.fade-enter-active { transition: opacity 0.25s ease; }
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
