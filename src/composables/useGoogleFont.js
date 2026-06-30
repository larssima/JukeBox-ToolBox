const loadedHrefs = new Set()

// Injects a Google Fonts <link> tag once per family and resolves once the
// browser has the face ready, so canvas text doesn't draw with a fallback
// font on the first paint.
export function loadGoogleFont(font) {
  if (!font.google) return Promise.resolve()

  const href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`

  if (!loadedHrefs.has(href)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
    loadedHrefs.add(href)
  }

  const weights = font.weights ? font.weights.split(';') : ['400']
  const familyName = font.family.split(',')[0]
  return Promise.all(
    weights.map((w) => document.fonts.load(`${w} 16px ${familyName}`)),
  ).catch(() => {})
}
