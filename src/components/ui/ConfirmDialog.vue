<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-dark-950/70 backdrop-blur-sm"
          @click="$emit('update:modelValue', false)"
        ></div>

        <div class="glass-card p-6 w-full max-w-sm relative z-10">
          <!-- Icon -->
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            :class="variant === 'danger'
              ? 'bg-rose-900/30 border border-rose-700/40'
              : 'bg-amber-900/20 border border-amber-700/30'"
          >
            <svg
              class="w-6 h-6"
              :class="variant === 'danger' ? 'text-rose-400' : 'text-amber-400'"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>

          <h3 class="font-display text-lg font-bold text-blush-50 text-center mb-2">{{ title }}</h3>
          <p class="text-blush-400 text-sm text-center mb-6">{{ message }}</p>

          <div class="flex gap-3">
            <button @click="$emit('update:modelValue', false)" class="btn-secondary flex-1">
              Cancelar
            </button>
            <button
              @click="confirm"
              :class="variant === 'danger' ? 'btn-danger flex-1' : 'btn-primary flex-1'"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue:   { type: Boolean, required: true },
  title:        { type: String,  default: '¿Estás seguro?' },
  message:      { type: String,  default: 'Esta acción no se puede deshacer.' },
  confirmLabel: { type: String,  default: 'Confirmar' },
  variant:      { type: String,  default: 'danger' },   // 'danger' | 'warning'
})

const emit = defineEmits(['update:modelValue', 'confirm'])

function confirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from,
.modal-leave-to     { opacity: 0; }
</style>