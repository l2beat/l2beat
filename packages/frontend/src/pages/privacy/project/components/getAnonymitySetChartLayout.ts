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
