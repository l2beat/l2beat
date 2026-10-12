import type { TvsChartDataPoint } from '~/server/features/layer2s/tvs/getTvsChartData'

export interface TvsSeriesPoint {
  timestamp: number
  fullData: number | null
  settlementOnly: number | null
}

/** A timestamp only one series has keeps the other as missing rather than zero, as one can start later */
export function mergeTvsSeries(
  fullData: TvsChartDataPoint[],
  settlementOnly: TvsChartDataPoint[],
): TvsSeriesPoint[] {
  const points = new Map<number, TvsSeriesPoint>()
  const get = (timestamp: number) => {
    let point = points.get(timestamp)
    if (!point) {
      point = { timestamp, fullData: null, settlementOnly: null }
      points.set(timestamp, point)
    }
    return point
  }

  for (const point of fullData) {
    get(point[0]).fullData = getTotal(point)
  }
  for (const point of settlementOnly) {
    get(point[0]).settlementOnly = getTotal(point)
  }

  return [...points.values()].sort((a, b) => a.timestamp - b.timestamp)
}

function getTotal([, native, canonical, external]: TvsChartDataPoint):
  | number
  | null {
  if (native === null && canonical === null && external === null) return null
  return (native ?? 0) + (canonical ?? 0) + (external ?? 0)
}
