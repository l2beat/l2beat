import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { calcAvgsPerProject } from './calc-avgs-per-project'
import { type LivenessRecordWithConfig } from './get-liveness-by-type-since'

const NOW = UnixTime.now()

const RECORDS: LivenessRecordWithConfig[] = [
  mockObject<LivenessRecordWithConfig>({
    timestamp: NOW,
    subtype: 'batchSubmissions',
  }),
  mockObject<LivenessRecordWithConfig>({
    timestamp: NOW.add(-1, 'hours'),
    subtype: 'batchSubmissions',
  }),
  mockObject<LivenessRecordWithConfig>({
    timestamp: NOW.add(-3, 'hours'),
    subtype: 'batchSubmissions',
  }),
  mockObject<LivenessRecordWithConfig>({
    timestamp: NOW.add(-29, 'days'),
    subtype: 'batchSubmissions',
  }),
  mockObject<LivenessRecordWithConfig>({
    timestamp: NOW.add(-30, 'days'),
    subtype: 'batchSubmissions',
  }),
  mockObject<LivenessRecordWithConfig>({
    timestamp: NOW.add(-31, 'days'),
    subtype: 'batchSubmissions',
  }),
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
