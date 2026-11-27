import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type GasFeesMempoolDayData,
  type GasFeesMempoolDayStatus,
  GasFeesMempoolRepository,
} from './GasFeesMempoolRepository'

describeDatabase(GasFeesMempoolRepository.name, (db) => {
  const repository = db.gasFeesMempool

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('replaces everything stored for the day, keeping other days', async () => {
    await repository.replaceDay(dayData(1, 5))
    await repository.replaceDay(dayData(2, 5))
    await repository.replaceDay(dayData(1, 2))

    const all = [UnixTime(0), UnixTime(10 * UnixTime.DAY)] as const
    expect(await repository.getDays(...all)).toEqual([
      dayData(1, 2).day,
      dayData(2, 5).day,
    ])
    expect(await repository.getTipLevelWaits(...all)).toEqual([
      ...dayData(1, 2).tipLevelWaits,
      ...dayData(2, 5).tipLevelWaits,
    ])
    expect(await repository.getTierWaits(...all)).toEqual([
      ...dayData(1, 2).tierWaits,
      ...dayData(2, 5).tierWaits,
    ])
  })

  it('adds up the waits of complete days only', async () => {
    await repository.replaceDay(dayData(1, 2, 'complete'))
    await repository.replaceDay(dayData(2, 2, 'complete'))
    await repository.replaceDay(dayData(3, 2, 'partial'))

    const all = [UnixTime(0), UnixTime(10 * UnixTime.DAY)] as const
    const level = { tipFromWei: 2_000_000_000, tipToWei: 2_050_000_000 }
    expect(await repository.getCompleteTipLevelWaitTotals(...all)).toEqual([
      { ...level, waitFromMs: 0, waitToMs: 500, txCount: 20, tipSumGwei: 41 },
      {
        ...level,
        waitFromMs: 500,
        waitToMs: null,
        txCount: 20,
        tipSumGwei: 41,
      },
    ])
    expect(await repository.getCompleteTierWaitTotals(...all)).toEqual([
      { tier: 'fast', waitFromMs: 0, waitToMs: 500, txCount: 6 },
      { tier: 'fast', waitFromMs: 500, waitToMs: null, txCount: 6 },
    ])
  })

  it('deletes the days after a timestamp from every table', async () => {
    await repository.replaceDay(dayData(1, 1))
    await repository.replaceDay(dayData(2, 1))

    await repository.deleteAfter(UnixTime(UnixTime.DAY))

    const all = [UnixTime(0), UnixTime(10 * UnixTime.DAY)] as const
    expect(await repository.getDays(...all)).toEqual([dayData(1, 1).day])
    expect(await repository.getTierWaits(...all)).toEqual(
      dayData(1, 1).tierWaits,
    )
  })
})

function dayData(
  day: number,
  buckets: number,
  status: GasFeesMempoolDayStatus = 'partial',
): GasFeesMempoolDayData {
  const timestamp = UnixTime(day * UnixTime.DAY)
  const waits = Array.from({ length: buckets }, (_, i) => ({
    waitFromMs: i * 500,
    waitToMs: i === buckets - 1 ? null : (i + 1) * 500,
  }))
  return {
    day: {
      timestamp,
      status,
      duneLandedCount: 900 + buckets,
      flashbotsLandedCount: null,
      keptCount: 400,
    },
    tipLevelWaits: waits.map((wait) => ({
      timestamp,
      tipFromWei: 2_000_000_000,
      tipToWei: 2_050_000_000,
      ...wait,
      txCount: 10,
      nextBlockCount: 9,
      tipSumGwei: 20.5,
    })),
    tierWaits: waits.map((wait) => ({
      timestamp,
      tier: 'fast',
      ...wait,
      txCount: 3,
      nextBlockCount: 2,
      within2BlocksCount: 3,
      within5BlocksCount: 3,
    })),
  }
}
