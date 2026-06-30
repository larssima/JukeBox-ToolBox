<script setup>
import CardCanvas from './CardCanvas.vue'
import { renderCardToDataURL } from '../utils/renderCard.js'

const props = defineProps({
  cards: { type: Array, required: true },
})

const emit = defineEmits(['edit', 'duplicate', 'delete'])

async function download(card) {
  const url = await renderCardToDataURL(card, 1200)
  const a = document.createElement('a')
  const name = [card.artist, card.songA].filter(Boolean).join(' - ') || 'sticker'
  a.href = url
  a.download = `${name}.png`
  a.click()
}
</script>

<template>
  <div class="card-list">
    <p v-if="cards.length === 0" class="empty">No stickers saved yet. Fill in the form and click "Add to sheet".</p>

    <div v-for="card in cards" :key="card.id" class="card-row">
      <CardCanvas :card="card" :width="450" class="thumb" />
      <div class="meta">
        <strong>{{ card.artist || '(no artist)' }}</strong>
        <span>{{ card.songA || '—' }} / {{ card.songB || '—' }}</span>
      </div>
      <div class="actions">
        <button type="button" @click="emit('edit', card.id)">Edit</button>
        <button type="button" @click="emit('duplicate', card.id)">Duplicate</button>
        <button type="button" @click="download(card)">Download</button>
        <button type="button" class="danger" @click="emit('delete', card.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.empty {
  color: #777;
  font-size: 0.9rem;
}

.card-row {
  display: grid;
  grid-template-columns: 160px 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}

.thumb {
  width: 160px;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.85rem;
  color: #333;
  min-width: 0;
}

.meta span {
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.actions button {
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #f7f7f7;
  cursor: pointer;
  font-size: 0.8rem;
}

.actions button:hover {
  background: #eee;
}

.actions button.danger {
  border-color: #f3b4b4;
  color: #b91c1c;
  background: #fff5f5;
}

.actions button.danger:hover {
  background: #ffe7e7;
}
</style>
