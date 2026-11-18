import { Logger } from '@l2beat/backend-tools'
import type { Database, GasFeesTipHourlyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import {
  GasFeesMempoolIndexer,
  getMempoolDayStatus,
} from './GasFeesMempoolIndexer'
import type { MempoolDay } from './readMempoolDay'

describe(GasFeesMempoolIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  const day = UnixTime.fromDate(new Date('2026-11-10T00:00:00Z'))
  const next = UnixTime(day + UnixTime.DAY)

  it("reads the day with the hours since the day before's start", async () => {
    const { indexer, mempool, readMempoolDay, tipHourly } = createIndexer()

    expect(await indexer.update(day + 1, next + 5 * UnixTime.DAY)).toEqual(next)
    // From the day before, as some were first seen then, to the hour after the day
    expect(tipHourly.getInRange).toHaveBeenOnlyCalledWith(
      UnixTime(day - UnixTime.DAY),
      next,
    )
    // Block numbers stand in for the timestamps they were looked up for
    expect(readMempoolDay.calls[0]?.args[0]).toEqual({
      day,
      previousDayFirstBlock: day - UnixTime.DAY + 1,
      firstBlock: day + 1,
      lastBlock: next,
      hourlyTips: hours(UnixTime(day - UnixTime.DAY), next),
    })
    expect(mempool.replaceDay.calls[0]?.args[0].day).toEqual({
      timestamp: day,
      status: 'complete',
      duneLandedCount: 1000,
      flashbotsLandedCount: 1001,
      keptCount: 460,
    })
  })

  it('starts at its first day when the hourly tips lower it below', async () => {
    const { indexer, readMempoolDay } = createIndexer()

    expect(await indexer.update(day - UnixTime.DAY, next)).toEqual(next)
    expect(readMempoolDay.calls[0]?.args[0].day).toEqual(day)
  })

  it('fails on a thin day until it has settled, reading it again after 6 hours at most', async () => {
    let now = next
    const { indexer, mempool, readMempoolDay } = createIndexer({
      flashbots: 2000,
      now: () => now,
    })

    for (const hours of [0, 5, 6]) {
      now = UnixTime(next + hours * UnixTime.HOUR)
      await expect(indexer.update(day + 1, next)).toBeRejectedWith(
        'Mempool day incomplete on Dune',
      )
    }
    expect(readMempoolDay).toHaveBeenCalledTimes(2)
    expect(mempool.replaceDay).not.toHaveBeenCalled()
  })

  it("doesn't pay for the Dune read when Flashbots' count can't be read", async () => {
    const { indexer, readMempoolDay, readFlashbotsLandedCount } =
      createIndexer()
    readFlashbotsLandedCount.rejectsWith(new Error('Flashbots summary error'))

    await expect(indexer.update(day + 1, next)).toBeRejectedWith(
      'Flashbots summary error',
    )
    expect(readMempoolDay).not.toHaveBeenCalled()
  })

  it("doesn't pay for the Dune read while Flashbots has no summary of an unsettled day", async () => {
    const { indexer, readMempoolDay, readFlashbotsLandedCount } =
      createIndexer()
    readFlashbotsLandedCount.resolvesTo(undefined)

    await expect(indexer.update(day + 1, next)).toBeRejectedWith(
      'Mempool day incomplete on Dune',
    )
    expect(readMempoolDay).not.toHaveBeenCalled()
  })

  it('reads a thin day again when it settles, though read less than 6 hours before', async () => {
    const settles = UnixTime(next + 3 * UnixTime.DAY)
    let now = UnixTime(settles - UnixTime.HOUR)
    const { indexer, mempool, readMempoolDay } = createIndexer({
      flashbots: 2000,
      now: () => now,
    })

    await expect(indexer.update(day + 1, next)).toBeRejectedWith(
      'Mempool day incomplete on Dune',
    )
    now = settles
    expect(await indexer.update(day + 1, next)).toEqual(next)

    expect(readMempoolDay).toHaveBeenCalledTimes(2)
    expect(mempool.replaceDay.calls[0]?.args[0].day.status).toEqual('partial')
  })

  it('stores a settled day Dune never got as missing, without waits', async () => {
    const { indexer, mempool } = createIndexer({
      landed: 0,
      now: () => UnixTime(next + 7 * UnixTime.DAY),
    })

    await indexer.update(day + 1, next)

    const stored = mempool.replaceDay.calls[0]?.args[0]
    expect(stored?.day.status).toEqual('missing')
    expect(stored?.tipLevelWaits).toEqual([])
  })

  function createIndexer(
    options: { landed?: number; flashbots?: number; now?: () => UnixTime } = {},
  ) {
    const mempool = mockObject<Database['gasFeesMempool']>({
      replaceDay: mockFn().resolvesTo(undefined),
    })
    const tipHourly = mockObject<Database['gasFeesTipHourly']>({
      getInRange: mockFn(async (from: UnixTime, to: UnixTime) =>
        hours(from, to),
      ),
    })
    const readMempoolDay = mockFn().resolvesTo({
      landedCount: options.landed ?? 1000,
      keptCount: 460,
      tipLevelWaits: [],
      tierWaits: [],
    } satisfies MempoolDay)
    const readFlashbotsLandedCount = mockFn<
      (day: UnixTime) => Promise<number | undefined>
    >().resolvesTo(options.flashbots ?? 1001)
    const indexer = new GasFeesMempoolIndexer(
      {
        parents: [],
        indexerService: mockObject<IndexerService>(),
        firstDay: day,
        db: mockDatabase({
          gasFeesMempool: mempool,
          gasFeesTipHourly: tipHourly,
        }),
        blockFinder: {
          getBlockNumberAtOrBefore: mockFn(async (t: UnixTime) => Number(t)),
        },
        readMempoolDay,
        readFlashbotsLandedCount,
        now: options.now ?? (() => next),
      },
      Logger.SILENT,
    )
    return {
      indexer,
      mempool,
      readMempoolDay,
      readFlashbotsLandedCount,
      tipHourly,
    }
  }

  function hours(from: UnixTime, to: UnixTime): GasFeesTipHourlyRecord[] {
    const count = (to - from) / UnixTime.HOUR + 1
    return Array.from({ length: count }, (_, h) => ({
      timestamp: UnixTime(from + h * UnixTime.HOUR),
      blockNumber: h,
      slowTipGwei: 0,
      mediumTipGwei: 0,
      fastTipGwei: 0.1,
      ethUsd: 4000,
    }))
  }
})

describe(getMempoolDayStatus.name, () => {
  it('is complete with 99% of the Flashbots count', () => {
    expect(getMempoolDayStatus(990, 1000)).toEqual('complete')
    expect(getMempoolDayStatus(989, 1000)).toEqual('partial')
  })

  it('is partial without a Flashbots count, and missing without rows', () => {
    expect(getMempoolDayStatus(500, undefined)).toEqual('partial')
    expect(getMempoolDayStatus(0, 1000)).toEqual('missing')
  })
})
