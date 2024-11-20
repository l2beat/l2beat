import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describe, it } from 'mocha'
import { type LivenessAnomaly } from '../types'
import { toAnomalyIndicatorEntries } from './get-anomaly-entries'

describe(toAnomalyIndicatorEntries.name, () => {
  const now = UnixTime.now()

  it('returns array of 30 entries', () => {
    const result = toAnomalyIndicatorEntries([])
    expect(result).toHaveLength(30)
  })

  it('marks days without anomalies as non-anomaly entries', () => {
    const result = toAnomalyIndicatorEntries([])
    expect(result.every((entry) => entry.isAnomaly === false)).toEqual(true)
  })

  it('correctly identifies and sorts anomalies on a given day', () => {
    const anomalies: LivenessAnomaly[] = [
      {
        timestamp: now.toNumber(),
        durationInSeconds: 3600,
        type: 'stateUpdates',
      },
      {
        timestamp: now.add(-1, 'hours').toNumber(),
        durationInSeconds: 1800,
        type: 'stateUpdates',
      },
    ]

    const result = toAnomalyIndicatorEntries(anomalies)
    const todayEntry = result[29] // Last entry should be today
    expect(todayEntry?.isAnomaly).toEqual(true)
    if (todayEntry?.isAnomaly) {
      expect(todayEntry.anomalies).toHaveLength(2)
      expect(todayEntry.anomalies.map((a) => a.timestamp)).toEqual([
        now.add(-1, 'hours').toNumber(),
        now.toNumber(),
      ])
    }
  })

  it('handles anomalies from different days', () => {
    const anomalies: LivenessAnomaly[] = [
      {
        timestamp: now.toNumber(),
        durationInSeconds: 3600,
        type: 'stateUpdates',
      },
      {
        timestamp: now.add(-5, 'days').toNumber(),
        durationInSeconds: 1800,
        type: 'stateUpdates',
      },
    ]

    const result = toAnomalyIndicatorEntries(anomalies)

    // Count days with anomalies
    const anomalyDays = result.filter((entry) => entry.isAnomaly)
    expect(anomalyDays).toHaveLength(2)
  })

  it('ignores anomalies outside the 30-day window', () => {
    const anomalies: LivenessAnomaly[] = [
      {
        timestamp: now.add(-31, 'days').toNumber(),
        durationInSeconds: 3600,
        type: 'stateUpdates',
      },
    ]

    const result = toAnomalyIndicatorEntries(anomalies)
    expect(result.every((entry) => entry.isAnomaly === false)).toEqual(true)
  })
})
