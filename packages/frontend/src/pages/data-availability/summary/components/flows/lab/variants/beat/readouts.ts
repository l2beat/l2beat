// What changes every frame outside the canvas is written straight onto its
// elements: as React state it would re-render the variant sixty times a second

const RING_SECONDS = 0.5

/** A ring goes out from a row's icon each time one of its notes sounds */
export function pulseRings(
  rings: readonly (HTMLElement | null)[],
  lastFired: readonly (number | undefined)[],
  now: number,
) {
  rings.forEach((ring, track) => {
    if (!ring) return
    const fired = lastFired[track]
    const progress = fired === undefined ? 1 : (now - fired) / RING_SECONDS
    if (progress < 0 || progress >= 1) {
      if (ring.style.opacity !== '0') ring.style.opacity = '0'
      return
    }
    const spread = 1 - (1 - progress) ** 3
    ring.style.opacity = String(0.9 * (1 - progress) ** 1.5)
    ring.style.transform = `scale(${1 + 0.6 * spread})`
  })
}

/** The speaker's waves follow how loud what is heard is, 0–1 */
export function showSoundLevel(speaker: SVGElement | null, level: number) {
  speaker?.style.setProperty('--level', level.toFixed(2))
}

export function showText(element: HTMLElement | null, text: string) {
  if (element) element.textContent = text
}
