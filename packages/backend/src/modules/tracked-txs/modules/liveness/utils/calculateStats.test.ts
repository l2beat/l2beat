import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { Interval } from './calculateIntervals'
import { calculateStats } from './calculateStats'
import type { LivenessRecordWithConfig } from './mapToRecordWithConfig'

describe(calculateStats.name, () => {
  it('should calculate stats', async () => {
    const NOW = UnixTime.now()
    const MOCK_INTERVALS: Interval[] = [
      {
        record: mockObject<LivenessRecordWithConfig>({
          subtype: 'batchSubmissions',
          timestamp: NOW - 1 * UnixTime.DAY,
        }),
        duration: 10,
      },
      {
        record: mockObject<LivenessRecordWithConfig>({
          subtype: 'batchSubmissions',
          timestamp: NOW - 10 * UnixTime.DAY,
        }),
        duration: 20,
      },
      {
        record: mockObject<LivenessRecordWithConfig>({
          subtype: 'batchSubmissions',
          timestamp: NOW - 40 * UnixTime.DAY,
        }),
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
