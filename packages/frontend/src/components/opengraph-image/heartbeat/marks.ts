import { A, B, BEATS, E, E_2, H, HEART, T, T_2 } from './pieces'

// SVG fragments of the logo and its heartbeat, placed on a 1200×630 canvas.
// The pieces come in the X header's coordinates; place() maps them.

export const PINK = '#FF3776'
export const INK = '#0D0C0C'
export const WHITE = '#FFFFFF'

const HEART_BOX = { x0: 720, y0: 70, x1: 1055.5, y1: 366.1 }
const HEART_CENTER = {
  x: (HEART_BOX.x0 + HEART_BOX.x1) / 2,
  y: (HEART_BOX.y0 + HEART_BOX.y1) / 2,
}
const LOCKUP_RIGHT = 1414.9
const BEATS_X0 = 537.4
const BEATS_X1 = 730.6
const BEATS_Y = 206.7

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

/** The lockup with its right edge at `right`. */
export function placeByRight(right: number, hy: number, heartH: number) {
  const scale = heartH / (HEART_BOX.y1 - HEART_BOX.y0)
  return place(right - scale * (LOCKUP_RIGHT - HEART_CENTER.x), hy, heartH)
}

const EVENODD = new Set([T, T_2, E, B, E_2, A])
const piece = (d: string, fill: string) =>
  `<path d="${d}"${EVENODD.has(d) ? ' fill-rule="evenodd"' : ''} fill="${fill}"/>`

/** The light-ground lockup: pink heart, white ETH, ink BEAT. `withBeat: false` leaves the heart alone. */
export function lockup(placement: Placement, { withBeat = true } = {}) {
  const letters = withBeat ? [B, E_2, A, T_2].map((d) => piece(d, INK)) : []
  return `<g transform="${placement.transform}">${piece(HEART, PINK)}${[E, T, H].map((d) => piece(d, WHITE)).join('')}${letters.join('')}</g>`
}

/** Where the heartbeat enters the heart: its widest line, where pink separates the outline from the E. */
export const pulseY = (placement: Placement) =>
  placement.hy - 11 * placement.scale

// The outline's left edge at pulseY's height, from the heart's centre in the
// pieces' units, measured on HEART's path.
const PULSE_ENTRY_DX = -154.0738

/** Where the heartbeat line meets the placed heart's outline, so it ends exactly on it. */
export const pulseEntryX = (placement: Placement) =>
  placement.hx + placement.scale * PULSE_ENTRY_DX

/** A flat line from x0, then the header's three beats, ending at x1 inside the heart. */
export function pulse({
  x0,
  x1,
  y,
  scale,
}: {
  x0: number
  x1: number
  y: number
  scale: number
}) {
  const end = x1 - 6 * scale
  const start = end - scale * (BEATS_X1 - BEATS_X0)
  const tokens = BEATS.replace(/([CH])/g, ' $1 ')
    .trim()
    .split(/\s+/)
  let path = ''
  for (let i = 0; i < tokens.length; ) {
    const command = tokens[i++]
    if (command === 'H') {
      path += `H${round(start + scale * (Number(tokens[i++]) - BEATS_X0))}`
    } else {
      const points: string[] = []
      for (let k = 0; k < 3; k++) {
        const x = Number(tokens[i++])
        const py = Number(tokens[i++])
        points.push(
          `${round(start + scale * (x - BEATS_X0))} ${round(y + scale * (py - BEATS_Y))}`,
        )
      }
      path += `C${points.join(' ')}`
    }
  }
  return `M${round(x0)} ${round(y)}H${round(start)}${path}H${round(x1 + 40 * scale)}`
}

/** Where the beats of a pulse ending at x1 begin: text left of the line ends before it. */
export const beatsStart = (x1: number, scale: number) =>
  x1 - 6 * scale - scale * (BEATS_X1 - BEATS_X0)

export const stroke = (d: string, color: string, attrs = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"${attrs ? ` ${attrs}` : ''}/>`

export function svgDataUri(width: number, height: number, body: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
