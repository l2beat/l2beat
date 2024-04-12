import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { findCutoffTime } from './findCutoffTime'
import { DailyTransactionCount } from './types'

export function toCombinedActivity(
  projectCounts: Map<ProjectId, DailyTransactionCount[]>,
): {
  daily: (DailyTransactionCount & { includesEstimated: number })[]
  estimatedSince: UnixTime
  estimatedImpact: number
} {
  const layer2sCounts = [...projectCounts.entries()]

  // Find the cutoff time for the estimation of the daily transaction count
  const cutoffTime = findCutoffTime(layer2sCounts.map(([_, counts]) => counts))

  // Construct the X-axis of the chart (array of days)
  const days = [
    ...new Set(
      layer2sCounts
        .map(([_, counts]) => counts.map((c) => c.timestamp.toNumber()))
        .flat(),
    ),
  ].map((t) => new UnixTime(t))

  // An object that stores the last present value of each project in case the one for the current day is missing
  const lastPresentValue: Record<ProjectId, number> = Object.fromEntries(
    [...projectCounts.keys()].map((k) => [k, 0]),
  )

  const dailyData = days.map((day) => {
    let includesEstimated = 0
    const count = layer2sCounts
      .map(([projectId, counts]) => {
        const current = counts.find((c) => c.timestamp.equals(day))
        if (current) {
          lastPresentValue[projectId] = current.count
          return current.count
        }
        includesEstimated += lastPresentValue[projectId]
        return lastPresentValue[projectId]
      })
      .reduce((acc, c) => acc + c, 0)
    return { timestamp: day, count, includesEstimated }
  })

  const lastDaily = dailyData.at(-1)
  const estimatedImpact =
    (lastDaily?.includesEstimated ?? 0) / (lastDaily?.count ?? 1)

  return { daily: dailyData, estimatedSince: cutoffTime, estimatedImpact }
}
