import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { LivenessRecordWithConfig } from '../services/LivenessWithConfigService'
import { calculateIntervals } from './calculateIntervals'

describe(calculateIntervals.name, () => {
  const NOW = UnixTime.now()
  it('returns calculated intervals', () => {
    const records: LivenessRecordWithConfig[] = [
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW - 1 * UnixTime.HOUR,
        subtype: 'batchSubmissions',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW - 3 * UnixTime.HOUR,
        subtype: 'batchSubmissions',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW - 7 * UnixTime.HOUR,
        subtype: 'batchSubmissions',
      }),
    ]
    const result = calculateIntervals(records)

    expect(result).toEqual([
      {
        record: records[1],
        duration: 2 * 60 * 60,
      },
      {
        record: records[2],
        duration: 4 * 60 * 60,
      },
    ])
  })

  it('if no records return empty array', () => {
    const result = calculateIntervals([])
    expect(result).toEqual([])
  })
})
