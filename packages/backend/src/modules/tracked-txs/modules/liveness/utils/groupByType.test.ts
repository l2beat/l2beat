import { UnixTime } from '@l2beat/shared-pure'

import { expect, mockObject } from 'earl'
import type { LivenessRecordWithConfig } from '../services/LivenessWithConfigService'
import { groupByType } from './groupByType'

describe(groupByType.name, () => {
  const NOW = UnixTime.now()

  it('returns grouped by type', () => {
    const records: LivenessRecordWithConfig[] = [
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW.add(-1, 'hours'),
        subtype: 'batchSubmissions',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW.add(-2, 'hours'),
        subtype: 'batchSubmissions',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW.add(-2, 'hours'),
        subtype: 'batchSubmissions',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW.add(-1, 'hours'),
        subtype: 'stateUpdates',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW.add(-2, 'hours'),
        subtype: 'stateUpdates',
      }),
    ]
    const result = groupByType(records)

    expect(result).toEqual([
      records.filter((r) => r.subtype === 'batchSubmissions'),
      records.filter((r) => r.subtype === 'stateUpdates'),
      [],
    ])
  })

  it('should throw on uknown type', () => {
    const records = [
      {
        timestamp: NOW.add(-1, 'hours'),
        subtype: 'unknown',
      },
    ]

    expect(() => groupByType(records as any)).toThrow(
      'There are more values to handle.',
    )
  })
})
