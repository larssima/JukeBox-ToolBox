import { reactive } from 'vue'
import { saveFontRecord, loadAllFontRecords } from '../utils/fontStore.js'

// Curated fonts that fit the vintage jukebox label look.
// `google` holds the family name as used in the Google Fonts URL (omit for system fonts).
// `weight` is what gets used to draw on canvas; `weights` is the full set fetched from Google.
export const FONTS = [
  { id: 'special-elite', name: 'Special Elite (typewriter)', family: '"Special Elite", monospace', google: 'Special+Elite', weights: '400', weight: 400 },
  { id: 'oswald', name: 'Oswald (condensed)', family: '"Oswald", sans-serif', google: 'Oswald:wght@500;700', weights: '500;700', weight: 700 },
  { id: 'bebas-neue', name: 'Bebas Neue (display)', family: '"Bebas Neue", sans-serif', google: 'Bebas+Neue', weights: '400', weight: 400 },
  { id: 'anton', name: 'Anton (bold display)', family: '"Anton", sans-serif', google: 'Anton', weights: '400', weight: 400 },
  { id: 'roboto-condensed', name: 'Roboto Condensed', family: '"Roboto Condensed", sans-serif', google: 'Roboto+Condensed:wght@400;700', weights: '400;700', weight: 700 },
  { id: 'arial', name: 'Arial (system)', family: 'Arial, Helvetica, sans-serif', google: null, weight: 700 },
]

export const DEFAULT_FONT_ID = FONTS[0].id

// Fonts uploaded by the user, persisted in IndexedDB so they survive a reload.
export const customFonts = reactive([])

async function registerFontFace(id, buffer) {
  const cssFamily = `JukeCustomFont_${id}`
  const fontFace = new FontFace(cssFamily, buffer)
  await fontFace.load()
  document.fonts.add(fontFace)
  return cssFamily
}

export async function addCustomFont(file) {
  const id = `custom-${crypto.randomUUID()}`
  const buffer = await file.arrayBuffer()
  const cssFamily = await registerFontFace(id, buffer)
  const name = file.name.replace(/\.(ttf|otf|woff2?)$/i, '')

  const entry = { id, name, family: `"${cssFamily}"`, google: null, weight: 400 }
  customFonts.push(entry)

  saveFontRecord({ id, name, buffer }).catch(() => {}) // best-effort persistence

  return entry
}

// Re-registers previously uploaded fonts from IndexedDB. Call once on startup.
export async function restoreCustomFonts() {
  let records = []
  try {
    records = await loadAllFontRecords()
  } catch {
    return
  }
  for (const record of records) {
    try {
      const cssFamily = await registerFontFace(record.id, record.buffer)
      customFonts.push({ id: record.id, name: record.name, family: `"${cssFamily}"`, google: null, weight: 400 })
    } catch {
      // skip a record that fails to load (e.g. corrupted font data)
    }
  }
}

export function getAllFonts() {
  return [...FONTS, ...customFonts]
}

export function getFont(id) {
  return getAllFonts().find((f) => f.id === id) ?? FONTS[0]
}

const LAST_FONT_KEY = 'jukebox-toolbox:last-font-id'

export function rememberLastFontId(id) {
  try {
    localStorage.setItem(LAST_FONT_KEY, id)
  } catch {
    // localStorage unavailable (e.g. private browsing) — not critical
  }
}

export function getLastFontId() {
  try {
    return localStorage.getItem(LAST_FONT_KEY)
  } catch {
    return null
  }
}
