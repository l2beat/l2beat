const SCROLL_SETTLE_MS = 200
const SCROLLING_ATTRIBUTE = 'data-scrolling'

/** Tailwind class: ignore the pointer while the page scrolls. */
export const ignorePointerWhileScrollingClassName =
  '[[data-scrolling]_&]:pointer-events-none'

let scrolling = false
let settleTimer: ReturnType<typeof setTimeout> | undefined
const settledListeners = new Set<() => void>()

/**
 * Runs the callback now if the page is idle, otherwise once scrolling has
 * been quiet for a moment; `deferred` tells the callback which one happened.
 * Returns a cancel function.
 */
export function whenScrollSettled(
  callback: (deferred: boolean) => void,
): () => void {
  startTrackingScroll()
  if (!scrolling) {
    callback(false)
    return () => {}
  }
  const listener = () => {
    settledListeners.delete(listener)
    callback(true)
  }
  settledListeners.add(listener)
  return () => settledListeners.delete(listener)
}

let tracking = false
function startTrackingScroll() {
  if (tracking || typeof window === 'undefined') return
  tracking = true
  window.addEventListener('scroll', onScroll, { passive: true })
}

function onScroll() {
  if (!scrolling) {
    scrolling = true
    document.documentElement.setAttribute(SCROLLING_ATTRIBUTE, '')
  }
  clearTimeout(settleTimer)
  settleTimer = setTimeout(onScrollSettled, SCROLL_SETTLE_MS)
}

function onScrollSettled() {
  scrolling = false
  document.documentElement.removeAttribute(SCROLLING_ATTRIBUTE)
  for (const listener of settledListeners) listener()
}
