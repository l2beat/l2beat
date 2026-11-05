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

// Around text the rings are cut away: fully within `pad` px of it, coming back
// over the next `fade` px in `steps` steps, too fine to show. Steps instead of
// a blur, which would cost a pass over the whole canvas for every image.
const CLEAR = { pad: 12, fade: 40, steps: 8 }

const { width: W, height: H } = OG_SIZE
const round = (v: number) => +v.toFixed(2)

/** A box on the canvas, by its edges. */
export interface Box {
  x0: number
  y0: number
  x1: number
  y1: number
}

const blur = (id: string, sigma: number) =>
  `<filter id="${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feGaussianBlur stdDeviation="${round(sigma)}"/></filter>`

/** SVG markup for the glow around the placed heart; draw the heart over it. */
export function heartGlow(placement: Placement) {
  const size = heartHeight(placement)
  const haze = HAZE.map(
    (layer, i) =>
      `<path d="${heartOutline(grown(placement, layer.factor))}" fill="${PINK}" opacity="${layer.opacity}" filter="url(#haze${i})"/>`,
  )
  return (
    `<defs>${HAZE.map((layer, i) => blur(`haze${i}`, layer.blur * size)).join('')}</defs>` +
    haze.join('')
  )
}

/** SVG markup for the rings spreading out from the placed heart. */
export function heartRings(placement: Placement) {
  const rings = Array.from({ length: RINGS }, (_, i) => {
    const outline = heartOutline(grown(placement, RING_GROWTH ** (i + 1)))
    const opacity = round(RING_OPACITY * RING_FADE ** i)
    return `<path d="${outline}" fill="none" stroke="${PINK}" stroke-width="${RING_WIDTH}" stroke-linejoin="round" opacity="${opacity}"/>`
  })
  // The rings' glow goes under them, so they stay crisp.
  return (
    `<defs>${blur('ringGlow', RING_GLOW * heartHeight(placement))}<g id="rings">${rings.join('')}</g></defs>` +
    '<use href="#rings" filter="url(#ringGlow)"/><use href="#rings"/>'
  )
}

/**
 * SVG markup for `rings`, an image of the whole canvas, cut away around each
 * box, so the text there reads while the ground and the glow stay.
 */
export function ringsClearOf(rings: string, boxes: Box[]) {
  // Nested rounded boxes, the innermost opaque and the nth 1/n opaque, add up
  // to a cut that fades evenly from full to none across them.
  const holes = boxes.flatMap((box) =>
    Array.from({ length: CLEAR.steps }, (_, i) => {
      const grow = CLEAR.pad + (CLEAR.fade * i) / (CLEAR.steps - 1)
      return `<rect x="${round(box.x0 - grow)}" y="${round(box.y0 - grow)}" width="${round(box.x1 - box.x0 + 2 * grow)}" height="${round(box.y1 - box.y0 + 2 * grow)}" rx="${round(grow)}" opacity="${round(1 / (i + 1))}"/>`
    }),
  )
  return (
    `<defs><g id="holes">${holes.join('')}</g>` +
    `<filter id="clear" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feImage href="#holes" result="holes"/><feComposite in="SourceGraphic" in2="holes" operator="out"/></filter></defs>` +
    `<image href="${rings}" width="${W}" height="${H}" filter="url(#clear)"/>`
  )
}
