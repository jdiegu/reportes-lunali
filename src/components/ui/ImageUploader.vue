<template>
  <div>
    <label class="input-label">{{ label }}</label>
    <div
      :class="[
        'relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden',
        preview ? 'border-solid' : ''
      ]"
      :style="{
        borderColor: isDragging ? 'var(--rose-primary)' : preview ? 'var(--border-color)' : 'var(--border-color)',
        background: isDragging ? 'var(--rose-lighter)' : preview ? 'transparent' : 'var(--bg-input)'
      }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="fileInput.click()"
    >
      <div v-if="preview" class="relative">
        <img :src="preview" class="w-full h-36 sm:h-44 object-cover" :alt="label" />
        <button
          type="button"
          @click.stop="clearFile"
          class="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm hover:scale-110"
          style="background: var(--bg-card); color: var(--error); border: 1px solid var(--border-color);"
        >
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <div class="absolute bottom-0 left-0 right-0 px-3 py-2" style="background: linear-gradient(transparent, rgba(0,0,0,0.55));">
          <p class="text-xs truncate text-white font-medium">{{ fileName }}</p>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-7 sm:py-9 px-4 text-center">
        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 transition-colors"
             :style="{ background: isDragging ? 'var(--rose-light)' : 'var(--rose-lighter)', color: 'var(--rose-primary)', border: '1px solid var(--rose-light)' }">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <p class="text-sm font-medium" :style="{ color: isDragging ? 'var(--rose-primary)' : 'var(--text-secondary)' }">
          {{ isDragging ? 'Suelta aqui' : 'Clic o arrastra una imagen' }}
        </p>
        <p class="text-xs mt-1" style="color: var(--text-muted);">{{ hint }}</p>
        <p class="text-xs mt-0.5" style="color: var(--text-muted); opacity: 0.5;">JPEG, PNG, WEBP · max 5 MB</p>
      </div>
    </div>

    <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="hidden" @change="handleFileChange" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: File,
  label: String,
  hint: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const isDragging = ref(false)
const preview = ref(null)
const fileName = ref('')

const setFile = (file) => {
  if (!file || !file.type.startsWith('image/')) return
  emit('update:modelValue', file)
  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => { preview.value = e.target.result }
  reader.readAsDataURL(file)
}

const handleFileChange = (e) => { setFile(e.target.files[0]) }
const handleDrop = (e) => { isDragging.value = false; setFile(e.dataTransfer.files[0]) }

const clearFile = () => {
  preview.value = null
  fileName.value = ''
  emit('update:modelValue', null)
  if (fileInput.value) fileInput.value.value = ''
}
</script>
