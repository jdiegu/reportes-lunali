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
                <h1 class="text-xl sm:text-2xl" :style="!user.active ? 'opacity:0.5;text-decoration:line-through;' : ''">{{ user.username }}</h1>
                <span v-if="user.role === 'boss'" class="text-[10px] px-2 py-0.5 rounded-full font-bold" style="background: var(--rose-gradient); color: white;">BOSS</span>
                <span v-else-if="user.role === 'admin'" class="text-[10px] px-2 py-0.5 rounded-full font-semibold" style="background: var(--info-bg); color: var(--info);">ADMIN</span>
                <span v-if="!user.active" class="text-[10px] px-2 py-0.5 rounded-full font-semibold" style="background: var(--error-bg); color: var(--error);">INACTIVO</span>
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

          <!-- Balance movements graph & table -->
          <BalanceMovementsCard :key="movementsKey" :userId="user._id" />

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

          <!-- Role toggle (boss only, not for self) -->
          <div v-if="isBoss && user._id !== authStore.user?._id" class="rounded-xl border p-5" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
            <p class="text-sm font-semibold mb-4 flex items-center gap-2" style="color: var(--text-primary);">
              <ShieldCheck class="w-4 h-4" style="color: var(--rose-primary);" />
              Cambiar rol
            </p>
            <div class="flex gap-2">
              <button @click="confirmRoleChange('user')"
                      class="flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all text-center"
                      :style="user.role === 'user' ? { background: 'var(--rose-gradient)', borderColor: 'var(--rose-primary)', color: 'white' } : { background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }">
                <User class="w-4 h-4 mx-auto mb-1" />
                Usuario
              </button>
              <button @click="confirmRoleChange('admin')"
                      class="flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all text-center"
                      :style="user.role === 'admin' ? { background: 'var(--rose-gradient)', borderColor: 'var(--rose-primary)', color: 'white' } : { background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }">
                <ShieldCheck class="w-4 h-4 mx-auto mb-1" />
                Admin
              </button>
              <button @click="confirmRoleChange('boss')"
                      class="flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all text-center"
                      :style="user.role === 'boss' ? { background: 'var(--rose-gradient)', borderColor: 'var(--rose-primary)', color: 'white' } : { background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }">
                <Crown class="w-4 h-4 mx-auto mb-1" />
                Boss
              </button>
            </div>
          </div>

          <!-- Danger zone (boss only, not for self) -->
          <div v-if="isBoss && user._id !== authStore.user?._id" class="rounded-xl border p-5 space-y-4" :style="{ background: 'var(--bg-surface)', borderColor: 'rgba(239,68,68,0.15)' }">
            <p class="text-sm font-semibold flex items-center gap-2" style="color: var(--error);">
              <Trash2 class="w-4 h-4" />
              Zona de peligro
            </p>

            <!-- Toggle activate/deactivate -->
            <div v-if="user.active" class="rounded-lg p-4" style="background: rgba(239,68,68,0.04); border: 1px solid rgba(239,68,68,0.1);">
              <div class="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                <div>
                  <p class="text-sm font-semibold" style="color: var(--text-primary);">Desactivar cuenta</p>
                  <p class="text-xs mt-0.5" style="color: var(--text-muted);">El usuario no podra acceder al sistema, pero sus datos se conservan.</p>
                </div>
                <button @click="confirmToggleActive(false)"
                        class="btn-danger text-sm !px-4 !py-2 shrink-0">
                  <Trash2 class="w-4 h-4" />
                  Desactivar
                </button>
              </div>
            </div>

            <div v-else class="rounded-lg p-4" style="background: rgba(75,181,116,0.04); border: 1px solid rgba(75,181,116,0.15);">
              <div class="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                <div>
                  <p class="text-sm font-semibold" style="color: var(--success);">Reactivar cuenta</p>
                  <p class="text-xs mt-0.5" style="color: var(--text-muted);">El usuario volvera a tener acceso al sistema.</p>
                </div>
                <button @click="confirmToggleActive(true)"
                        class="text-sm !px-4 !py-2 inline-flex items-center gap-1.5 rounded-xl font-semibold transition-all"
                        style="background: var(--success-bg); color: var(--success); border: 1px solid var(--success);">
                  <UserCheck class="w-4 h-4" />
                  Reactivar
                </button>
              </div>
            </div>

            <!-- Permanent delete (only for inactive users) -->
            <div v-if="!user.active" class="rounded-lg p-4" :style="{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }">
              <div class="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                <div>
                  <p class="text-sm font-semibold" style="color: var(--error);">Eliminar permanentemente</p>
                  <p class="text-xs mt-0.5" style="color: var(--text-muted);">Borra al usuario de la base de datos. No se puede deshacer.</p>
                </div>
                <button @click="confirmHardDelete"
                        class="text-sm !px-4 !py-2 inline-flex items-center gap-1.5 rounded-xl font-semibold transition-all"
                        style="background: var(--error-bg); color: var(--error); border: 1px solid var(--error);">
                  <Trash2 class="w-4 h-4" />
                  Eliminar
                </button>
              </div>
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

    <!-- Role change confirm dialog -->
    <ConfirmDialog
      :visible="showRoleConfirm"
      :title="roleConfirmTitle"
      :message="roleConfirmMessage"
      :confirmText="roleConfirmButton"
      :type="roleConfirmType"
      :loading="roleLoading"
      @confirm="executeRoleChange"
      @cancel="showRoleConfirm = false"
    />

    <!-- Toggle active confirm dialog -->
    <ConfirmDialog
      :visible="showToggleActiveConfirm"
      :title="toggleActiveTitle"
      :message="toggleActiveMessage"
      :confirmText="toggleActiveButton"
      :type="toggleActiveType"
      :loading="toggleActiveLoading"
      @confirm="executeToggleActive"
      @cancel="showToggleActiveConfirm = false"
    />

    <!-- Hard delete confirm dialog -->
    <ConfirmDialog
      :visible="showHardDeleteConfirm"
      title="Eliminar permanentemente"
      :message="hardDeleteConfirmMessage"
      confirmText="Eliminar"
      type="danger"
      :loading="hardDeleteLoading"
      @confirm="executeHardDelete"
      @cancel="showHardDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useToastStore } from '../../store/toast'
