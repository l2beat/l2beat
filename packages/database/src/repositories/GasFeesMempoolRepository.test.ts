import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type GasFeesMempoolDayData,
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

function dayData(day: number, buckets: number): GasFeesMempoolDayData {
  const timestamp = UnixTime(day * UnixTime.DAY)
  const waits = Array.from({ length: buckets }, (_, i) => ({
    waitFromMs: i * 500,
    waitToMs: i === buckets - 1 ? null : (i + 1) * 500,
  }))
  return {
    day: {
      timestamp,
      status: 'partial',
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
      within1MinuteCount: 3,
    })),
  }
}
