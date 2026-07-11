<template>
  <div class="max-w-3xl mx-auto p-4 sm:p-5 lg:p-6">
    <div class="card p-5 sm:p-6 lg:p-8">
      <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0" style="background: var(--rose-gradient);">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl">Nuevo Reporte</h1>
          <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">Registra un problema en una cuenta de streaming</p>
        </div>
      </div>

      <form @submit.prevent="submitReport" class="space-y-5 sm:space-y-6">
        <div class="rounded-xl p-4 sm:p-5 border" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
          <p class="text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2" style="color: var(--text-primary);">
            <svg class="w-4 h-4" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Informacion de la cuenta
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="input-label">Correo de la cuenta</label>
              <input v-model="form.mail" type="email" placeholder="cuenta@email.com" required class="input-field" />
            </div>
            <div>
              <label class="input-label">Contrasena de la cuenta</label>
              <input v-model="form.password" type="text" placeholder="Contrasena del usuario" class="input-field" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
            <div>
              <label class="input-label">Plataforma</label>
              <select v-model="form.platform" required class="input-field">
                <option value="" disabled>Selecciona</option>
                <option v-for="p in platforms" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div>
              <label class="input-label">Tipo de cuenta</label>
              <select v-model="form.platform_type" required class="input-field">
                <option value="account">Cuenta propia</option>
                <option value="profile">Perfil compartido</option>
              </select>
            </div>
          </div>
        </div>

        <div class="rounded-xl p-4 sm:p-5 border" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
          <p class="text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2" style="color: var(--text-primary);">
            <svg class="w-4 h-4" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
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
            <label class="input-label">Descripcion adicional</label>
            <textarea v-model="form.extraDescription" rows="2" placeholder="Detalles adicionales (opcional)..." class="input-field"></textarea>
          </div>
        </div>

        <div class="rounded-xl p-4 sm:p-5 border" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
          <p class="text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2" style="color: var(--text-primary);">
            <svg class="w-4 h-4" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Evidencias
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ImageUploader v-model="form.fail_evidence" label="Evidencia de falla" hint="Captura del error o problema" />
            <ImageUploader v-model="form.delivery_evidence" label="Evidencia de entrega" hint="Comprobante de pago o entrega" />
          </div>
        </div>

        <div v-if="errorMsg" class="rounded-lg border px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm" :style="{ borderColor: 'rgba(212,74,74,0.3)', background: 'var(--error-bg)', color: 'var(--error)' }">
          {{ errorMsg }}
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 sm:pt-2">
          <button type="submit" :disabled="saving" class="btn-primary">
            <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span v-if="saving">Enviando...</span>
            <span v-else>Enviar reporte</span>
          </button>
          <RouterLink to="/app/reports" class="btn-secondary text-sm text-center">Cancelar</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import { useToastStore } from '../../store/toast'
import ImageUploader from '../../components/ui/ImageUploader.vue'

const router = useRouter()
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const toast = useToastStore()

const saving = ref(false)
const errorMsg = ref('')

const form = reactive({
  mail: '',
  password: '',
  platform: '',
  platform_type: 'account',
  delivery_date: '',
  description: '',
  extraDescription: '',
  fail_evidence: null,
  delivery_evidence: null,
})

const platforms = ['Netflix', 'Spotify', 'HBO', 'Disney+', 'Prime Video', 'Crunchyroll', 'YouTube Premium', 'Otro']

const descriptionPresets = [
  'No tiene suscripcion activa',
  'No tiene acceso a la cuenta',
  'Cuenta bloqueada',
  'La sacaron de la cuenta',
  'Mueven sus perfiles sin permiso',
  'Cambiaron la contrasena',
  'Error al iniciar sesion',
  'Problema con el pago',
  'Otro',
]

async function submitReport() {
  errorMsg.value = ''
  saving.value = true
  try {
    const fullDescription = form.extraDescription
      ? `${form.description}\n\n${form.extraDescription}`
      : form.description

    const formData = new FormData()
    formData.append('user', authStore.user._id)
    formData.append('mail', form.mail)
    formData.append('password', form.password)
    formData.append('platform', form.platform)
    formData.append('platform_type', form.platform_type)
    formData.append('delivery_date', form.delivery_date)
    formData.append('description', fullDescription)
    if (form.fail_evidence) formData.append('fail_evidence', form.fail_evidence)
    if (form.delivery_evidence) formData.append('delivery_evidence', form.delivery_evidence)

    const result = await reportsStore.createReport(formData)
    if (result.success) {
      toast.success('Reporte creado', 'Tu reporte se registro correctamente')
      router.push('/app/reports')
    } else {
      errorMsg.value = result.message || 'Error al crear el reporte'
    }
  } catch (e) {
    errorMsg.value = e.message || 'Error al crear el reporte'
  } finally {
    saving.value = false
  }
}
</script>
