<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import CardForm from './components/CardForm.vue'
import CardCanvas from './components/CardCanvas.vue'
import CardList from './components/CardList.vue'
import PrintSheet from './components/PrintSheet.vue'
import { renderCardToDataURL } from './utils/renderCard.js'
import { DEFAULT_FONT_ID, getAllFonts, getLastFontId, rememberLastFontId, restoreCustomFonts } from './data/fonts.js'

const SAVED_CARDS_KEY = 'jukebox-toolbox:saved-cards'

let nextId = 1
const lastFontId = ref(getLastFontId() || DEFAULT_FONT_ID)

function blankCard() {
  return { id: null, templateId: 'red', fontId: lastFontId.value, artist: '', songA: '', songB: '' }
}

const currentCard = reactive(blankCard())
const editingId = ref(null) // id of saved card currently being edited, or null when composing new
const savedCards = ref([])
const previewCanvas = ref(null)

watch(
  () => currentCard.fontId,
  (id) => {
    lastFontId.value = id
    rememberLastFontId(id)
  },
)

watch(
  savedCards,
  (cards) => {
    try {
      localStorage.setItem(SAVED_CARDS_KEY, JSON.stringify(cards))
    } catch {
      // localStorage unavailable (e.g. private browsing) — not critical
    }
  },
  { deep: true },
)

onMounted(async () => {
  // restore custom font files before saved cards so their thumbnails render with the right font
  await restoreCustomFonts()

  // the remembered font may have been a custom upload that's no longer in storage
  if (editingId.value === null && !getAllFonts().some((f) => f.id === currentCard.fontId)) {
    currentCard.fontId = DEFAULT_FONT_ID
  }
  previewCanvas.value?.render()

  try {
    const raw = localStorage.getItem(SAVED_CARDS_KEY)
    const cards = raw ? JSON.parse(raw) : []
    savedCards.value = cards
    nextId = cards.reduce((max, c) => Math.max(max, c.id), 0) + 1
  } catch {
    // ignore corrupted/unavailable storage and start with an empty sheet
  }
})

function clearSheet() {
  if (savedCards.value.length === 0) return
  if (confirm('Clear all saved stickers from the sheet? This cannot be undone.')) {
    savedCards.value = []
  }
}

function addOrUpdateCard() {
  if (editingId.value !== null) {
    const idx = savedCards.value.findIndex((c) => c.id === editingId.value)
    if (idx !== -1) savedCards.value[idx] = { ...currentCard, id: editingId.value }
    editingId.value = null
  } else {
    savedCards.value.push({ ...currentCard, id: nextId++ })
  }
  Object.assign(currentCard, blankCard())
}

function editCard(id) {
  const card = savedCards.value.find((c) => c.id === id)
  if (!card) return
  Object.assign(currentCard, card)
  editingId.value = id
}

function duplicateCard(id) {
  const card = savedCards.value.find((c) => c.id === id)
  if (!card) return
  savedCards.value.push({ ...card, id: nextId++ })
}

function deleteCard(id) {
  savedCards.value = savedCards.value.filter((c) => c.id !== id)
  if (editingId.value === id) {
    editingId.value = null
    Object.assign(currentCard, blankCard())
  }
}

function cancelEdit() {
  editingId.value = null
  Object.assign(currentCard, blankCard())
}

async function downloadCurrent() {
  const url = await renderCardToDataURL(currentCard, 1200)
  const a = document.createElement('a')
  const name = [currentCard.artist, currentCard.songA].filter(Boolean).join(' - ') || 'sticker'
  a.href = url
  a.download = `${name}.png`
  a.click()
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header no-print">
      <h1>JukeBox Sticker Maker</h1>
      <p>Pick a template and font, fill in the titles, then add stickers to your print sheet.</p>
    </header>

    <main class="editor-layout no-print">
      <section class="panel">
        <h2>{{ editingId !== null ? 'Edit sticker' : 'New sticker' }}</h2>
        <CardForm v-model="currentCard" />
        <div class="form-actions">
          <button type="button" class="primary" @click="addOrUpdateCard">
            {{ editingId !== null ? 'Save changes' : 'Add to sheet' }}
          </button>
          <button type="button" @click="downloadCurrent">Download PNG</button>
          <button type="button" v-if="editingId !== null" @click="cancelEdit">Cancel</button>
        </div>
      </section>

      <section class="panel">
        <h2>Preview</h2>
        <CardCanvas ref="previewCanvas" :card="currentCard" :width="900" />
      </section>
    </main>

    <section class="panel no-print">
      <div class="panel-header">
        <h2>Saved stickers ({{ savedCards.length }})</h2>
        <button type="button" class="clear-btn" :disabled="savedCards.length === 0" @click="clearSheet">
          Clear sheet
        </button>
      </div>
      <CardList :cards="savedCards" @edit="editCard" @duplicate="duplicateCard" @delete="deleteCard" />
    </section>

    <section class="panel">
      <h2 class="no-print">Print sheet</h2>
      <PrintSheet :cards="savedCards" />
    </section>
  </div>
</template>

<style scoped>
.app-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.app-header h1 {
  margin: 0 0 0.3rem;
  font-size: 1.6rem;
}

.app-header p {
  margin: 0;
  color: #666;
}

.editor-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 760px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
}

.panel {
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 1.2rem;
  background: #fff;
}

.panel h2 {
  margin: 0 0 1rem;
  font-size: 1.05rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.panel-header h2 {
  margin: 0;
}

.clear-btn {
  margin-bottom: 1rem;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #f3b4b4;
  background: #fff5f5;
  color: #b91c1c;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.2rem;
  flex-wrap: wrap;
}

.form-actions button {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #f7f7f7;
  cursor: pointer;
  font-weight: 600;
}

.form-actions button.primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}
</style>
