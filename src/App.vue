<template>
  <div class="min-h-screen" :class="{ 'dark': isDark }">
    <RouterView />
    <ToastNotification />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useTheme } from './composables/useTheme'
import ToastNotification from './components/ui/ToastNotification.vue'

const { isDark, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>
