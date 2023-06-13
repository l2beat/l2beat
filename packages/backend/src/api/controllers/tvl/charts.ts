import { TvlApiChartPoint, UnixTime } from '@l2beat/shared-pure'

import { asNumber } from './asNumber'

export function addMissingTimestamps(
  points: TvlApiChartPoint[],
  hours: number,
): TvlApiChartPoint[] {
  if (points.length === 0) return []
  const [min] = points[0]
  const [max] = points[points.length - 1]
  const timestampValues = new Map(
    points.map(([t, v1, v2]) => [t.toString(), [v1, v2]]),
  )
  const allPoints: TvlApiChartPoint[] = []
  for (
    let timestamp = min;
    timestamp.lte(max);
    timestamp = timestamp.add(hours, 'hours')
  ) {
    const existing = timestampValues.get(timestamp.toString())
    const previous = allPoints[allPoints.length - 1]
    allPoints.push([
      timestamp,
      existing?.[0] ?? previous[1],
      existing?.[1] ?? previous[2],
    ])
  }
  return allPoints
}

export function getChartPoints(
  balances: { usd: bigint; asset: bigint; timestamp: UnixTime }[],
  hours: number,
  decimals: number,
  usdFirst = false,
): TvlApiChartPoint[] {
  const existing: TvlApiChartPoint[] = balances.map((b) => {
    const usd = asNumber(b.usd, 2)
    const asset = asNumber(b.asset, decimals)
    return usdFirst ? [b.timestamp, usd, asset] : [b.timestamp, asset, usd]
  })
  return addMissingTimestamps(existing, hours)
}
