import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { LivenessRecordWithConfig } from '../services/LivenessWithConfigService'
import type { Interval } from './calculateIntervals'
import { calculateStats } from './calculateStats'

describe(calculateStats.name, () => {
  it('should calculate stats', async () => {
    const NOW = UnixTime.now()
    const MOCK_INTERVALS: Interval[] = [
      {
        record: mockObject<LivenessRecordWithConfig>({
          subtype: 'batchSubmissions',
          timestamp: NOW.add(-1, 'days'),
        }),
        duration: 10,
      },
      {
        record: mockObject<LivenessRecordWithConfig>({
          subtype: 'batchSubmissions',
          timestamp: NOW.add(-10, 'days'),
        }),
        duration: 20,
      },
      {
        record: mockObject<LivenessRecordWithConfig>({
          subtype: 'batchSubmissions',
          timestamp: NOW.add(-40, 'days'),
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
