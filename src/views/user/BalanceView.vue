<template>
  <div class="max-w-lg mx-auto p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6">
    <div>
      <h1 class="text-xl sm:text-2xl">Mi saldo</h1>
      <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">Tu saldo disponible</p>
    </div>

    <div class="card overflow-hidden">
      <div class="p-6 sm:p-8 text-center" style="background: linear-gradient(135deg, var(--rose-lighter), var(--rose-light));">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
             style="background: var(--rose-gradient); box-shadow: 0 4px 16px rgba(196,90,122,0.3);">
          <DollarSign class="w-7 h-7 text-white" />
        </div>
        <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Saldo disponible</p>
        <p class="text-5xl sm:text-6xl font-display font-bold" style="color: var(--text-primary);">${{ balance.toFixed(2) }}</p>
        <p class="text-xs mt-3" style="color: var(--text-muted);">Actualizado al {{ today }}</p>
      </div>

      <div class="p-5 sm:p-6" v-if="balance > 0">
        <div class="rounded-xl p-4 flex items-center gap-3" style="background: var(--success-bg);">
          <CheckCircle class="w-5 h-5 shrink-0" style="color: var(--success);" />
          <p class="text-sm" style="color: var(--success);">Tu saldo esta disponible para ser utilizado en compras en el grupo.</p>
        </div>
      </div>

      <div class="p-5 sm:p-6" v-else>
        <div class="rounded-xl p-4 flex items-center gap-3" style="background: var(--bg-surface);">
          <Info class="w-5 h-5 shrink-0" style="color: var(--text-muted);" />
          <p class="text-sm" style="color: var(--text-muted);">No tienes saldo disponible.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../store/auth'
import { LOCALE } from '../../config/constants'
import { DollarSign, CheckCircle, Info } from '@lucide/vue'

const authStore = useAuthStore()
const balance = computed(() => authStore.balance)
const today = computed(() => new Date().toLocaleDateString(LOCALE))
</script>
