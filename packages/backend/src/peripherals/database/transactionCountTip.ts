export interface Boundaries {
  min: number
  max: number
}

export type Gap = [number, number]

export function extractTipNumber(
  gaps: Gap[],
  boundaries?: Boundaries,
): number | undefined {
  return gaps[0]?.[0] ? gaps[0]?.[0] - 1 : boundaries?.max
}

function toBoundaryGaps(
  first: number,
  last: number,
  boundaries: Boundaries,
): { before?: Gap; after?: Gap } {
  return {
    before: first < boundaries.min ? [first, boundaries.min - 1] : undefined,
    after: last > boundaries.max ? [boundaries.max + 1, last] : undefined,
  }
}

export function toExpandedGaps(
  first: number,
  last: number,
  gaps: Gap[],
  boundaries?: Boundaries,
): Gap[] {
  if (!boundaries) {
    return [[first, last]]
  }
  const { before, after } = toBoundaryGaps(first, last, boundaries)
  if (before) gaps.unshift(before)
  if (after) gaps.push(after)
  return gaps
}
