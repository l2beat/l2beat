import { A, B, E, E_2, H, HEART, T, T_2 } from './pieces'

// SVG fragments of the logo, placed on a 1200×630 canvas. The pieces come in
// the X header's coordinates; place() maps them.

export const PINK = '#FF3776'
export const INK = '#0D0C0C'
export const WHITE = '#FFFFFF'

const HEART_BOX = { x0: 720, y0: 70, x1: 1055.5, y1: 366.1 }
const HEART_CENTER = {
  x: (HEART_BOX.x0 + HEART_BOX.x1) / 2,
  y: (HEART_BOX.y0 + HEART_BOX.y1) / 2,
}
const LOCKUP_RIGHT = 1414.9

/** Heart width per px of heart height. */
export const HEART_RATIO =
  (HEART_BOX.x1 - HEART_BOX.x0) / (HEART_BOX.y1 - HEART_BOX.y0)

export interface Placement {
  scale: number
  hx: number
  hy: number
  transform: string
}

const round = (v: number) => +v.toFixed(2)

/** The lockup with its heart's centre at (hx, hy) and the heart `heartH` px tall. */
export function place(hx: number, hy: number, heartH: number): Placement {
  const scale = heartH / (HEART_BOX.y1 - HEART_BOX.y0)
  return {
    scale,
    hx,
    hy,
    transform: `translate(${round(hx - scale * HEART_CENTER.x)} ${round(hy - scale * HEART_CENTER.y)}) scale(${round(scale)})`,
  }
}

/** The lockup centred on `cx`, from the heart's left edge to the T's right. */
export function placeCentred(cx: number, hy: number, heartH: number) {
  const scale = heartH / (HEART_BOX.y1 - HEART_BOX.y0)
  const centre = (HEART_BOX.x0 + LOCKUP_RIGHT) / 2
  return place(cx - scale * (centre - HEART_CENTER.x), hy, heartH)
}

const EVENODD = new Set([T, T_2, E, B, E_2, A])
const piece = (d: string, fill: string) =>
  `<path d="${d}"${EVENODD.has(d) ? ' fill-rule="evenodd"' : ''} fill="${fill}"/>`

/** The dark-ground lockup: pink heart, white ETH and BEAT. `withBeat: false` leaves the heart alone. */
export function lockup(placement: Placement, { withBeat = true } = {}) {
  const letters = withBeat ? [B, E_2, A, T_2].map((d) => piece(d, WHITE)) : []
  return `<g transform="${placement.transform}">${piece(HEART, PINK)}${[E, T, H].map((d) => piece(d, WHITE)).join('')}${letters.join('')}</g>`
}

/** The placed heart's height in px. */
export const heartHeight = (placement: Placement) =>
  placement.scale * (HEART_BOX.y1 - HEART_BOX.y0)

/** The placed heart's outline in canvas px, so a stroke around it is in px too. */
export function heartOutline(placement: Placement) {
  // HEART is absolute commands only, so its numbers alternate x and y.
  let axis = 0
  return HEART.replace(/\d+(\.\d+)?/g, (n) => {
    const v = Number(n)
    const placed =
      axis++ % 2 === 0
        ? placement.hx + placement.scale * (v - HEART_CENTER.x)
        : placement.hy + placement.scale * (v - HEART_CENTER.y)
    return String(round(placed))
  })
}

// The point the heart's echoes grow from: on its axis, a little above its middle,
// so they spread wider below, towards the tip, than above.
const ECHO_ORIGIN = { x: 882.6, y: 203 }

/** The heart `factor` times bigger, grown from ECHO_ORIGIN, which stays put. */
export function grown(placement: Placement, factor: number): Placement {
  const dx = placement.scale * (HEART_CENTER.x - ECHO_ORIGIN.x)
  const dy = placement.scale * (HEART_CENTER.y - ECHO_ORIGIN.y)
  return place(
    placement.hx + (factor - 1) * dx,
    placement.hy + (factor - 1) * dy,
    heartHeight(placement) * factor,
  )
}
