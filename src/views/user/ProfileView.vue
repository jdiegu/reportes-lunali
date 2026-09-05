<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6">
    <div>
      <h1 class="text-xl sm:text-2xl">Mi perfil</h1>
      <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">Administra tu informacion personal</p>
    </div>

    <div class="card overflow-hidden">
      <div class="p-5 sm:p-6 border-b" :style="{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
               style="background: var(--rose-gradient); color: white;">
            {{ userInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-lg font-semibold" style="color: var(--text-primary);">{{ authStore.user?.username }}</p>
            <p class="text-xs" style="color: var(--text-muted);">{{ roleLabel }}</p>
          </div>
        </div>
      </div>

      <div class="p-5 sm:p-6 space-y-5">
        <div>
          <p class="text-sm font-semibold mb-3 flex items-center gap-2" style="color: var(--text-primary);">
            <Phone class="w-4 h-4" style="color: var(--rose-primary);" />
            Datos personales
          </p>
          <div>
            <label class="input-label">Teléfono</label>
            <input v-model="form.phone" type="tel" class="input-field" placeholder="+54 11 1234-5678" />
          </div>
        </div>

        <div class="border-t pt-5" :style="{ borderColor: 'var(--border-color)' }">
          <p class="text-sm font-semibold mb-3 flex items-center gap-2" style="color: var(--text-primary);">
            <Lock class="w-4 h-4" style="color: var(--rose-primary);" />
            Cambiar contraseña
          </p>
          <div class="space-y-3">
            <div>
              <label class="input-label">Contraseña actual</label>
              <input v-model="form.currentPassword" type="password" class="input-field" placeholder="Tu contrasena actual" />
            </div>
            <div>
              <label class="input-label">Nueva contraseña</label>
              <input v-model="form.newPassword" type="password" class="input-field" placeholder="Minimo 6 caracteres" />
            </div>
            <div>
              <label class="input-label">Confirmar nueva contraseña</label>
              <input v-model="form.confirmPassword" type="password" class="input-field" placeholder="Repite la contrasena" />
            </div>
          </div>
        </div>

        <div v-if="msg" class="rounded-lg border px-4 py-3 text-sm"
             :style="{
               borderColor: success ? 'rgba(75,181,116,0.25)' : 'rgba(212,74,74,0.25)',
               background: success ? 'var(--success-bg)' : 'var(--error-bg)',
               color: success ? 'var(--success)' : 'var(--error)',
             }">{{ msg }}</div>

        <div class="flex justify-end pt-1">
          <button @click="saveProfile" :disabled="saving" class="btn-primary">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            <span v-if="saving">Guardando...</span>
            <span v-else>Guardar cambios</span>
          </button>
        </div>
      </div>
    </div>

    <BalanceMovementsCard :userId="authStore.user?._id" />
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useAuthStore } from '../../store/auth'
import { useToastStore } from '../../store/toast'
import { usersApi } from '../../api/axios'
import { STORAGE_KEYS } from '../../config/constants'
import { Phone, Lock, Loader2 } from '@lucide/vue'
import BalanceMovementsCard from '../../components/balance/BalanceMovementsCard.vue'

const authStore = useAuthStore()
const toast = useToastStore()

const saving = ref(false)
const msg = ref('')
const success = ref(false)

const userInitial = computed(() => authStore.user?.username?.charAt(0).toUpperCase() || '?')
const roleLabel = computed(() => {
  if (authStore.user?.role === 'boss') return 'Super Admin'
  if (authStore.user?.role === 'admin') return 'Administrador'
  return 'Usuario'
})

const form = reactive({
  phone: authStore.user?.phone || '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

async function saveProfile() {
  msg.value = ''
  success.value = false

  if (form.newPassword && form.newPassword !== form.confirmPassword) {
    msg.value = 'Las contrasenas no coinciden'
    return
  }
  if (form.newPassword && form.newPassword.length < 6) {
    msg.value = 'La contrasena debe tener al menos 6 caracteres'
    return
  }
  if (form.newPassword && !form.currentPassword) {
    msg.value = 'Debes ingresar tu contrasena actual para cambiarla'
    return
  }

  saving.value = true
  try {
    const payload = { phone: form.phone }
    if (form.newPassword) {
      payload.currentPassword = form.currentPassword
      payload.newPassword = form.newPassword
    }
    const { data } = await usersApi.updateOwn(payload)
    authStore.user.phone = data.phone || data.user?.phone
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authStore.user))
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    msg.value = 'Perfil actualizado correctamente'
    success.value = true
    toast.success('Perfil', 'Datos actualizados correctamente')
  } catch (e) {
    msg.value = e.response?.data?.message || 'Error al guardar'
    success.value = false
  } finally {
    saving.value = false
  }
}
</script>
