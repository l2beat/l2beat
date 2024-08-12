import { type Interval } from './calculate-intervals'

type Stats = {
  averageInSeconds: number
  minimumInSeconds: number
  maximumInSeconds: number
}

export function calculateStats(intervals: Interval[]): Stats {
  const result: Stats = {
    averageInSeconds: 0,
    minimumInSeconds: Infinity,
    maximumInSeconds: 0,
  }

  for (const interval of intervals) {
    result.averageInSeconds += interval.duration
    result.minimumInSeconds = Math.min(
      result.minimumInSeconds,
      interval.duration,
    )
    result.maximumInSeconds = Math.max(
      result.maximumInSeconds,
      interval.duration,
    )
  }

  result.averageInSeconds = Math.ceil(
    result.averageInSeconds / intervals.length,
  )

  return result
}
