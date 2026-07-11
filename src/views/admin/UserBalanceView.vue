<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6">
    <div class="flex items-center justify-between">
      <button @click="$router.push('/app/admin')" class="inline-flex items-center gap-2 btn-ghost text-xs sm:text-sm no-underline !px-2 sm:!px-3">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Volver
      </button>
    </div>

    <div v-if="loadingUser" class="space-y-4">
      <div class="card p-6 space-y-4">
        <div class="skeleton h-8 w-48 rounded"></div>
        <div class="skeleton h-4 w-32 rounded"></div>
      </div>
    </div>

    <template v-else-if="user">
      <div class="card overflow-hidden">
        <div class="p-5 sm:p-6 border-b" :style="{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
                 style="background: var(--rose-gradient); color: white;">
              {{ (user.username || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl sm:text-2xl">{{ user.username }}</h1>
              <p class="text-xs sm:text-sm" style="color: var(--text-muted);">
                {{ user.role === 'admin' || user.role === 'boss' ? 'Administrador' : 'Usuario' }}
                <span v-if="user.phone"> · {{ user.phone }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="p-5 sm:p-6 space-y-6">
          <div class="rounded-xl p-5 border text-center"
               :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
            <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Saldo actual</p>
            <p class="text-4xl sm:text-5xl font-display font-bold" style="color: var(--success);">${{ (user.balance || 0).toFixed(2) }}</p>
          </div>

          <div class="rounded-xl border p-5" :style="{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }">
            <p class="text-sm font-semibold mb-4" style="color: var(--text-primary);">Modificar saldo</p>
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="flex-1">
                <label class="input-label">Monto ($)</label>
                <input v-model.number="balanceAmount" type="number" min="0.01" step="0.01" class="input-field text-lg font-mono"
                       placeholder="0.00" />
              </div>
              <div class="flex gap-2 sm:items-end">
                <button @click="handleBalance('add')" :disabled="!balanceAmount || balanceAmount <= 0 || balanceLoading"
                        class="btn-primary flex-1 sm:flex-initial">
                  <svg v-if="balanceLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                  Agregar
                </button>
                <button @click="handleBalance('subtract')" :disabled="!balanceAmount || balanceAmount <= 0 || balanceLoading"
                        class="btn-danger flex-1 sm:flex-initial">
                  <svg v-if="balanceLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/>
                  </svg>
                  Quitar
                </button>
              </div>
            </div>
          </div>

          <div v-if="balanceMsg" class="rounded-xl border px-4 py-3 text-sm"
               :style="{
                 borderColor: balanceSuccess ? 'rgba(75,181,116,0.25)' : 'rgba(212,74,74,0.25)',
                 background: balanceSuccess ? 'var(--success-bg)' : 'var(--error-bg)',
                 color: balanceSuccess ? 'var(--success)' : 'var(--error)',
               }">
            {{ balanceMsg }}
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-16 sm:py-20">
      <p class="text-sm" style="color: var(--text-muted);">Usuario no encontrado</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToastStore } from '../../store/toast'
import { usersApi } from '../../api/axios'

const route = useRoute()
const toast = useToastStore()

const loadingUser = ref(true)
const balanceLoading = ref(false)
const user = ref(null)
const balanceAmount = ref(null)
const balanceMsg = ref('')
const balanceSuccess = ref(false)

async function loadUser() {
  loadingUser.value = true
  try {
    const { data } = await usersApi.get(route.params.id)
    user.value = data
  } catch {
    user.value = null
  }
  loadingUser.value = false
}

async function handleBalance(operation) {
  balanceMsg.value = ''
  balanceLoading.value = true
  try {
    const { data } = await usersApi.updateBalance(route.params.id, balanceAmount.value, operation)
    user.value.balance = data.balance
    balanceMsg.value = data.message
    balanceSuccess.value = true
    balanceAmount.value = null
    toast.success('Saldo actualizado', data.message)
  } catch (e) {
    balanceMsg.value = e.response?.data?.message || 'Error al actualizar saldo'
    balanceSuccess.value = false
  } finally {
    balanceLoading.value = false
  }
}

onMounted(loadUser)
</script>
