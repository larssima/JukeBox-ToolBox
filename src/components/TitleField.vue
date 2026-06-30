<script setup>
defineProps({
  label: { type: String, required: true },
  placeholder: { type: String, default: '' },
  maxlength: { type: Number, default: 40 },
})

const text = defineModel('text', { type: String, required: true })
const scale = defineModel('scale', { type: Number, default: 1 })
</script>

<template>
  <div class="field">
    <div class="field-head">
      <span>{{ label }}</span>
      <span class="size-readout">{{ Math.round(scale * 100) }}%</span>
    </div>
    <input v-model="text" type="text" :placeholder="placeholder" :maxlength="maxlength" />
    <input v-model.number="scale" type="range" min="0.5" max="1.6" step="0.05" class="size-slider" />
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
}

.field-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.size-readout {
  font-weight: 400;
  color: #888;
  font-size: 0.78rem;
}

.field input[type='text'] {
  padding: 0.55rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  font-weight: 400;
  color: #111;
}

.size-slider {
  width: 100%;
  accent-color: #3b82f6;
}
</style>
