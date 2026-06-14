import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let nextId = 0

  function add(message, type = 'info', duration = 4000) {
    const id = ++nextId
    toasts.value.push({ id, message, type })
    if (duration > 0) setTimeout(() => remove(id), duration)
    return id
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (msg, d) => add(msg, 'success', d)
  const error   = (msg, d) => add(msg, 'error', d)
  const info    = (msg, d) => add(msg, 'info', d)
  const warning = (msg, d) => add(msg, 'warning', d)

  return { toasts, add, remove, success, error, info, warning }
})