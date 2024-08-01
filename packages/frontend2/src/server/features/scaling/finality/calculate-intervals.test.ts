import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { calculateIntervals } from './calculate-intervals'
import { type LivenessRecordWithConfig } from './get-liveness-by-type-since'

describe(calculateIntervals.name, () => {
  const NOW = UnixTime.now()
  it('returns calculated intervals', () => {
    const records: LivenessRecordWithConfig[] = [
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW.add(-1, 'hours'),
        subtype: 'batchSubmissions',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW.add(-3, 'hours'),
        subtype: 'batchSubmissions',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW.add(-7, 'hours'),
        subtype: 'batchSubmissions',
      }),
    ]
    const result = calculateIntervals(records)

    expect(result).toEqual([
      {
        record: records[1]!,
        duration: 2 * 60 * 60,
      },
      {
        record: records[2]!,
        duration: 4 * 60 * 60,
      },
    ])
  })

  it('if no records return empty array', () => {
    const result = calculateIntervals([])
    expect(result).toEqual([])
  })
})
