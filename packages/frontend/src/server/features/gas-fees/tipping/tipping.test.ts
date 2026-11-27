import type { GasFeesTipPayersDailyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utcDay } from '../test/mockDay'
import {
  fitNonRising,
  secondsWithin,
  toPriceOfSpeed,
  valueOnLine,
} from './toPriceOfSpeed'
import { toTipPayers } from './toTipPayers'

const FROM = utcDay('2026-01-01')
const at = (days: number) => UnixTime(FROM + days * UnixTime.DAY)

describe(secondsWithin.name, () => {
  it('interpolates the 99th percentile inside its bucket', () => {
    expect(
      secondsWithin([
        { waitFromMs: 0, waitToMs: 1_000, txCount: 98 },
        { waitFromMs: 10_000, waitToMs: 12_000, txCount: 2 },
      ]),
    ).toEqual(11)
  })

  it('has no value in the open-ended last bucket', () => {
    expect(
      secondsWithin([
        { waitFromMs: 0, waitToMs: 1_000, txCount: 90 },
        { waitFromMs: 1_800_000, waitToMs: null, txCount: 10 },
      ]),
    ).toEqual(undefined)
  })
})

describe(fitNonRising.name, () => {
  it('pools a rise with its neighbours, by weight', () => {
    const line = fitNonRising([
      { usd: 1, seconds: 30, weight: 1 },
      { usd: 2, seconds: 20, weight: 3 },
      { usd: 3, seconds: 24, weight: 1 },
    ])
    expect(line.map((p) => p.seconds)).toEqual([30, 21, 21])
  })
})

describe(valueOnLine.name, () => {
  it('is linear between points and flat past the ends', () => {
    const line = [
      { usd: 1, seconds: 30 },
      { usd: 3, seconds: 20 },
    ]
    expect(valueOnLine(line, 2)).toEqual(25)
    expect(valueOnLine(line, 9)).toEqual(20)
    expect(valueOnLine(line, 0)).toEqual(30)
  })
})

describe(toPriceOfSpeed.name, () => {
  const hour = (h: number) => ({
    timestamp: UnixTime(FROM + h * UnixTime.HOUR),
    blockNumber: 1,
    slowTipGwei: 0,
    mediumTipGwei: 0,
    fastTipGwei: 1,
    ethUsd: 1e9 / 46_109,
  })

  it('drops levels under 1,000 transactions and prices the rest at the average ETH price', () => {
    const level = (tipFromWei: number, txCount: number) => ({
      tipFromWei,
      tipToWei: tipFromWei + 1e7,
      waitFromMs: 0,
      waitToMs: 1_000,
      txCount,
      tipSumGwei: txCount * (tipFromWei / 1e9),
    })
    const speed = toPriceOfSpeed({
      completeDays: [FROM],
      levelWaits: [level(1e8, 999), level(2e9, 1_000)],
      tierWaits: [],
      hourlyTips: [hour(0), hour(1), hour(30)],
    })
    expect(speed?.dots.map((d) => d.usd)).toEqual([2])
    // The hour of an incomplete day is left out
    expect(speed?.fastTip).toEqual({ usd: 1, seconds: undefined })
  })

  it('has nothing without a complete day', () => {
    expect(
      toPriceOfSpeed({
        completeDays: [],
        levelWaits: [],
        tierWaits: [],
        hourlyTips: [],
      }),
    ).toEqual(undefined)
  })
})

describe(toTipPayers.name, () => {
  const complete = (
    timestamp: UnixTime,
    ethUsd: number,
  ): GasFeesTipPayersDailyRecord => ({
    timestamp,
    status: 'complete',
    ethUsd,
    fastTipGwei: 1,
    low: { txCount: 6, tipEth: 0 },
    middle: { txCount: 2, tipEth: 1 },
    high: { txCount: 2, tipEth: 3 },
    roundTipTxCount: 0,
    atFastTipEth: 1,
    nonOrdinary: { txCount: 100, tipEth: 100 },
  })

  it('prices each day at its own ETH price and reports the days it had', () => {
    const payers = toTipPayers([
      complete(at(0), 1),
      { timestamp: at(1), status: 'missing' },
      complete(at(2), 3),
    ])
    expect(payers?.period).toEqual({
      from: at(0),
      to: at(2),
      days: 2,
      missingDays: 1,
    })
    expect(payers?.ordinaryUsd).toEqual(16)
    expect(payers?.atFastTipUsd).toEqual(4)
    expect(payers?.bands.high).toEqual({ txShare: 0.2, tipShare: 0.75 })
  })
})
