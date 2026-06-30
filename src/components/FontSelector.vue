<script setup>
import { ref } from 'vue'
import { FONTS, customFonts, addCustomFont } from '../data/fonts.js'

const modelValue = defineModel({ type: String, required: true })

const fileInput = ref(null)
const uploading = ref(false)
const error = ref('')

function triggerUpload() {
  fileInput.value?.click()
}

async function onFileChange(event) {
  const file = event.target.files?.[0]
  event.target.value = '' // allow re-selecting the same file later
  if (!file) return

  error.value = ''
  uploading.value = true
  try {
    const entry = await addCustomFont(file)
    modelValue.value = entry.id
  } catch (err) {
    error.value = 'Could not load that font file. Try a .ttf, .otf, .woff or .woff2.'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="font-selector">
    <select v-model="modelValue">
      <optgroup label="Built-in">
        <option v-for="f in FONTS" :key="f.id" :value="f.id" :style="{ fontFamily: f.family }">
          {{ f.name }}
        </option>
      </optgroup>
      <optgroup v-if="customFonts.length" label="Your fonts">
        <option v-for="f in customFonts" :key="f.id" :value="f.id" :style="{ fontFamily: f.family }">
          {{ f.name }}
        </option>
      </optgroup>
    </select>

    <button type="button" class="upload-btn" @click="triggerUpload" :disabled="uploading">
      {{ uploading ? 'Loading…' : 'Upload font…' }}
    </button>
    <input ref="fileInput" type="file" accept=".ttf,.otf,.woff,.woff2" class="hidden-input" @change="onFileChange" />

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.font-selector {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

select {
  flex: 1;
  min-width: 160px;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
}

.upload-btn {
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #f7f7f7;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hidden-input {
  display: none;
}

.error {
  width: 100%;
  margin: 0.3rem 0 0;
  color: #b91c1c;
  font-size: 0.8rem;
}
</style>
