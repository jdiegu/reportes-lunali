<template>
  <div class="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
    <div class="flex items-center justify-between">
      <button @click="goBack" class="inline-flex items-center gap-2 btn-ghost text-sm no-underline w-auto">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Volver
      </button>
      <div v-if="report" class="flex items-center gap-2">
        <span :class="report.status === 'resolved' ? 'badge badge-resolved' : report.status === 'in_progress' ? 'badge badge-progress' : 'badge badge-pending'" class="text-xs">
          {{ statusLabel }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div class="card p-6 space-y-4">
        <div class="skeleton h-8 w-56 rounded"></div>
        <div class="skeleton h-4 w-40 rounded"></div>
        <div class="skeleton h-32 w-full rounded"></div>
      </div>
    </div>

    <template v-else-if="report">
      <div class="card overflow-hidden">
        <div class="p-6 lg:p-8 border-b" style="border-color: var(--border-color); background: var(--bg-surface);">
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
                 style="background: var(--rose-gradient); color: white;">
              {{ platformInitial }}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl mb-0.5">{{ report.platform }}</h1>
              <p class="text-sm" style="color: var(--text-muted);">{{ report.mail }}</p>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <button v-if="authStore.isAdmin && report.status !== 'resolved'" @click="openResolveModal" class="btn-primary text-xs">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Resolver
              </button>
              <button v-if="report.status === 'resolved'" @click="openEditResolution" class="btn-secondary text-xs">Editar resolución</button>
              <button v-if="authStore.isAdmin && report.status !== 'resolved'" @click="toggleStatus" :disabled="statusLoading" class="btn-ghost text-xs">
                {{ report.status === 'pending' ? 'En proceso' : 'Pendiente' }}
              </button>
              <button @click="openDeleteConfirm" class="btn-ghost text-xs" style="color: var(--error);">Eliminar</button>
            </div>
          </div>
        </div>

        <div class="p-6 lg:p-8 space-y-8">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2" style="color: var(--rose-primary);">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Información del reporte
            </p>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="info in reportInfo" :key="info.label" class="rounded-xl p-3" style="background: var(--bg-surface);">
                <p class="text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">{{ info.label }}</p>
                <div class="flex items-center gap-2">
                  <p class="text-sm font-medium truncate" :class="info.mono ? 'font-mono' : ''" style="color: var(--text-primary);">{{ info.value }}</p>
                  <button v-if="info.copy" @click="copyToClipboard(info.copy)" class="btn-ghost shrink-0 p-0.5">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="report.description">
            <p class="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style="color: var(--rose-primary);">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              Descripción
            </p>
            <div class="rounded-xl p-4" style="background: var(--bg-surface);">
              <p class="text-sm leading-relaxed whitespace-pre-wrap" style="color: var(--text-secondary);">{{ report.description }}</p>
            </div>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style="color: var(--rose-primary);">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Evidencias
            </p>
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="rounded-xl border overflow-hidden cursor-pointer" style="border-color: var(--border-color);" @click="openLightbox('fail')">
                <div class="bg-rose-50 dark:bg-rose-900/10 px-3 py-2 border-b text-xs font-medium" style="border-color: var(--border-color); color: var(--text-muted);">Evidencia de falla</div>
                <img v-if="report.fail_evidence" :src="getUploadUrl(report.fail_evidence)" alt="Evidencia de falla" class="w-full h-44 object-cover" @error="onImgError($event)" />
                <div v-else class="h-44 flex items-center justify-center text-xs" style="color: var(--text-muted);">Sin evidencia</div>
              </div>
              <div class="rounded-xl border overflow-hidden cursor-pointer" style="border-color: var(--border-color);" @click="openLightbox('delivery')">
                <div class="bg-rose-50 dark:bg-rose-900/10 px-3 py-2 border-b text-xs font-medium" style="border-color: var(--border-color); color: var(--text-muted);">Evidencia de entrega</div>
                <img v-if="report.delivery_evidence" :src="getUploadUrl(report.delivery_evidence)" alt="Evidencia de entrega" class="w-full h-44 object-cover" @error="onImgError($event)" />
                <div v-else class="h-44 flex items-center justify-center text-xs" style="color: var(--text-muted);">Sin evidencia</div>
              </div>
            </div>
          </div>

          <div v-if="report.status === 'resolved' && report.resolution" class="rounded-xl border p-6" style="border-color: var(--border-color); background: var(--success-bg);">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: var(--success);">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-lg">Reporte Resuelto</h2>
                <p class="text-xs" style="color: var(--text-muted);">Resuelto el {{ formatDate(report.resolution.resolvedAt) }}</p>
              </div>
            </div>

            <div v-if="report.resolution.text" class="rounded-xl p-4 mb-4" style="background: var(--bg-card);">
              <p class="text-xs font-medium mb-1" style="color: var(--text-muted);">Solución aplicada</p>
              <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">{{ report.resolution.text }}</p>
            </div>

            <div v-if="report.resolution.replaced_mail || report.resolution.replaced_password" class="rounded-xl border p-4" style="background: var(--bg-card); border-color: var(--border-color);">
              <p class="text-xs font-semibold mb-3 flex items-center gap-1.5" style="color: var(--rose-primary);">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Credenciales de reemplazo
              </p>
              <div class="space-y-2">
                <div v-if="report.resolution.replaced_mail" class="CredentialRow">
                  <span class="text-xs" style="color: var(--text-muted);">Nuevo correo</span>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.resolution.replaced_mail }}</span>
                    <button @click="copyToClipboard(report.resolution.replaced_mail)" class="btn-ghost shrink-0 p-1">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div v-if="report.resolution.replaced_password" class="CredentialRow">
                  <span class="text-xs" style="color: var(--text-muted);">Nueva contraseña</span>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-sm font-mono font-medium truncate" style="color: var(--text-primary);">
                      {{ showPassword ? report.resolution.replaced_password : '••••••••••••' }}
                    </span>
                    <button @click="showPassword = !showPassword" class="btn-ghost shrink-0 p-1" :title="showPassword ? 'Ocultar' : 'Mostrar'">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          :d="showPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                      </svg>
                    </button>
                    <button @click="copyToClipboard(report.resolution.replaced_password)" class="btn-ghost shrink-0 p-1">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2" style="color: var(--rose-primary);">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              Progreso
            </p>
            <div class="flex items-start gap-0">
              <div v-for="(step, i) in timeline" :key="i" class="flex-1 relative">
                <div class="flex flex-col items-center">
                  <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2',
                    step.done ? 'border-green-500 bg-green-500 text-white' :
                    step.active ? '' : 'border-gray-300 dark:border-gray-600']"
                    :style="step.active ? { borderColor: 'var(--rose-primary)', color: 'var(--rose-primary)' } : {}">
                    <svg v-if="step.done" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <p class="text-xs mt-2 text-center font-medium px-1" :style="{ color: step.done ? 'var(--success)' : step.active ? 'var(--text-primary)' : 'var(--text-muted)' }">
                    {{ step.label }}
                  </p>
                  <p v-if="step.date" class="text-[10px] mt-0.5 text-center" style="color: var(--text-muted);">{{ formatDate(step.date) }}</p>
                </div>
                <div v-if="i < timeline.length - 1" class="absolute top-4 left-[60%] right-[-40%] h-0.5" :class="step.done ? 'bg-green-500' : ''" style="background: var(--border-color);"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <p class="text-sm" style="color: var(--text-muted);">Reporte no encontrado</p>
    </div>

    <Teleport to="body">
      <div v-if="lightboxSrc" class="fixed inset-0 z-[300] flex items-center justify-center p-4" style="background: rgba(0,0,0,0.85);" @click="lightboxSrc = null">
        <img :src="lightboxSrc" alt="Evidencia" class="max-w-full max-h-[90vh] rounded-2xl shadow-2xl" @click.stop />
      </div>
    </Teleport>

    <ResolvModal :visible="showResolveModal" :report="report" @close="showResolveModal = false" @resolved="handleResolved" />
    <ResolvModal :visible="showEditModal" :report="report" @close="showEditModal = false" @resolved="handleResolved" />

    <ConfirmDialog :visible="showDeleteConfirm" title="Eliminar reporte" message="¿Estás seguro de eliminar este reporte? Esta acción no se puede deshacer." confirmText="Eliminar" type="danger" :loading="deleteLoading" @confirm="confirmDelete" @cancel="showDeleteConfirm = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import { useToastStore } from '../../store/toast'
