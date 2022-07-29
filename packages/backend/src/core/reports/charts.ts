import { ChartPoint, UnixTime } from '@l2beat/common'

export function getDailyTimestamps(min: UnixTime, max: UnixTime) {
  const timestamps: UnixTime[] = []
  for (let t = min; t.lte(max); t = t.add(1, 'days')) {
    timestamps.push(t)
  }
  return timestamps
}

export function addMissingDailyTimestamps(points: ChartPoint[]): ChartPoint[] {
  if (points.length === 0) return []
  const [min] = points[0]
  const [max] = points[points.length - 1]
  const daily = getDailyTimestamps(min, max)

  return daily.reduce((acc, timestamp, i) => {
    const [currTimestamp] = acc[i]
    if (currTimestamp.equals(timestamp)) {
      return acc
    }
    const [, prev1, prev2] = acc[i - 1]
    acc.splice(i, 0, [timestamp, prev1, prev2])
    return acc
  }, points)
}
