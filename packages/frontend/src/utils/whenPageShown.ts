/**
 * Runs `callback` once the visitor sees the page: right away, or when they
 * navigate to a page Chromium prerendered on hover (see speculationRules.ts).
 * For side effects that must count real visits only, since most prerendered
 * pages are never shown. Returns a function that cancels a pending callback.
 */
export function whenPageShown(callback: () => void): () => void {
  if (!document.prerendering) {
    callback()
    return () => {}
  }
  document.addEventListener('prerenderingchange', callback, { once: true })
  return () => document.removeEventListener('prerenderingchange', callback)
}
