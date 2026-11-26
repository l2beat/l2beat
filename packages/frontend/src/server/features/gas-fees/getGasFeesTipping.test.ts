import type { GasFeesTipPayersDailyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  buildGasFeesTipping,
  fitNeverRising,
  type GasFeesTippingInput,
  getSureWait,
} from './getGasFeesTipping'
import { tipToUsd } from './types'

const DAY = UnixTime.DAY
const NOTHING: GasFeesTippingInput = {
  payers: [],
  mempoolDays: [],
  tipLevelWaits: [],
  tierWaits: [],
  hourlyTips: [],
}

describe(getSureWait.name, () => {
  it('places the 99th percentile within its bucket', () => {
    const buckets = [
      { waitFromMs: 0, waitToMs: 12_000, txCount: 980 },
      { waitFromMs: 12_000, waitToMs: 24_000, txCount: 20 },
    ]
    // 990 of 1,000 are needed: all of the first bucket and half of the second
    expect(getSureWait(buckets)).toEqual(18)
  })

  it('has no wait to give within the last bucket, which has no end', () => {
    const buckets = [
      { waitFromMs: 0, waitToMs: 500, txCount: 1 },
      { waitFromMs: 1_800_000, waitToMs: null, txCount: 9 },
    ]
    expect(getSureWait(buckets)).toEqual(undefined)
  })
})

describe(fitNeverRising.name, () => {
  it('replaces values that rise with their weighted mean', () => {
    expect(
      fitNeverRising([
        [30, 1],
        [20, 1],
        [26, 2],
        [10, 1],
      ]),
    ).toEqual([30, 24, 24, 10])
  })
})

describe(buildGasFeesTipping.name, () => {
  it('adds up the complete days and counts the missing ones between them', () => {
    const { payers } = buildGasFeesTipping({
      ...NOTHING,
      payers: [
        payersDay(1, 1_000),
        { timestamp: UnixTime(2 * DAY), status: 'missing' },
        payersDay(3, 3_000),
      ],
    })

    expect(payers?.period).toEqual({
      from: DAY,
      to: 3 * DAY,
      days: 2,
      missingDays: 1,
    })
    // 10 ETH a day, at $1,000 and at $3,000
    expect(payers?.ordinaryUsd).toEqual(40_000)
    expect(payers?.atFastUsd).toEqual(8_000)
    expect(payers?.txShares).toEqual({ low: 0.5, middle: 0.3, high: 0.2 })
    expect(payers?.tipShares).toEqual({ low: 0.1, middle: 0.2, high: 0.7 })
  })

  it('draws a tip level at its average tip and marks our fast tip at its own wait', () => {
    const wait = { waitFromMs: 0, waitToMs: 10_000, txCount: 2_000 }
    const { speed } = buildGasFeesTipping({
      ...NOTHING,
      mempoolDays: [
        { timestamp: DAY, complete: true },
        { timestamp: 2 * DAY, complete: false },
      ],
      tipLevelWaits: [
        { ...wait, tipFromWei: 2e9, tipToWei: 2.05e9, tipSumGwei: 4_040 },
      ],
      tierWaits: [{ ...wait, tier: 'fast', waitToMs: 20_000 }],
      hourlyTips: [
        { timestamp: DAY, fastTipGwei: 0.5, ethUsd: 1_000 },
        { timestamp: DAY + 3_600, fastTipGwei: 1.5, ethUsd: 3_000 },
        // Not a day the waits are from
        { timestamp: 2 * DAY, fastTipGwei: 9, ethUsd: 9_000 },
      ],
    })

    expect(speed?.dots).toEqual([
      {
        fromGwei: 2,
        toGwei: 2.05,
        txCount: 2_000,
        usd: tipToUsd(2.02, 2_000),
        seconds: 9.9,
      },
    ])
    expect(speed?.marks.map((mark) => [mark.name, mark.seconds])).toEqual([
      ['Our fast tip', 19.8],
      ['2 gwei', 9.9],
    ])
    // Each hour's tip at that hour's price, not the average tip at the average price
    const fastUsd = (tipToUsd(0.5, 1_000) + tipToUsd(1.5, 3_000)) / 2
    expect(speed?.marks[0]?.usd).toEqual(fastUsd)
    expect(speed?.fastVsTwoGwei).toEqual({
      extraUsd: tipToUsd(2, 2_000) - fastUsd,
      fastSeconds: 19.8,
      twoGweiSeconds: 9.9,
    })
  })

  it('has nothing to show before a day is stored', () => {
    expect(buildGasFeesTipping(NOTHING)).toEqual({
      payers: undefined,
      speed: undefined,
    })
  })
})

function payersDay(day: number, ethUsd: number): GasFeesTipPayersDailyRecord {
  return {
    timestamp: UnixTime(day * DAY),
    status: 'complete',
    ethUsd,
    fastTipGwei: 0.3,
    low: { txCount: 50, tipEth: 1 },
    middle: { txCount: 30, tipEth: 2 },
    high: { txCount: 20, tipEth: 7 },
    roundTipTxCount: 5,
    atFastTipEth: 2,
    nonOrdinary: { txCount: 1, tipEth: 100 },
  }
}
