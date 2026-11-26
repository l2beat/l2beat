import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { GasFeesRecords } from './getGasFeesRecords'
import { buildGasFeesSummary } from './getGasFeesSummary'
import type { GasFeesRecord } from './types'

const DAY = UnixTime.DAY

describe(buildGasFeesSummary.name, () => {
  const records: GasFeesRecords = new Map([
    ['ethereum', [record(1, 10), record(2, 30), record(3, 20)]],
    // Lacks day 2, Ethereum's most expensive
    ['base', [record(1, 1), record(3, 2)]],
    ['taiko', [record(1, null), record(2, null), record(3, null)]],
    ['ink', []],
  ])
  const summary = buildGasFeesSummary(records, { range: [null, 10 * DAY] })
  const row = (id: string) => summary.rows.find((r) => r.id === id)

  it('compares a chain with Ethereum over the days the chain has', () => {
    expect(row('base')?.erc20).toEqual(1.5)
    expect(row('base')?.missingDays).toEqual(1)
    // Ethereum's days 1 and 3 average 15, not the 20 of all three
    expect(row('base')?.timesCheaper?.erc20).toEqual(10)
  })

  it('leaves out of the comparison a day Ethereum lacks', () => {
    const lacking = buildGasFeesSummary(
      new Map([
        ['ethereum', [record(1, 10)]],
        ['base', [record(1, 1), record(2, 9)]],
      ]),
      { range: [null, 10 * DAY] },
    )
    expect(lacking.rows[1]?.erc20).toEqual(5)
    expect(lacking.rows[1]?.timesCheaper?.erc20).toEqual(10)
  })

  it('has no cost for a chain without transactions, and lists one without data', () => {
    expect(row('taiko')?.erc20).toEqual(null)
    expect(row('taiko')?.timesCheaper?.erc20).toEqual(null)
    expect(summary.noDataIds.includes('ink')).toEqual(true)
    expect(summary.lastDay).toEqual(3 * DAY)
  })

  it("takes the latest transfer cost from Ethereum's newest day", () => {
    expect(summary.stats.latestErc20).toEqual({
      timestamp: 3 * DAY,
      ethereum: 20,
      l2s: 2,
    })
  })
})

function record(day: number, erc20: number | null): GasFeesRecord {
  const txCount = erc20 === null ? 0 : 100
  return {
    timestamp: day * DAY,
    txCount,
    gasUsed: txCount * 10,
    totalFees: txCount,
    baseFees: txCount,
    priorityFees: 0,
    l1DataFees: 0,
    medianFee: erc20,
    transfer: erc20,
    erc20,
    swap: erc20,
    gasPrice: erc20,
    baseFeePerGas: erc20,
    priorityFeePerGas: erc20 === null ? null : 0,
  }
}
