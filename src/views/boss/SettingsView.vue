<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6">
    <div>
      <h1 class="text-xl sm:text-2xl">Configuracion del Sitio</h1>
      <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">Gestiona el acceso y disponibilidad de la plataforma</p>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card p-5 space-y-3">
        <div class="skeleton h-4 w-40 rounded"></div>
        <div class="skeleton h-3 w-64 rounded"></div>
        <div class="skeleton h-6 w-12 rounded-full"></div>
      </div>
    </div>

    <template v-else>
      <div class="card p-5 space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h2 class="text-sm font-semibold" style="color: var(--text-primary);">Restringir Acceso</h2>
            <p class="text-xs mt-0.5" style="color: var(--text-muted);">Cuando esta activo, solo los roles permitidos pueden acceder al sitio. Los demas usuarios podran hacer login pero veran una pagina de aviso.</p>
          </div>
          <button @click="toggleRestrictAccess" :disabled="saving"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0"
                  :style="{ background: form.restrictAccess ? 'var(--rose-primary)' : 'var(--border-color)' }">
            <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm"
                  :style="{ transform: form.restrictAccess ? 'translateX(22px)' : 'translateX(2px)' }" />
          </button>
        </div>

        <Transition name="expand">
          <div v-if="form.restrictAccess" class="space-y-3 pl-0 sm:pl-1">
            <p class="text-[11px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Roles con acceso permitido</p>
            <div class="flex flex-wrap gap-2">
              <button v-for="role in availableRoles" :key="role.value"
                      @click="toggleRole(role.value)"
                      class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                      :style="form.allowedRoles.includes(role.value)
                        ? { background: 'var(--rose-lighter)', borderColor: 'var(--rose-primary)', color: 'var(--rose-primary)' }
                        : { background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }">
                {{ role.label }}
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <div class="card p-5 space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h2 class="text-sm font-semibold" style="color: var(--text-primary);">Cerrar Sitio</h2>
            <p class="text-xs mt-0.5" style="color: var(--text-muted);">Cierra temporalmente el sitio. Los usuarios no autorizados seran redirigidos a una pagina de aviso.</p>
          </div>
          <button @click="toggleSiteClosed" :disabled="saving"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0"
                  :style="{ background: form.siteClosed ? 'var(--error)' : 'var(--border-color)' }">
            <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm"
                  :style="{ transform: form.siteClosed ? 'translateX(22px)' : 'translateX(2px)' }" />
          </button>
        </div>

        <Transition name="expand">
          <div v-if="form.siteClosed" class="space-y-4 pl-0 sm:pl-1">
            <div>
              <label class="input-label">Razon del cierre</label>
              <input v-model="form.closureReason" type="text" class="input-field" placeholder="Ej: Mantenimiento programado..." @change="save" />
            </div>

            <div>
              <label class="input-label">Modo de cierre</label>
              <div class="flex flex-wrap gap-2">
                <button v-for="mode in closureModes" :key="mode.value"
                        @click="form.closureMode = mode.value; save()"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                        :style="form.closureMode === mode.value
                          ? { background: 'var(--rose-lighter)', borderColor: 'var(--rose-primary)', color: 'var(--rose-primary)' }
                          : { background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }">
                  {{ mode.label }}
                </button>
              </div>
            </div>

            <Transition name="expand">
              <div v-if="form.closureMode === 'scheduled'" class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="input-label">Cerrar el</label>
                    <input v-model="form.scheduledCloseAt" type="datetime-local" class="input-field" @change="save" />
                  </div>
                  <div>
                    <label class="input-label">Reabrir el</label>
                    <input v-model="form.scheduledOpenAt" type="datetime-local" class="input-field" @change="save" />
                  </div>
                </div>
                <p class="text-[11px]" style="color: var(--text-muted);">El sitio se cerrara y abrira automaticamente en las fechas indicadas.</p>
              </div>
            </Transition>

            <Transition name="expand">
              <div v-if="form.closureMode === 'recurring'" class="space-y-3">
                <p class="text-[11px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Dias de cierre</p>
                <div class="flex flex-wrap gap-2">
                  <button v-for="(day, idx) in weekDays" :key="idx"
                          @click="toggleRecurringDay(idx)"
                          class="w-10 h-10 rounded-lg text-xs font-medium border transition-all flex items-center justify-center"
                          :style="form.recurringDays.includes(idx)
                            ? { background: 'var(--rose-lighter)', borderColor: 'var(--rose-primary)', color: 'var(--rose-primary)' }
                            : { background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }">
                    {{ day }}
                  </button>
                </div>
                <p class="text-[11px]" style="color: var(--text-muted);">El sitio se cerrara automaticamente en los dias seleccionados.</p>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>

      <div v-if="saving" class="flex items-center gap-2 text-xs" style="color: var(--rose-primary);">
        <div class="w-4 h-4 border-2 rounded-full animate-spin" style="border-color: var(--rose-primary); border-top-color: transparent;"></div>
        Guardando...
      </div>

      <div v-if="lastSaved" class="text-xs" style="color: var(--success);">
        Configuracion guardada
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useSiteSettingsStore } from '../../store/siteSettings'
import { useToastStore } from '../../store/toast'

