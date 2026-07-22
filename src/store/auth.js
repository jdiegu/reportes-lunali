import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/axios'
import { STORAGE_KEYS } from '../config/constants'

function safeParseJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw || raw === 'undefined' || raw === 'null') return null
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {

  const token = ref(
    localStorage.getItem(STORAGE_KEYS.TOKEN) || null
  )

  const user = ref(
    safeParseJSON(STORAGE_KEYS.USER)
  )

  const loading = ref(false)

  const error = ref(null)

  const isLoggedIn = computed(() =>
    !!token.value && !!user.value
  )

  const isAdmin = computed(() =>
    ['admin', 'boss'].includes(user.value?.role)
  )

  const userRole = computed(() =>
    user.value?.role || 'guest'
  )

  const balance = computed(() =>
    user.value?.balance || 0
  )

  function updateBalance(newBalance) {
    if (user.value) {
      user.value.balance = newBalance
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
    }
  }

  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authApi.login(credentials)
      token.value = data.token
      user.value = data.user
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al iniciar sesion'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function register(credentials) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authApi.register(credentials)
      token.value = data.token
      user.value = data.user
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al registrarse'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }

  return {
    token,
    user,
    loading,
    error,

    isLoggedIn,
    isAdmin,
    userRole,
    balance,

    login,
    register,
    logout,
    updateBalance,
  }
})
