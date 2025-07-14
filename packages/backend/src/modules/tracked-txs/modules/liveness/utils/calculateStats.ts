import type { Interval } from './calculateIntervals'

type Stats = {
  averageInSeconds: number
  minimumInSeconds: number
  maximumInSeconds: number
}

export function calculateStats(intervals: Interval[]): Stats {
  const result: Stats = {
    averageInSeconds: 0,
    minimumInSeconds: Number.POSITIVE_INFINITY,
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
