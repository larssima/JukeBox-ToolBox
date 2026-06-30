<script setup>
import TemplateSelector from './TemplateSelector.vue'
import FontSelector from './FontSelector.vue'

const card = defineModel({ type: Object, required: true })
</script>

<template>
  <div class="card-form">
    <label class="field">
      <span>Template</span>
      <TemplateSelector v-model="card.templateId" />
    </label>

    <label class="field">
      <span>Font</span>
      <FontSelector v-model="card.fontId" />
    </label>

    <label class="field">
      <span>Side A title (top)</span>
      <input v-model="card.songA" type="text" placeholder="e.g. Twisting The Night Away" maxlength="40" />
    </label>

    <label class="field">
      <span>Artist (middle)</span>
      <input v-model="card.artist" type="text" placeholder="e.g. Sam Cooke" maxlength="30" />
    </label>

    <label class="field">
      <span>Side B title (bottom)</span>
      <input v-model="card.songB" type="text" placeholder="e.g. Chain Gang" maxlength="40" />
    </label>
  </div>
</template>

<style scoped>
.card-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
}

.field input {
  padding: 0.55rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  font-weight: 400;
  color: #111;
}
</style>
