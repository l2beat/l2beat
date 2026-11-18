import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { createTvsCleanerConfigurations } from '../../../config/features/tvs'
import { mockDatabase } from '../../../test/database'
import { Clock } from '../../../tools/Clock'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { SyncOptimizer } from '../tools/SyncOptimizer'
import { TvsCleaner, type TvsCleanerDeps } from './TvsCleaner'

describe(TvsCleaner.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(TvsCleaner.prototype.update.name, () => {
    it('cleans all archived TVS records on the first run', async () => {
      const tvsTokenValueRepository = mockObject<Database['tvsTokenValue']>({
        deleteHourlyUntil: mockFn().resolvesTo(10),
        deleteSixHourlyUntil: mockFn().resolvesTo(5),
      })
      const tvsBlockTimestampRepository = mockObject<
        Database['tvsBlockTimestamp']
      >({
        deleteHourlyUntil: mockFn().resolvesTo(4),
        deleteSixHourlyUntil: mockFn().resolvesTo(2),
      })
      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        deleteHourlyUntil: mockFn().resolvesTo(7),
        deleteSixHourlyUntil: mockFn().resolvesTo(3),
      })
      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        deleteHourlyUntil: mockFn().resolvesTo(8),
        deleteSixHourlyUntil: mockFn().resolvesTo(4),
      })

      const indexer = await createInitializedIndexer({
        db: mockDatabase({
          tvsTokenValue: tvsTokenValueRepository,
          tvsBlockTimestamp: tvsBlockTimestampRepository,
          tvsAmount: tvsAmountRepository,
          tvsPrice: tvsPriceRepository,
        }),
      })

      const to = timestamp('2026-04-07T00:00:00Z')
      // Hourly records are kept for 14 days, six-hourly ones for 100 days
      const hourlyRange = {
        from: undefined,
        to: timestamp('2026-03-24T00:00:00Z'),
      }
      const sixHourlyRange = {
        from: undefined,
        to: timestamp('2025-12-28T00:00:00Z'),
      }

      const result = await indexer.update(0, to)

      expectDeleteCalls(tvsTokenValueRepository, hourlyRange, sixHourlyRange)
      expectDeleteCalls(
        tvsBlockTimestampRepository,
        hourlyRange,
        sixHourlyRange,
      )
      expectDeleteCalls(tvsAmountRepository, hourlyRange, sixHourlyRange)
      expectDeleteCalls(tvsPriceRepository, hourlyRange, sixHourlyRange)
      expect(result).toEqual(to)
    })

    it('cleans each day exactly once when ticks arrive hourly', async () => {
      const repositories = createRepositories()
      const indexer = await createInitializedIndexer({
        db: mockDatabase(repositories),
      })

      let safeHeight = timestamp('2026-04-10T05:00:00Z')
      const end = timestamp('2026-04-13T05:00:00Z')
      while (safeHeight < end) {
        const to = safeHeight + UnixTime.HOUR
        await indexer.update(safeHeight + 1, to)
        safeHeight = to
      }

      // Midnights of 04-11, 04-12 and 04-13 each move both cutoffs by a day
      const hourlyRanges = consecutiveRanges([
        '2026-03-27',
        '2026-03-28',
        '2026-03-29',
        '2026-03-30',
      ])
      const sixHourlyRanges = consecutiveRanges([
        '2025-12-31',
        '2026-01-01',
        '2026-01-02',
        '2026-01-03',
      ])
      for (const repository of Object.values(repositories)) {
        expectDeleteCallsInOrder(repository, hourlyRanges, sixHourlyRanges)
      }
    })

    it('does not delete anything on a tick that does not cross midnight', async () => {
      const repositories = createRepositories()
      const indexer = await createInitializedIndexer({
        db: mockDatabase(repositories),
      })

      const from = timestamp('2026-04-10T05:00:00Z') + 1
      const to = timestamp('2026-04-10T06:00:00Z')

      const result = await indexer.update(from, to)

      for (const repository of Object.values(repositories)) {
        expect(repository.deleteHourlyUntil as any).not.toHaveBeenCalled()
        expect(repository.deleteSixHourlyUntil as any).not.toHaveBeenCalled()
      }
      expect(result).toEqual(to)
    })

    it('cleans every missed day when it resumes after downtime', async () => {
      const repositories = createRepositories()
      const indexer = await createInitializedIndexer({
        db: mockDatabase(repositories),
      })

      const from = timestamp('2026-04-10T15:00:00Z') + 1
      const to = timestamp('2026-04-13T10:00:00Z')
      // From the cutoffs of the cleaned 04-10 midnight to those of 04-13
      const hourlyRange = {
        from: timestamp('2026-03-27T00:00:00Z'),
        to: timestamp('2026-03-30T00:00:00Z'),
      }
      const sixHourlyRange = {
        from: timestamp('2025-12-31T00:00:00Z'),
        to: timestamp('2026-01-03T00:00:00Z'),
      }

      const result = await indexer.update(from, to)

      for (const repository of Object.values(repositories)) {
        expectDeleteCalls(repository, hourlyRange, sixHourlyRange)
      }
      expect(result).toEqual(to)
    })
  })

  describe(TvsCleaner.prototype.invalidate.name, () => {
    it('returns targetHeight unchanged', async () => {
      const indexer = createIndexer({})

      const result = await indexer.invalidate(123)

      expect(result).toEqual(123)
    })
  })
})

