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
      <div class="max-w-lg w-full text-center animate-entrance">

        <div class="logo-container mx-auto mb-8 sm:mb-10">
          <div class="logo-ring">
            <div class="logo-inner">
              <img src="/icon.png" alt="Lunali" class="logo-img" />
            </div>
          </div>
          <div class="logo-glow"></div>
          <div class="logo-ring-outer"></div>
        </div>

        <h1 class="unavailable-title text-3xl sm:text-4xl lg:text-5xl mb-4">
          <span class="gradient-text">Por el momento</span><br/>
          <span class="gradient-text-alt">no se reciben reportes</span>
        </h1>

        <p class="unavailable-subtitle text-sm sm:text-base mb-8">
          El sistema de reportes no se encuentra disponible en este momento.<br class="hidden sm:inline"/>
          Volveremos a recibir reportes pronto.
        </p>

        <div v-if="closureReason" class="reason-card mb-8">
          <div class="reason-card-inner">
            <div class="reason-icon">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="reason-label">Motivo</p>
              <p class="reason-text">{{ closureReason }}</p>
            </div>
          </div>
        </div>

        <div class="status-indicator">
          <div class="status-dot"></div>
          <span class="status-text">Esperando restauracion del servicio</span>
        </div>

      </div>
    </main>

    <footer class="relative z-10 border-t shrink-0 header-glass" :style="{ borderColor: 'var(--border-color)' }">
      <div class="max-w-md mx-auto px-6 py-5">
        <div class="flex items-center justify-center gap-2.5">
          <div class="w-6 h-6 rounded-full overflow-hidden shrink-0 ring-2 footer-logo-ring">
            <img src="/icon.png" alt="Lunali" class="w-full h-full object-cover" />
          </div>
          <span class="text-sm font-semibold footer-brand">Lunali Streaming</span>
          <span class="text-xs footer-dot">&middot;</span>
          <span class="text-xs footer-year">{{ new Date().getFullYear() }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { useAuthStore } from '../store/auth'
import { useSiteSettingsStore } from '../store/siteSettings'

const router = useRouter()
const { isDark, toggleTheme } = useTheme()
const authStore = useAuthStore()
const siteSettingsStore = useSiteSettingsStore()

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
  background: rgba(var(--header-bg-rgb, 255,255,255), 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.dark .header-glass {
  background: rgba(12,10,13,0.72);
}

.bg-orbs .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}
.orb-1 {
  width: 600px; height: 600px;
  top: -20%; right: -15%;
  background: var(--rose-primary);
  opacity: 0.06;
  animation: orb-drift 20s ease-in-out infinite alternate;
}
.orb-2 {
  width: 500px; height: 500px;
  bottom: -15%; left: -10%;
  background: var(--rose-primary);
  opacity: 0.04;
  animation: orb-drift 25s ease-in-out infinite alternate-reverse;
}
@keyframes orb-drift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(30px, -20px); }
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
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.logo-container {
  position: relative;
  width: 100px; height: 100px;
}
@media (min-width: 640px) {
  .logo-container { width: 120px; height: 120px; }
}
.logo-ring {
  width: 100%; height: 100%;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #e88aac, #d46a8a, #b84a6a);
  position: relative;
  z-index: 1;
}
.logo-inner {
  width: 100%; height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}
.logo-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.logo-glow {
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(196,90,122,0.15) 0%, transparent 70%);
  z-index: 0;
}
.logo-ring-outer {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(196,90,122,0.1);
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
.gradient-text-alt {
  background: linear-gradient(135deg, #b84a6a, var(--rose-primary), #d46a8a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 0.85em;
}
.unavailable-subtitle {
  color: var(--text-muted);
  line-height: 1.7;
  letter-spacing: 0.01em;
}

.reason-card {
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
.reason-card-inner {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(196,90,122,0.12);
  background: rgba(196,90,122,0.03);
  backdrop-filter: blur(12px);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.reason-card-inner:hover {
  border-color: rgba(196,90,122,0.2);
  box-shadow: 0 2px 12px rgba(196,90,122,0.05);
}
.reason-icon {
  width: 2.25rem; height: 2.25rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(196,90,122,0.08);
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

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.125rem;
  border-radius: 9999px;
  border: 1px solid rgba(196,90,122,0.12);
  background: rgba(196,90,122,0.03);
}
.status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--rose-primary);
  animation: dot-blink 2s ease-in-out infinite;
}
@keyframes dot-blink {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
.status-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.01em;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem; height: 2.25rem;
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
  border-color: rgba(212,74,74,0.3);
  color: var(--error);
}
.footer-logo-ring {
  --tw-ring-color: var(--rose-primary);
}
.footer-brand {
  color: var(--rose-primary);
}
.footer-dot, .footer-year {
  color: var(--text-muted);
}
</style>
