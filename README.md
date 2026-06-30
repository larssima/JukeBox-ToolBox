# JukeBox Sticker Maker

A small Vue 3 + Vite app for designing the selection-card stickers used inside a jukebox title strip — the cards that show the side‑A title on top, the artist in the middle band, and the side‑B title on the bottom.

## Features

- **Templates** — pick from the colored card templates in `src/assets/templates`.
- **Fonts** — choose from a curated set of vintage/typewriter-style Google Fonts, or upload your own `.ttf`/`.otf`/`.woff`/`.woff2` file. Uploaded fonts and your last-used font are remembered between visits.
- **Live preview** — a canvas render of the card updates as you type, auto-sizing text to fit each zone (top title / artist band / bottom title).
- **Sticker sheet** — add finished cards to a list (edit, duplicate, delete, or download any of them as a PNG). The sheet persists in the browser until you clear it.
- **Print sheet** — lays all saved stickers out on an A4 page with cut guides and an adjustable card width, ready to print and cut.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
