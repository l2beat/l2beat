/**
 * A single compare chart point: a timestamp plus one value per project id.
 * The shape every compare metric chart feeds into recharts.
 */
export interface CompareChartPoint {
  timestamp: number
  [projectId: string]: number | null
}

export interface IndexedChartData {
  data: CompareChartPoint[]
  /**
   * For projects whose data starts after the first chart point (e.g. a
   * mid-range launch): the timestamp of the point they were rebased at,
   * so the tooltip can note the shifted base.
   */
  rebasedMidRange: Record<string, number>
}

/**
 * Rebases every series to 100 at its first data point, making growth rates
 * directly comparable regardless of project size. Metric-agnostic: operates
 * on the already-fetched chart points of any compare metric.
 *
 * The base is the first positive value of a series - a zero base cannot be
 * indexed, so leading zeros index to 0 against the first positive value. A
 * series with no positive values stays null throughout.
 */
export function toIndexedChartData(
  data: CompareChartPoint[],
  projectIds: string[],
): IndexedChartData {
  const firstTimestamp = data[0]?.timestamp
  const bases: Record<string, number> = {}
  const rebasedMidRange: Record<string, number> = {}

  for (const id of projectIds) {
    let firstDataTimestamp: number | undefined
    for (const point of data) {
      const value = point[id]
      if (value === null || value === undefined) continue
      firstDataTimestamp ??= point.timestamp
      if (value > 0) {
        bases[id] = value
        break
      }
    }
    if (
      bases[id] !== undefined &&
      firstDataTimestamp !== undefined &&
      firstDataTimestamp !== firstTimestamp
    ) {
      rebasedMidRange[id] = firstDataTimestamp
    }
  }

  const indexedData = data.map((point) => {
    const indexed: CompareChartPoint = { timestamp: point.timestamp }
    for (const id of projectIds) {
      const value = point[id]
      const base = bases[id]
      indexed[id] =
        value !== null && value !== undefined && base !== undefined
          ? (value / base) * 100
          : null
    }
    return indexed
  })

  return { data: indexedData, rebasedMidRange }
}
