<template>
  <div class="p-4 lg:p-8 max-w-5xl mx-auto">
    <!-- Back -->
    <button
      @click="router.back()"
      class="btn-ghost text-xs mb-5 -ml-2 animate-fade-up"
    >
      ← Volver
    </button>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="skeleton h-10 w-64 rounded-xl"></div>
      <div class="skeleton h-56 rounded-2xl"></div>
      <div class="skeleton h-40 rounded-2xl"></div>
    </div>

    <!-- Not found -->
    <div v-else-if="!report" class="glass-card p-16 text-center">
      <p class="text-blush-400 font-display text-xl mb-2">
        Reporte no encontrado
      </p>
      <RouterLink to="/reports" class="btn-primary mt-4 inline-flex"
        >Ver reportes</RouterLink
      >
    </div>

    <template v-else>
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 animate-fade-up"
      >
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-10 h-10 rounded-xl bg-rose-900/30 border border-rose-900/30 flex items-center justify-center text-rose-300 font-display text-lg font-bold"
            >
              {{ report.platform?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h1 class="page-title !text-2xl">{{ report.platform }}</h1>
              <p class="text-blush-500 text-xs font-mono">{{ report.mail }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-wrap mt-1">
            <span :class="statusBadge(report.status)">
              <span
                class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"
              ></span>
              {{ statusLabel(report.status) }}
            </span>
            <span class="text-blush-600 text-xs">
              {{
                report.platform_type === "profile"
                  ? "👥 Perfiles compartidos"
                  : "👤 Cuenta individual"
              }}
            </span>
            <span class="text-blush-700 text-xs"
              >· {{ formatDate(report.createdAt) }}</span
            >
          </div>
        </div>

        <!-- Admin actions -->
        <div v-if="authStore.isAdmin" class="flex gap-2 flex-wrap items-start">
          <select
            v-if="report.status !== 'resolved'"
            :value="report.status"
            @change="handleStatusChange($event.target.value)"
            class="input-field text-xs py-2 cursor-pointer"
            style="min-width: 140px"
          >
            <option value="pending">⏳ Pendiente</option>
            <option value="in_progress">🔄 En proceso</option>
          </select>

          <button
            v-if="report.status !== 'resolved'"
            @click="showResolveModal = true"
            class="btn-primary text-xs"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Resolver
          </button>

          <button
            v-if="report.status === 'resolved'"
            @click="showEditModal = true"
            class="btn-secondary text-xs"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar resolución
          </button>

          <button @click="showDeleteConfirm = true" class="btn-danger text-xs">
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid lg:grid-cols-3 gap-5">
        <!-- Left col -->
        <div class="lg:col-span-2 space-y-5">
          <!-- Description -->
          <div
            class="glass-card p-5 animate-fade-up animate-delay-100 opacity-0-init"
          >
            <h2 class="font-display text-base font-bold text-blush-100 mb-3">
              Descripción del problema
            </h2>
            <p
              class="text-blush-300 text-sm leading-relaxed whitespace-pre-line"
            >
              {{ report.description }}
            </p>
          </div>

          <!-- Evidence images -->
          <div
            class="glass-card p-5 animate-fade-up animate-delay-200 opacity-0-init"
          >
            <h2 class="font-display text-base font-bold text-blush-100 mb-4">
              Evidencias
            </h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <p class="input-label mb-2">🔴 Evidencia de la falla</p>
                <div
                  class="rounded-xl overflow-hidden border border-rose-900/30 bg-dark-950/40 cursor-pointer group relative"
                  @click="
                    lightbox = {
                      open: true,
                      src: evidenceUrl(report.fail_evidence),
                    }
                  "
                >
                  <img
                    :src="evidenceUrl(report.fail_evidence)"
                    alt="Evidencia de falla"
                    class="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                    @error="$event.target.src = placeholderImg"
                  />
                  <div
                    class="absolute inset-0 bg-dark-950/0 group-hover:bg-dark-950/40 transition-colors flex items-center justify-center"
                  >
                    <svg
                      class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <p class="input-label mb-2">🟢 Evidencia de entrega</p>
                <div
                  class="rounded-xl overflow-hidden border border-rose-900/30 bg-dark-950/40 cursor-pointer group relative"
                  @click="
                    lightbox = {
                      open: true,
                      src: evidenceUrl(report.delivery_evidence),
                    }
                  "
                >
                  <img
                    :src="evidenceUrl(report.delivery_evidence)"
                    alt="Evidencia de entrega"
                    class="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                    @error="$event.target.src = placeholderImg"
                  />
                  <div
                    class="absolute inset-0 bg-dark-950/0 group-hover:bg-dark-950/40 transition-colors flex items-center justify-center"
                  >
                    <svg
                      class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resolution card -->
          <Transition name="slide-up">
            <div
              v-if="report.status === 'resolved' && report.resolution?.text"
              class="glass-card p-5 border-emerald-900/40 animate-fade-up animate-delay-300 opacity-0-init"
            >
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-9 h-9 rounded-xl bg-emerald-900/30 border border-emerald-700/30 flex items-center justify-center shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 class="font-display text-base font-bold text-emerald-300">
                    Resolución
                  </h2>
                  <p class="text-emerald-700 text-xs">
                    {{ resolutionTypeLabel(report.resolution.type) }} ·
                    {{ report.resolution.resolvedBy?.name || "Admin" }} ·
                    {{ formatDate(report.resolution.resolvedAt) }}
                  </p>
                </div>
              </div>

              <p
                class="text-blush-300 text-sm leading-relaxed mb-4 whitespace-pre-line"
              >
                {{ report.resolution.text }}
              </p>

              <!-- Replacement data -->
              <div
                v-if="
                  report.resolution.type === 'replacement' &&
                  report.resolution.replaced_mail
                "
                class="rounded-xl bg-dark-950/50 border border-rose-900/30 p-4 space-y-2"
              >
                <p
                  class="text-blush-500 text-xs font-medium uppercase tracking-wider mb-2"
                >
                  Datos de reposición
                </p>
                <div class="flex items-center gap-2">
                  <span class="text-blush-600 text-xs w-24 shrink-0"
                    >Correo:</span
                  >
                  <code
                    class="text-rose-300 text-xs bg-rose-900/20 px-2 py-0.5 rounded font-mono break-all"
                  >
                    {{ report.resolution.replaced_mail }}
                  </code>
                </div>
                <div
                  v-if="report.resolution.replaced_password"
                  class="flex items-center gap-2"
                >
                  <span class="text-blush-600 text-xs w-24 shrink-0"
                    >Contraseña:</span
                  >
                  <code
                    class="text-rose-300 text-xs bg-rose-900/20 px-2 py-0.5 rounded font-mono"
                  >
                    {{
                      showReplacedPass
                        ? report.resolution.replaced_password
                        : "••••••••"
                    }}
                  </code>
                  <button
                    @click="showReplacedPass = !showReplacedPass"
                    class="text-blush-500 hover:text-blush-300 transition-colors"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        :d="
                          showReplacedPass
                            ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                            : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        "
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Resolution history -->
              <div v-if="report.resolution.history?.length" class="mt-4">
                <button
                  @click="showHistory = !showHistory"
                  class="text-blush-600 text-xs hover:text-blush-400 transition-colors flex items-center gap-1"
                >
                  <svg
                    class="w-3 h-3 transition-transform duration-200"
                    :class="showHistory ? 'rotate-90' : ''"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Historial de cambios ({{ report.resolution.history.length }})
                </button>
                <Transition name="slide-down">
                  <div v-if="showHistory" class="mt-3 space-y-2">
                    <div
                      v-for="(h, i) in report.resolution.history"
                      :key="i"
                      class="rounded-lg bg-dark-950/40 border border-rose-900/20 px-3 py-2.5"
                    >
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-blush-500 text-xs font-medium">{{
                          h.changedBy?.name || "Admin"
                        }}</span>
                        <span class="text-blush-700 text-xs">{{
                          formatDate(h.changedAt)
                        }}</span>
                      </div>
                      <p class="text-blush-400 text-xs leading-relaxed">
                        {{ h.text }}
                      </p>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Right col -->
        <div class="space-y-4">
          <div
            class="glass-card p-5 animate-fade-up animate-delay-100 opacity-0-init"
          >
            <h3 class="font-display text-sm font-bold text-blush-200 mb-4">
              Detalles
            </h3>
            <dl class="space-y-3 text-sm">
              <div>
                <dt class="input-label !mb-0.5">ID del reporte</dt>
                <dd class="text-blush-500 text-xs font-mono break-all">
                  {{ report._id }}
                </dd>
              </div>
              <div>
                <dt class="input-label !mb-0.5">Reportado por</dt>
                <dd class="text-blush-300">{{ report.user?.name || "—" }}</dd>
              </div>
              <div v-if="authStore.isAdmin && report.user?.email">
                <dt class="input-label !mb-0.5">Correo del usuario</dt>
                <dd class="text-blush-400 text-xs font-mono">
                  {{ report.user.email }}
                </dd>
              </div>
              <div class="divider"></div>
              <div>
                <dt class="input-label !mb-0.5">Plataforma</dt>
                <dd class="text-blush-300">{{ report.platform }}</dd>
              </div>
              <div>
                <dt class="input-label !mb-0.5">Correo afectado</dt>
                <dd class="text-blush-400 text-xs font-mono break-all">
                  {{ report.mail }}
                </dd>
              </div>
              <div v-if="report.password && authStore.isAdmin">
                <dt class="input-label !mb-0.5">Contraseña</dt>
                <dd class="flex items-center gap-2">
                  <code class="text-blush-400 text-xs font-mono">{{
                    showPass ? report.password : "••••••••"
                  }}</code>
                  <button
                    @click="showPass = !showPass"
                    class="text-blush-600 hover:text-blush-400 transition-colors"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </dd>
              </div>
              <div>
                <dt class="input-label !mb-0.5">Fecha de entrega</dt>
                <dd class="text-blush-300">
                  {{ formatDate(report.delivery_date) }}
                </dd>
              </div>
              <div>
                <dt class="input-label !mb-0.5">Fecha del reporte</dt>
                <dd class="text-blush-300">
                  {{ formatDate(report.createdAt) }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Status timeline -->
          <div
            class="glass-card p-5 animate-fade-up animate-delay-200 opacity-0-init"
          >
            <h3 class="font-display text-sm font-bold text-blush-200 mb-4">
              Progreso
            </h3>
            <div class="relative">
              <div
                class="absolute left-3.5 top-3 bottom-3 w-px bg-rose-900/30"
              ></div>
              <div class="space-y-4">
                <div
                  v-for="step in statusSteps"
                  :key="step.status"
                  class="flex items-start gap-3 relative"
                >
                  <div
                    :class="[
                      'w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all duration-300',
                      isCompleted(step.status)
                        ? 'bg-emerald-600 border-emerald-500'
                        : isActive(step.status)
                          ? 'bg-rose-600 border-rose-500 shadow-rose animate-pulse-rose'
                          : 'bg-dark-900 border-rose-900/40',
                    ]"
                  >
                    <svg
                      v-if="isCompleted(step.status)"
                      class="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <div
                      v-else-if="isActive(step.status)"
                      class="w-2 h-2 rounded-full bg-white"
                    ></div>
                  </div>
                  <div class="pt-0.5">
                    <p
                      :class="[
                        'text-sm font-medium',
                        isActive(step.status)
                          ? 'text-rose-300'
                          : isCompleted(step.status)
                            ? 'text-emerald-400'
                            : 'text-blush-600',
                      ]"
                    >
                      {{ step.label }}
                    </p>
                    <p class="text-blush-700 text-xs">{{ step.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="lightbox.open"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-dark-950/90 backdrop-blur-sm"
          @click="lightbox.open = false"
        >
          <img
            :src="lightbox.src"
            class="max-w-full max-h-full rounded-2xl object-contain"
            style="max-height: 90vh"
            @click.stop
          />
          <button
            @click="lightbox.open = false"
            class="absolute top-4 right-4 btn-icon"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- Modals -->
    <ResolveModal
      v-model="showResolveModal"
      :report="report"
      :is-editing="false"
      @resolved="handleResolved"
    />
    <ResolveModal
      v-model="showEditModal"
      :report="report"
      :is-editing="true"
      @resolved="handleResolved"
    />
    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="Eliminar reporte"
      message="Se eliminarán el reporte y sus imágenes permanentemente. Esta acción no se puede deshacer."
      confirm-label="Sí, eliminar"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";

import { useAuthStore } from "../../store/auth";
import { useReportsStore } from "../../store/reports";
import { useToastStore } from "../../store/toast";

import ResolveModal from "../../components/reports/ResolvModal.vue";
import ConfirmDialog from "../../components/ui/ConfirmDialog.vue";

/*
|--------------------------------------------------------------------------
| STORES
|--------------------------------------------------------------------------
*/

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const reportsStore = useReportsStore();
const toast = useToastStore();

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const loading = ref(true);

const report = ref(null);

const showResolveModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);

const showPass = ref(false);
const showReplacedPass = ref(false);
const showHistory = ref(false);

var lightbox = reactive({
  open: false,
  src: "",
});

/*
|--------------------------------------------------------------------------
| PLACEHOLDER
|--------------------------------------------------------------------------
*/

const placeholderImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='176'%3E%3Crect width='400' height='176' fill='%234e0520'/%3E%3Ctext x='50%25' y='50%25' fill='%23c3adb9' font-size='13' text-anchor='middle' dominant-baseline='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

/*
|--------------------------------------------------------------------------
| STATUS
|--------------------------------------------------------------------------
*/

const statusOrder = {
  pending: 0,
  in_progress: 1,
  resolved: 2,
};

const statusSteps = [
  {
    status: "pending",
    label: "Pendiente",
    desc: "Esperando revisión",
  },

  {
    status: "in_progress",
    label: "En proceso",
    desc: "Siendo atendido",
  },

  {
    status: "resolved",
    label: "Resuelto",
    desc: "Solución aplicada",
  },
];

const isActive = (status) => {
  return report.value?.status === status;
};

const isCompleted = (status) => {
  if (!report.value?.status) return false;

  return statusOrder[status] < statusOrder[report.value.status];
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const statusBadge = (status) =>
  ({
    pending: "badge-pending",
    in_progress: "badge-progress",
    resolved: "badge-resolved",
  })[status] || "badge-pending";

const statusLabel = (status) =>
  ({
    pending: "Pendiente",
    in_progress: "En proceso",
    resolved: "Resuelto",
  })[status] || status;

const resolutionTypeLabel = (type) =>
  ({
    replacement: "🔄 Reposición",
    fix: "🔧 Corrección",
    refund: "💰 Reembolso",
    no_fault: "✅ Sin falla detectada",
    other: "📝 Otro",
  })[type] || type;

/*
|--------------------------------------------------------------------------
| URLS
|--------------------------------------------------------------------------
*/

const API_URL = "http://localhost:3000";

function evidenceUrl(filename) {
  if (!filename) return placeholderImg;

  if (filename.startsWith("http")) {
    return filename;
  }

  return `${API_URL}/api/${filename}`;
}

/*
|--------------------------------------------------------------------------
| DATE
|--------------------------------------------------------------------------
*/

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/*
|--------------------------------------------------------------------------
| ACTIONS
|--------------------------------------------------------------------------
*/

async function handleStatusChange(status) {
  try {
    const result = await reportsStore.updateReport(report.value._id, {
      status,
    });

    if (result.success) {
      report.value.status = status;

      toast.success("Estado actualizado.");
    } else {
      toast.error(result.message);
    }
  } catch (error) {
    toast.error("No se pudo actualizar el estado.");
  }
}

function handleResolved(updatedReport) {
  if (updatedReport) {
    report.value = updatedReport;
  }
}

async function handleDelete() {
  const result = await reportsStore.deleteReport(report.value._id);

  if (result.success) {
    toast.success("Reporte eliminado.");

    router.push("/reports");
  } else {
    toast.error(result.message);
  }
}

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  loading.value = true;

  try {
    const data = await reportsStore.fetchReport(route.params.id);

    report.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
