<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0" style="background: rgba(0,0,0,0.35); backdrop-filter: blur(4px);" @click="cancel"></div>

        <div class="relative rounded-2xl border shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
             style="background: var(--bg-card); border-color: var(--border-color);">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background: var(--rose-lighter);">
                <svg class="w-4 h-4" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="font-display font-bold text-lg" style="color: var(--text-primary);">Resolver reporte</h3>
            </div>
            <button @click="cancel" class="btn-icon" style="color: var(--text-muted);">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div v-if="report" class="space-y-4">
            <div class="rounded-xl p-4" style="background: var(--bg-surface);">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium"
                     style="background: var(--rose-lighter); color: var(--rose-primary);">
                  {{ report.platform?.charAt(0).toUpperCase() || '?' }}
                </div>
                <div>
                  <p class="text-sm font-medium" style="color: var(--text-primary);">{{ report.platform }}</p>
                  <p class="text-xs" style="color: var(--text-muted);">{{ report.mail }}</p>
                </div>
              </div>
              <p class="text-xs" style="color: var(--text-muted);">{{ report.problemType }}</p>
            </div>

            <div>
              <label class="input-label">Tipo de resoluci&oacute;n</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="opt in resolutionOptions" :key="opt.value"
                  @click="selectedType = opt.value"
                  :class="['rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 text-left']"
                  :style="selectedType === opt.value
                    ? { background: 'linear-gradient(135deg, var(--rose-primary), var(--rose-600))', borderColor: 'var(--rose-primary)', color: 'white' }
                    : { background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }"
                >
                  <p>{{ opt.label }}</p>
                  <p v-if="opt.hint" class="text-xs opacity-70 mt-0.5">{{ opt.hint }}</p>
                </button>
              </div>
            </div>

            <div>
              <label class="input-label">Soluci&oacute;n</label>
              <textarea v-model="solutionText" rows="3" class="input-field resize-none" placeholder="Describe la soluci&oacute;n aplicada..."></textarea>
            </div>

            <div v-if="selectedType === 'replace'">
              <p class="text-xs font-medium mb-2" style="color: var(--text-muted);">Nuevas credenciales</p>
              <div class="rounded-xl p-4 space-y-3 border" style="background: var(--bg-surface); border-color: var(--border-color);">
                <div>
                  <label class="text-xs" style="color: var(--text-muted);">Nuevo correo</label>
                  <input v-model="replaceMail" type="email" class="input-field mt-0.5" placeholder="nuevo@email.com" />
                </div>
                <div>
                  <label class="text-xs" style="color: var(--text-muted);">Nueva contrase&ntilde;a</label>
                  <input v-model="replacePassword" type="text" class="input-field mt-0.5" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" />
                </div>
              </div>
            </div>

            <div v-if="error" class="rounded-lg border px-3 py-2 text-xs"
                 style="border-color: rgba(232,138,138,0.3); background: var(--error-bg); color: var(--error);">
              {{ error }}
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button @click="cancel" class="btn-secondary text-sm">Cancelar</button>
              <button @click="handleResolve" :disabled="saving" class="btn-primary text-sm">
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

const props = defineProps({
  visible: Boolean,
  report: Object,
})

const emit = defineEmits(['close', 'resolved'])

const saving = ref(false)
const error = ref('')
const selectedType = ref('fix')
const solutionText = ref('')
const replaceMail = ref('')
const replacePassword = ref('')

const resolutionOptions = [
  { value: 'fix',     label: 'Correcci&oacute;n', hint: 'Sin cambio de credenciales' },
  { value: 'replace', label: 'Reemplazo',           hint: 'Nuevo correo y contrase&ntilde;a' },
]

watch(() => props.visible, (v) => {
  if (v) {
    selectedType.value = 'fix'
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
    const payload = { text: solutionText.value, type: selectedType.value }
    if (selectedType.value === 'replace') {
      payload.replaced_mail = replaceMail.value
      payload.replaced_password = replacePassword.value
    }
    await reportsStore.resolveReport(props.report._id, payload)
    const typeLabel = resolutionOptions.find(o => o.value === selectedType.value)?.label || selectedType.value
    const msgParts = ['Reporte resuelto (' + typeLabel + ')']
    if (selectedType.value === 'replace' && replaceMail.value) {
      msgParts.push('Reemplazo: ' + replaceMail.value)
    }
    toast.success('Reporte resuelto', msgParts.join(' — '))
    emit('resolved')
    emit('close')
  } catch (e) {
    error.value = e.message || 'Error al resolver el reporte'
  } finally {
    saving.value = false
  }
}
</script>
