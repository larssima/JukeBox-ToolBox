<script setup>
import { ref, watch, onMounted } from 'vue'
import { renderCardToDataURL } from '../utils/renderCard.js'

const props = defineProps({
  cards: { type: Array, required: true },
})

const cardWidthMm = ref(90)
const images = ref([]) // [{ id, url }]

async function refresh() {
  images.value = await Promise.all(
    props.cards.map(async (card) => ({ id: card.id, url: await renderCardToDataURL(card, 1200) })),
  )
}

onMounted(refresh)
watch(() => props.cards, refresh, { deep: true })

function print() {
  window.print()
}
</script>

<template>
  <div class="print-sheet">
    <div class="controls no-print">
      <label>
        Card width (mm)
        <input type="number" v-model.number="cardWidthMm" min="30" max="190" step="1" />
      </label>
      <button type="button" @click="print" :disabled="images.length === 0">Print sheet</button>
      <span class="hint">Sheet is A4. Cut along the dashed lines.</span>
    </div>

    <div v-if="images.length === 0" class="empty no-print">No stickers added to the sheet yet.</div>

    <div class="print-area">
      <div class="sheet-page">
        <img
          v-for="img in images"
          :key="img.id"
          :src="img.url"
          class="sheet-card"
          :style="{ width: cardWidthMm + 'mm' }"
          alt="sticker"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  flex-wrap: wrap;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  color: #444;
}

.controls input {
  width: 70px;
  padding: 0.3rem 0.4rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.controls button {
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  border: 1px solid #3b82f6;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}

.controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hint {
  color: #888;
}

.empty {
  color: #777;
  font-size: 0.9rem;
}

.sheet-page {
  display: flex;
  flex-wrap: wrap;
  gap: 3mm;
  background: #fff;
  border: 1px solid #ddd;
  padding: 8mm;
}

.sheet-card {
  display: block;
  height: auto;
  outline: 1px dashed #999;
  outline-offset: 2px;
  break-inside: avoid;
}
</style>
