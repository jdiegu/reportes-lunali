import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let nextId = 0

  function add(msg, type = 'info', duration = 4000) {
    const id = ++nextId
    const toast = typeof msg === 'string' ? { title: msg } : msg
    toasts.value.push({ id, type, _duration: duration, ...toast })
    if (duration > 0) setTimeout(() => remove(id), duration)
    return id
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (title, msg, d) => add(typeof title === 'object' ? title : { title, message: msg }, 'success', d || 4000)
  const error = (title, msg, d) => add(typeof title === 'object' ? title : { title, message: msg }, 'error', d || 4000)
  const info = (title, msg, d) => add(typeof title === 'object' ? title : { title, message: msg }, 'info', d || 4000)
  const warning = (title, msg, d) => add(typeof title === 'object' ? title : { title, message: msg }, 'warning', d || 4000)

  return { toasts, add, remove, success, error, info, warning }
})
