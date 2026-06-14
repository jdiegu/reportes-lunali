<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-zinc-950"
  >
    <!-- Background blobs -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-700/20 blur-3xl"
      ></div>

      <div
        class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-rose-900/30 blur-3xl"
      ></div>

      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               w-64 h-64 rounded-full bg-rose-800/10 blur-3xl"
      ></div>
    </div>

    <!-- Grid -->
    <div
      class="absolute inset-0 opacity-[0.03]"
      style="
        background-image:
          linear-gradient(rgba(249,61,114,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(249,61,114,1) 1px, transparent 1px);
        background-size: 40px 40px;
      "
    ></div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo -->
      <div class="text-center mb-10">
        <div
          class="inline-flex items-center justify-center
                 w-16 h-16 rounded-2xl
                 bg-rose-600/20 border border-rose-600/30
                 mb-5 shadow-lg"
        >
          <svg
            class="w-8 h-8 text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
            />
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-rose-50">
          Lunali
        </h1>

        <p class="text-rose-400 text-sm mt-1">
          Sistema de Reportes
        </p>
      </div>

      <!-- Card -->
      <div
        class="rounded-2xl border border-rose-900/30
               bg-zinc-900/70 backdrop-blur-xl
               shadow-2xl p-8"
      >
        <!-- Tabs -->
        <div
          class="flex rounded-xl bg-zinc-950/60
                 p-1 mb-7 border border-rose-900/20"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-lg'
                : 'text-rose-300 hover:text-rose-100'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- LOGIN -->
        <form
          v-if="activeTab === 'login'"
          @submit.prevent="handleLogin"
          class="space-y-5"
        >
          <div>
            <label class="block mb-2 text-xs font-medium uppercase tracking-wider text-rose-300">
              Usuario
            </label>

            <input
              v-model="loginForm.username"
              type="text"
              placeholder="Tu usuario"
              required
              class="w-full rounded-xl border border-rose-900/40
                     bg-zinc-950/60 px-4 py-3 text-sm text-rose-50
                     placeholder-rose-700
                     focus:outline-none
                     focus:ring-2 focus:ring-rose-500/40"
            />
          </div>

          <div>
            <label class="block mb-2 text-xs font-medium uppercase tracking-wider text-rose-300">
              Contraseña
            </label>

            <div class="relative">
              <input
                v-model="loginForm.password"
                :type="showPass ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full rounded-xl border border-rose-900/40
                       bg-zinc-950/60 px-4 py-3 pr-11
                       text-sm text-rose-50
                       placeholder-rose-700
                       focus:outline-none
                       focus:ring-2 focus:ring-rose-500/40"
              />

              <button
                type="button"
                @click="showPass = !showPass"
                class="absolute right-3 top-1/2 -translate-y-1/2
                       text-rose-400 hover:text-rose-200"
              >
                👁
              </button>
            </div>
          </div>

          <div
            v-if="errorMsg"
            class="rounded-lg border border-rose-800/40
                   bg-rose-900/20 px-3 py-2
                   text-xs text-rose-300"
          >
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full rounded-xl bg-rose-600 py-3
                   text-sm font-medium text-white
                   transition-all duration-200
                   hover:bg-rose-500
                   disabled:opacity-50"
          >
            <span v-if="authStore.loading">
              Ingresando...
            </span>

            <span v-else>
              Iniciar sesión
            </span>
          </button>
        </form>

        <!-- REGISTER -->
        <form
          v-else
          @submit.prevent="handleRegister"
          class="space-y-5"
        >
          <div>
            <label class="block mb-2 text-xs font-medium uppercase tracking-wider text-rose-300">
              Usuario
            </label>

            <input
              v-model="registerForm.username"
              type="text"
              placeholder="Tu usuario"
              required
              class="w-full rounded-xl border border-rose-900/40
                     bg-zinc-950/60 px-4 py-3 text-sm text-rose-50
                     placeholder-rose-700
                     focus:outline-none
                     focus:ring-2 focus:ring-rose-500/40"
            />
          </div>

          <div>
            <label class="block mb-2 text-xs font-medium uppercase tracking-wider text-rose-300">
              Teléfono
            </label>

            <input
              v-model="registerForm.phone"
              type="text"
              placeholder="2221234567"
              required
              class="w-full rounded-xl border border-rose-900/40
                     bg-zinc-950/60 px-4 py-3 text-sm text-rose-50
                     placeholder-rose-700
                     focus:outline-none
                     focus:ring-2 focus:ring-rose-500/40"
            />
          </div>

          <div>
            <label class="block mb-2 text-xs font-medium uppercase tracking-wider text-rose-300">
              Contraseña
            </label>

            <div class="relative">
              <input
                v-model="registerForm.password"
                :type="showPass ? 'text' : 'password'"
                placeholder="Mínimo 6 caracteres"
                minlength="6"
                required
                class="w-full rounded-xl border border-rose-900/40
                       bg-zinc-950/60 px-4 py-3 pr-11
                       text-sm text-rose-50
                       placeholder-rose-700
                       focus:outline-none
                       focus:ring-2 focus:ring-rose-500/40"
              />

              <button
                type="button"
                @click="showPass = !showPass"
                class="absolute right-3 top-1/2 -translate-y-1/2
                       text-rose-400 hover:text-rose-200"
              >
                👁
              </button>
            </div>
          </div>

          <div
            v-if="errorMsg"
            class="rounded-lg border border-rose-800/40
                   bg-rose-900/20 px-3 py-2
                   text-xs text-rose-300"
          >
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full rounded-xl bg-rose-600 py-3
                   text-sm font-medium text-white
                   transition-all duration-200
                   hover:bg-rose-500
                   disabled:opacity-50"
          >
            <span v-if="authStore.loading">
              Registrando...
            </span>

            <span v-else>
              Crear cuenta
            </span>
          </button>
        </form>
      </div>

      <p class="text-center text-rose-700 text-xs mt-6">
        © {{ new Date().getFullYear() }} Lunali Streaming
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('login')
const showPass = ref(false)
const errorMsg = ref('')

const tabs = [
  {
    id: 'login',
    label: 'Iniciar sesión'
  },
  {
    id: 'register',
    label: 'Registrarse'
  }
]

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  password: '',
  phone: ''
})

async function handleLogin() {
  errorMsg.value = ''

  try {
    const result = await authStore.login({
      username: loginForm.username,
      password: loginForm.password
    })

    if (result.success) {
      router.push('/')
    } else {
      errorMsg.value = result.message
    }
  } catch (error) {
    errorMsg.value = 'Error al iniciar sesión'
  }
}

async function handleRegister() {
  errorMsg.value = ''

  
  try {
    const result = await authStore.register({
      username: registerForm.username,
      password: registerForm.password,
      phone: registerForm.phone
    })

    if (result.success) {
      router.push('/')
    } else {
      errorMsg.value = result.message
    }
  } catch (error) {
    errorMsg.value = 'Error al registrar usuario'
  }
}
</script>