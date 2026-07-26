<template>
  <div class="login-page min-h-screen flex flex-col relative overflow-hidden">

    <div class="bg-orbs pointer-events-none" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="orb orb-4"></div>
    </div>

    <div class="floating-shapes pointer-events-none" aria-hidden="true">
      <div class="shape shape-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>
      <div class="shape shape-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      </div>
      <div class="shape shape-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
      </div>
      <div class="shape shape-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      </div>
      <div class="shape shape-5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>
      </div>
      <div class="shape shape-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>
    </div>

    <div class="grid-dots pointer-events-none" aria-hidden="true"></div>

    <div class="flex-1 flex items-center justify-center p-4 relative z-10">
      <div class="w-full max-w-md animate-slide-up">

        <div class="text-center mb-8 sm:mb-10">
          <div class="logo-container mx-auto mb-6 sm:mb-7">
            <a :href="whatsappGroupLink" target="_blank" rel="noopener" class="block">
              <div class="logo-ring">
                <div class="logo-inner">
                  <img src="/icon.png" alt="Lunali" class="logo-img" />
                </div>
              </div>
              <div class="logo-glow"></div>
            </a>
          </div>
          <h1 class="login-title text-3xl sm:text-4xl mb-2">Lunali</h1>
          <p class="text-sm sm:text-base login-subtitle">Sistema de reportes</p>
        </div>

        <div class="login-card p-6 sm:p-8">
          <div class="tabs-container flex rounded-xl p-1 mb-7 sm:mb-8 border" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
            <button
              v-for="tab in tabs" :key="tab.id"
              @click="activeTab = tab.id; errorMsg = ''"
              class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 relative overflow-hidden"
              :class="activeTab === tab.id ? 'tab-active' : 'tab-inactive'"
            >
              <span class="relative z-10">{{ tab.label }}</span>
            </button>
          </div>

          <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-5">
            <div class="field">
              <label class="field-label">
                <svg class="field-label-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>Usuario</span>
              </label>
              <input v-model="loginForm.username" type="text" placeholder="Tu usuario" required class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">
                <svg class="field-label-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span>Contrasena</span>
              </label>
              <div class="field-input-wrap">
                <input v-model="loginForm.password" :type="showPass ? 'text' : 'password'"
                       placeholder="••••••••" required class="field-input field-input-action" />
                <button type="button" @click="showPass = !showPass"
                        class="field-action" :title="showPass ? 'Ocultar' : 'Mostrar'">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      :d="showPass
                        ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                        : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="errorMsg" class="error-msg animate-shake">
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ errorMsg }}
            </div>

            <button type="submit" :disabled="authStore.loading" class="submit-btn">
              <svg v-if="authStore.loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              <span v-if="authStore.loading">Ingresando...</span>
              <span v-else>Iniciar sesión</span>
            </button>
          </form>

          <form v-else @submit.prevent="handleRegister" class="space-y-5">
            <div class="field">
              <label class="field-label">
                <svg class="field-label-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>Usuario</span>
              </label>
              <input v-model="registerForm.username" type="text" placeholder="Elige un usuario" required class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">
                <svg class="field-label-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>Teléfono</span>
              </label>
              <input v-model="registerForm.phone" type="number" placeholder="" required class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">
                <svg class="field-label-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span>Contraseña</span>
              </label>
              <div class="field-input-wrap">
                <input v-model="registerForm.password" :type="showPass ? 'text' : 'password'"
                       placeholder="Minimo 6 caracteres" minlength="6" required class="field-input field-input-action" />
                <button type="button" @click="showPass = !showPass"
                        class="field-action" :title="showPass ? 'Ocultar' : 'Mostrar'">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      :d="showPass
                        ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                        : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="errorMsg" class="error-msg animate-shake">
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ errorMsg }}
            </div>

            <button type="submit" :disabled="authStore.loading" class="submit-btn">
              <svg v-if="authStore.loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              <span v-if="authStore.loading">Registrando...</span>
              <span v-else>Crear cuenta</span>
            </button>
          </form>
        </div>

        <div class="flex items-center justify-center mt-6 gap-3">
          <button @click="toggleTheme" class="theme-toggle">
            <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
            <span>{{ isDark ? 'Modo claro' : 'Modo oscuro' }}</span>
          </button>
        </div>

      </div>
    </div>

    <footer class="relative z-10 border-t" :style="{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }">
      <div class="max-w-md mx-auto px-6 py-6">
        <div class="flex flex-col items-center gap-4">
          <div class="flex items-center gap-2.5">
            <div class="w-6 h-6 rounded-full overflow-hidden shrink-0 ring-2" :style="{ '--tw-ring-color': 'var(--rose-primary)' }">
              <img src="/icon.png" alt="Lunali" class="w-full h-full object-cover" />
            </div>
            <span class="text-sm font-semibold" style="color: var(--rose-primary);">Lunali Streaming</span>
          </div>

          <div class="flex items-center gap-4 text-xs" style="color: var(--text-muted);">
            <span>Sistema de reportes</span>
            <span class="opacity-40">·</span>
            <span>Desarrollado por <span class="font-semibold" style="color: var(--text-secondary);">jdiegu</span></span>
          </div>

          <a :href="`https://wa.me/${whatsappPhone}`" target="_blank" rel="noopener" class="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full no-underline transition-all hover:scale-105"
             :style="{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contacto por WhatsApp
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useTheme } from '../../composables/useTheme'
import { CONTACT_PHONE, WHATSAPP_GROUP, WHATSAPP_PHONE } from '../../config/constants'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()

