<template>
  <div>
    <label class="input-label">{{ label }}</label>
    <div
      :class="[
        'relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden',
        isDragging ? 'border-rose-500 bg-rose-900/20' : 'border-rose-900/40 hover:border-rose-700/60 hover:bg-rose-900/10',
        preview ? 'border-solid border-rose-700/40' : ''
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="fileInput.click()"
    >
      <!-- Preview -->
      <div v-if="preview" class="relative">
        <img :src="preview" class="w-full h-40 object-cover" :alt="label" />
        <button
          type="button"
          @click.stop="clearFile"
          class="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark-950/80 border border-rose-900/50 text-rose-400 flex items-center justify-center hover:bg-rose-700 hover:text-white transition-colors"
        >
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <div class="absolute bottom-0 left-0 right-0 bg-dark-950/70 px-3 py-1.5">
          <p class="text-blush-300 text-xs truncate">{{ fileName }}</p>
        </div>
      </div>

      <!-- Upload prompt -->
      <div v-else class="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div class="w-10 h-10 rounded-xl bg-rose-900/30 border border-rose-900/30 flex items-center justify-center mb-3 transition-colors group-hover:bg-rose-800/30">
          <svg class="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <p class="text-blush-400 text-sm font-medium">
          {{ isDragging ? 'Suelta aquí' : 'Clic o arrastra una imagen' }}
        </p>
        <p class="text-blush-600 text-xs mt-1">{{ hint }}</p>
        <p class="text-blush-700 text-xs mt-0.5">JPEG, PNG, WEBP · máx 5 MB</p>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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

const handleFileChange = (e) => {
  setFile(e.target.files[0])
}

const handleDrop = (e) => {
  isDragging.value = false
  setFile(e.dataTransfer.files[0])
}

const clearFile = () => {
  preview.value = null
  fileName.value = ''
  emit('update:modelValue', null)
  if (fileInput.value) fileInput.value.value = ''
}
</script>