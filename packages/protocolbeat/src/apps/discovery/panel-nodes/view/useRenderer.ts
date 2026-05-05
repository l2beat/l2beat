// Read once at module load. Switching renderer requires a page reload, which
// is fine for a prototype A/B feature flag and keeps the runtime path simple.
const renderer =
  typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('renderer')
    : null

export const USE_CANVAS_RENDERER = renderer === 'canvas'
