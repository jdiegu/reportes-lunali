<template>
  <div class="unavailable-page min-h-screen flex flex-col relative overflow-hidden">

    <div class="bg-orbs pointer-events-none" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="grid-dots pointer-events-none" aria-hidden="true"></div>

    <header class="relative z-10 border-b shrink-0 header-glass" :style="{ borderColor: 'var(--border-color)' }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14 sm:h-16">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 ring-2 header-logo-ring">
              <img src="/icon.png" alt="Lunali" class="w-full h-full object-cover" />
            </div>
            <span class="font-display text-lg sm:text-xl font-bold" style="color: var(--text-primary);">Lunali</span>
          </div>
          <div class="flex items-center gap-2">
            <button @click="toggleTheme" class="icon-btn" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
              <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>
            <button @click="logout" class="logout-pill">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span class="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
      <div class="w-full max-w-md animate-entrance">

        <div class="unavailable-card p-6 sm:p-8 text-center">
          <div class="status-badge">
            <div class="status-dot"></div>
            <span class="status-text">Servicio temporalmente en pausa</span>
          </div>

          <div class="logo-container mx-auto my-6 sm:my-7">
            <div class="logo-ring">
              <div class="logo-inner">
                <img src="/icon.png" alt="Lunali" class="logo-img" />
              </div>
            </div>
            <div class="logo-glow"></div>
            <div class="logo-ring-outer"></div>
          </div>

          <h1 class="unavailable-title text-2xl sm:text-[1.75rem]">
            <span class="gradient-text">Reportes en pausa</span>
          </h1>

          <p class="unavailable-subtitle text-sm sm:text-[15px] mt-2.5 mb-6">
            El sistema de reportes no se encuentra disponible en este momento.
            {{ reopenText }}
          </p>

          <div v-if="closureReason" class="reason-card">
            <div class="reason-card-inner">
              <div class="reason-icon">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="text-left">
                <p class="reason-label">Motivo del cierre</p>
                <p class="reason-text">{{ closureReason }}</p>
              </div>
            </div>
          </div>

          <div v-if="reopenText && closureMode === 'scheduled'" class="schedule-note">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Reapertura automática del servicio.</span>
          </div>

          <a :href="whatsappGroupLink" target="_blank" rel="noopener" class="group-cta">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Ir al grupo de WhatsApp
          </a>

          <p class="help-line">¿Necesitas informacion o ayuda? Escríbenos al grupo.</p>
        </div>

        <p class="text-center text-xs mt-4" style="color: var(--text-muted);">
          El administrador cerró temporalmente el sistema de reportes.
        </p>
      </div>
    </main>

    <footer class="relative z-10 border-t shrink-0 header-glass" :style="{ borderColor: 'var(--border-color)' }">
      <div class="max-w-5xl mx-auto px-5 py-3.5 sm:py-4">
        <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <div class="flex items-center gap-2">
            <img src="/icon.png" alt="Lunali" class="w-5 h-5 rounded object-cover" style="border-radius: 0.25rem" />
            <span class="text-[13px] font-bold tracking-tight footer-brand">Lunali Studio</span>
          </div>
          <div class="w-px h-4" :style="{ background: 'var(--border-color)' }"></div>
          <span class="text-xs footer-dot">Sistema de reportes</span>
          <span class="opacity-40">·</span>
          <span class="text-xs footer-year">© {{ new Date().getFullYear() }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { useAuthStore } from '../store/auth'
import { useSiteSettingsStore } from '../store/siteSettings'
import { WHATSAPP_GROUP } from '../config/constants'

const router = useRouter()
const { isDark, toggleTheme } = useTheme()
const authStore = useAuthStore()
const siteSettingsStore = useSiteSettingsStore()

const closureReason = computed(() => siteSettingsStore.closureReason)
const closureMode = computed(() => siteSettingsStore.closureMode)
const scheduledOpenAt = computed(() => siteSettingsStore.scheduledOpenAt)
const recurringDays = computed(() => siteSettingsStore.recurringDays)

const whatsappGroupLink = WHATSAPP_GROUP || '#'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

function formatDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const date = d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
  const time = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  return `${date} a las ${time}`
}

