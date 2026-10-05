import { parseColor } from '../../color'
import type { Wave } from './wave'

/** Draws the goo of a frame on a canvas of its own, inside `container` */
export interface GooRenderer {
  resize(width: number, height: number): void
  render(frame: GooFrame): void
  /** Draws at a lower density, for when frames come too slowly */
  lowerDensity(): boolean
  dispose(): void
}

export interface GooFrame {
  balls: BallBuffer
  wave: Wave
  /** Rest level of the pool's surface, CSS px */
  poolTop: number
  /** How far above its surface the pool reaches out to drops, CSS px */
  poolReach: number
  /** How deep the rounded lip of the surface is, CSS px */
  poolLip: number
  /** Rounding of the pool's bottom corners, CSS px */
  poolCorner: number
  theme: GooTheme
}

export interface GooTheme {
  /** Towards the light, from the top left: x right, y down, z out of the screen */
  light: [number, number, number]
  /** How much the light changes lightness, in OKLab units */
  shade: number
  /** Lightness at the very edge: below 0 darkens it, for goo on a light card */
  rim: number
  specular: number
  /** A faint light along the edge, for goo on a dark card */
  sheen: number
  /** A soft tint of the goo's own color around it */
  halo: number
  /** How domed the goo looks */
  bulge: number
  poolTop: GooColor
  poolDeep: GooColor
  poolOpacity: number
  poolSaturation: number
}

export interface GooColor {
  css: string
  /** OKLab, where blending and lighting keep colors vivid */
  lab: [number, number, number]
  chroma: number
}

/** Where the field of the balls is cut to make the goo's edge */
export const FIELD_THRESHOLD = 0.32

// A ball's field reaches past its visible edge, so neighbours flow together
export const REACH_PER_RADIUS = 1 / Math.sqrt(1 - Math.cbrt(FIELD_THRESHOLD))

export function toGooColor(css: string): GooColor {
  const [r, g, b] = parseColor(css).map(toLinear) as [number, number, number]
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const lab: [number, number, number] = [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
  return { css, lab, chroma: Math.hypot(lab[1], lab[2]) }
}

/**
 * What `color` looks like once dissolved into `into`: its hue, but `into`'s
 * lightness, and `into`'s hue when it has hardly any of its own. A black or
 * gray drop would otherwise leave a dull smudge.
 */
export function dissolveInto(color: GooColor, into: GooColor): GooColor {
  const [l, a, b] = color.lab
  const [intoL, intoA, intoB] = into.lab
  const neutral = 1 - Math.min(color.chroma / 0.1, 1)
  const lab: [number, number, number] = [
    l + (intoL - l) * (0.6 + 0.4 * neutral),
    a + (intoA - a) * neutral,
    b + (intoB - b) * neutral,
  ]
  return { css: color.css, lab, chroma: Math.hypot(lab[1], lab[2]) }
}

/** The balls of one frame, packed the way the shader reads them */
export class BallBuffer {
  static readonly STRIDE = 11
  readonly data: Float32Array
  readonly colors: GooColor[] = []
  count = 0

  constructor(readonly capacity: number) {
    this.data = new Float32Array(capacity * BallBuffer.STRIDE)
  }

  clear() {
    this.count = 0
  }

  /**
   * `radius` is the visible radius of the ball alone; `emphasis` is 1 for
   * vivid goo and 0 for goo stepping back behind a highlighted poster;
   * `shape` 0 makes a ball that only tints, as color bleeding into the pool.
   */
  push(
    x: number,
    y: number,
    radius: number,
    stretch: number,
    amplitude: number,
    color: GooColor,
    emphasis: number,
    shape = 1,
  ) {
    if (this.count >= this.capacity || radius <= 0 || amplitude <= 0) return
    const o = this.count * BallBuffer.STRIDE
    const d = this.data
    d[o] = x
    d[o + 1] = y
    d[o + 2] = radius * REACH_PER_RADIUS
    d[o + 3] = stretch
    d[o + 4] = amplitude
    d[o + 5] = color.lab[0]
    d[o + 6] = color.lab[1]
    d[o + 7] = color.lab[2]
    d[o + 8] = DIMMED_OPACITY + (1 - DIMMED_OPACITY) * emphasis
    d[o + 9] = DIMMED_SATURATION + (1 - DIMMED_SATURATION) * emphasis
    d[o + 10] = shape
    this.colors[this.count] = color
    this.count++
  }
}

const DIMMED_OPACITY = 0.2
const DIMMED_SATURATION = 0.12

function toLinear(channel: number) {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
