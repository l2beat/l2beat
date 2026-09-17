import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'
import { groupByType } from './groupByType'
import type { LivenessRecordWithConfig } from './mapToRecordWithConfig'

describe(groupByType.name, () => {
  const NOW = UnixTime.now()

  it('returns grouped by type', () => {
    const records: LivenessRecordWithConfig[] = [
      {
        timestamp: NOW - 1 * UnixTime.HOUR,
        subtype: 'batchSubmissions',
      } as unknown as LivenessRecordWithConfig,
      {
        timestamp: NOW - 2 * UnixTime.HOUR,
        subtype: 'batchSubmissions',
      } as unknown as LivenessRecordWithConfig,
      {
        timestamp: NOW - 2 * UnixTime.HOUR,
        subtype: 'batchSubmissions',
      } as unknown as LivenessRecordWithConfig,
      {
        timestamp: NOW - 1 * UnixTime.HOUR,
        subtype: 'stateUpdates',
      } as unknown as LivenessRecordWithConfig,
      {
        timestamp: NOW - 2 * UnixTime.HOUR,
        subtype: 'stateUpdates',
      } as unknown as LivenessRecordWithConfig,
    ]
    const result = groupByType(records)

    expect(result).toEqual([
      records.filter((r) => r.subtype === 'batchSubmissions'),
      records.filter((r) => r.subtype === 'stateUpdates'),
      [],
    ])
  })

  it('should throw on unknown type', () => {
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
