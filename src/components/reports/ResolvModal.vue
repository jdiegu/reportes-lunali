<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0" style="background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);" @click="cancel"></div>

        <div class="relative rounded-2xl border shadow-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto"
             style="background: var(--bg-card); border-color: var(--border-color);">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: var(--success-bg);">
                <svg class="w-5 h-5" style="color: var(--success);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg">Resolver Reporte</h3>
                <p class="text-xs" style="color: var(--text-muted);">Se resolverán todos los reportes con la misma cuenta</p>
              </div>
            </div>
            <button @click="cancel" class="btn-icon">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div v-if="report" class="space-y-4">
            <div class="rounded-xl p-4 border flex items-center gap-3" style="background: var(--bg-surface); border-color: var(--border-color);">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                   style="background: var(--rose-gradient); color: white;">
                {{ report.platform?.charAt(0).toUpperCase() || '?' }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.mail }}</p>
                <p class="text-xs" style="color: var(--text-muted);">{{ report.platform }} · {{ report.platform_type === 'profile' ? 'Perfil' : 'Cuenta' }}</p>
              </div>
              <span class="badge badge-pending">Pendiente</span>
            </div>

            <div>
              <label class="input-label">Tipo de resolución</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="opt in resolutionOptions" :key="opt.value"
                  @click="selectType(opt)"
                  class="rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-200 text-center"
                  :style="selectedType === opt.value
                    ? { background: 'var(--rose-gradient)', borderColor: 'var(--rose-primary)', color: 'white' }
                    : { background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }"
                >
                  <div class="text-lg mb-0.5">{{ opt.emoji }}</div>
                  <p class="text-xs font-semibold">{{ opt.label }}</p>
                </button>
              </div>
            </div>

            <div v-if="selectedType">
              <label class="input-label">Texto de resolución</label>
              <textarea v-model="solutionText" rows="2" class="input-field resize-none" readonly
                :placeholder="'Se generará automáticamente según el tipo'"></textarea>
            </div>

            <div v-if="selectedType === 'replace'" class="rounded-xl border p-4 space-y-3" style="background: var(--bg-surface); border-color: var(--border-color);">
              <p class="text-xs font-semibold flex items-center gap-1.5" style="color: var(--rose-primary);">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Nuevas credenciales
              </p>
              <input v-model="replaceMail" type="email" class="input-field" placeholder="nuevo_correo@email.com" />
              <input v-model="replacePassword" type="text" class="input-field" placeholder="Nueva contraseña" />
            </div>

            <div v-if="error" class="rounded-lg border px-4 py-3 text-sm" style="border-color: rgba(224,112,112,0.3); background: var(--error-bg); color: var(--error);">
              {{ error }}
            </div>

            <div class="flex justify-end gap-3 pt-2 border-t" style="border-color: var(--border-color);">
              <button @click="cancel" class="btn-secondary text-sm">Cancelar</button>
              <button @click="handleResolve" :disabled="saving || !selectedType" class="btn-primary text-sm">
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

const resolutionOptions = [
  { value: 'replace',  label: 'Reemplazo',  emoji: '🔄', preset: 'Se realizó un reemplazo de credenciales. Se asignó un nuevo correo y contraseña para restablecer el acceso a la cuenta.' },
  { value: 'refund',   label: 'Devolución', emoji: '💳', preset: 'Se procesó la devolución del pago correspondiente. El usuario recibirá el reembolso en los próximos días.' },
  { value: 'reject',   label: 'No Procede', emoji: '🚫', preset: 'El reporte no procede. Después de revisar la evidencia, no se encontraron anomalías que justifiquen una intervención.' },
]

function selectType(opt) {
  selectedType.value = opt.value
  solutionText.value = opt.preset
}

watch(() => props.visible, (v) => {
  if (v) {
    selectedType.value = null
    solutionText.value = ''
    replaceMail.value = ''
    replacePassword.value = ''
    error.value = ''
  }
})

function cancel() { emit('close') }

async function handleResolve() {
  error.value = ''
  saving.value = true
  try {
    const payload = { text: solutionText.value }
    if (selectedType.value === 'replace') {
      payload.replaced_mail = replaceMail.value
      payload.replaced_password = replacePassword.value
    }
    await reportsStore.resolveReport(props.report._id, payload)
    const typeLabel = resolutionOptions.find(o => o.value === selectedType.value)?.label || selectedType.value
    toast.success('Reporte resuelto', `Resolución: ${typeLabel}`)
    emit('resolved')
    emit('close')
  } catch (e) {
    error.value = e.message || 'Error al resolver el reporte'
  } finally {
    saving.value = false
  }
}
</script>