import { usersApi } from '../../api/axios'
import { LOCALE } from '../../config/constants'
import { ArrowLeft, DollarSign, Loader2, Plus, Minus, User, ShieldCheck, Crown, Trash2, UserCheck } from '@lucide/vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'
import BalanceMovementsCard from '../../components/balance/BalanceMovementsCard.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const loadingUser = ref(true)
const balanceLoading = ref(false)
const savingUser = ref(false)
const user = ref(null)
const balanceAmount = ref(null)
const msg = ref('')
const msgSuccess = ref(false)
const movementsKey = ref(0)

// Role confirm
const showRoleConfirm = ref(false)
const roleLoading = ref(false)
const pendingRole = ref(null)
const roleConfirmTitle = ref('')
const roleConfirmMessage = ref('')
const roleConfirmButton = ref('Cambiar')
const roleConfirmType = ref('info')

// Toggle active confirm
const showToggleActiveConfirm = ref(false)
const toggleActiveLoading = ref(false)
const pendingActivate = ref(null) // true = activate, false = deactivate
const toggleActiveTitle = ref('')
const toggleActiveMessage = ref('')
const toggleActiveButton = ref('')
const toggleActiveType = ref('warning')

// Hard delete confirm
const showHardDeleteConfirm = ref(false)
const hardDeleteLoading = ref(false)
const hardDeleteConfirmMessage = ref('')

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
    movementsKey.value++
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

const roleLabel = { user: 'Usuario', admin: 'Admin', boss: 'Boss' }

