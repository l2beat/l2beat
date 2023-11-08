import { LivenessType, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { calculateAnomalies } from './calculateAnomalies'
import { LivenessRecordWithInterval } from './calculateIntervalWithAverages'

describe(calculateAnomalies.name, () => {
  it('returns the anomalies', () => {
    const result = calculateAnomalies({
      project1: {
        batchSubmissions: {
          records: RECORDS,
          last30Days: undefined,
          last90Days: undefined,
          max: undefined,
        },
        stateUpdates: {
          records: [],
          last30Days: undefined,
          last90Days: undefined,
          max: undefined,
        },
      },
    })
    expect(result.project1.anomalies).toEqual([
      {
        timestamp: NOW,
        type: 'DA',
        durationInSeconds: 4320000,
      },
    ])
  })
})

const NOW = UnixTime.now()

const RECORDS: LivenessRecordWithInterval[] = [
  {
    timestamp: NOW,
    blockNumber: 1,
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
    previousRecordInterval: 50 * 24 * 3600,
  },
]

RECORDS.push(
  ...Array.from({ length: 500 }).map((_, i) => ({
    timestamp: NOW.add(-i, 'hours'),
    blockNumber: i,
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
    previousRecordInterval: 3600,
  })),
)
