import type { GasFeesDailyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { GasFeesChainConfig } from './chains'
import { toGasFeesRecord } from './toGasFeesRecord'

const DAY = UnixTime(100 * UnixTime.DAY)
const chain: GasFeesChainConfig = { id: 'l2', gasToken: 'ETH' }

describe(toGasFeesRecord.name, () => {
  it('splits a day into the base fee, tips and the L1 fee on top', () => {
    const record = toGasFeesRecord(row({}), chain)

    expect(record.baseFees).toEqual(1_000)
    expect(record.priorityFees).toEqual(500)
    expect(record.l1DataFees).toEqual(500)
    // 2 ETH - 0.5 ETH of L1 fee, over 1e9 gas
    expectClose(record.gasPrice, 1.5)
    expectClose(record.baseFeePerGas, 1)
    expectClose(record.priorityFeePerGas, 0.5)
  })

  it('prices an action at the gas price plus the average L1 fee', () => {
    const record = toGasFeesRecord(row({}), chain)

    // 21,000 gas at 1.5 gwei and 0.5 ETH of L1 fee over 1,000 transactions, at $1,000
    expectClose(record.transfer, 0.0315 + 0.5)
  })

  it('takes the L1 fee out of a base fee that holds it', () => {
    const record = toGasFeesRecord(row({ baseFeeNative: 1.5 }), {
      ...chain,
      l1FeeInGas: true,
    })

    expect(record.baseFees).toEqual(1_000)
    expect(record.priorityFees).toEqual(500)
    // The gas holds the L1 gas, so all 2 ETH were paid per gas
    expectClose(record.gasPrice, 2)
  })

  it('counts everything but the L1 fee as the base fee where there are no tips', () => {
    const record = toGasFeesRecord(row({}), {
      ...chain,
      noPriorityFees: { reason: '' },
    })

    expect(record.baseFees).toEqual(1_500)
    expect(record.priorityFees).toEqual(null)
    expect(record.priorityFeePerGas).toEqual(null)
  })

  it('counts blob fees and an operator fee as set by the chain', () => {
    const record = toGasFeesRecord(row({ blobFeeNative: 0.125 }), {
      ...chain,
      operatorFee: { from: DAY, gweiPerGas: 0.125 },
    })

    // 1 ETH of base fee, 0.125 of blobs, 0.125 gwei on 1e9 gas
    expectClose(record.baseFees, 1_250)
    expectClose(record.priorityFees, 250)
  })

  it('has no prices on a day without transactions', () => {
    const record = toGasFeesRecord(
      row({
        txCount: 0,
        gasUsed: 0,
        totalFeeNative: 0,
        totalFeeUsd: 0,
        l1FeeNative: 0,
        baseFeeNative: 0,
        medianFeeUsd: null,
      }),
      chain,
    )

    expect(record.totalFees).toEqual(0)
    expect(record.gasPrice).toEqual(null)
    expect(record.transfer).toEqual(null)
    expect(record.medianFee).toEqual(null)
  })
})

/** Sums and ratios of fractions don't come out exact */
function expectClose(actual: number | null, expected: number) {
  expect(actual ?? Number.NaN).toBeCloseTo(expected, 1e-9)
}

/** 1,000 transactions paying 2 ETH at $1,000: 1 of base fee, 0.5 of L1 fee, the rest tips */
function row(overrides: Partial<GasFeesDailyRecord>): GasFeesDailyRecord {
  return {
    timestamp: DAY,
    chain: 'l2',
    txCount: 1_000,
    totalFeeNative: 2,
    totalFeeUsd: 2_000,
    l1FeeNative: 0.5,
    blobFeeNative: 0,
    baseFeeNative: 1,
    gasUsed: 1e9,
    medianFeeUsd: 1,
    ...overrides,
  }
}
