<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0" style="background: rgba(0,0,0,0.45); backdrop-filter: blur(6px);" @click="cancel"></div>

        <div class="relative rounded-2xl border shadow-xl w-full max-w-lg p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
             style="background: var(--bg-card); border-color: var(--border-color); box-shadow: var(--shadow-lg);">
          <div class="flex items-center justify-between mb-5 sm:mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: var(--success-bg);">
                <svg class="w-5 h-5" style="color: var(--success);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold" style="color: var(--text-primary);">Resolver Reporte</h3>
                <p class="text-xs" style="color: var(--text-muted);">Se resolveran todos los reportes con la misma cuenta</p>
              </div>
            </div>
            <button @click="cancel" class="btn-icon w-8 h-8">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div v-if="report" class="space-y-4">
            <div class="rounded-xl p-3.5 sm:p-4 border flex items-center gap-3"
                 style="background: var(--bg-surface); border-color: var(--border-color);">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                   style="background: var(--rose-gradient); color: white;">
                {{ report.platform?.charAt(0).toUpperCase() || '?' }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.mail }}</p>
                <p class="text-xs" style="color: var(--text-muted);">
                  {{ report.platform }} · {{ report.platform_type === 'profile' ? 'Perfil' : 'Cuenta' }}
                </p>
              </div>
              <span class="badge badge-pending">Pendiente</span>
            </div>

            <div>
              <label class="input-label">Tipo de resolucion</label>
              <div class="grid grid-cols-3 gap-2 sm:gap-2.5">
                <button
                  v-for="opt in resolutionOptions" :key="opt.value"
                  @click="selectType(opt)"
                  class="rounded-xl border px-2.5 sm:px-3 py-3 text-sm font-medium transition-all duration-200 text-center"
                  :style="selectedType === opt.value
                    ? { background: 'var(--rose-gradient)', borderColor: 'var(--rose-primary)', color: 'white', boxShadow: '0 2px 12px rgba(196,90,122,0.3)' }
                    : { background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }"
                >
                  <div class="text-lg mb-0.5">{{ opt.emoji }}</div>
                  <p class="text-xs font-semibold">{{ opt.label }}</p>
                </button>
              </div>
            </div>

            <div v-if="selectedType">
              <label class="input-label">Texto de resolucion</label>
              <textarea v-model="solutionText" rows="3" class="input-field resize-none"
                placeholder="Se generara automaticamente segun el tipo"></textarea>
            </div>

            <div v-if="selectedType === 'replace'"
                 class="rounded-xl border p-4 space-y-3"
                 style="background: var(--bg-surface); border-color: var(--border-color);">
              <p class="text-xs font-semibold flex items-center gap-1.5" style="color: var(--rose-primary);">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
                Nuevas credenciales
              </p>
              <input v-model="replaceMail" type="email" class="input-field" placeholder="nuevo_correo@email.com" />
              <input v-model="replacePassword" type="text" class="input-field" placeholder="Nueva contrasena" />
            </div>

            <div v-if="selectedType === 'credit'"
                 class="rounded-xl border p-4 space-y-3"
                 style="background: var(--bg-surface); border-color: var(--border-color);">
              <p class="text-xs font-semibold flex items-center gap-1.5" style="color: var(--success);">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Saldo a favor
              </p>
              <div>
                <label class="input-label">Monto ($)</label>
                <input v-model.number="creditAmount" type="number" min="1" step="0.01" class="input-field text-lg font-mono"
                       placeholder="0.00" />
              </div>
            </div>

            <div v-if="error" class="rounded-lg border px-4 py-3 text-sm"
                 style="border-color: rgba(212,74,74,0.25); background: var(--error-bg); color: var(--error);">
              {{ error }}
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t" :style="{ borderColor: 'var(--border-color)' }">
              <button @click="cancel" class="btn-secondary text-sm !px-5">Cancelar</button>
              <button @click="handleResolve" :disabled="saving || !selectedType" class="btn-primary text-sm !px-5">
                <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span v-if="saving">Resolviendo...</span>
                <span v-else>Resolver</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToastStore } from '../../store/toast'
import { useReportsStore } from '../../store/reports'

const toast = useToastStore()
const reportsStore = useReportsStore()

const props = defineProps({ visible: Boolean, report: Object })
const emit = defineEmits(['close', 'resolved'])

const saving = ref(false)
const error = ref('')
const selectedType = ref(null)
const solutionText = ref('')
const replaceMail = ref('')
const replacePassword = ref('')
const creditAmount = ref(0)

const resolutionOptions = [
  { value: 'replace',  label: 'Reemplazo',  emoji: '🔄', preset: 'Se realizo un reemplazo de credenciales. Se asigno un nuevo correo y contrasena para restablecer el acceso a la cuenta.' },
  { value: 'credit',   label: 'Saldo',      emoji: '💰', preset: 'Se acredito un saldo a favor como compensacion por el inconveniente presentado.' },
  { value: 'reject',   label: 'No Procede', emoji: '🚫', preset: 'El reporte no procede. Despues de revisar la evidencia, no se encontraron anomalias que justifiquen una intervencion.' },
]

function selectType(opt) {
  selectedType.value = opt.value
  solutionText.value = opt.preset
  creditAmount.value = 0
}

watch(() => props.visible, (v) => {
  if (v) {
    selectedType.value = null
    solutionText.value = ''
    replaceMail.value = ''
    replacePassword.value = ''
    creditAmount.value = 0
    error.value = ''
  }
})

function cancel() { emit('close') }

async function handleResolve() {
  error.value = ''
  if (selectedType.value === 'credit' && (!creditAmount.value || creditAmount.value <= 0)) {
    error.value = 'Debes ingresar un monto valido para el saldo a favor.'
    return
  }
  saving.value = true
  try {
    const payload = { text: solutionText.value, type: selectedType.value }
    if (selectedType.value === 'replace') {
      payload.replaced_mail = replaceMail.value
      payload.replaced_password = replacePassword.value
    }
    if (selectedType.value === 'credit') {
      payload.credit_amount = creditAmount.value
    }
    await reportsStore.resolveReport(props.report._id, payload)
    const typeLabel = resolutionOptions.find(o => o.value === selectedType.value)?.label || selectedType.value
    toast.success('Reporte resuelto', `Resolucion: ${typeLabel}`)
    emit('resolved')
    emit('close')
  } catch (e) {
    error.value = e.message || 'Error al resolver el reporte'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-enter-active { transition: opacity 0.25s cubic-bezier(0.21, 1.02, 0.73, 1); }
.modal-leave-active { transition: opacity 0.15s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .relative { transition: transform 0.25s cubic-bezier(0.21, 1.02, 0.73, 1); }
.modal-enter-from .relative { transform: scale(0.96) translateY(8px); }
</style>
