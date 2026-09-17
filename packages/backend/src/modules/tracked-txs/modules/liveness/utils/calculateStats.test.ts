import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'
import type { Interval } from './calculateIntervals'
import { calculateStats } from './calculateStats'
import type { LivenessRecordWithConfig } from './mapToRecordWithConfig'

describe(calculateStats.name, () => {
  it('should calculate stats', async () => {
    const NOW = UnixTime.now()
    const MOCK_INTERVALS: Interval[] = [
      {
        record: {
          subtype: 'batchSubmissions',
          timestamp: NOW - 1 * UnixTime.DAY,
        } as unknown as LivenessRecordWithConfig,
        duration: 10,
      },
      {
        record: {
          subtype: 'batchSubmissions',
          timestamp: NOW - 10 * UnixTime.DAY,
        } as unknown as LivenessRecordWithConfig,
        duration: 20,
      },
      {
        record: {
          subtype: 'batchSubmissions',
          timestamp: NOW - 40 * UnixTime.DAY,
        } as unknown as LivenessRecordWithConfig,
        duration: 30,
      },
    ]

    const result = calculateStats(MOCK_INTERVALS)

    expect(result).toEqual({
      averageInSeconds: 20,
      minimumInSeconds: 10,
      maximumInSeconds: 30,
    })
  })
})
