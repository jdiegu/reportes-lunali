<template>
  <div class="p-4 lg:p-8 max-w-3xl mx-auto">
    <!-- Header -->
    <div class="mb-7 animate-fade-up">
      <button @click="router.back()" class="btn-ghost text-xs mb-4 -ml-2">
        ← Volver
      </button>
      <h1 class="page-title">Crear reporte</h1>
      <p class="page-subtitle">Completa el formulario para reportar una falla en tu plataforma</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Account info -->
      <div class="glass-card p-6 animate-fade-up animate-delay-100 opacity-0-init">
        <h2 class="font-display text-base font-bold text-blush-100 mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-rose-600/25 border border-rose-600/40 text-rose-400 text-xs flex items-center justify-center">1</span>
          Información de la cuenta
        </h2>
        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="input-label">Plataforma *</label>
            <input v-model="form.platform" type="text" class="input-field" placeholder="Netflix, Disney+, Spotify..." required />
          </div>
          <div>
            <label class="input-label">Tipo de plataforma *</label>
            <select v-model="form.platform_type" class="input-field" required>
              <option value="account">👤 Cuenta individual</option>
              <option value="profile">👥 Cuenta con perfiles compartidos</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="input-label">Correo de la cuenta *</label>
            <input v-model="form.mail" type="email" class="input-field" placeholder="correo@ejemplo.com" required />
          </div>
          <div>
            <label class="input-label">Contraseña de la cuenta</label>
            <div class="relative">
              <input v-model="form.password" :type="showPass ? 'text' : 'password'" class="input-field pr-10" placeholder="Opcional" />
              <button type="button" @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-blush-500 hover:text-blush-300">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="showPass ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label class="input-label">Fecha de entrega *</label>
            <input v-model="form.delivery_date" type="date" class="input-field" required />
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="glass-card p-6 animate-fade-up animate-delay-200 opacity-0-init">
        <h2 class="font-display text-base font-bold text-blush-100 mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-rose-600/25 border border-rose-600/40 text-rose-400 text-xs flex items-center justify-center">2</span>
          Descripción del problema
        </h2>
        <div>
          <label class="input-label">Describe la falla *</label>
          <textarea
            v-model="form.description"
            class="input-field resize-none"
            rows="4"
            placeholder="Describe con detalle qué falla tiene la cuenta, cuándo ocurre, qué mensajes de error aparecen..."
            required
            minlength="10"
          ></textarea>
          <p class="text-blush-600 text-xs mt-1">Mínimo 10 caracteres · {{ form.description.length }} escritos</p>
        </div>
      </div>

      <!-- Evidence images -->
      <div class="glass-card p-6 animate-fade-up animate-delay-300 opacity-0-init">
        <h2 class="font-display text-base font-bold text-blush-100 mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-rose-600/25 border border-rose-600/40 text-rose-400 text-xs flex items-center justify-center">3</span>
          Evidencias
        </h2>
        <div class="grid sm:grid-cols-2 gap-5">
          <ImageUploader
            label="Evidencia de la falla *"
            hint="Captura de pantalla del error"
            v-model="failEvidenceFile"
          />
          <ImageUploader
            label="Evidencia de entrega *"
            hint="Captura de que la cuenta fue entregada"
            v-model="deliveryEvidenceFile"
          />
        </div>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="text-rose-400 text-sm bg-rose-900/20 border border-rose-800/40 rounded-xl px-4 py-3">
        {{ errorMsg }}
      </div>

      <!-- Actions -->
      <div class="flex gap-3 animate-fade-up animate-delay-400 opacity-0-init">
        <button type="button" @click="router.back()" class="btn-secondary flex-1">Cancelar</button>
        <button type="submit" :disabled="submitting || !formValid" class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ submitting ? 'Enviando...' : 'Enviar reporte' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReportsStore } from '../../store/reports'
import ImageUploader from '../../components/ui/ImageUploader.vue'

import { useAuthStore } from '../../store/auth'
const authStore = useAuthStore()

const router = useRouter()
const reportsStore = useReportsStore()

const showPass = ref(false)
const submitting = ref(false)
const errorMsg = ref('')
const failEvidenceFile = ref(null)
const deliveryEvidenceFile = ref(null)

console.log(authStore.user)
const form = reactive({

  user: authStore.user._id || '',
  platform: '',
  platform_type: 'account',
  mail: '',
  password: '',
  delivery_date: '',
  description: '',
})

const formValid = computed(() =>
  form.platform && form.mail && form.delivery_date &&
  form.description.length >= 10 && failEvidenceFile.value && deliveryEvidenceFile.value
)

async function handleSubmit() {
  errorMsg.value = ''
  submitting.value = true
  try {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
    fd.append('fail_evidence', failEvidenceFile.value)
    fd.append('delivery_evidence', deliveryEvidenceFile.value)

    const result = await reportsStore.createReport(fd)
    if (result.success) {
      router.push(`/reports/${result.data._id}`)
    } else {
      errorMsg.value = result.message
    }
  } finally {
    submitting.value = false
  }
}
</script>   