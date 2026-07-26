<template>
  <div class="max-w-3xl mx-auto p-4 sm:p-5 lg:p-6">
    <div class="card p-5 sm:p-6 lg:p-8">
      <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0" style="background: var(--rose-gradient);">
          <Plus class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl">{{ isEditing ? 'Editar Reporte' : 'Nuevo Reporte' }}</h1>
          <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">{{ isEditing ? 'Modifica los datos del reporte' : 'Registra un problema en una cuenta de streaming' }}</p>
        </div>
      </div>

      <form @submit.prevent="submitReport" class="space-y-5 sm:space-y-6">
        <div class="rounded-xl p-4 sm:p-5 border" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
          <p class="text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2" style="color: var(--text-primary);">
            <User class="w-4 h-4" style="color: var(--rose-primary);" />
            Informacion de la cuenta
          </p>

          <!-- Batch toggle -->
          <div class="mb-4">
            <label class="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border w-fit transition-colors"
                   :style="{ background: form.is_batch ? 'var(--rose-lighter)' : 'var(--bg-card)', borderColor: form.is_batch ? 'var(--rose-primary)' : 'var(--border-color)' }">
              <input v-model="form.is_batch" type="checkbox" class="sr-only" />
              <div class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                   :style="{ background: form.is_batch ? 'var(--rose-primary)' : 'transparent', borderColor: form.is_batch ? 'var(--rose-primary)' : 'var(--border-color)' }">
                <Check v-if="form.is_batch" class="w-3 h-3 text-white" :stroke-width="3" />
              </div>
              <span class="text-xs font-medium" style="color: var(--text-primary);">Reporte por lote</span>
            </label>
          </div>

          <!-- Single email or batch textarea -->
          <div v-if="!form.is_batch" class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="input-label">Correo de la cuenta</label>
              <input v-model="form.mail" type="email" placeholder="cuenta@email.com" required class="input-field" />
            </div>
            <div>
              <label class="input-label">Contrasena de la cuenta</label>
              <input v-model="form.password" type="password" placeholder="Contrasena del usuario" class="input-field" />
            </div>
          </div>
          <div v-else class="space-y-3">
            <div>
              <label class="input-label">Correos del lote (uno por linea)</label>
              <textarea v-model="batchEmailsText" rows="5" required class="input-field font-mono text-xs"
                placeholder="cuenta1@email.com&#10;cuenta2@email.com&#10;cuenta3@email.com"></textarea>
              <p class="text-[10px] mt-1" style="color: var(--text-muted);">Se creara un reporte con {{ batchCount }} cuentas en lote</p>
            </div>
            <div>
              <label class="input-label">Contrasena</label>
              <input v-model="form.password" type="password" required placeholder="Misma contrasena para todas las cuentas" class="input-field" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
            <div>
              <label class="input-label">Plataforma</label>
              <PlatformSelect v-model="form.platform" :platforms="platforms" />
            </div>
            <div>
              <label class="input-label">Tipo de cuenta</label>
              <select v-model="form.platform_type" required class="input-field">
                <option value="account">Cuenta completa</option>
                <option value="profile">Perfil</option>
              </select>
            </div>
          </div>
          <div class="mt-3 sm:mt-4">
            <label class="input-label">Duracion de la cuenta (meses)</label>
            <input v-model.number="form.account_duration" type="number" min="1" max="120" class="input-field" placeholder="1" />
          </div>
        </div>

        <div class="rounded-xl p-4 sm:p-5 border" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
          <p class="text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2" style="color: var(--text-primary);">
            <Calendar class="w-4 h-4" style="color: var(--rose-primary);" />
            Detalles del reporte
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="input-label">Fecha de entrega</label>
              <input v-model="form.delivery_date" type="date" required class="input-field" />
            </div>
            <div>
              <label class="input-label">Tipo de problema</label>
              <select v-model="form.description" required class="input-field">
                <option value="" disabled>Selecciona el problema</option>
                <option v-for="opt in descriptionPresets" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
          </div>
          <div class="mt-3 sm:mt-4">
            <label class="input-label">Descripcion</label>
            <textarea v-model="form.extraDescription" rows="2" placeholder="Detalles adicionales..." class="input-field"></textarea>
          </div>
        </div>

        <div class="rounded-xl p-4 sm:p-5 border" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
          <p class="text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2" style="color: var(--text-primary);">
            <ImageIcon class="w-4 h-4" style="color: var(--rose-primary);" />
            Evidencias
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ImageUploader v-model="form.fail_evidence" :initial-preview="failEvidenceInitial" @cleared="failEvidenceCleared = true" label="Evidencia de falla" hint="Captura del error" />
            <ImageUploader v-model="form.delivery_evidence" :initial-preview="deliveryEvidenceInitial" @cleared="deliveryEvidenceCleared = true" label="Evidencia de entrega" hint="Comprobante de pago" />
          </div>
        </div>

        <div v-if="errorMsg" class="rounded-lg border px-3 sm:px-4 py-2.5 text-xs sm:text-sm" :style="{ borderColor: 'rgba(212,74,74,0.3)', background: 'var(--error-bg)', color: 'var(--error)' }">{{ errorMsg }}</div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <button type="submit" :disabled="saving" class="btn-primary">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            <span v-if="saving">Enviando...</span>
            <span v-else>{{ isEditing ? 'Guardar cambios' : 'Enviar reporte' }}</span>
          </button>
          <RouterLink to="/app/reports" class="btn-secondary text-sm text-center">Cancelar</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import { useToastStore } from '../../store/toast'
