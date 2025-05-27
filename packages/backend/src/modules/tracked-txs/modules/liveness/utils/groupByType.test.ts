import { UnixTime } from '@l2beat/shared-pure'

import { expect, mockObject } from 'earl'
import { groupByType } from './groupByType'
import type { LivenessRecordWithConfig } from './mapToRecordWithConfig'

describe(groupByType.name, () => {
  const NOW = UnixTime.now()

  it('returns grouped by type', () => {
    const records: LivenessRecordWithConfig[] = [
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW - 1 * UnixTime.HOUR,
        subtype: 'batchSubmissions',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW - 2 * UnixTime.HOUR,
        subtype: 'batchSubmissions',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW - 2 * UnixTime.HOUR,
        subtype: 'batchSubmissions',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW - 1 * UnixTime.HOUR,
        subtype: 'stateUpdates',
      }),
      mockObject<LivenessRecordWithConfig>({
        timestamp: NOW - 2 * UnixTime.HOUR,
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
        timestamp: NOW - 1 * UnixTime.HOUR,
        subtype: 'unknown',
      },
    ]

    expect(() => groupByType(records as any)).toThrow(
      'There are more values to handle.',
    )
  })
})
