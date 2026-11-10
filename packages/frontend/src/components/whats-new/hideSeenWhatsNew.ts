/**
 * Hides the nav's "What's new" card when the visitor has already seen its
 * item. It runs as an inline script, through `toString()`, so it must not
 * reference anything outside its own body.
 */
export function hideSeenWhatsNew(card: HTMLElement, storageKey: string) {
  try {
    card.hidden = localStorage.getItem(storageKey) === 'true'
  } catch {
    // Storage can be blocked. The card then stays, as it does for a new visitor.
  }
}
