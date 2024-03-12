import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessRecordWithInterval } from '../../liveness/api/calculateIntervalWithAverages'
import { calcAvgsPerProject } from './calcAvgsPerProject'

const NOW = UnixTime.now()

const RECORDS: LivenessRecordWithInterval[] = [
  {
    timestamp: NOW,
    subtype: 'batchSubmissions',
  },
  {
    timestamp: NOW.add(-1, 'hours'),
    subtype: 'batchSubmissions',
  },
  {
    timestamp: NOW.add(-3, 'hours'),
    subtype: 'batchSubmissions',
  },
  {
    timestamp: NOW.add(-91, 'days'),
    subtype: 'batchSubmissions',
  },
  {
    timestamp: NOW.add(-92, 'days'),
    subtype: 'batchSubmissions',
  },
  {
    timestamp: NOW.add(-93, 'days'),
    subtype: 'batchSubmissions',
  },
]

describe(calcAvgsPerProject.name, () => {
  it('returns correct values', () => {
    const result = calcAvgsPerProject(RECORDS)

    expect(result).toEqual({
      averageInSeconds: (3600 + 7200 + 86_400 * 91 - 10_800) / 3,
      maximumInSeconds: 86_400 * 91 - 10_800,
    })
  })
})
