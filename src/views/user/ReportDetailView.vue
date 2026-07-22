<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6">
    <div class="flex items-center justify-between">
      <button @click="goBack" class="inline-flex items-center gap-2 btn-ghost text-xs sm:text-sm no-underline !px-2 sm:!px-3" style="color: var(--rose-primary);">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Volver
      </button>
      <div v-if="report" class="flex items-center gap-2">
        <span :class="report.status === 'resolved' ? 'badge badge-resolved' : report.status === 'in_progress' ? 'badge badge-progress' : 'badge badge-pending'" class="text-[10px] sm:text-xs">
          {{ statusLabel }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div class="card p-5 sm:p-6 space-y-4">
        <div class="skeleton h-7 sm:h-8 w-48 sm:w-56 rounded"></div>
        <div class="skeleton h-4 w-40 rounded"></div>
        <div class="skeleton h-28 sm:h-32 w-full rounded"></div>
      </div>
    </div>

    <template v-else-if="report">
      <div class="card overflow-hidden">
        <div class="p-4 sm:p-6 lg:p-8 border-b" :style="{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-bold shrink-0"
                 style="background: var(--rose-gradient); color: white;">
              {{ platformInitial }}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl sm:text-2xl mb-0.5">{{ report.platform }}</h1>
              <p class="text-xs sm:text-sm truncate" style="color: var(--text-muted);">{{ report.mail }}</p>
              <p v-if="report.user?.phone" class="text-[10px] sm:text-xs mt-0.5 flex items-center gap-1" style="color: var(--text-muted);">
                <svg class="w-3 h-3 shrink-0" style="color: var(--rose-primary);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                {{ report.user.phone }}
              </p>
            </div>
            <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button v-if="authStore.isAdmin && report.status !== 'resolved'" @click="openResolveModal" class="btn-primary text-xs">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Resolver
              </button>
              <button v-if="authStore.isAdmin && report.status === 'resolved'" @click="openEditResolution" class="btn-secondary text-xs">Editar</button>
              <button v-if="authStore.isAdmin && report.status !== 'resolved'" @click="toggleStatus" :disabled="statusLoading" class="btn-ghost text-xs">
                {{ report.status === 'pending' ? 'En proceso' : 'Pendiente' }}
              </button>
              <button v-if="authStore.isAdmin" @click="openDeleteConfirm" class="btn-ghost text-xs" style="color: var(--error);">Eliminar</button>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div>
            <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2" style="color: var(--rose-primary);">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Informacion del reporte
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
              <div v-for="info in reportInfo" :key="info.label" class="rounded-xl p-3" style="background: var(--bg-surface);">
                <p class="text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">{{ info.label }}</p>
                <div class="flex items-center gap-2">
                  <p class="text-xs sm:text-sm font-medium truncate" :class="info.mono ? 'font-mono' : ''" style="color: var(--text-primary);">
                    <template v-if="info.isPassword">{{ showReportPassword ? info.value : '••••••' }}</template>
                    <template v-else>{{ info.value }}</template>
                  </p>
                  <button v-if="info.isPassword" @click="showReportPassword = !showReportPassword" class="btn-ghost shrink-0 !p-1 rounded-lg" :title="showReportPassword ? 'Ocultar' : 'Mostrar'" style="color: var(--rose-primary);">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" :d="showReportPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                    </svg>
                  </button>
                  <button v-if="info.copy" @click="copyToClipboard(info.copy)" class="btn-ghost shrink-0 !p-1 rounded-lg" title="Copiar" style="color: var(--rose-primary);">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="report.description">
            <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3 flex items-center gap-2" style="color: var(--rose-primary);">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              Descripcion
            </p>
            <div class="rounded-xl p-3.5 sm:p-4" style="background: var(--bg-surface);">
              <p class="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap" style="color: var(--text-secondary);">{{ report.description }}</p>
            </div>
          </div>

          <div>
            <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3 flex items-center gap-2" style="color: var(--rose-primary);">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Evidencias
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="rounded-xl border overflow-hidden cursor-pointer transition-colors hover:border-[var(--rose-light)]" :style="{ borderColor: 'var(--border-color)' }" @click="openLightbox('fail')">
                <div class="px-3 py-2 border-b text-xs font-medium" :style="{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }">Evidencia de falla</div>
                <img v-if="report.fail_evidence" :src="getUploadUrl(report.fail_evidence)" alt="Evidencia de falla" class="w-full h-36 sm:h-44 object-cover" @error="onImgError($event)" />
                <div v-else class="h-36 sm:h-44 flex items-center justify-center text-xs" style="color: var(--text-muted);">Sin evidencia</div>
              </div>
              <div class="rounded-xl border overflow-hidden cursor-pointer transition-colors hover:border-[var(--rose-light)]" :style="{ borderColor: 'var(--border-color)' }" @click="openLightbox('delivery')">
                <div class="px-3 py-2 border-b text-xs font-medium" :style="{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }">Evidencia de entrega</div>
                <img v-if="report.delivery_evidence" :src="getUploadUrl(report.delivery_evidence)" alt="Evidencia de entrega" class="w-full h-36 sm:h-44 object-cover" @error="onImgError($event)" />
                <div v-else class="h-36 sm:h-44 flex items-center justify-center text-xs" style="color: var(--text-muted);">Sin evidencia</div>
              </div>
            </div>
          </div>

          <div v-if="report.status === 'resolved' && report.resolution" class="rounded-xl border p-4 sm:p-5 lg:p-6" :style="{ borderColor: 'var(--border-color)', background: 'var(--success-bg)' }">
            <div class="flex items-center gap-3 mb-3 sm:mb-4">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style="background: var(--success);">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-base sm:text-lg">Reporte Resuelto</h2>
                <p class="text-[10px] sm:text-xs" style="color: var(--text-muted);">Resuelto el {{ formatDate(report.resolution.resolvedAt) }}</p>
              </div>
            </div>

            <div v-if="report.resolution.text" class="rounded-xl p-3 sm:p-4 mb-3 sm:mb-4" style="background: var(--bg-card);">
              <p class="text-[10px] sm:text-xs font-medium mb-1" style="color: var(--text-muted);">Solucion aplicada</p>
              <p class="text-xs sm:text-sm leading-relaxed" style="color: var(--text-secondary);">{{ report.resolution.text }}</p>
            </div>

            <div v-if="report.resolution.resolvedBy && authStore.isAdmin" class="rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 flex items-center gap-3" style="background: var(--bg-card);">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                   style="background: var(--rose-gradient); color: white;">
                {{ (report.resolution.resolvedBy?.username || '?').charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[10px] sm:text-xs" style="color: var(--text-muted);">Resuelto por</p>
                <p class="text-xs sm:text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.resolution.resolvedBy?.username || '—' }}</p>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    :style="{
                      background: report.resolution.resolvedBy?.role === 'boss' ? 'var(--rose-lighter)' : 'var(--info-bg)',
                      color: report.resolution.resolvedBy?.role === 'boss' ? 'var(--rose-primary)' : 'var(--info)',
                    }">
                {{ report.resolution.resolvedBy?.role === 'boss' ? 'Boss' : 'Admin' }}
              </span>
            </div>

            <div v-if="report.resolution.replaced_mail || report.resolution.replaced_password" class="rounded-xl border p-3 sm:p-4" style="background: var(--bg-card); border-color: var(--border-color);">
              <p class="text-[10px] sm:text-xs font-semibold mb-2.5 sm:mb-3 flex items-center gap-1.5" style="color: var(--rose-primary);">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
                Credenciales de reemplazo
              </p>
              <div class="space-y-2">
                <div v-if="report.resolution.replaced_mail" class="CredentialRow">
                  <span class="text-[10px] sm:text-xs" style="color: var(--text-muted);">Nuevo correo</span>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-xs sm:text-sm font-medium truncate" style="color: var(--text-primary);">{{ report.resolution.replaced_mail }}</span>
                    <button @click="copyToClipboard(report.resolution.replaced_mail)" class="btn-ghost shrink-0 !p-1 rounded-lg" style="color: var(--rose-primary);">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div v-if="report.resolution.replaced_password" class="CredentialRow">
                  <span class="text-[10px] sm:text-xs" style="color: var(--text-muted);">Nueva contrasena</span>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-xs sm:text-sm font-mono font-medium truncate" style="color: var(--text-primary);">
                      {{ showPassword ? report.resolution.replaced_password : '••••••••••••' }}
                    </span>
                    <button @click="showPassword = !showPassword" class="btn-ghost shrink-0 !p-1 rounded-lg" :title="showPassword ? 'Ocultar' : 'Mostrar'" style="color: var(--rose-primary);">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="showPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                      </svg>
                    </button>
                    <button @click="copyToClipboard(report.resolution.replaced_password)" class="btn-ghost shrink-0 !p-1 rounded-lg" style="color: var(--rose-primary);">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="report.resolution.type === 'credit' && report.resolution.credit_amount > 0"
                 class="rounded-xl border p-4 sm:p-5" style="background: var(--bg-card); border-color: var(--border-color);">
              <p class="text-[10px] sm:text-xs font-semibold mb-2.5 sm:mb-3 flex items-center gap-1.5" style="color: var(--success);">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Saldo a favor
              </p>
              <p class="text-2xl sm:text-3xl font-display font-bold" style="color: var(--success);">${{ report.resolution.credit_amount.toFixed(2) }}</p>
              <p class="text-xs mt-1" style="color: var(--text-muted);">Saldo acreditado a tu cuenta</p>
            </div>
          </div>

          <div>
            <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2" style="color: var(--rose-primary);">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
              Progreso
            </p>
            <div class="flex items-start gap-0">
              <div v-for="(step, i) in timeline" :key="i" class="flex-1 relative">
                <div class="flex flex-col items-center">
                  <div :class="['w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors']"
                       :style="{
                         borderColor: step.done ? 'var(--success)' : step.active ? 'var(--rose-primary)' : 'var(--border-color)',
                         background: step.done ? 'var(--success)' : 'transparent',
                         color: step.done ? 'white' : step.active ? 'var(--rose-primary)' : 'var(--text-muted)',
                       }">
                    <svg v-if="step.done" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <p class="text-[10px] sm:text-xs mt-1.5 sm:mt-2 text-center font-medium px-0.5" :style="{ color: step.done ? 'var(--success)' : step.active ? 'var(--text-primary)' : 'var(--text-muted)' }">
                    {{ step.label }}
                  </p>
                  <p v-if="step.date" class="text-[9px] sm:text-[10px] mt-0.5 text-center" style="color: var(--text-muted);">{{ formatDate(step.date) }}</p>
                </div>
                <div v-if="i < timeline.length - 1" class="absolute top-3.5 sm:top-4 left-[60%] right-[-40%] h-0.5"
                     :style="{ background: step.done ? 'var(--success)' : 'var(--border-color)' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-16 sm:py-20">
      <p class="text-sm" style="color: var(--text-muted);">Reporte no encontrado</p>
    </div>

    <Teleport to="body">
      <div v-if="lightboxSrc" class="fixed inset-0 z-[300] flex items-center justify-center p-4" style="background: rgba(0,0,0,0.85);" @click="lightboxSrc = null">
        <img :src="lightboxSrc" alt="Evidencia" class="max-w-full max-h-[85vh] sm:max-h-[90vh] rounded-xl sm:rounded-2xl shadow-2xl" @click.stop />
      </div>
    </Teleport>

    <ResolvModal :visible="showResolveModal" :report="report" @close="showResolveModal = false" @resolved="handleResolved" />
    <ResolvModal :visible="showEditModal" :report="report" @close="showEditModal = false" @resolved="handleResolved" />

    <ConfirmDialog :visible="showDeleteConfirm" title="Eliminar reporte" message="Estas seguro de eliminar este reporte? Esta accion no se puede deshacer." confirmText="Eliminar" type="danger" :loading="deleteLoading" @confirm="confirmDelete" @cancel="showDeleteConfirm = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import { useToastStore } from '../../store/toast'
import { LOCALE } from '../../config/constants'
import ResolvModal from '../../components/reports/ResolvModal.vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const toast = useToastStore()

const loading = ref(true)
const showPassword = ref(false)
const showReportPassword = ref(false)
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
    { label: 'Contrasena', value: r.password, isPassword: true, copy: r.password },
    { label: 'Telefono del cliente', value: r.user?.phone || '—', copy: r.user?.phone },
    { label: 'Fecha de entrega', value: formatDate(r.delivery_date) },
    { label: 'Reportado por', value: r.user?.name || r.user?.username || '—' },
    ...(authStore.isAdmin ? [{ label: 'Ultimo movimiento', value: r.updatedBy?.username ? `${r.updatedBy.username} (${r.updatedBy.role})` : '—' }] : []),
    { label: 'Creado', value: formatDate(r.createdAt) },
    { label: 'Actualizado', value: formatDate(r.updatedAt) },
  ]
})

const timeline = computed(() => [
  { label: 'Creado', done: true, date: report.value?.createdAt },
  { label: 'Revision', done: report.value?.status !== 'pending', active: report.value?.status === 'pending', date: report.value?.status !== 'pending' ? report.value?.updatedAt : null },
  { label: 'Resuelto', done: report.value?.status === 'resolved', active: report.value?.status === 'resolved', date: report.value?.resolution?.resolvedAt },
])

function getUploadUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
  const serverBase = apiBase.replace(/\/api\/?$/, '')
  const cleanPath = path.replace(/\\/g, '/').split('/').pop()
  return `${serverBase}/uploads/${cleanPath}`
}

function onImgError(e) {
  e.target.style.display = 'none'
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString(LOCALE, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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
  padding: 0.625rem 0.75rem;
  border-radius: 0.75rem;
  background: var(--bg-surface);
}
</style>
