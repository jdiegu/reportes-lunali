import { ref } from 'vue'

const isDark = ref(false)

function initTheme() {
  const stored = localStorage.getItem('lunali_theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const shouldBeDark = stored === 'dark' || (!stored && prefersDark)
  isDark.value = shouldBeDark
  document.documentElement.classList.toggle('dark', shouldBeDark)
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('lunali_theme', isDark.value ? 'dark' : 'light')
}

function setTheme(theme) {
  isDark.value = theme === 'dark'
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('lunali_theme', theme)
}

export function useTheme() {
  return { isDark, toggleTheme, setTheme, initTheme }
}
