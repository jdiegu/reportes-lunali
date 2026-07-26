<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6">
    <div class="flex items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl">Plataformas</h1>
        <p class="text-xs sm:text-sm mt-0.5" style="color: var(--text-muted);">Gestiona las plataformas de streaming</p>
      </div>
      <button @click="openCreate" class="btn-primary text-xs sm:text-sm shrink-0">
        <Plus class="w-4 h-4" />
        <span class="hidden sm:inline">Nueva</span>
      </button>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="card p-4 flex items-center gap-3">
        <div class="skeleton w-10 h-10 rounded-xl"></div>
        <div class="flex-1 space-y-2"><div class="skeleton h-4 w-32 rounded"></div><div class="skeleton h-3 w-20 rounded"></div></div>
      </div>
    </div>

    <div v-else-if="platforms.length === 0" class="card py-12 text-center">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: var(--rose-lighter);">
        <Zap class="w-7 h-7" style="color: var(--rose-primary);" />
      </div>
      <p class="text-sm font-medium mb-2" style="color: var(--text-muted);">No hay plataformas</p>
      <button @click="openCreate" class="btn-primary text-sm">Crear primera plataforma</button>
    </div>

    <div v-else class="space-y-3">
      <div v-for="p in platforms" :key="p._id"
           class="card p-4 flex items-center gap-3 transition-colors"
           @mouseenter="e => e.currentTarget.style.borderColor = 'rgba(196,90,122,0.2)'"
           @mouseleave="e => e.currentTarget.style.borderColor = 'var(--border-color)'">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             :style="{ background: getPlatformColor(p.name) + '18', border: '1px solid ' + getPlatformColor(p.name) + '30' }">
          <Icon :icon="p.icon_id || getPlatformIconId(p.name)" class="w-5 h-5" :style="{ color: getPlatformColor(p.name) }" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold" style="color: var(--text-primary);">{{ p.name }}</p>
          <p class="text-xs" style="color: var(--text-muted);">
            Credito: ${{ (p.default_credit || 0).toFixed(2) }}
            <span v-if="p.active" class="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium" style="background: var(--success-bg); color: var(--success);">Activa</span>
            <span v-else class="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium" style="background: var(--error-bg); color: var(--error);">Inactiva</span>
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button @click="openEdit(p)" class="btn-icon !w-8 !h-8" style="color: var(--rose-primary);" title="Editar">
            <Pencil class="w-4 h-4" />
          </button>
          <button @click="confirmDelete(p)" class="btn-icon !w-8 !h-8" style="color: var(--error);" title="Eliminar">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div class="absolute inset-0" style="background: rgba(0,0,0,0.45); backdrop-filter: blur(6px);" @click="closeModal"></div>
          <div class="relative rounded-2xl border shadow-xl w-full max-w-lg p-5 sm:p-6 max-h-[85vh] overflow-y-auto"
               style="background: var(--bg-card); border-color: var(--border-color);">
            <div class="flex items-center justify-between mb-5">
              <h3 class="text-base sm:text-lg font-semibold" style="color: var(--text-primary);">{{ editing ? 'Editar' : 'Nueva' }} Plataforma</h3>
              <button @click="closeModal" class="btn-icon !w-8 !h-8">
                <X class="w-4 h-4" />
              </button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="input-label">Nombre</label>
                <input v-model="modalForm.name" type="text" class="input-field" placeholder="Netflix, Disney+, etc." />
              </div>

              <div>
                <label class="input-label">Icono</label>
                <div class="flex items-center gap-2 mb-2">
                  <input v-model="iconSearchQuery" type="text" class="input-field flex-1" placeholder="Buscar icono (ej: netflix, disney)..." @input="onIconSearch" />
                </div>

                <div v-if="modalForm.icon_id" class="flex items-center gap-2 mb-3 p-2 rounded-xl border"
                     style="background: var(--bg-surface); border-color: var(--border-color);">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                       :style="{ background: getPlatformColor(modalForm.name) + '18' }">
                    <Icon :icon="modalForm.icon_id" class="w-5 h-5" :style="{ color: getPlatformColor(modalForm.name) }" />
                  </div>
                  <span class="text-xs font-medium" style="color: var(--text-secondary);">{{ modalForm.icon_id }}</span>
                  <button @click="modalForm.icon_id = ''" class="text-[10px] ml-auto" style="color: var(--error);">Quitar</button>
                </div>

                <div v-if="suggestedIcons.length" class="mb-2">
                  <p class="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style="color: var(--text-muted);">Sugeridos</p>
                  <div class="grid grid-cols-8 sm:grid-cols-10 gap-1.5 p-2 rounded-xl border max-h-36 overflow-y-auto"
                       :style="{ background: 'var(--bg-page)', borderColor: 'var(--border-color)' }">
                    <button v-for="iconId in suggestedIcons" :key="iconId"
                            @click="selectIcon(iconId)"
                            class="aspect-square rounded-lg flex items-center justify-center transition-all border-2"
                            :style="modalForm.icon_id === iconId
                              ? { borderColor: 'var(--rose-primary)', background: 'rgba(196,90,122,0.1)' }
                              : { borderColor: 'transparent', background: 'var(--bg-card)' }"
                            :title="iconId">
                      <Icon :icon="iconId" class="w-5 h-5" style="color: var(--text-secondary);" />
                    </button>
                  </div>
                </div>

                <div v-if="searchResults.length && !suggestedIcons.length">
                  <p class="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style="color: var(--text-muted);">Resultados de busqueda</p>
                  <div class="grid grid-cols-8 sm:grid-cols-10 gap-1.5 p-2 rounded-xl border max-h-36 overflow-y-auto"
                       :style="{ background: 'var(--bg-page)', borderColor: 'var(--border-color)' }">
                    <button v-for="iconId in searchResults" :key="iconId"
                            @click="selectIcon(iconId)"
                            class="aspect-square rounded-lg flex items-center justify-center transition-all border-2"
                            :style="modalForm.icon_id === iconId
                              ? { borderColor: 'var(--rose-primary)', background: 'rgba(196,90,122,0.1)' }
                              : { borderColor: 'transparent', background: 'var(--bg-card)' }"
                            :title="iconId">
                      <Icon :icon="iconId" class="w-5 h-5" style="color: var(--text-secondary);" />
                    </button>
                  </div>
                </div>

                <div v-if="!suggestedIcons.length && !searchResults.length && !iconSearchQuery">
                  <p class="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style="color: var(--text-muted);">Todas las plataformas</p>
                  <div class="grid grid-cols-8 sm:grid-cols-10 gap-1.5 p-2 rounded-xl border max-h-36 overflow-y-auto"
                       :style="{ background: 'var(--bg-page)', borderColor: 'var(--border-color)' }">
                    <button v-for="item in allPlatformIcons" :key="item.key"
                            @click="selectIcon(item.iconId)"
                            class="aspect-square rounded-lg flex items-center justify-center transition-all border-2"
                            :style="modalForm.icon_id === item.iconId
                              ? { borderColor: 'var(--rose-primary)', background: 'rgba(196,90,122,0.1)' }
                              : { borderColor: 'transparent', background: 'var(--bg-card)' }"
                            :title="item.key">
                      <Icon :icon="item.iconId" class="w-5 h-5" :style="{ color: item.color }" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label class="input-label">Credito por defecto ($)</label>
                <input v-model.number="modalForm.default_credit" type="number" min="0" step="0.01" class="input-field" />
              </div>
              <div class="flex items-center gap-2">
                <button @click="modalForm.active = !modalForm.active"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                        :style="{ background: modalForm.active ? 'var(--rose-primary)' : 'var(--border-color)' }">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm"
                        :style="{ transform: modalForm.active ? 'translateX(22px)' : 'translateX(2px)' }" />
                </button>
                <span class="text-xs font-medium" style="color: var(--text-secondary);">{{ modalForm.active ? 'Activa' : 'Inactiva' }}</span>
              </div>
              <div v-if="modalError" class="rounded-lg border px-4 py-3 text-sm"
                   style="border-color: rgba(212,74,74,0.25); background: var(--error-bg); color: var(--error);">{{ modalError }}</div>
              <div class="flex justify-end gap-3 pt-2">
                <button @click="closeModal" class="btn-secondary text-sm">Cancelar</button>
                <button @click="savePlatform" :disabled="saving || !modalForm.name" class="btn-primary text-sm">
                  <span v-if="saving">Guardando...</span>
                  <span v-else>{{ editing ? 'Guardar' : 'Crear' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToastStore } from '../../store/toast'
import { platformsApi } from '../../api/axios'
import { getPlatformIconId, getPlatformColor, getAllPlatforms, searchIcons } from '../../utils/platformIcons'
import { Icon } from '@iconify/vue'
import { Plus, Zap, Pencil, Trash2, X } from '@lucide/vue'

const toast = useToastStore()
const loading = ref(true)
const platforms = ref([])
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)
const modalError = ref('')

