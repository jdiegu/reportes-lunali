<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
    <div class="flex items-center justify-between">
      <button @click="$router.push('/app/admin')" class="inline-flex items-center gap-2 btn-ghost text-xs sm:text-sm !px-2 sm:!px-3">
        <ArrowLeft class="w-4 h-4" />
        Volver
      </button>
    </div>

    <div v-if="loadingUser" class="space-y-4">
      <div class="card p-6 space-y-4"><div class="skeleton h-8 w-48 rounded"></div><div class="skeleton h-4 w-32 rounded"></div></div>
    </div>

    <template v-else-if="user">
      <!-- Header card -->
      <div class="card overflow-hidden">
        <div class="p-5 sm:p-6 border-b" :style="{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
                 style="background: var(--rose-gradient); color: white;">
              {{ (user.username || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h1 class="text-xl sm:text-2xl">{{ user.username }}</h1>
                <span v-if="user.role === 'boss'" class="text-[10px] px-2 py-0.5 rounded-full font-bold" style="background: var(--rose-gradient); color: white;">BOSS</span>
                <span v-else-if="user.role === 'admin'" class="text-[10px] px-2 py-0.5 rounded-full font-semibold" style="background: var(--info-bg); color: var(--info);">ADMIN</span>
              </div>
              <p class="text-xs sm:text-sm" style="color: var(--text-muted);">
                {{ user.phone || 'Sin telefono' }} · Registrado {{ formatDate(user.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-5 sm:p-6 space-y-5">
          <!-- Balance -->
          <div class="rounded-xl p-5 border text-center"
               :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
            <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Saldo actual</p>
            <p class="text-4xl sm:text-5xl font-display font-bold" style="color: var(--success);">${{ (user.balance || 0).toFixed(2) }}</p>
          </div>

          <!-- Balance management (admin/boss only) -->
          <div v-if="authStore.isAdmin" class="rounded-xl border p-5" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
            <p class="text-sm font-semibold mb-4 flex items-center gap-2" style="color: var(--text-primary);">
              <DollarSign class="w-4 h-4" style="color: var(--rose-primary);" />
              Modificar saldo
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="flex-1">
                <label class="input-label">Monto ($)</label>
                <input v-model.number="balanceAmount" type="number" min="0.01" step="0.01" class="input-field text-lg font-mono" placeholder="0.00" />
              </div>
              <div class="flex gap-2 sm:items-end">
                <button @click="handleBalance('add')" :disabled="!balanceAmount || balanceAmount <= 0 || balanceLoading" class="btn-primary flex-1 sm:flex-initial !bg-[var(--success)]">
                  <Loader2 v-if="balanceLoading" class="w-4 h-4 animate-spin" />
                  <Plus v-else class="w-4 h-4" />
                  Agregar
                </button>
                <button @click="handleBalance('subtract')" :disabled="!balanceAmount || balanceAmount <= 0 || balanceLoading" class="btn-danger flex-1 sm:flex-initial">
                  <Loader2 v-if="balanceLoading" class="w-4 h-4 animate-spin" />
                  <Minus v-else class="w-4 h-4" />
                  Quitar
                </button>
              </div>
            </div>
          </div>

          <!-- Edit data -->
          <div class="rounded-xl border p-5" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
            <p class="text-sm font-semibold mb-4 flex items-center gap-2" style="color: var(--text-primary);">
              <User class="w-4 h-4" style="color: var(--rose-primary);" />
              Editar datos
            </p>
            <div class="space-y-3">
              <div>
                <label class="input-label">Telefono</label>
                <input v-model="editForm.phone" type="tel" class="input-field" placeholder="+54 11 1234-5678" />
              </div>
              <div>
                <label class="input-label">Nueva contrasena (dejar vacio para no cambiar)</label>
                <input v-model="editForm.password" type="password" class="input-field" placeholder="Nueva contrasena" />
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <button @click="saveUserData" :disabled="savingUser" class="btn-primary text-sm">
                <span v-if="savingUser">Guardando...</span>
                <span v-else>Guardar datos</span>
              </button>
            </div>
          </div>

          <!-- Role toggle (boss only) -->
          <div v-if="isBoss && user.role !== 'boss'" class="rounded-xl border p-5" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
            <p class="text-sm font-semibold mb-4 flex items-center gap-2" style="color: var(--text-primary);">
              <Shield class="w-4 h-4" style="color: var(--rose-primary);" />
              Cambiar rol
            </p>
            <div class="flex gap-2">
              <button @click="setRole('user')"
                      class="flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all text-center"
                      :style="user.role === 'user' ? { background: 'var(--rose-gradient)', borderColor: 'var(--rose-primary)', color: 'white' } : { background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }">
                <User class="w-4 h-4 mx-auto mb-1" />
                Usuario
              </button>
              <button @click="setRole('admin')"
                      class="flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all text-center"
                      :style="user.role === 'admin' ? { background: 'var(--rose-gradient)', borderColor: 'var(--rose-primary)', color: 'white' } : { background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }">
                <Shield class="w-4 h-4 mx-auto mb-1" />
                Admin
              </button>
            </div>
          </div>

          <div v-if="msg" class="rounded-xl border px-4 py-3 text-sm"
               :style="{
                 borderColor: msgSuccess ? 'rgba(75,181,116,0.25)' : 'rgba(212,74,74,0.25)',
                 background: msgSuccess ? 'var(--success-bg)' : 'var(--error-bg)',
                 color: msgSuccess ? 'var(--success)' : 'var(--error)',
               }">{{ msg }}</div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-16 sm:py-20">
      <p class="text-sm" style="color: var(--text-muted);">Usuario no encontrado</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useToastStore } from '../../store/toast'
import { usersApi } from '../../api/axios'
import { LOCALE } from '../../config/constants'
import { ArrowLeft, DollarSign, Loader2, Plus, Minus, User, Shield } from '@lucide/vue'

const route = useRoute()
const authStore = useAuthStore()
const toast = useToastStore()

const loadingUser = ref(true)
const balanceLoading = ref(false)
const savingUser = ref(false)
const user = ref(null)
const balanceAmount = ref(null)
const msg = ref('')
const msgSuccess = ref(false)

const isBoss = computed(() => authStore.user?.role === 'boss')

const editForm = reactive({ phone: '', password: '' })

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' })
}

async function loadUser() {
  loadingUser.value = true
  try {
    const { data } = await usersApi.get(route.params.id)
    user.value = data
    editForm.phone = data.phone || ''
  } catch {
    user.value = null
  }
  loadingUser.value = false
}

async function handleBalance(operation) {
  msg.value = ''
  balanceLoading.value = true
  try {
    const { data } = await usersApi.updateBalance(route.params.id, balanceAmount.value, operation)
    user.value.balance = data.balance
    msg.value = data.message
    msgSuccess.value = true
    balanceAmount.value = null
    toast.success('Saldo actualizado', data.message)
  } catch (e) {
    msg.value = e.response?.data?.message || 'Error al actualizar saldo'
    msgSuccess.value = false
  } finally {
    balanceLoading.value = false
  }
}

async function saveUserData() {
  msg.value = ''
  savingUser.value = true
  try {
    const payload = { phone: editForm.phone }
    if (editForm.password) payload.password = editForm.password
    await usersApi.adminUpdate(route.params.id, payload)
    user.value.phone = editForm.phone
    editForm.password = ''
    msg.value = 'Datos actualizados'
    msgSuccess.value = true
    toast.success('Datos', 'Informacion actualizada')
  } catch (e) {
    msg.value = e.response?.data?.message || 'Error al guardar'
    msgSuccess.value = false
  } finally {
    savingUser.value = false
  }
}

async function setRole(role) {
  if (user.value.role === role) return
  try {
    await usersApi.updateRole(route.params.id, role)
    user.value.role = role
    toast.success('Rol actualizado', `${user.value.username} ahora es ${role}`)
  } catch (e) {
    toast.error('Error', e.response?.data?.message || 'No se pudo cambiar el rol')
  }
}

onMounted(loadUser)
</script>