const reopenText = computed(() => {
  if (closureMode.value === 'scheduled') {
    const formatted = formatDateTime(scheduledOpenAt.value)
    return formatted ? `Reapertura programada para ${formatted}.` : ''
  }
  if (closureMode.value === 'recurring' && recurringDays.value.length) {
    const days = recurringDays.value
      .map((i) => DAY_NAMES[i]?.toLowerCase())
      .filter(Boolean)
    return `Cerramos la recepción de reportes los ${days.join(', ')}.`
  }
  return 'Volveremos a recibir reportes pronto.'
})

function logout() {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  if (!siteSettingsStore.settings) {
    await siteSettingsStore.fetchStatus()
  }
})
</script>

<style scoped>
.unavailable-page {
  background: var(--bg-page);
}

.header-glass {
  background: rgba(var(--header-bg-rgb, 255, 255, 255), 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.dark .header-glass {
  background: rgba(12, 10, 13, 0.72);
}

.bg-orbs .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}
.orb-1 {
  width: 600px;
  height: 600px;
  top: -20%;
  right: -15%;
  background: var(--rose-primary);
  opacity: 0.06;
  animation: orb-drift 20s ease-in-out infinite alternate;
}
.orb-2 {
  width: 500px;
  height: 500px;
  bottom: -15%;
  left: -10%;
  background: var(--rose-primary);
  opacity: 0.04;
  animation: orb-drift 25s ease-in-out infinite alternate-reverse;
}
@keyframes orb-drift {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(30px, -20px);
  }
}

.grid-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--rose-primary) 0.7px, transparent 0.7px);
  background-size: 52px 52px;
  opacity: 0.03;
}

.animate-entrance {
  animation: entrance 0.6s cubic-bezier(0.21, 1.02, 0.73, 1) both;
}
@keyframes entrance {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.unavailable-card {
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  border-radius: 1.25rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  border: 1px solid rgba(196, 90, 122, 0.14);
  background: rgba(196, 90, 122, 0.05);
}
.status-badge .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--rose-primary);
  animation: dot-blink 2s ease-in-out infinite;
}
@keyframes dot-blink {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
.status-badge .status-text {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-muted);
}

.logo-container {
  position: relative;
  width: 82px;
  height: 82px;
}
@media (min-width: 640px) {
  .logo-container {
    width: 96px;
    height: 96px;
  }
}
.logo-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #e88aac, #d46a8a, #b84a6a);
  position: relative;
  z-index: 1;
}
.logo-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}
.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.logo-glow {
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(196, 90, 122, 0.15) 0%, transparent 70%);
  z-index: 0;
}
.logo-ring-outer {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(196, 90, 122, 0.1);
}

.unavailable-title {
  font-family: "Playfair Display", Georgia, serif;
  font-weight: 700;
  line-height: 1.2;
}
.gradient-text {
  background: linear-gradient(135deg, var(--rose-primary), #d46a8a, #e88aac);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.unavailable-subtitle {
  color: var(--text-muted);
  line-height: 1.65;
  letter-spacing: 0.01em;
}

.reason-card {
  text-align: left;
}
.reason-card-inner {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-radius: 0.875rem;
  border: 1px solid rgba(196, 90, 122, 0.14);
  background: rgba(196, 90, 122, 0.04);
}
.reason-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(196, 90, 122, 0.09);
  color: var(--rose-primary);
}
.reason-label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}
.reason-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.schedule-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.8125rem;
  padding: 0.375rem 0;
}

.group-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.875rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: var(--rose-gradient);
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(196, 90, 122, 0.3);
}
.group-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 26px rgba(196, 90, 122, 0.4);
}
.group-cta:active {
  transform: translateY(0);
}

.help-line {
  margin-top: 0.875rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.25s ease;
}
.icon-btn:hover {
  background: var(--bg-surface);
  border-color: var(--rose-light);
  color: var(--rose-primary);
}
.header-logo-ring {
  --tw-ring-color: var(--rose-primary);
}
.logout-pill {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.875rem;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.25s ease;
}
.logout-pill:hover {
  background: var(--error-bg);
  border-color: rgba(212, 74, 74, 0.3);
  color: var(--error);
}
.footer-brand {
  color: var(--rose-primary);
}
.footer-dot,
.footer-year {
  color: var(--text-muted);
}
</style>