function createIndexer(overrides: Partial<TvsCleanerDeps> = {}): TvsCleaner {
  const defaults: TvsCleanerDeps = {
    db: mockDatabase({
      tvsTokenValue: mockObject(),
      tvsBlockTimestamp: mockObject(),
      tvsAmount: mockObject(),
      tvsPrice: mockObject(),
    }),
    syncOptimizer: testSyncOptimizer(),
    parents: [],
    indexerService: mockObject<IndexerService>({
      getSavedConfigurations: mockFn().resolvesTo([]),
      insertConfigurations: mockFn().resolvesTo(undefined),
      upsertConfigurations: mockFn().resolvesTo(undefined),
      deleteConfigurations: mockFn().resolvesTo(undefined),
      updateConfigurationsCurrentHeight: mockFn().resolvesTo(undefined),
      setInitialState: mockFn().resolvesTo(undefined),
    }),
    configurations: createTvsCleanerConfigurations([
      'tvsTokenValue',
      'tvsBlockTimestamp',
      'tvsAmount',
      'tvsPrice',
    ]),
  }

  return new TvsCleaner({ ...defaults, ...overrides }, Logger.SILENT)
}

async function createInitializedIndexer(
  overrides: Partial<TvsCleanerDeps> = {},
): Promise<TvsCleaner> {
  const indexer = createIndexer(overrides)
  await indexer.initialize()
  return indexer
}

function timestamp(value: string): UnixTime {
  return UnixTime.fromDate(new Date(value))
}

function consecutiveRanges(days: string[]) {
  return days.slice(1).map((day, i) => ({
    from: timestamp(`${days[i]}T00:00:00Z`),
    to: timestamp(`${day}T00:00:00Z`),
  }))
}

function testSyncOptimizer(): SyncOptimizer {
  return new SyncOptimizer(new Clock(0, 0))
}

function createRepositories() {
  const methods = () => ({
    deleteHourlyUntil: mockFn().resolvesTo(0),
    deleteSixHourlyUntil: mockFn().resolvesTo(0),
  })
  return {
    tvsTokenValue: mockObject<Database['tvsTokenValue']>(methods()),
    tvsBlockTimestamp: mockObject<Database['tvsBlockTimestamp']>(methods()),
    tvsAmount: mockObject<Database['tvsAmount']>(methods()),
    tvsPrice: mockObject<Database['tvsPrice']>(methods()),
  }
}

function expectDeleteCallsInOrder(
  repository: {
    deleteHourlyUntil: unknown
    deleteSixHourlyUntil: unknown
  },
  hourlyRanges: { from: UnixTime | undefined; to: UnixTime }[],
  sixHourlyRanges: { from: UnixTime | undefined; to: UnixTime }[],
) {
  expect(repository.deleteHourlyUntil as any).toHaveBeenCalledTimes(
    hourlyRanges.length,
  )
  hourlyRanges.forEach((range, i) => {
    expect(repository.deleteHourlyUntil as any).toHaveBeenNthCalledWith(
      i + 1,
      range,
    )
  })
  expect(repository.deleteSixHourlyUntil as any).toHaveBeenCalledTimes(
    sixHourlyRanges.length,
  )
  sixHourlyRanges.forEach((range, i) => {
    expect(repository.deleteSixHourlyUntil as any).toHaveBeenNthCalledWith(
      i + 1,
      range,
    )
  })
}

function expectDeleteCalls(
  repository: {
    deleteHourlyUntil: unknown
    deleteSixHourlyUntil: unknown
  },
  hourlyRange: { from: UnixTime | undefined; to: UnixTime },
  sixHourlyRange: { from: UnixTime | undefined; to: UnixTime },
) {
  expect(repository.deleteHourlyUntil as any).toHaveBeenOnlyCalledWith(
    hourlyRange,
  )
  expect(repository.deleteSixHourlyUntil as any).toHaveBeenOnlyCalledWith(
    sixHourlyRange,
  )
}