const whatsappGroupLink = computed(() => WHATSAPP_GROUP || '#')
const whatsappPhone = WHATSAPP_PHONE

const activeTab = ref(route.query.register === 'true' ? 'register' : 'login')
const showPass = ref(false)
const errorMsg = ref('')

const tabs = [{ id: 'login', label: 'Iniciar sesion' }, { id: 'register', label: 'Registrarse' }]

const loginForm = reactive({ username: '', password: '' })
const registerForm = reactive({ username: '', password: '', phone: '' })

async function handleLogin() {
  errorMsg.value = ''
  try {
    const result = await authStore.login({ username: loginForm.username, password: loginForm.password })
    if (result.success) {
      router.push('/app')
    } else {
      errorMsg.value = result.message
    }
  } catch {
    errorMsg.value = 'Error al iniciar sesion'
  }
}

async function handleRegister() {
  errorMsg.value = ''
  try {
    const result = await authStore.register({ username: registerForm.username, password: registerForm.password, phone: registerForm.phone })
    if (result.success) {
      router.push('/app')
    } else {
      errorMsg.value = result.message
    }
  } catch {
    errorMsg.value = 'Error al registrar usuario'
  }
}
</script>

<style scoped>
.login-page {
  background: var(--bg-page);
}

.bg-orbs .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}
.orb-1 {
  width: 500px; height: 500px;
  top: -15%; right: -10%;
  background: var(--rose-primary);
  opacity: 0.07;
  animation: orb-drift 18s ease-in-out infinite alternate;
}
.orb-2 {
  width: 400px; height: 400px;
  bottom: -10%; left: -8%;
  background: var(--rose-primary);
  opacity: 0.05;
  animation: orb-drift 22s ease-in-out infinite alternate-reverse;
}
.orb-3 {
  width: 300px; height: 300px;
  top: 30%; left: 20%;
  background: var(--info);
  opacity: 0.04;
  animation: orb-drift 15s ease-in-out infinite alternate;
}
.orb-4 {
  width: 200px; height: 200px;
  bottom: 20%; right: 15%;
  background: var(--success);
  opacity: 0.03;
  animation: orb-drift 20s ease-in-out infinite alternate-reverse;
}
@keyframes orb-drift {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -20px) scale(1.1); }
  100% { transform: translate(-20px, 15px) scale(0.95); }
}

.floating-shapes .shape {
  position: absolute;
  opacity: 0.06;
  color: var(--rose-primary);
}
.floating-shapes .shape svg { width: 100%; height: 100%; }
.shape-1 { width: 40px; height: 40px; top: 12%; left: 8%; animation: shape-float 12s ease-in-out infinite; }
.shape-2 { width: 48px; height: 48px; top: 20%; right: 12%; animation: shape-float 16s ease-in-out infinite 2s; }
.shape-3 { width: 36px; height: 36px; bottom: 25%; left: 15%; animation: shape-float 14s ease-in-out infinite 4s; }
.shape-4 { width: 32px; height: 32px; bottom: 15%; right: 20%; animation: shape-float 18s ease-in-out infinite 1s; }
.shape-5 { width: 28px; height: 28px; top: 55%; left: 5%; animation: shape-float 20s ease-in-out infinite 3s; }
.shape-6 { width: 24px; height: 24px; top: 45%; right: 6%; animation: shape-float 15s ease-in-out infinite 5s; }
@keyframes shape-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(5deg); }
  50% { transform: translateY(-8px) rotate(-3deg); }
  75% { transform: translateY(-20px) rotate(8deg); }
}