import ResolvModal from '../../components/reports/ResolvModal.vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const toast = useToastStore()

const loading = ref(true)
const showPassword = ref(false)
const lightboxSrc = ref(null)
const showResolveModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const statusLoading = ref(false)
const deleteLoading = ref(false)

const report = computed(() => reportsStore.currentReport)
const platformInitial = computed(() => report.value?.platform?.charAt(0).toUpperCase() || '?')

const statusLabel = computed(() => {
  const s = report.value?.status
  if (s === 'resolved') return 'Resuelto'
  if (s === 'in_progress') return 'En proceso'
  return 'Pendiente'
})

const reportInfo = computed(() => {
  const r = report.value
  if (!r) return []
  return [
    { label: 'Plataforma', value: r.platform },
    { label: 'Tipo', value: r.platform_type === 'profile' ? 'Perfil' : 'Cuenta' },
    { label: 'Cuenta', value: r.mail },
    { label: 'Contraseña', value: r.password ? '••••••' : '—', copy: r.password },
    { label: 'Fecha de entrega', value: formatDate(r.delivery_date) },
    { label: 'Creado', value: formatDate(r.createdAt) },
    { label: 'Actualizado', value: formatDate(r.updatedAt) },
    { label: 'Reportado por', value: r.user?.name || r.user?.username || '—' },
  ]
})

