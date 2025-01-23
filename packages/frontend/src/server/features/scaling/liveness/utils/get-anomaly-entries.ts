import { UnixTime } from '@l2beat/shared-pure'
import { type LivenessAnomaly } from '../types'

export type AnomalyIndicatorEntry = AnomalyEntry | NonAnomalyEntry
export interface AnomalyEntry {
  isAnomaly: true
  anomalies: (Omit<LivenessAnomaly, 'timestamp'> & {
    timestamp: number
  })[]
}

interface NonAnomalyEntry {
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
      const unixTimestamp = new UnixTime(a.timestamp)
      return dayInLoop.inInclusiveRange(
        unixTimestamp,
        unixTimestamp.add(a.durationInSeconds, 'seconds'),
      )
    })

    if (anomaliesInGivenDay.length === 0) {
      result.push({
        isAnomaly: false,
      })
    } else {
      anomaliesInGivenDay.sort((a, b) => a.timestamp - b.timestamp)
      result.push({
        isAnomaly: true,
        anomalies: anomaliesInGivenDay,
      })
    }

    dayInLoop = dayInLoop.add(1, 'days')
  }
  return result
}
