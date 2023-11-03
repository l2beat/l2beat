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
          last30days: MOCK_EMPTY_DATA,
          last90days: MOCK_EMPTY_DATA,
          max: MOCK_EMPTY_DATA,
        },
        stateUpdates: {
          records: [],
          last30days: MOCK_EMPTY_DATA,
          last90days: MOCK_EMPTY_DATA,
          max: MOCK_EMPTY_DATA,
        },
      },
    })
    expect(result.project1.anomalies).toEqual([
      {
        timestamp: NOW,
        blockNumber: 1,
        txHash: '0x1234567890abcdef',
        type: 'DA',
        previousRecordInterval: 4320000,
        isAnomaly: true,
      },
    ])
  })
})

const NOW = UnixTime.now()

const MOCK_EMPTY_DATA = {
  averageInSeconds: null,
  maximumInSeconds: null,
}

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
