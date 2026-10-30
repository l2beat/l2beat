export interface SparklinePoint {
  timestamp: number
  value: number | null
  /** What the value breaks down into, in the order of the part labels. */
  parts: (number | null)[]
}

/**
 * The y domain, and the high and low with their hairlines (none for a flat
 * or empty series). The domain is the series' own range: a sparkline shows
 * the shape, not the size. The high and low hairlines are the plot's top and
 * bottom; a flat series draws near the top, where a real series would peak.
 */
export function getSparklineScale(points: SparklinePoint[]): {
  domain: [number, number]
  range: { min: number; max: number } | undefined
} {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const { value } of points) {
    if (value === null) continue
    min = Math.min(min, value)
    max = Math.max(max, value)
  }
  if (min > max) {
    return { domain: [0, 1], range: undefined }
  }
  if (min === max) {
    const padding = Math.abs(min) || 1
    return { domain: [min - padding, max + padding * 0.1], range: undefined }
  }
  return { domain: [min, max], range: { min, max } }
}
