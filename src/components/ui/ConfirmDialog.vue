<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0"
             style="background: rgba(0,0,0,0.55); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);"
             @click="cancel"></div>
        <div class="relative w-full max-w-sm rounded-2xl overflow-hidden dialog-card">
          <div class="h-1 w-full" :style="barStyle"></div>
          <div class="px-6 pt-5 pb-4" style="background: var(--bg-card);">
            <div class="flex items-start gap-3.5">
              <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                   :style="iconWrapStyle">
                <AlertTriangle v-if="type === 'danger'" class="w-5 h-5" />
                <AlertTriangle v-else-if="type === 'warning'" class="w-5 h-5" />
                <Info v-else class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0 pt-0.5">
                <p class="text-base sm:text-lg font-display font-bold leading-snug" style="color: var(--text-primary);">{{ title }}</p>
                <p class="text-sm mt-2 leading-relaxed" style="color: var(--text-secondary); line-height: 1.7;">{{ message }}</p>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2.5 px-6 pb-5 pt-1" style="background: var(--bg-card);">
            <button @click="cancel" :disabled="loading"
                    class="btn-dialog-secondary">
              Cancelar
            </button>
            <button @click="confirm" :disabled="loading"
                    :class="['btn-dialog-confirm', confirmBtnClass]">
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <span v-else>{{ confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { AlertTriangle, Info, Loader2 } from '@lucide/vue'

const props = defineProps({
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

const barStyle = computed(() => {
  if (props.type === 'danger') return { background: 'linear-gradient(90deg, var(--error), #d46a8a)' }
  if (props.type === 'warning') return { background: 'linear-gradient(90deg, var(--warning), #e88aac)' }
  return { background: 'var(--rose-gradient)' }
})

const iconWrapStyle = computed(() => {
  if (props.type === 'danger') return { background: 'var(--error-bg)', color: 'var(--error)' }
  if (props.type === 'warning') return { background: 'var(--warning-bg)', color: 'var(--warning)' }
  return { background: 'var(--rose-lighter)', color: 'var(--rose-primary)' }
})

const confirmBtnClass = computed(() => {
  if (props.type === 'danger') return 'btn-confirm-danger'
  if (props.type === 'warning') return 'btn-confirm-warning'
  return 'btn-confirm-primary'
})
</script>

<style scoped>
.modal-enter-active { transition: opacity 0.2s ease; }
.modal-leave-active { transition: opacity 0.15s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@keyframes dialogIn {
  from {
    transform: scale(0.93) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.dialog-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: var(--modal-shadow);
  animation: dialogIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-dialog-confirm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 5.5rem;
  position: relative;
}
.btn-dialog-confirm:focus-visible {
  outline: 2px solid var(--rose-primary);
  outline-offset: 2px;
}
.btn-dialog-confirm:active:not(:disabled) { transform: scale(0.96); }
.btn-dialog-confirm:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
.btn-dialog-confirm:not(:disabled):hover { transform: translateY(-1px); }

.btn-confirm-primary {
  background: var(--rose-gradient);
  color: white;
}
.btn-confirm-primary:not(:disabled):hover {
  box-shadow: 0 6px 20px rgba(196, 90, 122, 0.35);
}

.btn-confirm-danger {
  background: var(--error);
  color: white;
}
.btn-confirm-danger:not(:disabled):hover {
  box-shadow: 0 6px 20px rgba(212, 74, 74, 0.3);
}

.btn-confirm-warning {
  background: var(--warning);
  color: white;
}
.btn-confirm-warning:not(:disabled):hover {
  box-shadow: 0 6px 20px rgba(212, 148, 10, 0.3);
}

.btn-dialog-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-dialog-secondary:focus-visible {
  outline: 2px solid var(--rose-primary);
  outline-offset: 2px;
}
.btn-dialog-secondary:hover:not(:disabled) {
  background: var(--bg-surface);
  border-color: var(--rose-light);
  color: var(--text-primary);
}
.btn-dialog-secondary:active:not(:disabled) {
  transform: scale(0.97);
}
.btn-dialog-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>