function confirmRoleChange(role) {
  if (user.value.role === role) return
  pendingRole.value = role
  const from = roleLabel[user.value.role] || user.value.role
  const to = roleLabel[role]
  if (to === 'Boss') {
    roleConfirmTitle.value = 'Ascender a Boss'
    roleConfirmMessage.value = `${user.value.username} obtendra control total del sistema: podra gestionar administradores, modificar saldos y eliminar usuarios.`
    roleConfirmButton.value = 'Ascender a Boss'
    roleConfirmType.value = 'warning'
  } else if (from === 'Boss') {
    roleConfirmTitle.value = 'Descender de Boss'
    roleConfirmMessage.value = `${user.value.username} perdera el rango Boss y pasara a ser "${to}". Sus datos y reportes se conservan.`
    roleConfirmButton.value = 'Quitar rango Boss'
    roleConfirmType.value = 'danger'
  } else {
    roleConfirmTitle.value = 'Cambiar rol'
    roleConfirmMessage.value = `${user.value.username} pasara de "${from}" a "${to}". Se modificaran sus permisos de acceso.`
    roleConfirmButton.value = 'Cambiar'
    roleConfirmType.value = 'info'
  }
  showRoleConfirm.value = true
}

async function executeRoleChange() {
  if (!pendingRole.value) return
  roleLoading.value = true
  try {
    await usersApi.updateRole(route.params.id, pendingRole.value)
    user.value.role = pendingRole.value
    toast.success('Rol actualizado', `${user.value.username} ahora es ${roleLabel[pendingRole.value]}`)
    showRoleConfirm.value = false
  } catch (e) {
    toast.error('Error', e.response?.data?.message || 'No se pudo cambiar el rol')
  } finally {
    roleLoading.value = false
    pendingRole.value = null
  }
}

function confirmToggleActive(activate) {
  pendingActivate.value = activate
  if (activate) {
    toggleActiveTitle.value = 'Reactivar cuenta'
    toggleActiveMessage.value = `${user.value.username} podra acceder al sistema nuevamente. Todos sus datos y reportes se conservan.`
    toggleActiveButton.value = 'Reactivar'
    toggleActiveType.value = 'warning'
  } else {
    toggleActiveTitle.value = 'Desactivar cuenta'
    toggleActiveMessage.value = `${user.value.username} no podra iniciar sesion, pero sus datos y reportes se conservan. Puedes reactivarlo en cualquier momento.`
    toggleActiveButton.value = 'Desactivar'
    toggleActiveType.value = 'danger'
  }
  showToggleActiveConfirm.value = true
}

async function executeToggleActive() {
  if (pendingActivate.value === null) return
  toggleActiveLoading.value = true
  try {
    if (pendingActivate.value) {
      await usersApi.activate(route.params.id)
      user.value.active = true
      toast.success('Cuenta reactivada', `${user.value.username} puede acceder nuevamente`)
    } else {
      await usersApi.deactivate(route.params.id)
      user.value.active = false
      toast.success('Cuenta desactivada', `${user.value.username} ha sido desactivado`)
    }
    showToggleActiveConfirm.value = false
  } catch (e) {
    toast.error('Error', e.response?.data?.message || 'No se pudo cambiar el estado')
  } finally {
    toggleActiveLoading.value = false
    pendingActivate.value = null
  }
}

function confirmHardDelete() {
  hardDeleteConfirmMessage.value = `Se eliminara a ${user.value.username} de la base de datos junto con todos sus reportes e historial. Esta operacion es irreversible.`
  showHardDeleteConfirm.value = true
}

async function executeHardDelete() {
  hardDeleteLoading.value = true
  try {
    await usersApi.delete(route.params.id)
    toast.success('Usuario eliminado', `${user.value.username} ha sido eliminado permanentemente`)
    showHardDeleteConfirm.value = false
    router.push('/app/admin')
  } catch (e) {
    toast.error('Error', e.response?.data?.message || 'No se pudo eliminar')
  } finally {
    hardDeleteLoading.value = false
  }
}

onMounted(loadUser)
</script>
