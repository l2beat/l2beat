import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
        deleteHourlyUntil: vi.fn().mockResolvedValue(10),
        deleteSixHourlyUntil: vi.fn().mockResolvedValue(5),
      })
      const tvsBlockTimestampRepository = mockObject<
        Database['tvsBlockTimestamp']
      >({
        deleteHourlyUntil: vi.fn().mockResolvedValue(4),
        deleteSixHourlyUntil: vi.fn().mockResolvedValue(2),
      })
      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        deleteHourlyUntil: vi.fn().mockResolvedValue(7),
        deleteSixHourlyUntil: vi.fn().mockResolvedValue(3),
      })
      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        deleteHourlyUntil: vi.fn().mockResolvedValue(8),
        deleteSixHourlyUntil: vi.fn().mockResolvedValue(4),
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
      const adjustedTo = UnixTime.toStartOf(to, 'day')
      const syncOptimizer = testSyncOptimizer()
      const hourlyRange = {
        from: undefined,
        to: syncOptimizer.getHourlyCutOffWithGracePeriod(adjustedTo),
      }
      const sixHourlyRange = {
        from: undefined,
        to: syncOptimizer.getSixHourlyCutOffWithGracePeriod(adjustedTo),
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
      expect(result).toStrictEqual(to)
    })

    it('always cleans from the beginning up to the current cutoff', async () => {
      const tvsTokenValueRepository = mockObject<Database['tvsTokenValue']>({
        deleteHourlyUntil: vi.fn().mockResolvedValue(3),
        deleteSixHourlyUntil: vi.fn().mockResolvedValue(2),
      })
      const tvsBlockTimestampRepository = mockObject<
        Database['tvsBlockTimestamp']
      >({
        deleteHourlyUntil: vi.fn().mockResolvedValue(1),
        deleteSixHourlyUntil: vi.fn().mockResolvedValue(1),
      })
      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        deleteHourlyUntil: vi.fn().mockResolvedValue(6),
        deleteSixHourlyUntil: vi.fn().mockResolvedValue(4),
      })
      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        deleteHourlyUntil: vi.fn().mockResolvedValue(5),
        deleteSixHourlyUntil: vi.fn().mockResolvedValue(3),
      })

      const indexer = await createInitializedIndexer({
        db: mockDatabase({
          tvsTokenValue: tvsTokenValueRepository,
          tvsBlockTimestamp: tvsBlockTimestampRepository,
          tvsAmount: tvsAmountRepository,
          tvsPrice: tvsPriceRepository,
        }),
      })

      const from = timestamp('2026-04-01T00:00:00Z')
      const to = timestamp('2026-04-30T00:00:00Z')
      const adjustedTo = UnixTime.toStartOf(to, 'day')
      const syncOptimizer = testSyncOptimizer()
      const hourlyRange = {
        from: syncOptimizer.getHourlyCutOffWithGracePeriod(from),
        to: syncOptimizer.getHourlyCutOffWithGracePeriod(adjustedTo),
      }
      const sixHourlyRange = {
        from: syncOptimizer.getSixHourlyCutOffWithGracePeriod(from),
        to: syncOptimizer.getSixHourlyCutOffWithGracePeriod(adjustedTo),
      }

      const result = await indexer.update(from, to)

      expectDeleteCalls(tvsTokenValueRepository, hourlyRange, sixHourlyRange)
      expectDeleteCalls(
        tvsBlockTimestampRepository,
        hourlyRange,
        sixHourlyRange,
      )
      expectDeleteCalls(tvsAmountRepository, hourlyRange, sixHourlyRange)
      expectDeleteCalls(tvsPriceRepository, hourlyRange, sixHourlyRange)
      expect(result).toStrictEqual(to)
    })
  })

  describe(TvsCleaner.prototype.invalidate.name, () => {
    it('returns targetHeight unchanged', async () => {
      const indexer = createIndexer({})

      const result = await indexer.invalidate(123)

      expect(result).toStrictEqual(123)
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
      getSavedConfigurations: vi.fn().mockResolvedValue([]),
      insertConfigurations: vi.fn().mockResolvedValue(undefined),
      upsertConfigurations: vi.fn().mockResolvedValue(undefined),
      deleteConfigurations: vi.fn().mockResolvedValue(undefined),
      updateConfigurationsCurrentHeight: vi.fn().mockResolvedValue(undefined),
      setInitialState: vi.fn().mockResolvedValue(undefined),
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

function testSyncOptimizer(): SyncOptimizer {
  return new SyncOptimizer(new Clock(0, 0))
}

function expectDeleteCalls(
  repository: {
    deleteHourlyUntil: unknown
    deleteSixHourlyUntil: unknown
  },
  hourlyRange: { from: UnixTime | undefined; to: UnixTime },
  sixHourlyRange: { from: UnixTime | undefined; to: UnixTime },
) {
  expect(repository.deleteHourlyUntil as any).toHaveBeenCalledExactlyOnceWith(
    hourlyRange,
  )
  expect(
    repository.deleteSixHourlyUntil as any,
  ).toHaveBeenCalledExactlyOnceWith(sixHourlyRange)
}