const allPlatformIcons = getAllPlatforms()

const iconSearchQuery = ref('')
const searchResults = ref([])

const suggestedIcons = ref([])

const modalForm = reactive({
  name: '',
  icon_id: '',
  default_credit: 0,
  active: true,
})

function selectIcon(iconId) {
  modalForm.icon_id = iconId
}

let searchTimeout = null
function onIconSearch() {
  clearTimeout(searchTimeout)
  const query = iconSearchQuery.value.trim()
  if (query.length < 2) {
    searchResults.value = []
    suggestedIcons.value = []
    return
  }
  searchTimeout = setTimeout(async () => {
    const results = await searchIcons(query)
    searchResults.value = results
  }, 300)
}

async function loadPlatforms() {
  loading.value = true
  try {
    const { data } = await platformsApi.listAll()
    platforms.value = data || []
  } catch {
    platforms.value = []
  }
  loading.value = false
}

function openCreate() {
  editing.value = null
  modalForm.name = ''
  modalForm.icon_id = ''
  modalForm.default_credit = 0
  modalForm.active = true
  iconSearchQuery.value = ''
  searchResults.value = []
  suggestedIcons.value = []
  modalError.value = ''
  showModal.value = true
}

function openEdit(p) {
  editing.value = p._id
  modalForm.name = p.name
  modalForm.icon_id = p.icon_id || getPlatformIconId(p.name)
  modalForm.default_credit = p.default_credit || 0
  modalForm.active = p.active !== false
  iconSearchQuery.value = ''
  searchResults.value = []
  suggestedIcons.value = [modalForm.icon_id]
  modalError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editing.value = null
  modalError.value = ''
}

