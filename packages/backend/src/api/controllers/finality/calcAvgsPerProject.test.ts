import { LivenessType, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessRecordWithInterval } from '../liveness/calculateIntervalWithAverages'
import { calcAvgsPerProject } from './calcAvgsPerProject'

const NOW = UnixTime.now()

const RECORDS: LivenessRecordWithInterval[] = [
  {
    timestamp: NOW,
    type: LivenessType('DA'),
  },
  {
    timestamp: NOW.add(-1, 'hours'),
    type: LivenessType('DA'),
  },
  {
    timestamp: NOW.add(-3, 'hours'),
    type: LivenessType('DA'),
  },
  {
    timestamp: NOW.add(-91, 'days'),
    type: LivenessType('DA'),
  },
  {
    timestamp: NOW.add(-92, 'days'),
    type: LivenessType('DA'),
  },
  {
    timestamp: NOW.add(-93, 'days'),
    type: LivenessType('DA'),
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
