import { grown, heartHeight, heartOutline, PINK, type Placement } from './marks'
import { OG_SIZE } from './render'

// The logo's heart glowing on the dark ground, with outlines of it spreading
// out like the echo of a beat. Each ring is the last one grown by the same
// factor, so the gaps widen as the rings leave the heart.

const RING_GROWTH = 1.45
const RINGS = 9
const RING_WIDTH = 2.5
const RING_OPACITY = 0.95
const RING_FADE = 0.72
const RING_GLOW = 0.012 // blur, of the heart's height

/** Haze layers, from the bright rim hugging the heart to the wide dim one. Blur is of the heart's height. */
const HAZE = [
  { factor: 1, blur: 0.05, opacity: 0.9 },
  { factor: 1.1, blur: 0.15, opacity: 0.5 },
  { factor: 1.7, blur: 0.3, opacity: 0.28 },
  { factor: 2.6, blur: 0.5, opacity: 0.12 },
]

// In the inner part of a clearing the rings vanish; they come back by its edge.
const CLEARING_INNER = 0.62

const { width: W, height: H } = OG_SIZE
const round = (v: number) => +v.toFixed(2)

/** An ellipse on the canvas, by its centre and radii. */
export interface Ellipse {
  cx: number
  cy: number
  rx: number
  ry: number
}

/**
 * SVG markup for the glow and rings around the placed heart; draw the lockup
 * over it. The rings fade out inside `clearing`, so text there reads, while
 * the glow stays.
 */
export function heartEcho(placement: Placement, clearing?: Ellipse) {
  const size = heartHeight(placement)
  const blur = (id: string, sigma: number) =>
    `<filter id="${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feGaussianBlur stdDeviation="${round(sigma)}"/></filter>`

  const haze = HAZE.map(
    (layer, i) =>
      `<path d="${heartOutline(grown(placement, layer.factor))}" fill="${PINK}" opacity="${layer.opacity}" filter="url(#haze${i})"/>`,
  )
  const rings = Array.from({ length: RINGS }, (_, i) => {
    const outline = heartOutline(grown(placement, RING_GROWTH ** (i + 1)))
    const opacity = round(RING_OPACITY * RING_FADE ** i)
    const stroke = clearing ? 'url(#ringStroke)' : PINK
    return `<path d="${outline}" fill="none" stroke="${stroke}" stroke-width="${RING_WIDTH}" stroke-linejoin="round" opacity="${opacity}"/>`
  })

  // The rings' glow goes under them, so they stay crisp.
  return (
    `<defs>${clearing ? clearingStroke(clearing) : ''}${HAZE.map((layer, i) => blur(`haze${i}`, layer.blur * size)).join('')}${blur('ringGlow', RING_GLOW * size)}<g id="rings">${rings.join('')}</g></defs>` +
    haze.join('') +
    `<use href="#rings" filter="url(#ringGlow)"/><use href="#rings"/>`
  )
}

/** The rings' pink, see-through inside the clearing. */
function clearingStroke({ cx, cy, rx, ry }: Ellipse) {
  const stop = (offset: number, opacity: number) =>
    `<stop offset="${offset}" stop-color="${PINK}" stop-opacity="${opacity}"/>`
  return (
    `<radialGradient id="ringStroke" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(${round(cx)} ${round(cy)}) scale(${round(rx)} ${round(ry)})">` +
    stop(0, 0) +
    stop(CLEARING_INNER, 0) +
    stop(1, 1) +
    '</radialGradient>'
  )
}
