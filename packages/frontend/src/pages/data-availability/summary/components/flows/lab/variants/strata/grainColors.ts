import { parseColor, readableColor } from '../../color'
import type { ThemeTokens } from '../../hooks'
import type { LabPoster } from '../../model'
import { fromOklch, type Rgb, toOklch } from './oklch'
import { GRAIN_SHADES, type PourPlan } from './pour'

/** How far each poster and hour have moved from plain sand, 0 to 1 */
export interface Focus {
  /** Goes up whenever any of the rest changes */
  version: number
  /** Gone gray, as another poster or hour is looked at */
  posterMuted: Float32Array
  hourMuted: Float32Array
  /** Back to its own brand color, as the poster picked */
  posterPicked: Float32Array
}

/**
 * The color of every kind of grain, packed as RGBA for an image. Grains are
 * told apart by poster, hour and a jitter of lightness, so a color stands for
 * each mix of the three; a grain finds its own through `grainKeys`.
 *
 * Sand is each project's brand color, a little muted so the bands sit
 * together, with a jitter of lightness grain to grain for the look of sand.
 * The picked project gets its full brand color.
 */
export class GrainColors {
  readonly table: Uint32Array
  private appliedVersion = -1
  private readonly sand: Float32Array
  private readonly brand: Float32Array
  private readonly gray: Float32Array

  constructor(
    posters: LabPoster[],
    private readonly hours: number,
    tokens: ThemeTokens,
  ) {
    const size = posters.length * hours * GRAIN_SHADES
    this.table = new Uint32Array(size)
    this.sand = new Float32Array(size * 3)
    this.brand = new Float32Array(size * 3)
    this.gray = new Float32Array(size * 3)
    const surface = parseColor(tokens.surface)
    const sinking = tokens.isDark ? 0.5 : 0.55

    posters.forEach((poster, p) => {
      const brand = toOklch(
        parseColor(readableColor(poster.color, tokens.surface)),
      )
      const [brandLightness, chroma, hue] = brand
      // a black or white brand would be a hole in the sand, not a color
      const lightness = Math.min(
        Math.max(brandLightness, DARKEST_SAND),
        LIGHTEST_SAND,
      )
      for (let hour = 0; hour < hours; hour++) {
        for (let shade = 0; shade < GRAIN_SHADES; shade++) {
          const key = (p * hours + hour) * GRAIN_SHADES + shade
          const grain = lightness + lightnessJitter(shade)
          const muted = chroma * SAND_CHROMA
          this.store(this.sand, key, fromOklch([grain, muted, hue]))
          this.store(this.brand, key, fromOklch([grain, chroma, hue]))
          // muted grains keep their texture but sink towards the card
          const gray = fromOklch([grain, 0, 0])
          this.store(this.gray, key, towards(gray, surface, sinking))
        }
      }
    })
  }

  update(focus: Focus) {
    if (focus.version === this.appliedVersion) return
    this.appliedVersion = focus.version
    const { table, sand, brand, gray, hours } = this
    for (let key = 0; key < table.length; key++) {
      const group = Math.floor(key / GRAIN_SHADES)
      const poster = Math.floor(group / hours)
      const picked = focus.posterPicked[poster] ?? 0
      const muted = Math.max(
        focus.posterMuted[poster] ?? 0,
        focus.hourMuted[group % hours] ?? 0,
      )
      let packed = 255 << 24
      for (let c = 0; c < 3; c++) {
        const i = key * 3 + c
        const own = mix(sand[i] ?? 0, brand[i] ?? 0, picked)
        packed |= Math.round(mix(own, gray[i] ?? 0, muted)) << (c * 8)
      }
      table[key] = packed
    }
  }

  private store(target: Float32Array, key: number, rgb: Rgb) {
    target[key * 3] = rgb[0]
    target[key * 3 + 1] = rgb[1]
    target[key * 3 + 2] = rgb[2]
  }
}

/** Where each grain's color is in `GrainColors.table` */
export function grainKeys(plan: PourPlan): Uint32Array {
  const keys = new Uint32Array(plan.grainCount)
  for (let grain = 0; grain < plan.grainCount; grain++) {
    keys[grain] =
      ((plan.poster[grain] ?? 0) * plan.hours + (plan.hour[grain] ?? 0)) *
        GRAIN_SHADES +
      (plan.shade[grain] ?? 0)
  }
  return keys
}

const DARKEST_SAND = 0.42
const LIGHTEST_SAND = 0.88

/** Of a brand's chroma, kept in its sand, so the bands sit together */
const SAND_CHROMA = 0.85

/** Each grain's own jitter of lightness, about ±5%, for the look of sand */
function lightnessJitter(shade: number): number {
  return (shade / (GRAIN_SHADES - 1) - 0.5) * 0.06
}

function mix(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

function towards(from: Rgb, to: Rgb, t: number): Rgb {
  return [
    mix(from[0], to[0], t),
    mix(from[1], to[1], t),
    mix(from[2], to[2], t),
  ]
}
