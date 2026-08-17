import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { siteSettingsApi } from '../api/axios'

export const useSiteSettingsStore = defineStore('siteSettings', () => {
  const settings = ref(null)
  const loading = ref(false)

  const restrictAccess = computed(() => settings.value?.restrictAccess ?? false)
  const siteClosed = computed(() => settings.value?.siteClosed ?? false)
  const closureReason = computed(() => settings.value?.closureReason ?? '')
  const closureMode = computed(() => settings.value?.closureMode ?? 'manual')
  const scheduledCloseAt = computed(() => settings.value?.scheduledCloseAt ?? null)
  const scheduledOpenAt = computed(() => settings.value?.scheduledOpenAt ?? null)
  const recurringDays = computed(() => settings.value?.recurringDays ?? [])
  const allowedRoles = computed(() => settings.value?.allowedRoles ?? ['admin', 'boss'])

  function isSiteEffectivelyClosed() {
    if (!settings.value) return false
    const s = settings.value
    if (!s.siteClosed) return false
    if (s.closureMode === 'manual') return true
    if (s.closureMode === 'scheduled') {
      const now = Date.now()
      const closeAt = s.scheduledCloseAt ? new Date(s.scheduledCloseAt).getTime() : 0
      const openAt = s.scheduledOpenAt ? new Date(s.scheduledOpenAt).getTime() : Infinity
      return now >= closeAt && now < openAt
    }
    if (s.closureMode === 'recurring') {
      const today = new Date().getDay()
      return s.recurringDays.includes(today)
    }
    return false
  }

  function canUserAccess(userRole) {
    if (!settings.value) return true
    if (!settings.value.restrictAccess) return true
    return settings.value.allowedRoles.includes(userRole)
  }

  async function fetchStatus() {
    try {
      const { data } = await siteSettingsApi.status()
      settings.value = data
    } catch {
      settings.value = { restrictAccess: false, siteClosed: false }
    }
  }

  async function fetchSettings() {
    loading.value = true
    try {
      const { data } = await siteSettingsApi.get()
      settings.value = data
    } catch {
      settings.value = { restrictAccess: false, siteClosed: false }
    } finally {
      loading.value = false
    }
  }

  async function updateSettings(payload) {
    const { data } = await siteSettingsApi.update(payload)
    settings.value = data
    return data
  }

  return {
    settings,
    loading,
    restrictAccess,
    siteClosed,
    closureReason,
    closureMode,
    scheduledCloseAt,
    scheduledOpenAt,
    recurringDays,
    allowedRoles,

    isSiteEffectivelyClosed,
    canUserAccess,
    fetchStatus,
    fetchSettings,
    updateSettings,
  }
})
