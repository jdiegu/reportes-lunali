import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/axios'

export const useAuthStore = defineStore('auth', () => {

  const token = ref(
    localStorage.getItem('lunali_token') || null
  )

  const user = ref(
    JSON.parse(localStorage.getItem('lunali_user') || 'null')
  )

  const loading = ref(false)

  const error = ref(null)

  // ─────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────

  const isLoggedIn = computed(() =>
    !!token.value && !!user.value
  )

  const isAdmin = computed(() =>
    ['admin', 'superadmin'].includes(user.value?.role)
  )

  const userRole = computed(() =>
    user.value?.role || 'guest'
  )

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────

  async function login(credentials) {
    loading.value = true
    error.value = null

    try {
      const { data } = await authApi.login(credentials)

      token.value = data.token
      user.value = data.user

      localStorage.setItem(
        'lunali_token',
        data.token
      )

      localStorage.setItem(
        'lunali_user',
        JSON.stringify(data.user)
      )

      return {
        success: true,
        user: data.user
      }

    } catch (err) {

      error.value =
        err.response?.data?.message ||
        'Error al iniciar sesión'

      return {
        success: false,
        message: error.value
      }

    } finally {
      loading.value = false
    }
  }

  // ─────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────

  async function register(credentials) {

    loading.value = true
    error.value = null

    try {

      const { data } =
        await authApi.register(credentials)

      token.value = data.token
      user.value = data.user

      localStorage.setItem(
        'lunali_token',
        data.token
      )

      localStorage.setItem(
        'lunali_user',
        JSON.stringify(data.user)
      )

      return {
        success: true,
        user: data.user
      }

    } catch (err) {

      error.value =
        err.response?.data?.message ||
        'Error al registrarse'

      return {
        success: false,
        message: error.value
      }

    } finally {
      loading.value = false
    }
  }

  // ─────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────

  function logout() {

    token.value = null
    user.value = null

    localStorage.removeItem('lunali_token')
    localStorage.removeItem('lunali_user')
  }

  return {
    token,
    user,
    loading,
    error,

    isLoggedIn,
    isAdmin,
    userRole,

    login,
    register,
    logout
  }
})