import ImageUploader from '../../components/ui/ImageUploader.vue'
import PlatformSelect from '../../components/ui/PlatformSelect.vue'
import { Plus, User, Check, Calendar, Image as ImageIcon, Loader2 } from '@lucide/vue'
import { usePlatformsStore } from '../../store/platforms'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const toast = useToastStore()
const platformsStore = usePlatformsStore()

const saving = ref(false)
const errorMsg = ref('')
const platforms = ref([])
const batchEmailsText = ref('')

const isEditing = computed(() => !!route.query.edit)
const editId = computed(() => route.query.edit)
const batchCount = computed(() => {
  const lines = batchEmailsText.value.split('\n').map(e => e.trim()).filter(Boolean)
  return lines.length
})

const form = reactive({
  mail: '',
  password: '',
  platform: '',
  platform_type: 'account',
  account_duration: 1,
  is_batch: false,
  delivery_date: '',
  description: '',
  extraDescription: '',
  fail_evidence: null,
  delivery_evidence: null,
})

const failEvidenceInitial = ref('')
const deliveryEvidenceInitial = ref('')
const failEvidenceCleared = ref(false)
const deliveryEvidenceCleared = ref(false)

const descriptionPresets = [
  'No tiene suscripcion activa', 'No tiene acceso a la cuenta', 'Cuenta bloqueada',
  'Me sacaron de la cuenta', 'Mueven los perfiles sin permiso', 'Cambiaron la contraseña',
  'Error al iniciar sesion', 'Problema con el pago',"Se termino la suscripcion", 'Otro',
]

function getUploadUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
  const serverBase = apiBase.replace(/\/api\/?$/, '')
  const cleanPath = path.replace(/\\/g, '/').split('/').pop()
  return `${serverBase}/uploads/${cleanPath}`
}

onMounted(async () => {
  try {
    await platformsStore.fetch()
    platforms.value = platformsStore.platforms.filter(p => p.active)
  } catch { platforms.value = [] }

  if (editId.value) {
    try {
      const report = await reportsStore.fetchReport(editId.value)
      if (report) {
        form.mail = report.mail
        form.password = report.password
        form.platform = report.platform
        form.platform_type = report.platform_type
        form.account_duration = report.account_duration || 1
        form.is_batch = report.is_batch || false
        batchEmailsText.value = report.is_batch ? (report.batch_emails || [report.mail]).join('\n') : ''
        form.delivery_date = report.delivery_date ? new Date(report.delivery_date).toISOString().split('T')[0] : ''
        const descLines = (report.description || '').split('\n\n')
        form.description = descLines[0] || ''
        form.extraDescription = descLines.slice(1).join('\n\n') || ''
        if (report.fail_evidence) {
          failEvidenceInitial.value = getUploadUrl(report.fail_evidence)
        }
        if (report.delivery_evidence) {
          deliveryEvidenceInitial.value = getUploadUrl(report.delivery_evidence)
        }
      }
    } catch {}
  }
})

