<template>
  <div class="max-w-3xl mx-auto p-4 lg:p-6 space-y-6">
    <button @click="goBack" class="inline-flex items-center gap-2 btn-ghost text-sm no-underline w-auto">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
      </svg>
      Volver
    </button>

    <div v-if="loading" class="space-y-4">
      <div class="card p-6 space-y-4">
        <div class="skeleton h-8 w-48 rounded"></div>
        <div class="skeleton h-4 w-32 rounded"></div>
        <div class="skeleton h-20 w-full rounded"></div>
      </div>
    </div>

    <template v-else-if="report">
      <div class="card p-6 lg:p-8">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0"
                 style="background: var(--rose-lighter); color: var(--rose-primary);">
              {{ platformInitial }}
            </div>
            <div>
              <h1 class="text-xl font-display font-bold" style="color: var(--text-primary);">{{ report.platform }}</h1>
              <p class="text-sm" style="color: var(--text-muted);">{{ report.mail }}</p>
            </div>
          </div>
          <span :class="report.status === 'resolved' ? 'badge badge-resolved' : report.status === 'in_progress' ? 'badge badge-progress' : 'badge badge-pending'">
            {{ report.status === 'resolved' ? 'Resuelto' : report.status === 'in_progress' ? 'En proceso' : 'Pendiente' }}
          </span>
        </div>

        <div class="grid sm:grid-cols-3 gap-4 mb-6 p-4 rounded-xl" style="background: var(--bg-surface);">
          <div>
            <p class="text-xs font-medium mb-0.5" style="color: var(--text-muted);">Tipo de problema</p>
            <p class="text-sm font-medium" style="color: var(--text-primary);">{{ report.problemType }}</p>
          </div>
          <div>
            <p class="text-xs font-medium mb-0.5" style="color: var(--text-muted);">Creado</p>
            <p class="text-sm" style="color: var(--text-secondary);">{{ formatDate(report.createdAt) }}</p>
          </div>
          <div>
            <p class="text-xs font-medium mb-0.5" style="color: var(--text-muted);">Actualizado</p>
            <p class="text-sm" style="color: var(--text-secondary);">{{ formatDate(report.updatedAt) }}</p>
          </div>
        </div>

        <div v-if="report.description" class="mb-6">
          <p class="text-sm font-medium mb-2" style="color: var(--text-primary);">Descripci&oacute;n</p>
          <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">{{ report.description }}</p>
        </div>

        <div v-if="report.evidence" class="mb-6">
          <p class="text-sm font-medium mb-2" style="color: var(--text-primary);">Evidencia</p>
          <div class="image-card rounded-xl overflow-hidden border cursor-pointer max-w-sm"
               style="border-color: var(--border-color);" @click="lightbox = report.evidence">
            <img :src="getUploadUrl(report.evidence)" alt="Evidencia" class="w-full h-40 object-cover" />
          </div>
        </div>

        <div v-if="authStore.isAdmin" class="flex flex-wrap items-center gap-2 pt-4 border-t" style="border-color: var(--border-color);">
          <button v-if="report.status !== 'resolved'" @click="openResolveModal" class="btn-primary text-xs">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Resolver
          </button>
          <button
            v-if="report.status === 'resolved'"
            @click="openEditResolution"
            class="btn-secondary text-xs"
          >
            Editar resoluci&oacute;n
          </button>
          <div class="flex-1"></div>
          <button v-if="report.status !== 'resolved'" @click="toggleStatus" class="btn-ghost text-xs" :disabled="statusLoading">
            <span v-if="report.status === 'pending'">Marcar en proceso</span>
            <span v-else>Volver a pendiente</span>
          </button>
          <button @click="openDeleteConfirm" class="btn-ghost text-xs" style="color: var(--error);">
            Eliminar
          </button>
        </div>
      </div>

      <div v-if="report.status === 'resolved' && report.resolution" class="card p-6 lg:p-8">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: var(--success-bg);">
            <svg class="w-5 h-5" style="color: var(--success);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h2 class="font-display font-bold" style="color: var(--text-primary);">Reporte Resuelto</h2>
            <p class="text-xs" style="color: var(--text-muted);">Resuelto {{ formatDate(report.resolution.resolvedAt) }}</p>
          </div>
        </div>

        <div v-if="report.resolution.text" class="mb-5 p-4 rounded-xl" style="background: var(--bg-surface);">
          <p class="text-xs font-medium mb-1" style="color: var(--text-muted);">Soluci&oacute;n</p>
          <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">{{ report.resolution.text }}</p>
        </div>

        <div v-if="report.resolution.replaced_mail || report.resolution.replaced_password" class="rounded-xl border p-4" style="border-color: var(--border-color);">
          <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color: var(--rose-primary);">Credenciales de reemplazo</p>
          <div class="space-y-3">
            <div v-if="report.resolution.replaced_mail" class="flex items-center justify-between gap-2 p-3 rounded-lg" style="background: var(--bg-surface);">
              <div class="min-w-0">
                <p class="text-xs mb-0.5" style="color: var(--text-muted);">Nuevo correo</p>
                <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.resolution.replaced_mail }}</p>
              </div>
              <button @click="copyToClipboard(report.resolution.replaced_mail)" class="btn-ghost shrink-0" title="Copiar">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </button>
            </div>
            <div v-if="report.resolution.replaced_password" class="flex items-center justify-between gap-2 p-3 rounded-lg" style="background: var(--bg-surface);">
              <div class="min-w-0">
                <p class="text-xs mb-0.5" style="color: var(--text-muted);">Nueva contrase&ntilde;a</p>
                <p class="text-sm font-mono font-medium truncate" style="color: var(--text-primary);">
                  {{ showPassword ? report.resolution.replaced_password : '••••••••••••' }}
                </p>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button @click="showPassword = !showPassword" class="btn-ghost" :title="showPassword ? 'Ocultar' : 'Mostrar'">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      :d="showPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                  </svg>
                </button>
                <button @click="copyToClipboard(report.resolution.replaced_password)" class="btn-ghost" title="Copiar">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card p-6 lg:p-8">
        <h2 class="font-display font-bold mb-4" style="color: var(--text-primary);">Progreso</h2>
        <div class="space-y-0">
          <div v-for="(step, i) in timelineSteps" :key="i" class="flex gap-4 pb-6 relative">
            <div v-if="i < timelineSteps.length - 1" class="absolute left-[11px] top-6 w-px h-full" style="background: var(--border-color);"></div>
            <div class="flex flex-col items-center shrink-0">
              <div v-if="step.done" class="w-[22px] h-[22px] rounded-full flex items-center justify-center" style="background: var(--success);">
                <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div v-else-if="step.active" class="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center"
                   style="border-color: var(--rose-primary);">
                <div class="w-2 h-2 rounded-full" style="background: var(--rose-primary);"></div>
              </div>
              <div v-else class="w-[22px] h-[22px] rounded-full border-2" style="border-color: var(--border-color);"></div>
            </div>
            <div class="pt-0.5">
              <p class="text-sm font-medium" :style="{ color: step.done ? 'var(--success)' : step.active ? 'var(--text-primary)' : 'var(--text-muted)' }">
                {{ step.label }}
              </p>
              <p v-if="step.date" class="text-xs mt-0.5" style="color: var(--text-muted);">{{ formatDate(step.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-20">
      <p class="text-sm" style="color: var(--text-muted);">Reporte no encontrado</p>
    </div>

    <div v-if="lightbox" class="fixed inset-0 z-[300] flex items-center justify-center p-4" style="background: rgba(0,0,0,0.8);" @click="lightbox = null">
      <img :src="getUploadUrl(lightbox)" alt="Evidencia" class="max-w-full max-h-[90vh] rounded-xl" @click.stop />
    </div>

    <ResolvModal
      :visible="showResolveModal"
      :report="report"
      @close="showResolveModal = false"
      @resolved="handleResolved"
    />

    <ResolvModal
      :visible="showEditModal"
      :report="report"
      @close="showEditModal = false"
      @resolved="handleResolved"
    />

    <ConfirmDialog
      :visible="showDeleteConfirm"
      title="Eliminar reporte"
      message="&iquest;Est&aacute;s seguro de eliminar este reporte? Esta acci&oacute;n no se puede deshacer."
      confirm-text="Eliminar"
      type="danger"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
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
const lightbox = ref(null)
const showResolveModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const statusLoading = ref(false)
const deleteLoading = ref(false)

const report = computed(() => reportsStore.currentReport)

const platformInitial = computed(() => report.value?.platform?.charAt(0).toUpperCase() || '?')

const timelineSteps = computed(() => [
  { label: 'Reporte creado', done: true, date: report.value?.createdAt },
  { label: 'En revisi&oacute;n', done: report.value?.status !== 'pending', active: report.value?.status === 'pending', date: report.value?.status !== 'pending' ? report.value?.updatedAt : null },
  { label: 'Resuelto', done: report.value?.status === 'resolved', active: report.value?.status === 'resolved', date: report.value?.resolution?.resolvedAt },
])

function getUploadUrl(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : `${import.meta.env.VITE_API_URL || ''}/uploads/${path}`
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => toast.success('Copiado', 'Texto copiado al portapapeles'))
}

function goBack() { router.push('/app/reports') }

function openResolveModal() { showResolveModal.value = true }
function openEditResolution() { showEditModal.value = true }
function openDeleteConfirm() { showDeleteConfirm.value = true }

async function handleResolved() {
  try { await reportsStore.fetchReport(route.params.id) } catch { /* ignore */ }
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
