<template>
  <div class="max-w-lg mx-auto p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6">
    <div>
      <h1 class="text-xl sm:text-2xl">Mi saldo</h1>
      <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">Consulta tu saldo disponible</p>
    </div>

    <div class="card overflow-hidden">
      <div class="p-6 sm:p-8 text-center" style="background: linear-gradient(135deg, var(--rose-lighter), var(--rose-light));">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
             style="background: var(--rose-gradient); box-shadow: 0 4px 16px rgba(196,90,122,0.3);">
          <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Saldo disponible</p>
        <p class="text-5xl sm:text-6xl font-display font-bold" style="color: var(--text-primary);">${{ balance.toFixed(2) }}</p>
        <p class="text-xs mt-3" style="color: var(--text-muted);">Actualizado al {{ today }}</p>
      </div>

      <div class="p-5 sm:p-6" v-if="balance > 0">
        <div class="rounded-xl p-4 flex items-center gap-3" style="background: var(--success-bg);">
          <svg class="w-5 h-5 shrink-0" style="color: var(--success);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm" style="color: var(--success);">Tu saldo esta disponible para ser utilizado en futuros reportes.</p>
        </div>
      </div>

      <div class="p-5 sm:p-6" v-else>
        <div class="rounded-xl p-4 flex items-center gap-3" style="background: var(--bg-surface);">
          <svg class="w-5 h-5 shrink-0" style="color: var(--text-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm" style="color: var(--text-muted);">No tienes saldo disponible. El administrador puede asignar saldo cuando resuelva un reporte.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../store/auth'
import { LOCALE } from '../../config/constants'

const authStore = useAuthStore()
const balance = computed(() => authStore.balance)
const today = computed(() => new Date().toLocaleDateString(LOCALE))
</script>
