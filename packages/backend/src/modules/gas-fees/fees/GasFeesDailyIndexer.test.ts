import { Logger } from '@l2beat/backend-tools'
import type { Database, GasFeesDailyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { GasFeesChain } from './chains'
import { FEE_RULES } from './feeRules'
import { GasFeesDailyIndexer } from './GasFeesDailyIndexer'
import type { FeesDay } from './readFeesDays'

describe(GasFeesDailyIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  const firstDay = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
  const day = (n: number) => UnixTime(firstDay + n * UnixTime.DAY)

  it('reads a batch of days and stores them', async () => {
    const { indexer, daily, readFeesDays } = createIndexer([
      feesDay(day(0)),
      feesDay(day(1)),
      feesDay(day(2)),
    ])

    expect(await indexer.update(day(1), day(9))).toEqual(day(3))
    expect(readFeesDays).toHaveBeenOnlyCalledWith(CHAINS, day(0), day(2))
    expect(daily.upsertMany.calls[0]?.args[0]).toHaveLength(3)
  })

  it('stores a day without a late chain and moves on', async () => {
    const { indexer, daily } = createIndexer([feesDay(day(0)), feesDay(day(1))])

    expect(await indexer.update(day(1), day(9))).toEqual(day(2))
    expect(daily.upsertMany.calls[0]?.args[0]).toHaveLength(2)
  })

  it('stops at a day no chain has yet, and fails when it is the first', async () => {
    const { indexer, daily, readFeesDays } = createIndexer(
      [feesDay(day(0)), { day: day(1), records: [] }],
      { now: () => day(3) },
    )

    expect(await indexer.update(day(1), day(9))).toEqual(day(1))
    expect(daily.upsertMany.calls[0]?.args[0]).toHaveLength(1)

    readFeesDays.resolvesToOnce([{ day: day(1), records: [] }])
    await expect(indexer.update(day(2), day(9))).toBeRejectedWith(
      'Gas fees day not on Dune yet',
    )
    // The retry within 6 hours fails without a read
    await expect(indexer.update(day(2), day(9))).toBeRejectedWith(
      'Gas fees day not on Dune yet',
    )
    expect(readFeesDays).toHaveBeenCalledTimes(2)
  })

  it('moves past a day no chain has once it has settled', async () => {
    const { indexer } = createIndexer(
      [{ day: day(1), records: [] }, feesDay(day(2))],
      { now: () => day(5) },
    )

    expect(await indexer.update(day(2), day(9))).toEqual(day(3))
  })

  it('reads the late chains of earlier days again, 6 hours apart at most', async () => {
    let now = day(9)
    const { indexer, daily, readFeesDays } = createIndexer([feesDay(day(2))], {
      // Abstract is missing on day 1
      stored: [
        record(day(0), 'ethereum'),
        record(day(0), 'abstract'),
        record(day(1), 'ethereum'),
      ],
      now: () => now,
    })
    readFeesDays.resolvesToOnce([feesDay(day(2))])
    readFeesDays.resolvesToOnce([
      { day: day(1), records: [record(day(1), 'abstract')] },
    ])

    await indexer.update(day(3), day(9))

    expect(readFeesDays).toHaveBeenLastCalledWith([ABSTRACT], day(1), day(1))
    expect(daily.upsertMany).toHaveBeenLastCalledWith([
      record(day(1), 'abstract'),
    ])

    now = UnixTime(day(9) + 5 * UnixTime.HOUR)
    await indexer.update(day(3), day(9))
    expect(readFeesDays).toHaveBeenCalledTimes(3)
  })

  it('reads the newest late days and the oldest in two bounded reads, not all between', async () => {
    const { indexer, readFeesDays } = createIndexer([feesDay(day(8))], {
      // Abstract is missing on days 0 and 7, further apart than a batch of 3
      stored: ALL_STORED.filter(
        (r) =>
          r.chain !== 'abstract' ||
          (r.timestamp !== day(0) && r.timestamp !== day(7)),
      ),
    })

    await indexer.update(day(9), day(9))

    expect(readFeesDays.calls.slice(1).map((c) => c.args)).toEqual([
      [[ABSTRACT], day(7), day(7)],
      [[ABSTRACT], day(0), day(0)],
    ])
  })

  it('keeps the newest late days when the read of the oldest fails', async () => {
    const { indexer, daily, readFeesDays } = createIndexer([feesDay(day(8))], {
      stored: ALL_STORED.filter(
        (r) =>
          r.chain !== 'abstract' ||
          (r.timestamp !== day(0) && r.timestamp !== day(7)),
      ),
    })
    readFeesDays.resolvesToOnce([feesDay(day(8))])
    readFeesDays.resolvesToOnce([
      { day: day(7), records: [record(day(7), 'abstract')] },
    ])
    readFeesDays.rejectsWithOnce(new Error('Dune error'))

    expect(await indexer.update(day(9), day(9))).toEqual(day(9))
    expect(readFeesDays).toHaveBeenCalledTimes(3)
    expect(daily.upsertMany).toHaveBeenLastCalledWith([
      record(day(7), 'abstract'),
    ])
  })

  it('reads the oldest late days when the read of the newest fails', async () => {
    const { indexer, daily, readFeesDays } = createIndexer([feesDay(day(8))], {
      stored: ALL_STORED.filter(
        (r) =>
          r.chain !== 'abstract' ||
          (r.timestamp !== day(0) && r.timestamp !== day(7)),
      ),
    })
    readFeesDays.resolvesToOnce([feesDay(day(8))])
    readFeesDays.rejectsWithOnce(new Error('Dune error'))
    readFeesDays.resolvesToOnce([
      { day: day(0), records: [record(day(0), 'abstract')] },
    ])

    expect(await indexer.update(day(9), day(9))).toEqual(day(9))
    expect(daily.upsertMany).toHaveBeenLastCalledWith([
      record(day(0), 'abstract'),
    ])
  })

  it('stores only the late chain-days of a late read, leaving stored ones as they are', async () => {
    const { indexer, daily, readFeesDays } = createIndexer([feesDay(day(2))], {
      stored: [
        record(day(0), 'ethereum'),
        record(day(0), 'abstract'),
        record(day(1), 'ethereum'),
      ],
    })
    readFeesDays.resolvesToOnce([feesDay(day(2))])
    readFeesDays.resolvesToOnce([
      {
        day: day(1),
        records: [record(day(1), 'ethereum'), record(day(1), 'abstract')],
      },
    ])

    await indexer.update(day(3), day(9))

    expect(daily.upsertMany).toHaveBeenLastCalledWith([
      record(day(1), 'abstract'),
    ])
  })

  it('moves past a day before any chain is expected', async () => {
    const { indexer, readFeesDays } = createIndexer(
      [
        { day: day(0), records: [] },
        { day: day(1), records: [] },
      ],
      { chains: [{ ...ETHEREUM, requiredFrom: day(2) }] },
    )

    expect(await indexer.update(day(1), day(2))).toEqual(day(2))
    expect(readFeesDays).toHaveBeenCalledTimes(1)
  })

  it('leaves late days older than 30 days alone, as in a backfill', async () => {
    const { indexer, readFeesDays } = createIndexer([feesDay(day(2))], {
      stored: [record(day(1), 'ethereum')],
      now: () => day(45),
    })

    await indexer.update(day(3), day(9))

    expect(readFeesDays).toHaveBeenCalledTimes(1)
  })

  it('keeps the stored days when the late chains read fails', async () => {
    const { indexer, readFeesDays } = createIndexer([feesDay(day(2))], {
      stored: [record(day(1), 'ethereum')],
    })
    readFeesDays.resolvesToOnce([feesDay(day(2))])
    readFeesDays.rejectsWithOnce(new Error('Dune error'))

    expect(await indexer.update(day(3), day(9))).toEqual(day(3))
  })

  it('moves to `to` while no day has finished', async () => {
    const { indexer, readFeesDays } = createIndexer([])

    expect(await indexer.update(day(1) + 1, day(1) + 3600)).toEqual(
      day(1) + 3600,
    )
    expect(readFeesDays).not.toHaveBeenCalled()
  })

  it('keeps only the days that end by the invalidated height', async () => {
    const { indexer, daily } = createIndexer([])

    expect(await indexer.invalidate(day(3))).toEqual(day(3))
    expect(daily.deleteAfter).toHaveBeenOnlyCalledWith(day(2))
  })

  function createIndexer(
    days: FeesDay[],
    options: {
      stored?: GasFeesDailyRecord[]
      now?: () => UnixTime
      chains?: GasFeesChain[]
    } = {},
  ) {
    const daily = mockObject<Database['gasFeesDaily']>({
      upsertMany: mockFn().resolvesTo(0),
      deleteAfter: mockFn().resolvesTo(0),
      getInRange: mockFn(async (from: UnixTime, to: UnixTime) =>
        (options.stored ?? ALL_STORED).filter(
          (r) => r.timestamp >= from && r.timestamp <= to,
        ),
      ),
    })
    const readFeesDays =
      mockFn<
        (
          chains: GasFeesChain[],
          from: UnixTime,
          to: UnixTime,
        ) => Promise<FeesDay[]>
      >().resolvesTo(days)
    const indexer = new GasFeesDailyIndexer(
      {
        parents: [],
        indexerService: mockObject<IndexerService>(),
        firstDay,
        daysPerQuery: 3,
        chains: options.chains ?? CHAINS,
        db: mockDatabase({ gasFeesDaily: daily }),
        readFeesDays,
        now: options.now ?? (() => day(9)),
      },
      Logger.SILENT,
    )
    return { indexer, daily, readFeesDays }
  }

  const ETHEREUM: GasFeesChain = {
    id: 'ethereum',
    dune: 'ethereum',
    fees: FEE_RULES.ethereum,
    requiredFrom: firstDay,
  }
  const ABSTRACT: GasFeesChain = {
    id: 'abstract',
    dune: 'abstract',
    fees: FEE_RULES.zkStack,
    requiredFrom: firstDay,
  }
  const CHAINS = [ETHEREUM, ABSTRACT]
  /** Every chain on every day, so no chain is late */
  const ALL_STORED = Array.from({ length: 10 }, (_, n) =>
    CHAINS.map((chain) => record(day(n), chain.id)),
  ).flat()
})

function record(timestamp: UnixTime, chain: string): GasFeesDailyRecord {
  return {
    timestamp,
    chain,
    txCount: 1,
    totalFeeNative: 1,
    totalFeeUsd: 1,
    l1FeeNative: 0,
    blobFeeNative: 0,
    baseFeeNative: 1,
    gasUsed: 1,
    medianFeeUsd: 1,
  }
}

function feesDay(day: UnixTime): FeesDay {
  return { day, records: [record(day, 'ethereum')] }
}
