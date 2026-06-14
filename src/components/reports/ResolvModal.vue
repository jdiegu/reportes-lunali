<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-[9990] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark-950/75 backdrop-blur-sm" @click="close"></div>

        <div class="glass-card w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto">

          <!-- Header -->
          <div class="px-6 pt-6 pb-4 border-b border-rose-900/30 sticky top-0 glass-card rounded-b-none z-10">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="font-display text-xl font-bold text-blush-50">
                  {{ isEditing ? 'Editar resolución' : 'Resolver reporte' }}
                </h2>
                <p class="text-blush-500 text-xs mt-0.5">
                  {{ report?.platform }} · <span class="font-mono">{{ report?.mail }}</span>
                </p>
              </div>
              <button @click="close" class="btn-icon">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Bulk-resolve notice (solo cuando es plataforma de perfil y no es edición) -->
          <div
            v-if="report?.platform_type === 'profile' && !isEditing"
            class="mx-6 mt-5 p-3 rounded-xl bg-amber-900/20 border border-amber-700/30 flex gap-2.5"
          >
            <svg class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-amber-300 text-xs leading-relaxed">
              <strong>Plataforma con perfiles compartidos.</strong>
              Al resolver este reporte, todos los reportes con la misma cuenta
              (<span class="font-mono">{{ report?.mail }}</span>) quedarán resueltos automáticamente
              con la misma solución.
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-5">

            <!-- Tipo de solución -->
            <div>
              <label class="input-label">Tipo de solución *</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  v-for="opt in resolutionTypes"
                  :key="opt.value"
                  type="button"
                  @click="form.type = opt.value"
                  :class="[
                    'px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-150 text-left',
                    form.type === opt.value
                      ? 'bg-rose-600/25 border-rose-500/60 text-rose-300'
                      : 'border-rose-900/40 text-blush-400 hover:border-rose-800/60 hover:text-blush-200'
                  ]"
                >
                  <span class="block text-lg mb-0.5">{{ opt.emoji }}</span>
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- Datos de reposición (solo si type === 'replacement') -->
            <Transition name="slide-down">
              <div
                v-if="form.type === 'replacement'"
                class="space-y-3 rounded-xl border border-rose-800/30 p-4 bg-rose-900/10"
              >
                <p class="text-blush-400 text-xs font-medium uppercase tracking-wider">
                  Datos de la cuenta de reposición
                </p>
                <div>
                  <label class="input-label">Nuevo correo *</label>
                  <input
                    v-model="form.replaced_mail"
                    type="email"
                    class="input-field"
                    placeholder="nuevo@correo.com"
                    :required="form.type === 'replacement'"
                  />
                </div>
                <div>
                  <label class="input-label">Nueva contraseña *</label>
                  <input
                    v-model="form.replaced_password"
                    type="text"
                    class="input-field font-mono"
                    placeholder="contraseña123"
                    :required="form.type === 'replacement'"
                  />
                </div>
              </div>
            </Transition>

            <!-- Explicación -->
            <div>
              <label class="input-label">Explicación de la solución *</label>
              <textarea
                v-model="form.text"
                class="input-field resize-none"
                rows="4"
                placeholder="Describe cómo se resolvió el problema, qué se hizo y cualquier instrucción adicional para el usuario..."
                required
              ></textarea>
              <p class="text-blush-700 text-xs mt-1">{{ form.text.length }} caracteres</p>
            </div>

            <!-- Error -->
            <div
              v-if="errorMsg"
              class="text-rose-400 text-xs bg-rose-900/20 border border-rose-800/40 rounded-lg px-3 py-2"
            >
              {{ errorMsg }}
            </div>

            <!-- Acciones -->
            <div class="flex gap-3 pt-1">
              <button type="button" @click="close" class="btn-secondary flex-1">
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="submitting || !formValid"
                class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ submitting ? 'Guardando...' : (isEditing ? 'Actualizar resolución' : 'Marcar como resuelto') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useReportsStore } from '../../store/reports'
import { useToastStore } from '../../store/toast'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  report:     { type: Object,  default: null },
  isEditing:  { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'resolved'])

const reportsStore = useReportsStore()
const toast        = useToastStore()

const submitting = ref(false)
const errorMsg   = ref('')

const form = reactive({
  type:              '',
  text:              '',
  replaced_mail:     '',
  replaced_password: '',
})

const resolutionTypes = [
  { value: 'replacement', label: 'Reposición',       emoji: '🔄' },
  { value: 'fix',         label: 'Corrección',        emoji: '🔧' },
  { value: 'refund',      label: 'Reembolso',         emoji: '💰' },
  { value: 'no_fault',    label: 'Sin falla',         emoji: '✅' },
  { value: 'other',       label: 'Otro',              emoji: '📝' },
]

const formValid = computed(() =>
  form.type &&
  form.text.trim().length > 0 &&
  (form.type !== 'replacement' || (form.replaced_mail && form.replaced_password))
)

// Pre-llenar cuando se abre en modo edición
watch(() => props.modelValue, (open) => {
  errorMsg.value = ''
  if (!open) return

  if (props.isEditing && props.report?.resolution) {
    const r = props.report.resolution
    form.type              = r.type              || ''
    form.text              = r.text              || ''
    form.replaced_mail     = r.replaced_mail     || ''
    form.replaced_password = r.replaced_password || ''
  } else {
    form.type              = ''
    form.text              = ''
    form.replaced_mail     = ''
    form.replaced_password = ''
  }
})

function close() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  submitting.value = true
  errorMsg.value   = ''

  try {
    const payload = {
      type: form.type,
      text: form.text,
      ...(form.type === 'replacement' && {
        replaced_mail:     form.replaced_mail,
        replaced_password: form.replaced_password,
      }),
    }

    const result = props.isEditing
      ? await reportsStore.updateResolution(props.report._id, payload)
      : await reportsStore.resolveReport(props.report._id, payload)

    if (result.success) {
      toast.success(
        result.message ||
        (props.isEditing ? 'Resolución actualizada.' : 'Reporte resuelto correctamente.')
      )
      emit('resolved', result.data)
      close()
    } else {
      errorMsg.value = result.message
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from,
.modal-leave-to     { opacity: 0; }

.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to     { opacity: 0; transform: translateY(-8px); }
</style>