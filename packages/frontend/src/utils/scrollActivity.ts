const SCROLL_SETTLE_MS = 200

let scrolling = false
let settleTimer: ReturnType<typeof setTimeout> | undefined
const listeners = new Set<() => void>()

function onScroll() {
  if (!scrolling) {
    scrolling = true
    document.documentElement.setAttribute('data-scrolling', '')
  }
  clearTimeout(settleTimer)
  settleTimer = setTimeout(() => {
    scrolling = false
    document.documentElement.removeAttribute('data-scrolling')
    for (const listener of listeners) listener()
  }, SCROLL_SETTLE_MS)
}

let started = false
function start() {
  if (started || typeof window === 'undefined') return
  started = true
  window.addEventListener('scroll', onScroll, { passive: true })
}

export function isScrolling(): boolean {
  start()
  return scrolling
}

/** Calls back once, the next time scrolling has been idle for a moment. */
export function onceScrollSettled(callback: () => void): () => void {
  start()
  const listener = () => {
    listeners.delete(listener)
    callback()
  }
  listeners.add(listener)
  return () => listeners.delete(listener)
}
