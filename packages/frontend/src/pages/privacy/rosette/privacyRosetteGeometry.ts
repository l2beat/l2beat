/**
 * Geometry of the privacy rosette: one ring split into two halves - the
 * adversaries on the right, the remaining protocol risks on the left - and
 * each half split into one slice per risk. Angles are degrees clockwise from
 * 12 o'clock, so they read the way the slices do.
 */

export const PRIVACY_ROSETTE_SIZE = 180
const CENTER = PRIVACY_ROSETTE_SIZE / 2
export const PRIVACY_ROSETTE_OUTER_RADIUS = 88
export const PRIVACY_ROSETTE_INNER_RADIUS = 30

/**
 * Degrees dropped at 12 and 6 o'clock. Wide enough that the split between the
 * two halves stays legible at table-cell size, where the slices themselves are
 * only a few pixels across.
 */
const HALF_GAP = 14
/** Degrees between neighbouring slices of the same half. */
const SLICE_GAP = 3

export type PrivacyRosetteHalf = 'left' | 'right'

export interface PrivacyRosetteArc {
  start: number
  end: number
}

const HALF_SPAN: Record<PrivacyRosetteHalf, PrivacyRosetteArc> = {
  right: { start: HALF_GAP, end: 180 - HALF_GAP },
  left: { start: 180 + HALF_GAP, end: 360 - HALF_GAP },
}

/**
 * One arc per slice of a half, in the order the slices are listed. The right
 * half runs clockwise from the top and so already reads top to bottom; the
 * left half runs clockwise from the bottom, so it is flipped to make both
 * halves list in the same direction.
 */
export function getPrivacyRosetteArcs(
  count: number,
  half: PrivacyRosetteHalf,
): PrivacyRosetteArc[] {
  if (count <= 0) {
    return []
  }

  const { start, end } = HALF_SPAN[half]
  const sliceSpan = (end - start - SLICE_GAP * (count - 1)) / count
  const arcs = Array.from({ length: count }, (_, index) => {
    const sliceStart = start + index * (sliceSpan + SLICE_GAP)
    return { start: sliceStart, end: sliceStart + sliceSpan }
  })

  return half === 'right' ? arcs : arcs.reverse()
}

/** The annular sector of one slice, as an SVG path. */
export function describePrivacyRosetteSlice(
  arc: PrivacyRosetteArc,
  outerRadius = PRIVACY_ROSETTE_OUTER_RADIUS,
  innerRadius = PRIVACY_ROSETTE_INNER_RADIUS,
): string {
  const largeArc = arc.end - arc.start > 180 ? 1 : 0
  const outerStart = polar(outerRadius, arc.start)
  const outerEnd = polar(outerRadius, arc.end)
  const innerEnd = polar(innerRadius, arc.end)
  const innerStart = polar(innerRadius, arc.start)

  return [
    `M${outerStart}`,
    `A${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd}`,
    `L${innerEnd}`,
    `A${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart}`,
    'Z',
  ].join(' ')
}

function polar(radius: number, angle: number): string {
  const radians = ((angle - 90) * Math.PI) / 180
  const x = CENTER + radius * Math.cos(radians)
  const y = CENTER + radius * Math.sin(radians)
  return `${round(x)} ${round(y)}`
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}
