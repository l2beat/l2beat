import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { GAS_FEES_CHART_KEYS, type GasFeesChartKey } from '../chains'
import { utcDay } from '../days'
import { mockDay } from '../test/mockDay'
import { toChartData } from './getGasFeesChart'
import type { GasFeesMetric } from './metrics'

const FROM = utcDay('2026-01-01')
const at = (days: number) => UnixTime(FROM + days * UnixTime.DAY)
const column = (key: GasFeesChartKey) => GAS_FEES_CHART_KEYS.indexOf(key) + 1

describe(toChartData.name, () => {
  it('leaves a day without a row as a gap, not a zero', () => {
    const { rows } = toChartData(
      [
        mockDay('ethereum', { timestamp: at(0) }),
        mockDay('base', { timestamp: at(2) }),
      ],
      'avgFee',
      FROM,
    )
    expect(rows.map((r) => r[column('ethereum')])).toEqual([2_000, null, null])
  })

  it('weighs the L2s combined by transactions, and has no median for them', () => {
    const days = [
      mockDay('base', { totalFeeUsd: 10, txCount: 10 }),
      mockDay('ink', { totalFeeUsd: 90, txCount: 30 }),
    ]
    const l2s = (metric: GasFeesMetric) =>
      toChartData(days, metric, FROM).rows[0]?.[column('l2s')]
    expect(l2s('avgFee')).toEqual(2.5)
    expect(l2s('medianFee')).toEqual(null)
  })

  it('counts the gas of a chain without priority fees in the combined priority fee', () => {
    const { rows } = toChartData(
      [mockDay('base'), mockDay('zksync2')],
      'priorityFee',
      FROM,
    )
    // Base tips 3 gwei a gas, ZKsync Era none, on as much gas
    expect(rows[0]?.[column('base')]).toEqual(3)
    expect(rows[0]?.[column('zksync2')]).toEqual(null)
    expect(rows[0]?.[column('l2s')]).toEqual(1.5)
  })

  it('draws no price per gas for a chain priced in another token', () => {
    const { rows } = toChartData(
      [mockDay('mantle'), mockDay('base')],
      'gasPrice',
      FROM,
    )
    expect(rows[0]?.[column('mantle')]).toEqual(null)
    expect(rows[0]?.[column('l2s')]).toEqual(rows[0]?.[column('base')])
  })

  it('averages weeks past 120 days, each needing 4 of its 7 days', () => {
    // The first four days are missing
    const days = Array.from({ length: 136 }, (_, i) =>
      mockDay('ethereum', { timestamp: at(i + 4) }),
    )
    const { rows, weekly } = toChartData(days, 'avgFee', FROM)
    expect(weekly).toEqual(true)
    const valueAt = (ts: number) =>
      rows.find((r) => r[0] === ts)?.[column('ethereum')]
    // Weeks end on the last day, and the 1st of each month has a point too
    expect(rows.at(-1)?.[0]).toEqual(at(139))
    expect(valueAt(utcDay('2026-02-01'))).toEqual(2_000)
    expect(valueAt(at(6))).toEqual(null)
    expect(valueAt(at(13))).toEqual(2_000)
  })

  it("makes a week's average fee its fees over its transactions", () => {
    const days = Array.from({ length: 130 }, (_, i) =>
      mockDay('ethereum', { timestamp: at(i) }),
    )
    // The last day has 110 transactions at $1, the six before it 10 at $2,000
    days.push(
      mockDay('ethereum', {
        timestamp: at(130),
        txCount: 110,
        totalFeeUsd: 110,
      }),
    )
    const { rows } = toChartData(days, 'avgFee', FROM)
    expect(rows.at(-1)?.[column('ethereum')]).toEqual(
      Number(((6 * 20_000 + 110) / (6 * 10 + 110)).toPrecision(3)),
    )
  })
})
