import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  aggregateTransferSize,
  aggregateTransferType,
} from './getTransferSizeChartData'

const TIMESTAMP = UnixTime(1700000000)

function record(
  overrides: Partial<AggregatedInteropTransferRecord>,
): AggregatedInteropTransferRecord {
  return {
    timestamp: TIMESTAMP,
    id: 'protocol-a',
    bridgeType: 'lockAndMint',
    srcChain: 'arbitrum',
    dstChain: 'base',
    transferTypeStats: undefined,
    transferCount: 0,
    transfersWithDurationCount: 0,
    identifiedCount: 0,
    totalDurationSum: 0,
    srcValueUsd: undefined,
    dstValueUsd: undefined,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    avgValueInFlight: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    countUnder100: 0,
    count100To1K: 0,
    count1KTo10K: 0,
    count10KTo100K: 0,
    countOver100K: 0,
    ...overrides,
  }
}

describe(aggregateTransferSize.name, () => {
  it('returns undefined for no records', () => {
    expect(aggregateTransferSize([])).toEqual(undefined)
  })

  it('returns undefined when no transfers fall into any bucket', () => {
    expect(aggregateTransferSize([record({ srcValueUsd: 100 })])).toEqual(
      undefined,
    )
  })

  it('sums buckets, min/max and average across records and protocols', () => {
    const result = aggregateTransferSize([
      record({
        id: 'protocol-a',
        countUnder100: 2,
        count100To1K: 1,
        identifiedCount: 3,
        srcValueUsd: 300,
        minTransferValueUsd: 10,
        maxTransferValueUsd: 200,
      }),
      record({
        id: 'protocol-b',
        count1KTo10K: 1,
        identifiedCount: 1,
        srcValueUsd: 5000,
        minTransferValueUsd: 5000,
        maxTransferValueUsd: 5000,
      }),
    ])

    expect(result).toEqual({
      name: '',
      iconUrl: '',
      countUnder100: 2,
      percentageUnder100: 50,
      count100To1K: 1,
      percentage100To1K: 25,
      count1KTo10K: 1,
      percentage1KTo10K: 25,
      count10KTo100K: 0,
      percentage10KTo100K: 0,
      countOver100K: 0,
      percentageOver100K: 0,
      minTransferValueUsd: 10,
      maxTransferValueUsd: 5000,
      // (300 + 5000) / (3 + 1)
      averageTransferSizeUsd: 1325,
    })
  })

  it('leaves average undefined when nothing was identified', () => {
    const result = aggregateTransferSize([
      record({ countUnder100: 1, identifiedCount: 0, srcValueUsd: 50 }),
    ])
    expect(result?.averageTransferSizeUsd).toEqual(undefined)
  })
})

describe(aggregateTransferType.name, () => {
  it('returns undefined for no records', () => {
    expect(aggregateTransferType([])).toEqual(undefined)
  })

  it('returns undefined when total volume is zero', () => {
    expect(
      aggregateTransferType([record({ bridgeType: 'lockAndMint' })]),
    ).toEqual(undefined)
  })

  it('sums volume per bridge type', () => {
    const result = aggregateTransferType([
      record({ bridgeType: 'lockAndMint', srcValueUsd: 300 }),
      record({ bridgeType: 'lockAndMint', srcValueUsd: 200 }),
      record({ bridgeType: 'burnAndMint', srcValueUsd: 5000 }),
    ])

    expect(result).toEqual({
      lockAndMint: 500,
      burnAndMint: 5000,
    })
  })
})
