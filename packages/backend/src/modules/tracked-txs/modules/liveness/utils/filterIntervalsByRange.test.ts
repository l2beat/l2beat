import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { LivenessRecordWithConfig } from '../services/LivenessWithConfigService'
import type { Interval } from './calculateIntervals'
import { filterIntervalsByRange } from './filterIntervalsByRange'

describe(filterIntervalsByRange.name, () => {
  it('should filter intervals by range', async () => {
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

    const result = filterIntervalsByRange(MOCK_INTERVALS, NOW, '30D')

    expect(result).toEqual([...MOCK_INTERVALS].splice(0, 2))
  })
})