async function savePlatform() {
  modalError.value = ''
  if (!modalForm.name.trim()) {
    modalError.value = 'El nombre es obligatorio'
    return
  }
  saving.value = true
  try {
    const payload = {
      name: modalForm.name.trim(),
      icon_id: modalForm.icon_id || getPlatformIconId(modalForm.name),
      default_credit: modalForm.default_credit,
      active: modalForm.active,
    }
    if (editing.value) {
      await platformsApi.update(editing.value, payload)
      toast.success('Actualizada', 'Plataforma actualizada')
    } else {
      await platformsApi.create(payload)
      toast.success('Creada', 'Plataforma creada')
    }
    await loadPlatforms()
    closeModal()
  } catch (e) {
    modalError.value = e.response?.data?.message || 'Error al guardar'
  } finally {
    saving.value = false
  }
}

function confirmDelete(p) {
  if (confirm(`Eliminar la plataforma "${p.name}"?`)) {
    deletePlatform(p._id)
  }
}

async function deletePlatform(id) {
  try {
    await platformsApi.delete(id)
    toast.success('Eliminada', 'Plataforma eliminada')
    await loadPlatforms()
  } catch (e) {
    toast.error('Error', e.response?.data?.message || 'No se pudo eliminar')
  }
}

onMounted(loadPlatforms)
</script>

<style scoped>
.modal-enter-active { transition: opacity 0.25s cubic-bezier(0.21, 1.02, 0.73, 1); }
.modal-leave-active { transition: opacity 0.15s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .relative { transition: transform 0.25s cubic-bezier(0.21, 1.02, 0.73, 1); }
.modal-enter-from .relative { transform: scale(0.96) translateY(8px); }
</style>
