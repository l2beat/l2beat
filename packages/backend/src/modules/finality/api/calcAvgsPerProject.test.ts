import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { LivenessRecordWithSubtype } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { calcAvgsPerProject } from './calcAvgsPerProject'

const NOW = UnixTime.now()

const RECORDS: LivenessRecordWithSubtype[] = [
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
    timestamp: NOW.add(-29, 'days'),
    subtype: 'batchSubmissions',
  },
  {
    timestamp: NOW.add(-30, 'days'),
    subtype: 'batchSubmissions',
  },
  {
    timestamp: NOW.add(-31, 'days'),
    subtype: 'batchSubmissions',
  },
]

describe(calcAvgsPerProject.name, () => {
  it('returns correct values', () => {
    const result = calcAvgsPerProject(RECORDS)

    expect(result).toEqual({
      averageInSeconds: (3600 + 7200 + 86_400 * 29 - 10_800) / 3,
      maximumInSeconds: 86_400 * 29 - 10_800,
    })
  })
})
