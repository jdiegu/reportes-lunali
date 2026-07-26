<template>
  <div class="relative" ref="rootRef">
    <button type="button" @click="open = !open"
            class="input-field flex items-center gap-2 text-left w-full">
      <Icon :icon="selectedIconId" class="w-4 h-4 shrink-0" :style="{ color: selectedColor }" />
      <span class="flex-1 truncate text-sm" :style="{ color: selected ? 'var(--text-primary)' : 'var(--text-muted)' }">
        {{ selected || placeholder }}
      </span>
      <ChevronDown class="w-4 h-4 shrink-0 transition-transform" :class="{ 'rotate-180': open }" style="color: var(--text-muted);" />
    </button>

    <Transition name="dropdown">
      <div v-if="open"
           class="absolute z-50 mt-1.5 w-full rounded-xl border shadow-xl overflow-hidden max-h-60 overflow-y-auto"
           style="background: var(--bg-card); border-color: var(--border-color);">
        <div class="p-1.5">
          <div v-if="platforms.length === 0" class="px-3 py-4 text-center text-xs" style="color: var(--text-muted);">
            No hay plataformas
          </div>
          <button v-for="p in platforms" :key="p._id" type="button"
                  @click="select(p.name)"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  :style="selected === p.name
                    ? { background: 'var(--rose-lighter)', color: 'var(--rose-primary)' }
                    : { color: 'var(--text-primary)' }"
                  @mouseenter="$event.currentTarget.style.background = selected === p.name ? 'var(--rose-lighter)' : 'var(--bg-surface)'"
                  @mouseleave="$event.currentTarget.style.background = selected === p.name ? 'var(--rose-lighter)' : 'transparent'">
            <Icon :icon="p.icon_id || getPlatformIconId(p.name)" class="w-4 h-4 shrink-0" :style="{ color: p.icon_id ? getPlatformColor(p.name) : getPlatformColor(p.name) }" />
            <span class="truncate">{{ p.name }}</span>
            <span v-if="!p.active" class="ml-auto text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                  style="background: var(--error-bg); color: var(--error);">Off</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { ChevronDown } from '@lucide/vue'
import { getPlatformIconId, getPlatformColor } from '../../utils/platformIcons'

const props = defineProps({
  modelValue: { type: String, default: '' },
  platforms: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Selecciona' },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const rootRef = ref(null)

const selected = computed(() => props.modelValue)
const selectedIconId = computed(() => {
  if (!selected.value) return 'mdi:application'
  const match = props.platforms.find(p => p.name === selected.value)
  if (match?.icon_id) return match.icon_id
  return getPlatformIconId(selected.value)
})
const selectedColor = computed(() => {
  if (!selected.value) return '#888'
  return getPlatformColor(selected.value)
})

function select(name) {
  emit('update:modelValue', name)
  open.value = false
}

function onClickOutside(e) {
  if (rootRef.value && !rootRef.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.dropdown-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }
</style>
