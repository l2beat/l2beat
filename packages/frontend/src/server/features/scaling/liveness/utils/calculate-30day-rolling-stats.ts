import { UnixTime, notUndefined } from '@l2beat/shared-pure'
import type { Interval } from './calculate-intervals'
import { RunningStatistics } from './running-statistics'

export function calculate30DayRollingStats(
  entireScope: Interval[],
  windowStartIndex: number,
  windowEndIndex: number,
  upTo: UnixTime,
): {
  means: Map<number, number>
  stdDeviations: Map<number, number>
} {
  const result = {
    means: new Map<number, number>(),
    stdDeviations: new Map<number, number>(),
  }

  let timeStart = upTo

  const initialWindow = entireScope.slice(windowStartIndex, windowEndIndex)
  let sum = initialWindow.reduce((prev, curr) => prev + (curr.duration ?? 0), 0)

  // special handling for the first loop iteration
  const mean = sum / (windowEndIndex - windowStartIndex)
  const rollingStdDev = new RunningStatistics(
    initialWindow.map((r) => r.duration).filter(notUndefined),
  )

  result.means.set(timeStart, mean)
  result.stdDeviations.set(timeStart, rollingStdDev.getStandardDeviation())
  while (timeStart >= upTo - 1 * 30 * UnixTime.DAY) {
    timeStart = timeStart - 1 * UnixTime.MINUTE
    const leftFence = timeStart
    const rightFence = timeStart - 1 * 30 * UnixTime.DAY

    while (entireScope[windowStartIndex]!.timestamp >= leftFence) {
      sum -= entireScope[windowStartIndex]?.duration ?? 0
      rollingStdDev.removeValue(entireScope[windowStartIndex]?.duration ?? 0)
      windowStartIndex++
    }
    while (
      windowEndIndex < entireScope.length &&
      entireScope[windowEndIndex]!.timestamp >= rightFence
    ) {
      sum += entireScope[windowEndIndex]?.duration ?? 0
      rollingStdDev.addValue(entireScope[windowEndIndex]?.duration ?? 0)
      windowEndIndex++
    }

    const mean = sum / (windowEndIndex - windowStartIndex)
    result.means.set(timeStart, mean)
    result.stdDeviations.set(timeStart, rollingStdDev.getStandardDeviation())
  }

  return result
}