.grid-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--rose-primary) 0.8px, transparent 0.8px);
  background-size: 48px 48px;
  opacity: 0.035;
}

.animate-slide-up {
  animation: slide-up 0.7s cubic-bezier(0.21, 1.02, 0.73, 1) both;
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.logo-container {
  position: relative;
  width: 88px; height: 88px;
}
@media (min-width: 640px) {
  .logo-container { width: 104px; height: 104px; }
}
.logo-ring {
  width: 100%; height: 100%;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #e88aac, #d46a8a, #b84a6a, #e88aac);
  background-size: 300% 300%;
  animation: ring-rotate 6s ease-in-out infinite;
  position: relative;
  z-index: 1;
}
@keyframes ring-rotate {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.logo-inner {
  width: 100%; height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}
.logo-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.logo-glow {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(196,90,122,0.25) 0%, transparent 70%);
  z-index: 0;
  animation: glow-pulse 4s ease-in-out infinite;
}
@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}

.login-title {
  font-family: "Playfair Display", Georgia, serif;
  font-weight: 700;
  background: linear-gradient(135deg, var(--rose-primary), #d46a8a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.login-subtitle {
  color: var(--text-muted);
  letter-spacing: 0.03em;
}

.login-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 1.25rem;
  box-shadow:
    0 1px 3px rgba(0,0,0,0.04),
    0 4px 24px rgba(196,90,122,0.06),
    0 12px 48px rgba(0,0,0,0.03);
  backdrop-filter: blur(12px);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
.login-card:hover {
  box-shadow:
    0 1px 3px rgba(0,0,0,0.04),
    0 8px 32px rgba(196,90,122,0.1),
    0 16px 56px rgba(0,0,0,0.04);
  border-color: rgba(196,90,122,0.15);
}
.dark .login-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 4px 24px rgba(0,0,0,0.15), 0 12px 48px rgba(0,0,0,0.1);
}
.dark .login-card:hover {
  box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 8px 32px rgba(232,138,172,0.08), 0 16px 56px rgba(0,0,0,0.15);
}

.tabs-container { gap: 0.25rem; }
.tab-active {
  background: var(--rose-primary);
  color: white;
  box-shadow: 0 2px 10px rgba(196,90,122,0.35);
}
.tab-inactive {
  color: var(--text-muted);
  background: transparent;
}
.tab-inactive:hover {
  color: var(--text-secondary);
  background: rgba(196,90,122,0.05);
}

.field { position: relative; }
.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  padding-left: 0.125rem;
}
.field-label-icon {
  width: 1rem;
  height: 1rem;
  color: var(--rose-primary);
  opacity: 0.7;
  flex-shrink: 0;
}
.field-input-wrap { position: relative; }
.field-input {
  width: 100%;
  padding: 0.75rem 0.875rem;
  border-radius: 0.875rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-input);
  border: 1.5px solid var(--border-color);
  transition: all 0.25s ease;
  outline: none;
  line-height: 1.5;
}
.field-input::placeholder { color: var(--text-muted); opacity: 0.6; }
.field-input:focus {
  border-color: var(--rose-primary);
  box-shadow: 0 0 0 3px rgba(196,90,122,0.1);
  background: var(--bg-card);
}
.field-input-action { padding-right: 3rem; }
.field-action {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  color: var(--rose-primary);
  opacity: 0.7;
  transition: all 0.2s;
  cursor: pointer;
  background: transparent;
  border: none;
}
.field-action:hover {
  opacity: 1;
  background: var(--rose-lighter);
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: 0.875rem;
  font-size: 0.8125rem;
  border: 1px solid rgba(212,74,74,0.2);
  background: var(--error-bg);
  color: var(--error);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(3px); }
}
.animate-shake { animation: shake 0.4s ease; }

.submit-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  background: var(--rose-gradient);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  line-height: 1.4;
}
.submit-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
}
.submit-btn:hover::before { opacity: 1; }
.submit-btn:hover {
  box-shadow: 0 6px 24px rgba(196,90,122,0.4);
  transform: translateY(-1px);
}
.submit-btn:active { transform: translateY(0); box-shadow: 0 2px 12px rgba(196,90,122,0.3); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}
.theme-toggle:hover {
  background: var(--bg-surface);
  border-color: var(--rose-light);
  color: var(--rose-primary);
}
</style>
