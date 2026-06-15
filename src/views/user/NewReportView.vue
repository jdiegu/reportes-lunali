<template>
  <div class="max-w-2xl mx-auto p-4 lg:p-6">
    <div class="card p-6 lg:p-8">
      <div class="flex items-center gap-4 mb-7">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center"
             style="background: linear-gradient(135deg, var(--rose-lighter), var(--rose-light)); color: var(--rose-primary);">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-display font-bold" style="color: var(--text-primary);">Nuevo Reporte</h1>
          <p class="text-sm" style="color: var(--text-muted);">Describe el problema que necesitas resolver</p>
        </div>
      </div>

      <form @submit.prevent="submitReport" class="space-y-5">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="input-label">Plataforma</label>
            <select v-model="form.platform" required class="input-field">
              <option value="" disabled>Selecciona</option>
              <option v-for="p in platforms" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
          <div>
            <label class="input-label">Tipo de problema</label>
            <select v-model="form.problemType" required class="input-field">
              <option value="" disabled>Selecciona</option>
              <option v-for="t in problemTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="input-label">Correo electr&oacute;nico</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <input v-model="form.mail" type="email" placeholder="tu@email.com" required class="input-field pl-10" />
          </div>
        </div>

        <div>
          <label class="input-label">Descripci&oacute;n</label>
          <textarea v-model="form.description" rows="4" placeholder="Describe el problema detalladamente..." required class="input-field resize-none"></textarea>
        </div>

        <div>
          <ImageUploader v-model="form.image" label="Captura de pantalla" hint="Opcional, pero ayuda a resolver m&aacute;s r&aacute;pido" />
        </div>

        <div v-if="error" class="rounded-lg border px-3 py-2 text-xs"
             style="border-color: rgba(232,138,138,0.3); background: var(--error-bg); color: var(--error);">
          {{ error }}
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button type="submit" :disabled="saving" class="btn-primary">
            <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span v-if="saving">Enviando...</span>
            <span v-else>Enviar reporte</span>
          </button>
          <RouterLink to="/app/reports" class="btn-secondary text-sm">Cancelar</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useReportsStore } from '../../store/reports'
import { useToastStore } from '../../store/toast'
import ImageUploader from '../../components/ui/ImageUploader.vue'

const router = useRouter()
const reportsStore = useReportsStore()
const toast = useToastStore()

const saving = ref(false)
const error = ref('')

const form = reactive({
  platform: '',
  mail: '',
  problemType: '',
  description: '',
  image: null,
})

const platforms = ['Netflix', 'Spotify', 'HBO', 'Disney+', 'Prime Video', 'Crunchyroll', 'YouTube Premium', 'Otro']
const problemTypes = ['Acceso', 'Pago', 'Cambio de contrase&ntilde;a', 'Perfil bloqueado', 'Cuenta compartida', 'Otro']

async function submitReport() {
  error.value = ''
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('platform', form.platform)
    formData.append('mail', form.mail)
    formData.append('problemType', form.problemType)
    formData.append('description', form.description)
    if (form.image) formData.append('image', form.image)
    await reportsStore.createReport(formData)
    toast.success('Reporte creado', 'Tu reporte ha sido registrado exitosamente')
    router.push('/app/reports')
  } catch (e) {
    error.value = e.message || 'Error al crear el reporte'
  } finally {
    saving.value = false
  }
}
</script>
