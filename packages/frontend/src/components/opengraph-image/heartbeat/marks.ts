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
/** Lockup width (heart and BEAT) per px of heart height. */
export const LOCKUP_RATIO =
  (LOCKUP_RIGHT - HEART_BOX.x0) / (HEART_BOX.y1 - HEART_BOX.y0)

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

/** Leftmost x of the placed heart's outline at canvas height y, so a line ends exactly on it. */
export function heartLeftAt(placement: Placement, y: number) {
  const points = HEART_OUTLINE.map(([x, py]): [number, number] => [
    placement.hx + placement.scale * (x - HEART_CENTER.x),
    placement.hy + placement.scale * (py - HEART_CENTER.y),
  ])
  let left = Number.POSITIVE_INFINITY
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1] as [number, number]
    const [bx, by] = points[i] as [number, number]
    if ((ay - y) * (by - y) > 0 || ay === by) continue
    left = Math.min(left, ax + ((y - ay) / (by - ay)) * (bx - ax))
  }
  return left
}

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

// The heart's outline flattened to points, 20 per curve.
const HEART_OUTLINE = (() => {
  const tokens = HEART.replace(/([MCZ])/g, ' $1 ')
    .trim()
    .split(/[\s,]+/)
  const points: [number, number][] = []
  let current: [number, number] = [0, 0]
  for (let i = 0; i < tokens.length; ) {
    const command = tokens[i++]
    if (command === 'M') {
      current = [Number(tokens[i++]), Number(tokens[i++])]
      points.push(current)
    } else if (command === 'C') {
      const [x1, y1, x2, y2, x3, y3] = tokens.slice(i, i + 6).map(Number) as [
        number,
        number,
        number,
        number,
        number,
        number,
      ]
      i += 6
      for (let t = 0.05; t <= 1.0001; t += 0.05) {
        const u = 1 - t
        points.push([
          u ** 3 * current[0] +
            3 * u * u * t * x1 +
            3 * u * t * t * x2 +
            t ** 3 * x3,
          u ** 3 * current[1] +
            3 * u * u * t * y1 +
            3 * u * t * t * y2 +
            t ** 3 * y3,
        ])
      }
      current = [x3, y3]
    }
  }
  return points
})()
