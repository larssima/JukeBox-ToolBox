import { getTemplate } from '../data/templates.js'
import { getFont } from '../data/fonts.js'
import { loadGoogleFont } from '../composables/useGoogleFont.js'

const imageCache = new Map()

function loadImage(src) {
  if (imageCache.has(src)) return imageCache.get(src)
  const p = new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
  imageCache.set(src, p)
  return p
}

function fitAndDraw(ctx, text, zone, canvasW, canvasH, fontFamily, weight, color, scale = 1) {
  if (!text) return
  const upper = text.toUpperCase()
  const maxWidth = (zone.xMax - zone.xMin) * canvasW
  const zoneHeight = (zone.bottom - zone.top) * canvasH
  const cx = ((zone.xMin + zone.xMax) / 2) * canvasW
  const cy = zone.yCenter * canvasH

  // scale adjusts the starting size; the height cap keeps it from spilling into neighboring zones
  let fontSize = Math.floor(Math.min(zoneHeight * 0.78 * scale, zoneHeight * 0.95))
  const minFontSize = 6
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  while (fontSize > minFontSize) {
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`
    if (ctx.measureText(upper).width <= maxWidth) break
    fontSize -= 1
  }
  ctx.font = `${weight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.fillText(upper, cx, cy, maxWidth)
}

// Draws a sticker card onto `canvas` at the given render width (aspect is fixed 3:1).
export async function drawCard(canvas, card, width = 900) {
  const template = getTemplate(card.templateId)
  const font = getFont(card.fontId)
  await loadGoogleFont(font)
  const img = await loadImage(template.src)

  const w = width
  const h = Math.round(w / 3)
  canvas.width = w
  canvas.height = h

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)

  const textColor = '#1a1a1a'
  const weight = font.weight ?? 700
  fitAndDraw(ctx, card.songA, template.zones.top, w, h, font.family, weight, textColor, card.songAScale ?? 1)
  fitAndDraw(ctx, card.artist, template.zones.middle, w, h, font.family, weight, textColor, card.artistScale ?? 1)
  fitAndDraw(ctx, card.songB, template.zones.bottom, w, h, font.family, weight, textColor, card.songBScale ?? 1)
}

// Renders a card off-screen and returns a PNG data URL, for downloads/export.
export async function renderCardToDataURL(card, width = 900) {
  const canvas = document.createElement('canvas')
  await drawCard(canvas, card, width)
  return canvas.toDataURL('image/png')
}
