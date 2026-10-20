<template>
  <div class="space-y-4 sm:space-y-5">

    <!-- Hero -->
    <div class="relative rounded-2xl overflow-hidden border h-64 sm:h-72 lg:h-80" :style="{ borderColor: 'var(--border-color)', backgroundImage: 'url(' + dashboardBg + ')', backgroundSize: 'cover', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }">
      <div class="absolute inset-0 bg-gradient-to-r from-[#0c0a0d]/60 via-transparent to-transparent" />
      <div class="relative p-5 sm:p-7 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 hero-content">
        <div class="flex-1 min-w-0">
          <h1 class="text-3xl sm:text-5xl font-display font-bold tracking-tight leading-none">¡Hola, {{ firstName }}! <span class="text-yellow-400">✨</span></h1>
        </div>
        <div class="shrink-0 rounded-xl border px-3 sm:px-4 py-2 sm:py-3 text-center sm:text-left hero-date" :style="{ borderColor: 'var(--border-color)', background: 'rgba(255,255,255,0.05)' }">
          <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Hoy</p>
          <p class="text-sm sm:text-base font-semibold" style="color: var(--text-primary);">{{ todayLabel }}</p>
          <p class="text-[10px] sm:text-xs mt-0.5" style="color: var(--rose-primary);">Que tengas un gran día 💗</p>
        </div>
      </div>
    </div>

    <!-- KPI -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      <StatWaveCard
        v-for="stat in stats" :key="stat.key" :stat="stat" :loading="loading"
        :class="{ 'col-span-2 lg:col-span-1': stat.key === 'resolved' }"
      />
    </div>

    <!-- ==================== ADMIN ==================== -->
    <template v-if="authStore.isAdmin">
    <!-- Grid principal -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

      <!-- Izquierda: plataformas + actividad -->
      <div class="lg:col-span-8 flex flex-col gap-4 sm:gap-5">

        <div class="card animate-fade-in">
          <div class="p-4 sm:p-5 border-b flex items-center justify-between gap-2" :style="{ borderColor: 'var(--border-color)' }">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style="color: var(--rose-primary);">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/></svg>
                Reportes por plataforma
              </span>
            </div>
            <div class="flex items-center gap-2">
              <select v-model="periodFilter" class="bg-transparent border-none text-xs sm:text-sm font-medium cursor-pointer px-2" style="color: var(--text-secondary);">
                <option>Este mes</option>
                <option>Últimos 30 días</option>
                <option>Este año</option>
              </select>
              <select class="bg-transparent border-none text-xs sm:text-sm font-medium cursor-pointer pl-1" style="color: var(--text-secondary);">
                <option>Todos</option>
              </select>
            </div>
          </div>

          <div v-if="loading" class="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="i in 4" :key="i" class="skeleton h-32 rounded-xl"></div>
          </div>

          <div v-else class="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div v-for="p in platformCards" :key="p.key" class="rounded-xl border p-3 sm:p-4 relative overflow-hidden" :style="{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }">
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />
              <div class="relative z-10 flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                     :style="{ background: p.color + '1a' }">
                  <Icon :icon="p.icon" class="w-5 h-5 sm:w-6 sm:h-6" :style="{ color: p.color }" />
                </div>
                <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 z-10"
                      :style="{ background: p.color + '14', color: p.color }">{{ p.share }}%</span>
              </div>
              <div class="relative z-10">
                <p class="text-2xl sm:text-3xl font-display font-bold leading-none tabular-nums" style="color: var(--text-primary);">{{ p.count }}</p>
                <p class="text-xs mt-1 sm:mt-1.5 mb-1 sm:mb-2 truncate" style="color: var(--text-muted);">{{ p.label }}</p>
                <div class="h-1.5 sm:h-2 rounded-full overflow-hidden mb-1.5 sm:mb-2" style="background: var(--bg-surface);">
                  <div class="h-full rounded-full transition-all duration-700" :style="{ width: p.pct + '%', background: p.color }"></div>
                </div>
                <div class="flex items-center gap-1" style="color: var(--text-muted);">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3a1 1 0 10-2 0v12a1 1 0 10-2 0V5a1 1 0 10-2 0v12a1 1 0 10-2 0v1a1 1 0 102 0V5a1 1 0 112 0v12a1 1 0 112 0V3a1 1 0 012-0z"/>
                  </svg>
                  <span class="text-[10px] font-medium">{{ p.trendLabel }}</span>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 h-[2px] z-0" :style="{ background: p.color + '22' }">
                <div class="h-full" :style="{ width: p.pct + '%', background: p.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actividad reciente -->
        <div class="card animate-fade-in flex-1">
          <div class="p-4 sm:p-5 border-b flex items-center justify-between gap-2" :style="{ borderColor: 'var(--border-color)' }">
            <h2 class="text-base sm:text-lg font-semibold">Actividad reciente</h2>
            <RouterLink to="/app/reports" class="text-xs font-medium no-underline transition-colors" style="color: var(--rose-primary);">
              Ver todos &rarr;
            </RouterLink>
          </div>

          <div v-if="loading" class="p-4 sm:p-5 space-y-2">
            <div v-for="i in 5" :key="i" class="flex items-center gap-3">
              <div class="skeleton w-10 h-10 rounded-xl shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="skeleton h-4 w-40 rounded"></div>
                <div class="skeleton h-3 w-32 rounded"></div>
              </div>
            </div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">#</th>
                  <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Plataforma</th>
                  <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Usuario</th>
                  <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Tipo</th>
                  <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Estatus</th>
                  <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-right" style="color: var(--text-muted);">Fecha</th>
                </tr>
              </thead>
              <tbody class="divide-y" :style="{ borderColor: 'var(--border-color)' }">
                <tr v-for="r in recentReports" :key="r._id" class="hover:bg-[var(--bg-surface)] transition-colors">
                  <td class="px-4 py-3 text-xs font-medium" style="color: var(--text-muted);">{{ '#' + (r._id?.slice(-4) || '-') }}</td>
                  <td class="px-4 py-3 flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" :style="{ background: (r.platformColor || '#888888') + '1a' }">
                      <Icon :icon="r.platformIcon || 'mdi:application'" class="w-3 h-3" :style="{ color: r.platformColor || '#888888' }" />
                    </div>
                    <span class="text-sm font-medium truncate" style="color: var(--text-secondary);">{{ r.platform }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm" style="color: var(--text-secondary);">{{ r.userName }}</td>
                  <td class="px-4 py-3 text-sm" style="color: var(--text-muted);">{{ r.type }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold" :style="statusStyle(r.status)">
                      <span class="w-1.5 h-1.5 rounded-full" :style="{ background: statusDotColor(r.status) }" />
                      {{ statusLabel(r.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs text-right" style="color: var(--text-muted);">{{ formatDate(r.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Derecha: destacados + resumen rápido -->
      <div class="lg:col-span-4 flex flex-col gap-4 sm:gap-5">

        <div class="card animate-fade-in">
          <div class="p-4 sm:p-5 border-b" :style="{ borderColor: 'var(--border-color)' }">
            <h2 class="text-base sm:text-lg font-semibold">Destacados</h2>
          </div>
          <div class="p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div class="rounded-xl p-4 sm:p-5 border" :style="{ background: 'linear-gradient(135deg, var(--rose-lighter), var(--rose-light))', borderColor: 'var(--rose-light)' }">
              <div class="flex items-center justify-between gap-2 mb-3">
                <p class="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5" style="color: var(--rose-primary);">
                  <Trophy class="w-3.5 h-3.5" />
                  Plataforma con más reportes
                </p>
                <span v-if="topPlatform" class="badge" style="background: var(--bg-card); color: var(--rose-primary);">{{ topPlatform.count }}</span>
              </div>
              <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" :style="{ background: topPlatform.color + '26' }">
                  <Icon :icon="topPlatform.icon" class="w-6 h-6 sm:w-7 sm:h-7" :style="{ color: topPlatform.color }" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm sm:text-base font-semibold truncate" style="color: var(--text-primary);">{{ topPlatform.name }}</p>
                  <p class="text-xs" style="color: var(--text-muted);">reportes registrados</p>
                </div>
              </div>
            </div>
            <div class="rounded-xl p-4 sm:p-5 border" style="background: var(--bg-card); border-color: var(--border-color);">
              <div class="flex items-center justify-between gap-2 mb-3">
                <p class="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5" style="color: var(--info);">
                  <Users class="w-3.5 h-3.5" />
                  Usuario con más reportes
                </p>
                <span v-if="topUser" class="badge" style="background: var(--bg-card); color: var(--info);">{{ topUser.count }}</span>
              </div>
              <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold" style="background: var(--bg-card); color: var(--info); border: 1px solid var(--border-color);">
                  {{ topUser?.name?.charAt(0)?.toUpperCase() || '?' }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm sm:text-base font-semibold truncate" style="color: var(--text-primary);">{{ topUser?.name || '—' }}</p>
                  <p class="text-xs" style="color: var(--text-muted);">reportes enviados</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen rápido (sin "Nuevo reporte" - el admin no crea reportes) -->
        <div class="card animate-fade-in">
          <div class="p-4 sm:p-5 border-b" :style="{ borderColor: 'var(--border-color)' }">
            <h2 class="text-base sm:text-lg font-semibold">Resumen rápido</h2>
          </div>
          <div class="p-4 sm:p-5 grid grid-cols-2 gap-2.5 sm:gap-3">
            <QuickAction to="/app/reports" label="Ver reportes" subtitle="Ir a la lista" icon="mdi:format-list-bulleted" color="blue" />
            <QuickAction to="/app/admin" label="Gestionar usuarios" subtitle="Administrar" icon="mdi:account-group" color="amber" />
            <QuickAction to="/app/stats" label="Estadísticas" subtitle="Ver análisis" icon="mdi:chart-bar" color="rose" />
            <QuickAction to="/app/admin/platforms" label="Plataformas" subtitle="Ver catálogo" icon="mdi:view-grid" color="emerald" />
          </div>
        </div>

      </div>
    </div>
    </template>

    <!-- ==================== USUARIO ==================== -->
    <template v-else>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

      <!-- Izquierda: mis reportes recientes -->
      <div class="lg:col-span-8 flex flex-col gap-4 sm:gap-5">
        <div class="card animate-fade-in flex-1">
          <div class="p-4 sm:p-5 border-b flex items-center justify-between gap-2" :style="{ borderColor: 'var(--border-color)' }">
            <h2 class="text-base sm:text-lg font-semibold">Mis reportes recientes</h2>
            <RouterLink to="/app/reports" class="text-xs font-medium no-underline transition-colors" style="color: var(--rose-primary);">
              Ver todos &rarr;
            </RouterLink>
          </div>

          <div v-if="loading" class="p-4 sm:p-5 space-y-2">
            <div v-for="i in 5" :key="i" class="flex items-center gap-3">
              <div class="skeleton w-10 h-10 rounded-xl shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="skeleton h-4 w-40 rounded"></div>
                <div class="skeleton h-3 w-32 rounded"></div>
              </div>
            </div>
          </div>

          <div v-else-if="recentReports.length === 0" class="p-8 sm:p-10 text-center">
            <div class="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center" style="background: var(--rose-lighter);">
              <Icon icon="mdi:file-document-outline" class="w-7 h-7" style="color: var(--rose-primary);" />
            </div>
            <p class="text-sm font-semibold mb-1" style="color: var(--text-primary);">Aún no tienes reportes</p>
            <p class="text-xs" style="color: var(--text-muted);">Cuando envíes un reporte aparecerá aquí.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">#</th>
                  <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Plataforma</th>
                  <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Tipo</th>
                  <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-muted);">Estatus</th>
                  <th class="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-right" style="color: var(--text-muted);">Fecha</th>
                </tr>
              </thead>
              <tbody class="divide-y" :style="{ borderColor: 'var(--border-color)' }">
                <tr v-for="r in recentReports" :key="r._id" class="hover:bg-[var(--bg-surface)] transition-colors cursor-pointer" @click="router.push('/app/reports/' + r._id)">
                  <td class="px-4 py-3 text-xs font-medium" style="color: var(--text-muted);">{{ '#' + (r._id?.slice(-4) || '-') }}</td>
                  <td class="px-4 py-3 flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" :style="{ background: (r.platformColor || '#888888') + '1a' }">
                      <Icon :icon="r.platformIcon || 'mdi:application'" class="w-3 h-3" :style="{ color: r.platformColor || '#888888' }" />
                    </div>
                    <span class="text-sm font-medium truncate" style="color: var(--text-secondary);">{{ r.platform }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm" style="color: var(--text-muted);">{{ r.type }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold" :style="statusStyle(r.status)">
                      <span class="w-1.5 h-1.5 rounded-full" :style="{ background: statusDotColor(r.status) }" />
                      {{ statusLabel(r.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs text-right" style="color: var(--text-muted);">{{ formatDate(r.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Derecha: reportar + saldo -->
      <div class="lg:col-span-4 flex flex-col gap-4 sm:gap-5">

        <!-- CTA reportar -->
        <div class="card animate-fade-in">
          <div class="p-4 sm:p-5 border-b" :style="{ borderColor: 'var(--border-color)' }">
            <h2 class="text-base sm:text-lg font-semibold">¿Necesitas reportar?</h2>
          </div>
          <div class="p-4 sm:p-5 space-y-3">
            <p class="text-xs" style="color: var(--text-muted);">Si tienes un problema con alguna plataforma, envía un reporte y te ayudamos lo antes posible.</p>
            <RouterLink to="/app/reports/new" class="btn-primary w-full flex items-center justify-center gap-2 no-underline text-sm">
              <Icon icon="mdi:plus-circle-outline" class="w-4 h-4" />
              Crear reporte
            </RouterLink>
          </div>
        </div>

        <!-- Mi saldo -->
        <div class="card animate-fade-in">
          <div class="p-4 sm:p-5 border-b" :style="{ borderColor: 'var(--border-color)' }">
            <h2 class="text-base sm:text-lg font-semibold">Mi saldo</h2>
          </div>
          <div class="p-4 sm:p-5">
            <div class="rounded-xl p-4 sm:p-5 border" :style="{ background: 'linear-gradient(135deg, var(--rose-lighter), var(--rose-light))', borderColor: 'var(--rose-light)' }">
              <div class="flex items-center justify-between gap-2 mb-3">
                <p class="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5" style="color: var(--rose-primary);">
                  <Icon icon="mdi:wallet-outline" class="w-3.5 h-3.5" />
                  Crédito disponible
                </p>
              </div>
              <p class="text-3xl sm:text-4xl font-display font-bold leading-none tabular-nums" style="color: var(--text-primary);">${{ authStore.balance?.toFixed?.(2) || '0.00' }}</p>
              <p class="text-xs mt-2" style="color: var(--text-muted);">Se acredita cuando tu reporte se resuelve con crédito.</p>
            </div>
            <RouterLink to="/app/balance" class="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium no-underline transition-colors" style="color: var(--rose-primary);">
              Ver historial de saldo &rarr;
            </RouterLink>
          </div>
        </div>

      </div>
    </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { Trophy, Users } from '@lucide/vue'
import { useAuthStore } from '../../store/auth'
import { useReportsStore } from '../../store/reports'
import { getPlatformIconId, getPlatformColor } from '../../utils/platformIcons'
import { toDateKey } from '../../utils/dates'
import StatWaveCard from '../../components/ui/StatWaveCard.vue'
import QuickAction from '../../components/ui/QuickAction.vue'
import dashboardBgImage from '../../assets/dashboard-bg.png'

const authStore = useAuthStore()
const reportsStore = useReportsStore()
const router = useRouter()
const loading = ref(true)
const allReports = ref([])
const periodFilter = ref('Este mes')

const dashboardBg = dashboardBgImage

const firstName = computed(() => {
  const name = (authStore.user?.name || authStore.user?.username || '').split(' ')[0]
  return name || 'Nami'
})

const todayLabel = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const MONTH_LABELS = {
  january: 'enero', february: 'febrero', march: 'marzo', april: 'abril',
  may: 'mayo', june: 'junio', july: 'julio', august: 'agosto',
  september: 'septiembre', october: 'octubre', november: 'noviembre', december: 'diciembre'
}

const PLATFORM_KEYS = [
  { key: 'netflix', label: 'Netflix', match: 'netflix' },
  { key: 'disney', label: 'Disney', match: 'disney' },
  { key: 'prime', label: 'Prime Video', match: 'prime' },
  { key: 'spotify', label: 'Spotify', match: 'spotify' },
]

const statusStyle = (status) => {
  const base = 'px-2 py-0.5 rounded-md text-[10px] font-semibold'
  const map = {
    pending: { bg: 'var(--warning-bg)', color: 'var(--warning)', dot: 'var(--warning)' },
    in_progress: { bg: 'var(--info-bg)', color: 'var(--info)', dot: 'var(--info)' },
    resolved: { bg: 'var(--success-bg)', color: 'var(--success)', dot: 'var(--success)' },
  }
  const m = map[status] || map.pending
  return { background: m.bg, color: m.color }
}

const statusDotColor = (status) => {
  const map = { pending: 'var(--warning)', in_progress: 'var(--info)', resolved: 'var(--success)' }
  return map[status] || 'var(--warning)'
}

const statusLabel = (status) => {
  const map = { pending: 'Pendiente', in_progress: 'En proceso', resolved: 'Resuelto' }
  return map[status] || 'Pendiente'
}

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const monthKey = (iso) => {
  const d = new Date(iso)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
}

const now = () => new Date()
const startOfMonth = () => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d }
const startOfLastMonth = () => { const d = new Date(); d.setMonth(d.getMonth() - 1); d.setDate(1); d.setHours(0,0,0,0); return d }
const endOfLastMonth = () => { const d = new Date(); d.setDate(0); d.setHours(23,59,59,999); return d }

const platformCounts = computed(() => {
  const rows = PLATFORM_KEYS.map(p => ({
    ...p,
    count: allReports.value.filter(r => (r.platform || '').toLowerCase().includes(p.match)).length,
    icon: getPlatformIconId(p.key),
    color: getPlatformColor(p.key),
  }))
  const max = Math.max(1, ...rows.map(r => r.count))
  const total = allReports.value.length || 1
  return rows.map(r => ({ ...r, pct: Math.round((r.count / max) * 100), share: Math.round((r.count / total) * 100) }))
})

const topPlatform = computed(() => {
  const rows = platformCounts.value.slice().sort((a, b) => b.count - a.count)
  return rows[0] || null
})

const topUser = computed(() => {
  const map = new Map()
  for (const r of allReports.value) {
    if (!r.user) continue
    const id = r.user._id || r.user.username
    const entry = map.get(id) || { name: r.user.name || r.user.username || 'Usuario', count: 0 }
    entry.count++
    map.set(id, entry)
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count)[0] || null
})

const recentReports = computed(() => {
  return allReports.value
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(r => ({
      ...r,
      platformIcon: getPlatformIconId(r.platform),
      platformColor: getPlatformColor(r.platform),
      userName: (r.user && (r.user.name || r.user.username)) || '—',
      type: r.is_batch ? 'Lote' : 'Reporte',
    }))
})

const stats = computed(() => {
  const start = startOfMonth()
  const monthReports = allReports.value.filter(r => new Date(r.createdAt) >= start)
  const total = monthReports.length
  const pending = monthReports.filter(r => r.status === 'pending').length
  const inProgress = monthReports.filter(r => r.status === 'in_progress').length
  const resolved = monthReports.filter(r => r.status === 'resolved').length
  const overdue = allReports.value.filter(r => {
    if (r.status === 'resolved') return false
    const created = new Date(r.createdAt)
    return !isNaN(created.getTime()) && (Date.now() - created.getTime()) > 4 * 24 * 60 * 60 * 1000
  }).length
  const unresolved = allReports.value.filter(r => r.status !== 'resolved').length
  const pctOf = (n, base) => (base > 0 ? (n / base) * 100 : 0)

  const totalLastMonth = allReports.value.filter(r => {
    const d = new Date(r.createdAt)
    return d >= startOfLastMonth() && d <= endOfLastMonth()
  }).length

  const monthName = new Date().toLocaleDateString('es-ES', { month: 'long' })
  return [
    { key: 'total', label: `Total de reportes (${monthName})`, value: total, sub: `${total - totalLastMonth} vs. mes pasado`, trend: totalLastMonth > 0 ? Math.round(((total - totalLastMonth) / totalLastMonth) * 100) : 0, trendUp: total >= totalLastMonth, icon: 'list', color: 'rose', pct: 100 },
    { key: 'overdue', label: 'Atrasados', value: overdue, sub: '+4 días sin resolver', trend: 0, trendUp: false, icon: 'alert', color: 'red', pct: pctOf(overdue, unresolved) },
    { key: 'pending', label: 'Pendientes', value: pending, sub: 'Este mes', trend: 0, trendUp: true, icon: 'clock', color: 'amber', pct: pctOf(pending, total) },
    { key: 'in_progress', label: 'En proceso', value: inProgress, sub: 'Este mes', trend: 0, trendUp: false, icon: 'refresh', color: 'blue', pct: pctOf(inProgress, total) },
    { key: 'resolved', label: 'Resueltos', value: resolved, sub: `Este mes`, trend: 0, trendUp: true, icon: 'check', color: 'emerald', pct: pctOf(resolved, total) },
  ]
})

const platformCards = computed(() => {
  const days = 14
  const today = new Date()
  today.setHours(0,0,0,0)
  const dayKeys = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i)
    dayKeys.push(d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'))
  }

  const byPlatformDay = {}
  for (const r of allReports.value) {
    const pKey = PLATFORM_KEYS.find(p => (r.platform || '').toLowerCase().includes(p.match))?.key
    if (!pKey) continue
    const day = toDateKey(new Date(r.createdAt))
    if (!byPlatformDay[pKey]) byPlatformDay[pKey] = {}
    byPlatformDay[pKey][day] = (byPlatformDay[pKey][day] || 0) + 1
  }

  const nowMonth = monthKey(now())
  const lastMonthKey = startOfLastMonth().getFullYear() + '-' + String(startOfLastMonth().getMonth() + 1).padStart(2,'0')
  const curMonthCount = {}, lastMonthCount = {}
  for (const r of allReports.value) {
    const pKey = PLATFORM_KEYS.find(p => (r.platform || '').toLowerCase().includes(p.match))?.key
    if (!pKey) continue
    const mk = monthKey(r.createdAt)
    if (mk === nowMonth) curMonthCount[pKey] = (curMonthCount[pKey] || 0) + 1
    if (mk === lastMonthKey) lastMonthCount[pKey] = (lastMonthCount[pKey] || 0) + 1
  }

  return platformCounts.value.map(p => {
    const sparkline = dayKeys.map(k => byPlatformDay[p.key]?.[k] || 0)
    const cur = curMonthCount[p.key] || 0
    const prev = lastMonthCount[p.key] || 0
    const pctChange = prev > 0 ? Math.round(((cur - prev) / prev) * 100) : (cur > 0 ? 100 : 0)
    return {
      ...p,
      sparkline,
      trendLabel: (pctChange >= 0 ? '↑ ' : '↓ ') + Math.abs(pctChange) + '% vs. mes anterior',
      trendUp: pctChange >= 0,
    }
  })
})

onMounted(async () => {
  loading.value = true
  try {
    if (authStore.isAdmin) {
      await reportsStore.fetchReports({})
    } else {
      await reportsStore.fetchMyReports({})
    }
    allReports.value = reportsStore.reports || []
  } catch {
    allReports.value = []
  }
  loading.value = false
})
</script>

<style scoped>
:not(.dark) .hero-content * {
  color: #ffffff !important;
}
</style>

<style scoped>
.StatWaveCard {}
</style>