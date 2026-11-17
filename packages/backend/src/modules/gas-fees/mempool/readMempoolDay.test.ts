import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { type MempoolRow, toMempoolDay } from './readMempoolDay'

describe(toMempoolDay.name, () => {
  const day = UnixTime.fromDate(new Date('2026-11-10T00:00:00Z'))

  it('splits the rows into level waits, tier waits and totals', () => {
    const result = toMempoolDay(day, [
      row({ tip_from_wei: 1e9, bucket: 3, kept: 5 }),
      // Two fast transactions, one of them within 5 blocks; none in the other tiers
      row({
        bucket: 241,
        kept: 7,
        tier_counts: [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
      }),
      row({ landed: 1000, kept: 460 }),
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

  it('fails on tier counts of another length', () => {
    expect(() =>
      toMempoolDay(day, [
        row({ bucket: 1, tier_counts: [1, 1, 1, 1] }),
        row({ landed: 0 }),
      ]),
    ).toThrow('Mempool tier counts malformed')
  })

  it('fails on a tip level it does not know', () => {
    expect(() =>
      toMempoolDay(day, [
        row({ tip_from_wei: 123, bucket: 1 }),
        row({ landed: 0 }),
      ]),
    ).toThrow('Mempool row malformed')
  })
})

function row(values: Partial<MempoolRow>): MempoolRow {
  return {
    tip_from_wei: null,
    bucket: null,
    landed: null,
    kept: 0,
    next_block: 1,
    tip_sum_gwei: 2,
    tier_counts: null,
    ...values,
  }
}