const timeline = computed(() => [
  { label: 'Creado', done: true, date: report.value?.createdAt },
  { label: 'Revisión', done: report.value?.status !== 'pending', active: report.value?.status === 'pending', date: report.value?.status !== 'pending' ? report.value?.updatedAt : null },
  { label: 'Resuelto', done: report.value?.status === 'resolved', active: report.value?.status === 'resolved', date: report.value?.resolution?.resolvedAt },
])

function getUploadUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = import.meta.env.VITE_API_URL || ''
  const cleanPath = path.replace(/\\/g, '/').split('/').pop()
  return `${base}/uploads/${cleanPath}`
}

function onImgError(e) {
  e.target.style.display = 'none'
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => toast.success('Copiado', 'Texto copiado al portapapeles'))
}

function goBack() { router.push('/app/reports') }
function openLightbox(type) {
  const path = type === 'fail' ? report.value?.fail_evidence : report.value?.delivery_evidence
  if (path) lightboxSrc.value = getUploadUrl(path)
}
function openResolveModal() { showResolveModal.value = true }
function openEditResolution() { showEditModal.value = true }

async function handleResolved() {
  try { await reportsStore.fetchReport(route.params.id) } catch { }
}

async function toggleStatus() {
  statusLoading.value = true
  try {
    const newStatus = report.value.status === 'pending' ? 'in_progress' : 'pending'
    await reportsStore.updateStatus(report.value._id, newStatus)
    toast.success('Estado actualizado', `Reporte marcado como "${newStatus === 'in_progress' ? 'En proceso' : 'Pendiente'}"`)
    await reportsStore.fetchReport(route.params.id)
  } catch {
    toast.error('Error', 'No se pudo actualizar el estado')
  } finally {
    statusLoading.value = false
  }
}

function openDeleteConfirm() { showDeleteConfirm.value = true }

async function confirmDelete() {
  deleteLoading.value = true
  try {
    await reportsStore.deleteReport(report.value._id)
    toast.success('Eliminado', 'El reporte fue eliminado')
    router.push('/app/reports')
  } catch {
    toast.error('Error', 'No se pudo eliminar el reporte')
  } finally {
    deleteLoading.value = false
    showDeleteConfirm.value = false
  }
}

onMounted(() => {
  loading.value = true
  reportsStore.fetchReport(route.params.id).finally(() => loading.value = false)
})
</script>

<style scoped>
.CredentialRow {
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: var(--bg-surface);
}
</style>
