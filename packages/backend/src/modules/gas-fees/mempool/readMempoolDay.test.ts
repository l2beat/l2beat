import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { type MempoolRow, toMempoolDay } from './readMempoolDay'

describe(toMempoolDay.name, () => {
  const day = UnixTime.fromDate(new Date('2026-11-10T00:00:00Z'))

  it('splits the grouping sets into level waits, tier waits and totals', () => {
    const result = toMempoolDay(day, [
      row({ grouping_set: 0, tip_from_wei: 1e9, bucket: 3, kept: 5 }),
      row({ grouping_set: 2, bucket: 241, kept: 7, fast: 2 }),
      row({ grouping_set: 3, landed: 1000, kept: 460 }),
    ])

    expect(result.landedCount).toEqual(1000)
    expect(result.keptCount).toEqual(460)
    expect(result.tipLevelWaits).toEqual([
      {
        timestamp: day,
        tipFromWei: 1e9,
        tipToWei: 1.05e9,
        waitFromMs: 1500,
        waitToMs: 2000,
        txCount: 5,
        nextBlockCount: 1,
        tipSumGwei: 2,
      },
    ])
    expect(result.tierWaits).toEqual([
      {
        timestamp: day,
        tier: 'fast',
        waitFromMs: 300_000,
        waitToMs: 600_000,
        txCount: 2,
        nextBlockCount: 0,
        within2BlocksCount: 0,
        within5BlocksCount: 1,
      },
    ])
  })

  it('reads a day with no rows as empty', () => {
    expect(toMempoolDay(day, []).landedCount).toEqual(0)
  })

  it('fails on a tip level it does not know', () => {
    expect(() =>
      toMempoolDay(day, [
        row({ grouping_set: 0, tip_from_wei: 123, bucket: 1 }),
        row({ grouping_set: 3 }),
      ]),
    ).toThrow('Mempool row malformed')
  })
})

function row(values: Partial<MempoolRow>): MempoolRow {
  return {
    grouping_set: 3,
    tip_from_wei: null,
    bucket: null,
    landed: 0,
    kept: 0,
    next_block: 1,
    tip_sum_gwei: 2,
    slow: 0,
    slow_next_block: 0,
    slow_within_2_blocks: 0,
    slow_within_5_blocks: 0,
    medium: 0,
    medium_next_block: 0,
    medium_within_2_blocks: 0,
    medium_within_5_blocks: 0,
    fast: 0,
    fast_next_block: 0,
    fast_within_2_blocks: 0,
    fast_within_5_blocks: 1,
    ...values,
  }
}
