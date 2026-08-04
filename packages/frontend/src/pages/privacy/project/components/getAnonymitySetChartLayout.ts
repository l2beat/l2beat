/**
 * Layout bits both anonymity set charts need, kept together so the two stay
 * visually consistent when either is tweaked.
 */

/**
 * Recharts reserves legend space up front, so the rows a wrapped legend needs
 * have to be estimated rather than measured.
 */
export function getLegendHeight(bucketCount: number): number {
  return 18 * Math.ceil(bucketCount / 7)
}

/**
 * Left to itself a symlog axis renders a single gridline on this data, because
 * the series span four orders of magnitude. Decades make it readable.
 */
export function getLogTicks(
  data: Record<string, number>[],
  dataKeys: string[],
): number[] {
  const max = data.reduce((highest, point) => {
    for (const key of dataKeys) {
      highest = Math.max(highest, point[key] ?? 0)
    }
    return highest
  }, 0)
  return [1, 10, 100, 1000, 10_000].filter((tick) => tick <= max * 1.5)
}
