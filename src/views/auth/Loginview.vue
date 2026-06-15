<template>
  <div class="min-h-screen flex" style="background: var(--bg-page);">
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
         style="background: linear-gradient(135deg, var(--rose-lighter), var(--rose-light));">
      <div class="absolute inset-0 opacity-10"
        style="background-image: linear-gradient(rgba(212,106,138,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,106,138,0.3) 1px, transparent 1px); background-size: 40px 40px;">
      </div>
      <div class="relative text-center max-w-md p-8">
        <div class="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
             style="background: linear-gradient(135deg, var(--rose-400), var(--rose-500));">
          <svg class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
          </svg>
        </div>
        <h2 class="text-3xl mb-3 font-display">Lunali</h2>
        <p class="text-base" style="color: var(--text-muted);">Sistema de gestión de reportes para plataformas de streaming.</p>
        <div class="mt-8 flex items-center justify-center gap-4">
          <div class="w-2 h-2 rounded-full" style="background: var(--rose-300);"></div>
          <div class="w-2 h-2 rounded-full" style="background: var(--rose-400);"></div>
          <div class="w-2 h-2 rounded-full" style="background: var(--rose-primary);"></div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center p-4 sm:p-8">
      <div class="w-full max-w-sm">
        <RouterLink to="/" class="inline-flex items-center gap-2 no-underline mb-8">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--text-muted);">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span class="text-sm" style="color: var(--text-muted);">Volver al inicio</span>
        </RouterLink>

        <h2 class="text-2xl font-display mb-1" style="color: var(--text-primary);">
          {{ activeTab === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta' }}
        </h2>
        <p class="text-sm mb-8" style="color: var(--text-muted);">
          {{ activeTab === 'login' ? 'Inicia sesión para continuar' : 'Regístrate para empezar' }}
        </p>

        <div class="flex rounded-xl p-0.5 mb-7 border" style="background: var(--bg-surface); border-color: var(--border-color);">
          <button
            v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id; errorMsg = ''"
            class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
            :style="activeTab === tab.id
              ? { background: 'var(--rose-primary)', color: 'white', boxShadow: '0 2px 8px rgba(212,106,138,0.3)' }
              : { color: 'var(--text-muted)', background: 'transparent' }"
          >
            {{ tab.label }}
          </button>
        </div>

        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="input-label">Usuario</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <input v-model="loginForm.username" type="text" placeholder="Tu usuario" required class="input-field pl-10" />
            </div>
          </div>
          <div>
            <label class="input-label">Contraseña</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <input v-model="loginForm.password" :type="showPass ? 'text' : 'password'"
                     placeholder="••••••••" required class="input-field pl-10 pr-11" />
              <button type="button" @click="showPass = !showPass"
                      class="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style="color: var(--text-muted);">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="showPass
                      ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                      : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                </svg>
              </button>
            </div>
          </div>
          <div v-if="errorMsg" class="rounded-lg border px-3 py-2 text-xs"
               style="border-color: rgba(232,138,138,0.3); background: var(--error-bg); color: var(--error);">
            {{ errorMsg }}
          </div>
          <button type="submit" :disabled="authStore.loading" class="btn-primary w-full py-3">
            <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span v-if="authStore.loading">Ingresando...</span>
            <span v-else>Iniciar sesión</span>
          </button>
        </form>

        <form v-else @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="input-label">Usuario</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <input v-model="registerForm.username" type="text" placeholder="Elige un usuario" required class="input-field pl-10" />
            </div>
          </div>
          <div>
            <label class="input-label">Teléfono</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <input v-model="registerForm.phone" type="text" placeholder="2221234567" required class="input-field pl-10" />
            </div>
          </div>
          <div>
            <label class="input-label">Contraseña</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <input v-model="registerForm.password" :type="showPass ? 'text' : 'password'"
                     placeholder="Mínimo 6 caracteres" minlength="6" required class="input-field pl-10 pr-11" />
              <button type="button" @click="showPass = !showPass"
                      class="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style="color: var(--text-muted);">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="showPass
                      ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                      : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                </svg>
              </button>
            </div>
          </div>
          <div v-if="errorMsg" class="rounded-lg border px-3 py-2 text-xs"
               style="border-color: rgba(232,138,138,0.3); background: var(--error-bg); color: var(--error);">
            {{ errorMsg }}
          </div>
          <button type="submit" :disabled="authStore.loading" class="btn-primary w-full py-3">
            <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span v-if="authStore.loading">Registrando...</span>
            <span v-else>Crear cuenta</span>
          </button>
        </form>

        <div class="flex items-center justify-between mt-6 pt-6 border-t" style="border-color: var(--border-color);">
          <button @click="toggleTheme" class="btn-ghost text-xs flex items-center gap-1.5">
            <svg v-if="isDark" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
            {{ isDark ? 'Modo claro' : 'Modo oscuro' }}
          </button>
          <p class="text-xs" style="color: var(--text-muted);">
            &copy; {{ new Date().getFullYear() }} Lunali
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useTheme } from '../../composables/useTheme'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()

const activeTab = ref(route.query.register === 'true' ? 'register' : 'login')
const showPass = ref(false)
const errorMsg = ref('')

const tabs = [{ id: 'login', label: 'Iniciar sesión' }, { id: 'register', label: 'Registrarse' }]

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
    errorMsg.value = 'Error al iniciar sesión'
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
