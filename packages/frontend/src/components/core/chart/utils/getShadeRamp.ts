/**
 * Colors for charts whose series group into families - e.g. one family per
 * token, one line per denomination inside it. Hue identifies the family,
 * lightness identifies the line inside it.
 *
 * A ramp keeps the family's chart color hue and chroma and only overrides
 * lightness, so the result still reads as "shades of the same color". The
 * offsets are absolute OKLCH lightness values plus `--chart-shade-shift`, which
 * lifts the whole ramp on dark surfaces.
 *
 * LIMITS - worth knowing before adding series:
 * - Only the first `FAMILY_COLORS.length` families get a hue. Beyond that they
 *   fall back to gray ramps, which are readable but not identifiable by color.
 * - Hue alone cannot separate this many families: the underlying chart palette
 *   has pairs (cyan/sky, orange/yellow) that sit close together for red-green
 *   color blindness, and a ramp of 3+ steps compresses families toward a shared
 *   lightness. Charts using this MUST carry identity in the legend and tooltip
 *   as well, never in color alone.
 */

/** Family hues in fixed assignment order - never cycled, never reordered. */
const FAMILY_COLORS = [
  'var(--chart-ethereum)',
  'var(--chart-orange)',
  'var(--chart-cyan)',
  'var(--chart-pink)',
  'var(--chart-lime)',
  'var(--chart-stacked-purple)',
  'var(--chart-yellow)',
  'var(--chart-sky)',
]

/**
 * Base lightness of each family color, so a ramp can start from the color's own
 * lightness instead of flattening every family onto one value.
 */
const FAMILY_BASE_LIGHTNESS = [0.44, 0.7, 0.61, 0.62, 0.9, 0.6, 0.58, 0.75]

const LIGHTNESS_MIN = 0.42
const LIGHTNESS_MAX = 0.78
const LIGHTNESS_STEP = 0.09

/**
 * `count` shades of the `index`-th family color, darkest first.
 * Families past the palette get a gray ramp.
 */
export function getShadeRamp(index: number, count: number): string[] {
  const base = FAMILY_COLORS[index]
  const baseLightness = FAMILY_BASE_LIGHTNESS[index]

  const start = Math.min(
    Math.max(baseLightness ?? LIGHTNESS_MIN, LIGHTNESS_MIN),
    LIGHTNESS_MAX - (count - 1) * LIGHTNESS_STEP,
  )

  return Array.from({ length: count }, (_, shade) => {
    const lightness = (start + shade * LIGHTNESS_STEP).toFixed(3)
    return base
      ? `oklch(from ${base} calc(${lightness} + var(--chart-shade-shift)) c h)`
      : `oklch(calc(${lightness} + var(--chart-shade-shift)) 0.015 265)`
  })
}
