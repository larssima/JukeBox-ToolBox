<script setup>
import { TEMPLATES } from '../data/templates.js'

const modelValue = defineModel({ type: String, required: true })
</script>

<template>
  <div class="template-selector">
    <button
      v-for="t in TEMPLATES"
      :key="t.id"
      type="button"
      class="swatch"
      :class="{ active: modelValue === t.id }"
      @click="modelValue = t.id"
      :title="t.name"
    >
      <img :src="t.src" :alt="t.name" />
      <span>{{ t.name }}</span>
    </button>
  </div>
</template>

<style scoped>
.template-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: #f4f4f4;
  cursor: pointer;
  font-size: 0.75rem;
  color: #333;
  width: 110px;
}

.swatch img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  background: #fff;
}

.swatch.active {
  border-color: #3b82f6;
  background: #eaf2ff;
}

.swatch:hover {
  border-color: #93c5fd;
}
</style>
