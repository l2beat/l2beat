import { UnixTime } from '@l2beat/shared-pure'
import { type LivenessAnomaly } from './types'

export type AnomalyIndicatorEntry = AnomalyEntry | NonAnomalyEntry
export interface AnomalyEntry {
  isAnomaly: true
  anomalies: (Omit<LivenessAnomaly, 'timestamp'> & {
    timestamp: number
  })[]
}

export interface NonAnomalyEntry {
  isAnomaly: false
}

export function toAnomalyIndicatorEntries(
  anomalies: LivenessAnomaly[],
): AnomalyIndicatorEntry[] {
  const now = UnixTime.now()
  // We want to show last 30 days with today included so we start 29 days ago
  const thirtyDaysAgo = now.add(-29, 'days')
  let dayInLoop = thirtyDaysAgo
  const result: AnomalyIndicatorEntry[] = []

  while (dayInLoop.lte(now)) {
    const anomaliesInGivenDay = anomalies.filter((a) => {
      return a.timestamp.toYYYYMMDD() === dayInLoop.toYYYYMMDD()
    })

    if (anomaliesInGivenDay.length === 0) {
      result.push({
        isAnomaly: false,
      })
    } else {
      const anomalies = anomaliesInGivenDay.map(
        (a) =>
          ({
            type: a.type,
            timestamp: a.timestamp.toNumber(),
            durationInSeconds: a.durationInSeconds,
          }) as const,
      )
      anomalies.sort((a, b) => a.timestamp - b.timestamp)
      result.push({
        isAnomaly: true,
        anomalies: anomalies,
      })
    }

    dayInLoop = dayInLoop.add(1, 'days')
  }
  return result
}