const siteSettingsStore = useSiteSettingsStore()
const toast = useToastStore()

const loading = ref(true)
const saving = ref(false)
const lastSaved = ref(false)

const form = reactive({
  restrictAccess: false,
  allowedRoles: ['admin', 'boss'],
  siteClosed: false,
  closureReason: '',
  closureMode: 'manual',
  scheduledCloseAt: '',
  scheduledOpenAt: '',
  recurringDays: [],
})

const availableRoles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'boss', label: 'Super Admin' },
]

const closureModes = [
  { value: 'manual', label: 'Manual' },
  { value: 'scheduled', label: 'Programado' },
  { value: 'recurring', label: 'Recurrente' },
]

const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

function syncForm() {
  const s = siteSettingsStore.settings
  if (!s) return
  form.restrictAccess = s.restrictAccess ?? false
  form.allowedRoles = [...(s.allowedRoles || ['admin', 'boss'])]
  form.siteClosed = s.siteClosed ?? false
  form.closureReason = s.closureReason ?? ''
  form.closureMode = s.closureMode ?? 'manual'
  form.recurringDays = [...(s.recurringDays || [])]

  if (s.scheduledCloseAt) {
    const d = new Date(s.scheduledCloseAt)
    form.scheduledCloseAt = d.toISOString().slice(0, 16)
  } else {
    form.scheduledCloseAt = ''
  }
  if (s.scheduledOpenAt) {
    const d = new Date(s.scheduledOpenAt)
    form.scheduledOpenAt = d.toISOString().slice(0, 16)
  } else {
    form.scheduledOpenAt = ''
  }
}

function toggleRestrictAccess() {
  form.restrictAccess = !form.restrictAccess
  save()
}

function toggleSiteClosed() {
  form.siteClosed = !form.siteClosed
  save()
}

function toggleRole(role) {
  const idx = form.allowedRoles.indexOf(role)
  if (idx >= 0) {
    if (form.allowedRoles.length > 1) {
      form.allowedRoles.splice(idx, 1)
    }
  } else {
    form.allowedRoles.push(role)
  }
  save()
}

function toggleRecurringDay(day) {
  const idx = form.recurringDays.indexOf(day)
  if (idx >= 0) {
    form.recurringDays.splice(idx, 1)
  } else {
    form.recurringDays.push(day)
  }
  save()
}

let saveTimeout = null
function save() {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(doSave, 500)
}

async function doSave() {
  saving.value = true
  lastSaved.value = false
  try {
    await siteSettingsStore.updateSettings({
      restrictAccess: form.restrictAccess,
      allowedRoles: form.allowedRoles,
      siteClosed: form.siteClosed,
      closureReason: form.closureReason,
      closureMode: form.closureMode,
      scheduledCloseAt: form.scheduledCloseAt || null,
      scheduledOpenAt: form.scheduledOpenAt || null,
      recurringDays: form.recurringDays,
    })
    lastSaved.value = true
    setTimeout(() => { lastSaved.value = false }, 2000)
  } catch (e) {
    toast.error('Error', e.response?.data?.message || 'No se pudo guardar')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await siteSettingsStore.fetchSettings()
  syncForm()
  loading.value = false
})
</script>

<style scoped>
.expand-enter-active { transition: all 0.25s cubic-bezier(0.21, 1.02, 0.73, 1); }
.expand-leave-active { transition: all 0.15s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 500px; }
</style>
