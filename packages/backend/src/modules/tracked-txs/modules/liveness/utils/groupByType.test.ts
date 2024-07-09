import { UnixTime } from '@l2beat/shared-pure'

import { expect } from 'earl'
import { LivenessRecordWithSubtype } from '../repositories/LivenessRepository'
import { groupByType } from './groupByType'

describe(groupByType.name, () => {
  const NOW = UnixTime.now()

  it('returns grouped by type', () => {
    const records: LivenessRecordWithSubtype[] = [
      {
        timestamp: NOW.add(-1, 'hours'),
        subtype: 'batchSubmissions',
      },
      {
        timestamp: NOW.add(-2, 'hours'),
        subtype: 'batchSubmissions',
      },
      {
        timestamp: NOW.add(-2, 'hours'),
        subtype: 'batchSubmissions',
      },
      {
        timestamp: NOW.add(-1, 'hours'),
        subtype: 'stateUpdates',
      },
      {
        timestamp: NOW.add(-2, 'hours'),
        subtype: 'stateUpdates',
      },
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
