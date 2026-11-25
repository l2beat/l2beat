import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { GAS_FEES_CHAINS } from './chains'
import { buildGasFeesChart } from './getGasFeesChart'
import type { GasFeesRecords } from './getGasFeesRecords'
import type { GasFeesRecord } from './types'

const DAY = UnixTime.DAY
const index = (id: string) => 1 + GAS_FEES_CHAINS.findIndex((c) => c.id === id)
const L2S = 1 + GAS_FEES_CHAINS.length

describe(buildGasFeesChart.name, () => {
  it('leaves a gap for a day a chain lacks or had no transactions on', () => {
    const records: GasFeesRecords = new Map([
      ['ethereum', [record(1, 10), record(2, 10), record(3, 10)]],
      ['base', [record(1, 2), record(3, null)]],
    ])

    const { chart } = buildGasFeesChart(records, {
      range: [null, 10 * DAY],
      metric: 'erc20',
    })

    expect(chart.map((point) => point[0])).toEqual([DAY, 2 * DAY, 3 * DAY])
    expect(chart.map((point) => point[index('ethereum')])).toEqual([10, 10, 10])
    expect(chart.map((point) => point[index('base')])).toEqual([2, null, null])
    expect(chart.map((point) => point[L2S])).toEqual([2, null, null])
  })

  it('keeps chains priced in another token off the gas price axis', () => {
    const records: GasFeesRecords = new Map([
      ['base', [record(1, 2)]],
      ['mantle', [record(1, 2)]],
    ])

    const { chart } = buildGasFeesChart(records, {
      range: [null, 10 * DAY],
      metric: 'gasPrice',
    })

    expect(chart[0]?.[index('base')]).toEqual(5)
    expect(chart[0]?.[index('mantle')]).toEqual(null)
  })

  it('averages over a week once the range is long, without filling a gap', () => {
    const days = Array.from({ length: 200 }, (_, i) => i + 1)
    const records: GasFeesRecords = new Map([
      ['ethereum', days.map((day) => record(day, day))],
      ['base', days.filter((day) => day !== 200).map((day) => record(day, 1))],
    ])

    const { chart, smoothed } = buildGasFeesChart(records, {
      range: [null, 300 * DAY],
      metric: 'erc20',
    })

    expect(smoothed).toEqual(true)
    // The mean of days 194 to 200
    expect(chart.at(-1)?.[index('ethereum')]).toEqual(197)
    expect(chart.at(-1)?.[index('base')]).toEqual(null)
  })
})

function record(day: number, erc20: number | null): GasFeesRecord {
  return {
    timestamp: day * DAY,
    txCount: erc20 === null ? 0 : 100,
    gasUsed: erc20 === null ? 0 : 1_000,
    totalFees: 0,
    baseFees: 0,
    priorityFees: 0,
    l1DataFees: 0,
    medianFee: erc20,
    transfer: erc20,
    erc20,
    swap: erc20,
    gasPrice: erc20 === null ? null : 5,
    baseFeePerGas: erc20 === null ? null : 4,
    priorityFeePerGas: erc20 === null ? null : 1,
  }
}
