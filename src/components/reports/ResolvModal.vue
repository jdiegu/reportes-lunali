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
                <CheckCircle class="w-5 h-5" style="color: var(--success);" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold" style="color: var(--text-primary);">{{ editingResolution ? 'Editar Resolución' : 'Resolver Reporte' }}</h3>
                <p class="text-xs" style="color: var(--text-muted);">{{ editingResolution ? 'Modifica los datos de la resolucion' : (selectedType === 'credit' ? 'Solo se resolvera este reporte' : 'Se resolveran todos los reportes con la misma cuenta') }}</p>
              </div>
            </div>
            <button @click="cancel" class="btn-icon w-8 h-8">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div v-if="report" class="space-y-4">

            <div class="rounded-xl p-3.5 sm:p-4 border flex items-center gap-3"
                 style="background: var(--bg-surface); border-color: var(--border-color);">
               <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                    :style="{ background: platformColor + '18' }">
                 <Icon :icon="platformIconId" class="w-5 h-5" :style="{ color: platformColor }" />
               </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.mail }}</p>
                <p class="text-xs" style="color: var(--text-muted);">
                  {{ report.platform }} · {{ report.platform_type === 'profile' ? 'Perfil' : 'Cuenta' }}
                  <span v-if="report.is_batch && batchCount > 0"> · {{ batchCount + 1 }} cuentas en lote</span>
                </p>
              </div>
              <span class="badge badge-pending">Pendiente</span>
            </div>

            <div>
              <label class="input-label">Tipo de resolución</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                <button
                  v-for="opt in resolutionOptions" :key="opt.value"
                  @click="selectType(opt)"
                  class="rounded-xl border px-2.5 sm:px-3 py-3 text-sm font-medium transition-all duration-200 text-center"
                  :style="selectedType === opt.value
                    ? { background: 'var(--rose-gradient)', borderColor: 'var(--rose-primary)', color: 'white', boxShadow: '0 2px 12px rgba(196,90,122,0.3)' }
                    : { background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }"
                >
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1"
                       :style="{ background: selectedType === opt.value ? 'rgba(255,255,255,0.2)' : 'var(--bg-card)' }">
                    <RefreshCw v-if="opt.value === 'replace'" class="w-4 h-4" :style="{ color: selectedType === opt.value ? 'white' : 'var(--rose-primary)' }" />
                    <DollarSign v-else-if="opt.value === 'credit'" class="w-4 h-4" :style="{ color: selectedType === opt.value ? 'white' : 'var(--rose-primary)' }" />
                    <XCircle v-else-if="opt.value === 'reject'" class="w-4 h-4" :style="{ color: selectedType === opt.value ? 'white' : 'var(--rose-primary)' }" />
                    <RotateCcw v-else-if="opt.value === 'reactivated'" class="w-4 h-4" :style="{ color: selectedType === opt.value ? 'white' : 'var(--rose-primary)' }" />
                  </div>
                  <p class="text-xs font-semibold">{{ opt.label }}</p>
                </button>
              </div>
            </div>

            <div v-if="selectedType">
              <label class="input-label">Texto de resolución</label>
              <textarea v-model="solutionText" rows="3" class="input-field resize-none"
                placeholder="Se generara automaticamente segun el tipo"></textarea>
            </div>

            <div v-if="selectedType === 'replace' && !report.is_batch"
                 class="rounded-xl border p-4 space-y-3"
                 style="background: var(--bg-surface); border-color: var(--border-color);">
              <p class="text-xs font-semibold flex items-center gap-1.5" style="color: var(--rose-primary);">
                <Lock class="w-3.5 h-3.5" />
                Nueva cuenta
              </p>
              <input v-model="replaceMail" type="email" class="input-field" placeholder="nuevo_correo@email.com" />
              <input v-model="replacePassword" type="password" class="input-field" placeholder="Nueva contrasena" />
            </div>

            <div v-if="selectedType === 'replace' && report.is_batch"
                 class="rounded-xl border p-4 space-y-3"
                 style="background: var(--bg-surface); border-color: var(--border-color);">
              <p class="text-xs font-semibold flex items-center gap-1.5" style="color: var(--rose-primary);">
                <Lock class="w-3.5 h-3.5" />
                Nuevas cuentas
              </p>
              <p class="text-[11px]" style="color: var(--text-muted);">
                Ingresa un correo por linea. Se asignaran a las {{ batchCount + 1 }} cuentas del lote.
              </p>
              <textarea v-model="replaceMailsBatch" rows="4" class="input-field font-mono text-xs resize-none"
                placeholder="nuevo1@email.com&#10;nuevo2@email.com&#10;nuevo3@email.com"></textarea>
              <input v-model="replacePassword" type="password" class="input-field" placeholder="Nueva contrasena (misma para todas)" />
            </div>

            <div v-if="selectedType === 'credit'"
                 class="rounded-xl border p-4 space-y-3"
                 style="background: var(--bg-surface); border-color: var(--border-color);">
              <p class="text-xs font-semibold flex items-center gap-1.5" style="color: var(--success);">
                <DollarSign class="w-3.5 h-3.5" />
                Saldo a favor
              </p>
              <button @click="showCalculator = !showCalculator" class="text-xs sm:text-sm font-medium no-underline flex items-center gap-1.5 transition-colors" style="color: var(--rose-primary);">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <span>{{ showCalculator ? 'Ocultar' : 'Calculador' }} de crédito</span>
              </button>

              <div v-if="showCalculator" class="space-y-3 pt-3 border-t" :style="{ borderColor: 'var(--border-color)' }">
                <div class="flex items-center justify-between gap-2">
                  <label class="input-label">Duración de la cuenta</label>
                  <span class="text-xs font-medium" style="color: var(--text-muted);">{{ accountDuration }} mes{{ accountDuration > 1 ? 'es' : '' }} ({{ getTotalDays(accountDuration) }} días)</span>
                </div>
                <div>
                  <label class="input-label">Costo de la cuenta ($)</label>
                  <input v-model.number="accountCost" type="number" min="0" step="0.01" class="input-field" placeholder="0.00" />
                </div>
                <div>
                  <label class="input-label">Fecha de reporte</label>
                  <input v-model="reportDate" type="date" class="input-field" />
                </div>
                <div>
                  <label class="input-label">Fecha de entrega</label>
                  <input v-model="deliveryDate" type="date" class="input-field" />
                </div>
                <button @click="calculateCredit" class="btn-primary w-full text-sm !px-5">
                  Calcular crédito
                </button>
                <div v-if="calcPreview" class="rounded-lg border px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-x-3 gap-y-1"
                     style="border-color: color-mix(in srgb, var(--success) 22%, var(--border-color)); background: var(--success-bg); color: var(--success);">
                  <span>Días restantes: <strong>{{ calcPreview.days }}</strong></span>
                  <span>Crédito calculado: <strong>${{ calcPreview.credit.toFixed(2) }}</strong></span>
                </div>
                <div v-if="error" class="rounded-lg border px-3 py-2 text-sm flex items-center gap-2"
                     style="border-color: rgba(212,74,74,0.25); background: var(--error-bg); color: var(--error);">
                  <AlertTriangle class="w-4 h-4 shrink-0" />
                  <span>{{ error }}</span>
                </div>
              </div>

              <div>
                <label class="input-label">Monto ($)</label>
                <input v-model.number="creditAmount" type="number" min="1" step="0.01" class="input-field text-lg font-mono" placeholder="0.00" />
              </div>
            </div>

            <div v-if="error" class="rounded-lg border px-4 py-3 text-sm flex items-center gap-2"
                 style="border-color: rgba(212,74,74,0.25); background: var(--error-bg); color: var(--error);">
              <AlertTriangle class="w-4 h-4 shrink-0" />
              <span>{{ error }}</span>
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t" :style="{ borderColor: 'var(--border-color)' }">
              <button @click="cancel" class="btn-secondary text-sm !px-5">Cancelar</button>
              <button @click="handleResolve" :disabled="saving || !selectedType" class="btn-primary text-sm !px-5">
                <RefreshCw v-if="saving" class="w-4 h-4 animate-spin" />
                <span v-if="saving">{{ editingResolution ? 'Guardando...' : 'Resolviendo...' }}</span>
                <span v-else>{{ editingResolution ? 'Guardar cambios' : 'Resolver' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, CheckCircle, RefreshCw, DollarSign, XCircle, RotateCcw, Lock, Mail, AlertTriangle } from '@lucide/vue'
import { useToastStore } from '../../store/toast'
import { useReportsStore } from '../../store/reports'
import { getPlatformIconId, getPlatformColor } from '../../utils/platformIcons'
import { parseDateOnly } from '../../utils/dates'
import { usePlatformsStore } from '../../store/platforms'
import { Icon } from '@iconify/vue'

const toast = useToastStore()
const reportsStore = useReportsStore()
const platformsStore = usePlatformsStore()

const props = defineProps({
  visible: Boolean,
  report: Object,
  editingResolution: { type: Object, default: null }
})
const emit = defineEmits(['close', 'resolved'])

const saving = ref(false)
const error = ref('')
const selectedType = ref(null)
const solutionText = ref('')
const replaceMail = ref('')
const replacePassword = ref('')
const replaceMailsBatch = ref('')
const creditAmount = ref(0)
const showCalculator = ref(false)
const accountCost = ref(0)
const reportDate = ref('')
const deliveryDate = ref('')
const accountDuration = ref(1)

const batchCount = computed(() => (props.report?.batch_emails?.length || 0))
const platformIconId = computed(() => platformsStore.getIconId(props.report?.platform))
const platformColor = computed(() => platformsStore.getColor(props.report?.platform))

const resolutionOptions = [
  { value: 'replace', label: 'Reemplazo', preset: 'Se realizo un reemplazo de cuenta. Se asigno un nuevo correo y contrasena.' },
  { value: 'credit',  label: 'Saldo',     preset: 'Se acredito un saldo a favor como compensación por el inconveniente presentado.' },
  { value: 'reject',  label: 'No Procede', preset: 'El reporte no procede. Despues de revisar la evidencia, no se encontraron anomalias que justifiquen una intervención.' },
  { value: 'reactivated', label: 'Reactivada', preset: 'Tu cuenta ha sido reactivada, puedes utilizarla con los mismos datos que te fueron entregados desde el principio.' },
]

function selectType(opt) {
  selectedType.value = opt.value
  solutionText.value = opt.preset
  creditAmount.value = 0
  replaceMail.value = ''
  replacePassword.value = ''
  replaceMailsBatch.value = ''
}

watch(() => props.visible, (v) => {
  if (v) {
    error.value = ''
    showCalculator.value = false
    if (props.editingResolution) {
      const res = props.editingResolution
      selectedType.value = res.type || null
      solutionText.value = res.text || ''
      replaceMail.value = res.replaced_mail || ''
      replacePassword.value = res.replaced_password || ''
      replaceMailsBatch.value = (res.replaced_mails || []).join('\n')
      creditAmount.value = res.credit_amount || 0
    } else {
      selectedType.value = null
      solutionText.value = ''
      replaceMail.value = ''
      replacePassword.value = ''
      replaceMailsBatch.value = ''
      creditAmount.value = 0
    }
    if (props.report?.createdAt) {
      const d = new Date(props.report.createdAt)
      const pad = (n) => String(n).padStart(2, '0')
      reportDate.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
      accountDuration.value = props.report?.account_duration || 1
      if (props.report?.delivery_date) {
        const dd = parseDateOnly(props.report.delivery_date)
        deliveryDate.value = `${dd.getFullYear()}-${pad(dd.getMonth() + 1)}-${pad(dd.getDate())}`
      } else {
        const totalDays = getTotalDays(accountDuration.value)
        const delivery = new Date(d)
        delivery.setDate(delivery.getDate() + totalDays)
        deliveryDate.value = `${delivery.getFullYear()}-${pad(delivery.getMonth() + 1)}-${pad(delivery.getDate())}`
      }
    }
  }
})

function getTotalDays(months) {
  if (months === 3) return 90
  if (months >= 12) return 365
  return months * 30
}

const calcPreview = computed(() => {
  if (!reportDate.value || !deliveryDate.value || !accountCost.value || accountCost.value <= 0) return null
  const start = new Date(reportDate.value)
  const end = new Date(deliveryDate.value)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null
  const days = Math.abs(Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
  const totalDays = getTotalDays(accountDuration.value)
  return {
    days,
    credit: Math.round(((accountCost.value / totalDays) * days) * 100) / 100,
  }
})

function cancel() { emit('close') }

function calculateCredit() {
  error.value = ''
  if (!calcPreview.value) {
    error.value = 'Completa el costo y ambas fechas'
    return
  }
  creditAmount.value = calcPreview.value.credit
}

async function handleResolve() {
  error.value = ''
  if (selectedType.value === 'credit' && (!creditAmount.value || creditAmount.value <= 0)) {
    error.value = 'Debes ingresar un monto valido para el saldo a favor.'
    return
  }
  if (selectedType.value === 'replace' && props.report?.is_batch) {
    const mails = replaceMailsBatch.value.split('\n').map(m => m.trim()).filter(Boolean)
    if (mails.length < batchCount.value + 1) {
      error.value = `Se necesitan al menos ${batchCount.value + 1} correos para el lote.`
      return
    }
  }
  saving.value = true
  try {
    const payload = { text: solutionText.value, type: selectedType.value }
    if (selectedType.value === 'replace') {
      if (props.report?.is_batch) {
        payload.replaced_mails = replaceMailsBatch.value.split('\n').map(m => m.trim()).filter(Boolean)
      } else {
        payload.replaced_mail = replaceMail.value
      }
      payload.replaced_password = replacePassword.value
    }
    if (selectedType.value === 'credit') {
      payload.credit_amount = creditAmount.value
    }

    if (props.editingResolution) {
      await reportsStore.updateReport(props.report._id, { resolution: payload })
      toast.success('Resolucion actualizada', 'Los cambios se guardaron correctamente')
    } else {
      await reportsStore.resolveReport(props.report._id, payload)
      const typeLabel = resolutionOptions.find(o => o.value === selectedType.value)?.label || selectedType.value
      toast.success('Reporte resuelto', `Resolucion: ${typeLabel}`)
    }
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
