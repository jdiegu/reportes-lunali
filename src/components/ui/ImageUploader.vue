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
          <X class="w-3 h-3" :stroke-width="2.5" />
        </button>
        <div class="absolute bottom-0 left-0 right-0 px-3 py-2" style="background: linear-gradient(transparent, rgba(0,0,0,0.55));">
          <p class="text-xs truncate text-white font-medium">{{ fileName }}</p>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-7 sm:py-9 px-4 text-center">
        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 transition-colors"
             :style="{ background: isDragging ? 'var(--rose-light)' : 'var(--rose-lighter)', color: 'var(--rose-primary)', border: '1px solid var(--rose-light)' }">
          <ImageIcon class="w-5 h-5" />
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
import { ref, watch } from 'vue'
import { X, Image as ImageIcon } from '@lucide/vue'

const props = defineProps({
  modelValue: File,
  label: String,
  hint: { type: String, default: '' },
  initialPreview: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'cleared'])

const fileInput = ref(null)
const isDragging = ref(false)
const preview = ref(null)
const fileName = ref('')
const isShowingInitial = ref(false)

watch(() => props.initialPreview, (url) => {
  if (url) {
    preview.value = url
    isShowingInitial.value = true
    fileName.value = 'Imagen actual'
  }
}, { immediate: true })

const setFile = (file) => {
  if (!file || !file.type.startsWith('image/')) return
  isShowingInitial.value = false
  emit('update:modelValue', file)
  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => { preview.value = e.target.result }
  reader.readAsDataURL(file)
}

const handleFileChange = (e) => { setFile(e.target.files[0]) }
const handleDrop = (e) => { isDragging.value = false; setFile(e.dataTransfer.files[0]) }

const clearFile = () => {
  if (isShowingInitial.value) {
    emit('cleared')
  }
  isShowingInitial.value = false
  preview.value = null
  fileName.value = ''
  emit('update:modelValue', null)
  if (fileInput.value) fileInput.value.value = ''
}
</script>
