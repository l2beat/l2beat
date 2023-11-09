import { LivenessType, notUndefined, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  calculateAverage,
  calculateAverages,
  calculateIntervals,
  calculateIntervalWithAverages,
  calculateMax,
  filterRecords,
  LivenessRecordWithInterval,
} from './calculateIntervalWithAverages'

const NOW = UnixTime.now()

const RECORDS: LivenessRecordWithInterval[] = [
  {
    timestamp: NOW,
    blockNumber: 1,
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
  },
  {
    timestamp: NOW.add(-1, 'hours'),
    blockNumber: 2,
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
  },
  {
    timestamp: NOW.add(-3, 'hours'),
    blockNumber: 1,
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
  },
  {
    timestamp: NOW.add(-31, 'days'),
    blockNumber: 2,
    txHash: '0x1234567890abcdef',
    type: LivenessType('STATE'),
  },
  {
    timestamp: NOW.add(-31, 'days').add(-1, 'hours'),
    blockNumber: 3,
    txHash: '0x1234567890abcdef',
    type: LivenessType('STATE'),
  },
  {
    timestamp: NOW.add(-91, 'days'),
    blockNumber: 4,
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
    previousRecordInterval: 86_400 * 60,
  },
  {
    timestamp: NOW.add(-92, 'days'),
    blockNumber: 4,
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
    previousRecordInterval: 86_400 * 60,
  },
]

describe(calculateMax.name, () => {
  it('returns the maximum', () => {
    const result = calculateMax([1, 2, 3, 4, 1, 5, 7])
    expect(result).toEqual(7)
  })
})

describe(calculateAverage.name, () => {
  it('returns the average', () => {
    const result = calculateAverage([1, 2, 3, 4])
    // 2.5 rounded to 3
    expect(result).toEqual(3)
  })
})

describe(filterRecords.name, () => {
  it('30d', () => {
    const withIntervals = calculateIntervals(RECORDS)!
    const result = filterRecords(withIntervals, '30d')
    expect(result).toEqual(
      withIntervals.slice(0, 3).map((r) => r.previousRecordInterval!),
    )
  })
  it('90d', () => {
    const withIntervals = calculateIntervals(RECORDS)!
    const result = filterRecords(withIntervals, '90d')
    expect(result).toEqual(
      withIntervals.slice(0, 5).map((r) => r.previousRecordInterval!),
    )
  })
  it('max', () => {
    const withIntervals = calculateIntervals(RECORDS)!
    const result = filterRecords(withIntervals, 'max')
    expect(result).toEqual(
      withIntervals.map((r) => r.previousRecordInterval!).filter(notUndefined),
    )
  })
})

describe(calculateIntervals.name, () => {
  it('returns records with intervals', () => {
    const expected: LivenessRecordWithInterval[] = [
      {
        timestamp: NOW,
        blockNumber: 1,
        txHash: '0x1234567890abcdef',
        type: LivenessType('DA'),
        previousRecordInterval: 3600,
      },
      {
        timestamp: NOW.add(-1, 'hours'),
        blockNumber: 2,
        txHash: '0x1234567890abcdef',
        type: LivenessType('DA'),
        previousRecordInterval: 2 * 3600,
      },
      {
        timestamp: NOW.add(-3, 'hours'),
        blockNumber: 1,
        txHash: '0x1234567890abcdef',
        type: LivenessType('DA'),
      },
    ]
    const records = calculateIntervals(RECORDS.slice(0, 3))

    expect(records).toEqual(expected)
  })
})

describe(calculateAverages.name, () => {
  it('returns the averages for stateUpdates with undefined', () => {
    const records = calculateIntervals(RECORDS)!
    const result = calculateAverages(
      records.filter((r) => r.type === LivenessType('STATE')),
    )
    const expected = {
      last30Days: undefined,
      last90Days: { averageInSeconds: 2592000, maximumInSeconds: 5180400 },
      max: { averageInSeconds: 2592000, maximumInSeconds: 5180400 },
    }
    expect(result).toEqual(expected)
  })
  it('returns the averages for batchSubmissions', () => {
    const records = calculateIntervals(RECORDS)!
    const result = calculateAverages(
      records.filter((r) => r.type === LivenessType('DA')),
    )
    const expected = {
      last30Days: { averageInSeconds: 892800, maximumInSeconds: 2667600 },
      last90Days: { averageInSeconds: 892800, maximumInSeconds: 2667600 },
      max: { averageInSeconds: 1589760, maximumInSeconds: 5184000 },
    }
    expect(result).toEqual(expected)
  })
})

describe(calculateIntervalWithAverages.name, () => {
  it('returns the intervals with averages', () => {
    const result = calculateIntervalWithAverages({
      project1: {
        batchSubmissions: {
          records: RECORDS.filter((r) => r.type === LivenessType('DA')),
        },
        stateUpdates: {
          records: RECORDS.filter((r) => r.type === LivenessType('STATE')),
        },
      },
    })
    const expected = {
      project1: {
        batchSubmissions: {
          records: calculateIntervals(
            RECORDS.filter((r) => r.type === LivenessType('DA')),
          )!,
          last30Days: {
            averageInSeconds: 2620800,
            maximumInSeconds: 7851600,
          },
          last90Days: {
            averageInSeconds: 2620800,
            maximumInSeconds: 7851600,
          },
          max: {
            averageInSeconds: 2626560,
            maximumInSeconds: 7851600,
          },
        },

        stateUpdates: {
          records: calculateIntervals(
            RECORDS.filter((r) => r.type === LivenessType('STATE')),
          )!,
          last30Days: undefined,
          last90Days: {
            averageInSeconds: 3600,
            maximumInSeconds: 3600,
          },
          max: {
            averageInSeconds: 3600,
            maximumInSeconds: 3600,
          },
        },
      },
    }
    expect(result).toEqual(expected)
  })
})
