import { grown, heartHeight, heartOutline, PINK, type Placement } from './marks'
import { type Box, OG_SIZE } from './render'

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

// Around text the rings are cut away along its letters, a halo rather than a
// box: fully within `grow` px of them, coming back over the next `fade` px in
// `steps` steps, too fine to show. Steps of stroked outlines instead of a
// blur, which would cost a pass over the whole canvas for every image.
const HALO = { grow: 6, fade: 14, steps: 7 }

const { width: W, height: H } = OG_SIZE
const round = (v: number) => +v.toFixed(2)

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
 * SVG markup for `rings`, an image of the whole canvas, cut away in a halo
 * around `outline`, the path data of the text and marks they must stay off,
 * so the text reads while the ground and the glow stay.
 */
export function ringsClearOf(rings: string, outline: string) {
  // The outline stroked ever wider, the innermost opaque and the nth 1/n
  // opaque, adds up to a cut that fades evenly from full to none across them.
  const halo = Array.from({ length: HALO.steps }, (_, i) => {
    const grow = HALO.grow + (HALO.fade * i) / (HALO.steps - 1)
    return `<path d="${outline}" stroke="black" stroke-width="${round(2 * grow)}" stroke-linejoin="round" opacity="${round(1 / (i + 1))}"/>`
  })
  return (
    `<defs><g id="halo">${halo.join('')}</g>` +
    `<filter id="clear" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feImage href="#halo" result="halo"/><feComposite in="SourceGraphic" in2="halo" operator="out"/></filter></defs>` +
    `<image href="${rings}" width="${W}" height="${H}" filter="url(#clear)"/>`
  )
}

/** Path data of a box, so a mark can be cleared like text. */
export function boxOutline({ x0, y0, x1, y1 }: Box) {
  return `M${round(x0)} ${round(y0)}H${round(x1)}V${round(y1)}H${round(x0)}Z`
}
