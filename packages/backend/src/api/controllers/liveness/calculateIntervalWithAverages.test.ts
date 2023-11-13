import { LivenessType, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { cloneDeep } from 'lodash'

import {
  calculateAverages,
  calculateIntervals,
  calculateIntervalWithAverages,
  LivenessRecordWithInterval,
} from './calculateIntervalWithAverages'

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
    timestamp: NOW.add(-31, 'days'),
    type: LivenessType('STATE'),
  },
  {
    timestamp: NOW.add(-31, 'days').add(-1, 'hours'),
    type: LivenessType('STATE'),
  },
  {
    timestamp: NOW.add(-91, 'days'),
    type: LivenessType('DA'),
    previousRecordInterval: 86_400 * 60,
  },
  {
    timestamp: NOW.add(-92, 'days'),
    type: LivenessType('DA'),
    previousRecordInterval: 86_400 * 60,
  },
]

describe(calculateIntervals.name, () => {
  it('returns records with intervals', () => {
    const expected: LivenessRecordWithInterval[] = [
      {
        timestamp: NOW,
        type: LivenessType('DA'),
        previousRecordInterval: 3600,
      },
      {
        timestamp: NOW.add(-1, 'hours'),
        type: LivenessType('DA'),
        previousRecordInterval: 2 * 3600,
      },
      {
        timestamp: NOW.add(-3, 'hours'),
        type: LivenessType('DA'),
      },
    ]
    const input = cloneDeep(RECORDS).slice(0, 3)
    calculateIntervals(input)

    expect(input).toEqual(expected)
  })
})

describe(calculateAverages.name, () => {
  it('returns the averages for stateUpdates with undefined', () => {
    const input = cloneDeep(RECORDS)
    calculateIntervals(input)!
    const result = calculateAverages(
      input.filter((r) => r.type === LivenessType('STATE')),
    )
    const expected = {
      last30Days: undefined,
      last90Days: { averageInSeconds: 2592000, maximumInSeconds: 5180400 },
      max: { averageInSeconds: 2592000, maximumInSeconds: 5180400 },
    }
    expect(result).toEqual(expected)
  })
  it('returns the averages for batchSubmissions', () => {
    const input = cloneDeep(RECORDS)
    calculateIntervals(input)!
    const result = calculateAverages(
      input.filter((r) => r.type === LivenessType('DA')),
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
