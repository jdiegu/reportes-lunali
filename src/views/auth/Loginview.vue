<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style="background: var(--bg-page);">

    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-[0.06] blur-3xl"
           style="background: var(--rose-primary);"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-[0.04] blur-3xl"
           style="background: var(--rose-primary);"></div>
      <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-[0.03] blur-3xl"
           style="background: var(--info);"></div>
      <div class="absolute grid-pattern inset-0 opacity-[0.025]"
           style="background-image: linear-gradient(var(--rose-primary) 1px, transparent 1px), linear-gradient(90deg, var(--rose-primary) 1px, transparent 1px); background-size: 64px 64px;">
      </div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <div class="text-center mb-8 sm:mb-10">
        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg logo-float"
             style="background: var(--rose-gradient); box-shadow: 0 8px 32px rgba(196,90,122,0.3);">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"/>
          </svg>
        </div>
        <h1 class="text-3xl sm:text-4xl font-display mb-2" style="color: var(--text-primary);">Lunali</h1>
        <p class="text-sm sm:text-base" style="color: var(--text-muted);">Gestion de reportes para streaming</p>
      </div>

      <div class="card p-6 sm:p-8">
        <div class="flex rounded-xl p-1 mb-6 sm:mb-7 border" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
          <button
            v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id; errorMsg = ''"
            class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
            :style="activeTab === tab.id
              ? { background: 'var(--rose-primary)', color: 'white', boxShadow: '0 2px 8px rgba(196,90,122,0.3)' }
              : { color: 'var(--text-muted)', background: 'transparent' }"
          >
            {{ tab.label }}
          </button>
        </div>

        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="input-label">Usuario</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <input v-model="loginForm.username" type="text" placeholder="Tu usuario" required class="input-field pl-11" />
            </div>
          </div>
          <div>
            <label class="input-label">Contrasena</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <input v-model="loginForm.password" :type="showPass ? 'text' : 'password'"
                     placeholder="••••••••" required class="input-field pl-11 pr-11" />
              <button type="button" @click="showPass = !showPass"
                      class="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style="color: var(--text-muted);">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    :d="showPass
                      ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                      : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="errorMsg" class="rounded-xl border px-4 py-3 text-sm flex items-center gap-2.5"
               :style="{ borderColor: 'rgba(212,74,74,0.25)', background: 'var(--error-bg)', color: 'var(--error)' }">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ errorMsg }}
          </div>

          <button type="submit" :disabled="authStore.loading" class="btn-primary w-full !py-3 text-base">
            <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span v-if="authStore.loading">Ingresando...</span>
            <span v-else>Iniciar sesion</span>
          </button>
        </form>

        <form v-else @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="input-label">Usuario</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <input v-model="registerForm.username" type="text" placeholder="Elige un usuario" required class="input-field pl-11" />
            </div>
          </div>
          <div>
            <label class="input-label">Telefono</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <input v-model="registerForm.phone" type="text" placeholder="2221234567" required class="input-field pl-11" />
            </div>
          </div>
          <div>
            <label class="input-label">Contrasena</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <input v-model="registerForm.password" :type="showPass ? 'text' : 'password'"
                     placeholder="Minimo 6 caracteres" minlength="6" required class="input-field pl-11 pr-11" />
              <button type="button" @click="showPass = !showPass"
                      class="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style="color: var(--text-muted);">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    :d="showPass
                      ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                      : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="errorMsg" class="rounded-xl border px-4 py-3 text-sm flex items-center gap-2.5"
               :style="{ borderColor: 'rgba(212,74,74,0.25)', background: 'var(--error-bg)', color: 'var(--error)' }">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ errorMsg }}
          </div>

          <button type="submit" :disabled="authStore.loading" class="btn-primary w-full !py-3 text-base">
            <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span v-if="authStore.loading">Registrando...</span>
            <span v-else>Crear cuenta</span>
          </button>
        </form>
      </div>

      <div class="flex items-center justify-center mt-6 gap-3">
        <button @click="toggleTheme" class="btn-ghost text-xs flex items-center gap-1.5">
          <svg v-if="isDark" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
          {{ isDark ? 'Modo claro' : 'Modo oscuro' }}
        </button>
      </div>

      <p class="text-center text-xs mt-6" style="color: var(--text-muted); opacity: 0.5;">
        &copy; {{ new Date().getFullYear() }} Lunali
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useTheme } from '../../composables/useTheme'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()

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
.logo-float {
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
</style>