async function submitReport() {
  errorMsg.value = ''
  saving.value = true
  try {
    const fullDescription = form.extraDescription ? `${form.description}\n\n${form.extraDescription}` : form.description

    if (form.is_batch) {
      const emails = batchEmailsText.value.split('\n').map(e => e.trim()).filter(Boolean)
      if (emails.length === 0) {
        errorMsg.value = 'Ingresa al menos un correo'
        saving.value = false
        return
      }
      const formData = new FormData()
      formData.append('user', authStore.user._id)
      formData.append('mail', emails[0])
      formData.append('password', form.password)
      formData.append('platform', form.platform)
      formData.append('platform_type', form.platform_type)
      formData.append('account_duration', form.account_duration)
      formData.append('is_batch', 'true')
      formData.append('batch_emails', JSON.stringify(emails))
      formData.append('delivery_date', form.delivery_date)
      formData.append('description', fullDescription)
      if (form.fail_evidence) formData.append('fail_evidence', form.fail_evidence)
      if (form.delivery_evidence) formData.append('delivery_evidence', form.delivery_evidence)
      const result = await reportsStore.createReport(formData)
      if (!result.success) {
        errorMsg.value = result.message || 'Error al crear el reporte'
        saving.value = false
        return
      }
      toast.success('Lote creado', `Reporte con ${emails.length} cuentas registrado`)
      router.push('/app/reports')
    } else {
      let result
      if (isEditing.value) {
        const hasNewImages = form.fail_evidence instanceof File || form.delivery_evidence instanceof File
        const hasClearedImages = failEvidenceCleared.value || deliveryEvidenceCleared.value
        const hasImageChanges = hasNewImages || hasClearedImages

        if (hasImageChanges) {
          const formData = new FormData()
          formData.append('mail', form.mail)
          formData.append('password', form.password)
          formData.append('platform', form.platform)
          formData.append('platform_type', form.platform_type)
          formData.append('account_duration', form.account_duration)
          formData.append('is_batch', 'false')
          formData.append('delivery_date', form.delivery_date)
          formData.append('description', fullDescription)
          if (form.fail_evidence instanceof File) {
            formData.append('fail_evidence', form.fail_evidence)
          } else if (failEvidenceCleared.value) {
            formData.append('fail_evidence', '')
          }
          if (form.delivery_evidence instanceof File) {
            formData.append('delivery_evidence', form.delivery_evidence)
          } else if (deliveryEvidenceCleared.value) {
            formData.append('delivery_evidence', '')
          }
          result = await reportsStore.updateReport(editId.value, formData)
        } else {
          result = await reportsStore.updateReport(editId.value, {
            mail: form.mail, password: form.password, platform: form.platform,
            platform_type: form.platform_type, account_duration: form.account_duration,
            is_batch: false, batch_emails: [],
            delivery_date: form.delivery_date, description: fullDescription,
          })
        }
      } else {
        const formData = new FormData()
        formData.append('user', authStore.user._id)
        formData.append('mail', form.mail)
        formData.append('password', form.password)
        formData.append('platform', form.platform)
        formData.append('platform_type', form.platform_type)
        formData.append('account_duration', form.account_duration)
        formData.append('is_batch', 'false')
        formData.append('delivery_date', form.delivery_date)
        formData.append('description', fullDescription)
        if (form.fail_evidence) formData.append('fail_evidence', form.fail_evidence)
        if (form.delivery_evidence) formData.append('delivery_evidence', form.delivery_evidence)
        result = await reportsStore.createReport(formData)
      }

      if (result.success) {
        toast.success(isEditing.value ? 'Actualizado' : 'Reporte creado', isEditing.value ? 'Reporte actualizado correctamente' : 'Tu reporte se registro correctamente')
        router.push('/app/reports')
      } else {
        errorMsg.value = result.message || 'Error al guardar el reporte'
      }
    }
  } catch (e) {
    errorMsg.value = e.message || 'Error al guardar el reporte'
  } finally {
    saving.value = false
  }
}
</script>
