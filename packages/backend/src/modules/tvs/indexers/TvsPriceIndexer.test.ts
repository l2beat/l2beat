import { Logger } from '@l2beat/backend-tools'
import type { Database, TvsPriceRecord } from '@l2beat/database'
import { DataNotReadyError, type PriceProvider } from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { SyncOptimizer } from '../tools/SyncOptimizer'
import { TvsPriceIndexer } from './TvsPriceIndexer'

describe(TvsPriceIndexer.name, () => {
  describe(TvsPriceIndexer.prototype.multiUpdate.name, () => {
    it('fetches prices and saves them to DB', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const configs = [
        config('config-1', 'ethereum'),
        config('config-2', 'bitcoin'),
      ]

      const priceProvider = mockObject<PriceProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getUsdPriceHistoryHourly: mockFn()
          .returnsOnce(points(150, 250))
          .returnsOnce(points(200, 250)),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([
          UnixTime(150),
          UnixTime(200),
        ]),
        shouldTimestampBeSynced: mockFn().returns(true),
      })

      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new TvsPriceIndexer(
        {
          configurations: configs,
          priceProvider,
          db: mockDatabase({ tvsPrice: tvsPriceRepository }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      expect(priceProvider.getUsdPriceHistoryHourly).toHaveBeenNthCalledWith(
        1,
        CoingeckoId('ethereum'),
        UnixTime(from),
        adjustedTo,
      )

      expect(priceProvider.getUsdPriceHistoryHourly).toHaveBeenNthCalledWith(
        2,
        CoingeckoId('bitcoin'),
        UnixTime(from),
        adjustedTo,
      )

      const expectedRecords: TvsPriceRecord[] = [
        record('config-1', 'ethereum', 150),
        record('config-1', 'ethereum', 250),
        record('config-2', 'bitcoin', 200),
        record('config-2', 'bitcoin', 250),
      ]

      expect(tvsPriceRepository.upsertMany).toHaveBeenOnlyCalledWith(
        expectedRecords,
      )
      expect(safeHeight).toEqual(adjustedTo)
    })

    it('filters out timestamps that should not be synced', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const priceProvider = mockObject<PriceProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getUsdPriceHistoryHourly: mockFn().returnsOnce(points(150, 200, 250)),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([UnixTime(150)]),
        shouldTimestampBeSynced: mockFn()
          .returnsOnce(true) // For timestamp 150
          .returnsOnce(false) // For timestamp 200
          .returnsOnce(false), // For timestamp 250
      })

      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new TvsPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider,
          db: mockDatabase({ tvsPrice: tvsPriceRepository }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      const expectedRecords: TvsPriceRecord[] = [
        record('config-1', 'ethereum', 150),
      ]

      expect(tvsPriceRepository.upsertMany).toHaveBeenOnlyCalledWith(
        expectedRecords,
      )
      expect(safeHeight).toEqual(adjustedTo)
    })

    it('syncs only up to the last hour every coin has a price for', async () => {
      const from = UnixTime.HOUR
      const adjustedTo = 4 * UnixTime.HOUR

      const priceProvider = mockObject<PriceProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getUsdPriceHistoryHourly: mockFn()
          .returnsOnce(points(1 * H, 2 * H, 3 * H, 4 * H))
          // CoinGecko has not published the last two hours for bitcoin yet
          .returnsOnce(points(1 * H, 2 * H)),
      })
      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })
      const info = mockFn().returns(undefined)
      const logger = mockLogger(info)

      const indexer = new TvsPriceIndexer(
        {
          configurations: [
            config('config-1', 'ethereum'),
            config('config-2', 'bitcoin'),
          ],
          priceProvider,
          db: mockDatabase({ tvsPrice: tvsPriceRepository }),
          syncOptimizer: syncEverything(),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        logger,
      )

      const updateFn = await indexer.multiUpdate(from, adjustedTo, [
        config('config-1', 'ethereum'),
        config('config-2', 'bitcoin'),
      ])
      const safeHeight = await updateFn()

      expect(safeHeight).toEqual(2 * H)
      expect(tvsPriceRepository.upsertMany).toHaveBeenOnlyCalledWith([
        record('config-1', 'ethereum', UnixTime(1 * H)),
        record('config-1', 'ethereum', UnixTime(2 * H)),
        record('config-2', 'bitcoin', UnixTime(1 * H)),
        record('config-2', 'bitcoin', UnixTime(2 * H)),
      ])
      expect(info).toHaveBeenCalledWith(
        'Price range shrunk to available hours',
        { from, to: adjustedTo, adjustedTo: 2 * H, missingHours: 2 },
      )
    })

    it('waits while CoinGecko has not published the first hour', async () => {
      const from = UnixTime.HOUR

      const priceProvider = mockObject<PriceProvider>({
        getAdjustedTo: mockFn().returnsOnce(from),
        getUsdPriceHistoryHourly: mockFn()
          .rejectsWithOnce(new DataNotReadyError('Not published'))
          .resolvesToOnce(points(from)),
      })
      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new TvsPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider,
          db: mockDatabase({ tvsPrice: tvsPriceRepository }),
          syncOptimizer: syncEverything(),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
          notReadyPollIntervalMs: 0,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, from, [
        config('config-1', 'ethereum'),
      ])

      expect(await updateFn()).toEqual(from)
      expect(priceProvider.getUsdPriceHistoryHourly).toHaveBeenCalledTimes(2)
      expect(tvsPriceRepository.upsertMany).toHaveBeenOnlyCalledWith([
        record('config-1', 'ethereum', from),
      ])
    })

    it('returns to value if no timestamps to sync', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const priceProvider = mockObject<PriceProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([]),
      })

      const indexer = new TvsPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider,
          db: mockDatabase({ tvsPrice: mockObject() }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(priceProvider.getAdjustedTo).toHaveBeenOnlyCalledWith(from, to)
      expect(syncOptimizer.getTimestampsToSync).toHaveBeenOnlyCalledWith(
        from,
        adjustedTo,
        1,
      )
      expect(safeHeight).toEqual(to)
    })

    it('handles insufficient data errors', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const priceProvider = mockObject<PriceProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getUsdPriceHistoryHourly: mockFn().throwsOnce(
          new Error('Insufficient data in response for ethereum'),
        ),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([UnixTime(150)]),
      })

      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new TvsPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider,
          db: mockDatabase({ tvsPrice: tvsPriceRepository }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(priceProvider.getUsdPriceHistoryHourly).toHaveBeenOnlyCalledWith(
        CoingeckoId('ethereum'),
        UnixTime(from),
        adjustedTo,
      )

      expect(tvsPriceRepository.upsertMany).toHaveBeenOnlyCalledWith([])
      expect(safeHeight).toEqual(adjustedTo)
    })

    it('rethrows other errors', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const priceProvider = mockObject<PriceProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getUsdPriceHistoryHourly: mockFn().throwsOnce(
          new Error('Network error'),
        ),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([UnixTime(150)]),
      })

      const indexer = new TvsPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider,
          db: mockDatabase({ tvsPrice: mockObject() }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      await expect(async () => {
        await indexer.multiUpdate(from, to, [config('config-1', 'ethereum')])
      }).toBeRejectedWith('Network error')
    })
  })

  describe(TvsPriceIndexer.prototype.trimData.name, () => {
    it('deletes records for configurations in time range', async () => {
      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        deleteByConfigs: mockFn().returns(5),
      })

      const indexer = new TvsPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider: mockObject<PriceProvider>({}),
          db: mockDatabase({ tvsPrice: tvsPriceRepository }),
          syncOptimizer: mockObject<SyncOptimizer>({}),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const removalConfigs = [
        {
          type: 'trim' as const,
          id: 'config-1',
          range: [100, 200] as [number, number],
        },
        {
          type: 'trim' as const,
          id: 'config-2',
          range: [300, 400] as [number, number],
        },
      ]

      await indexer.trimData(removalConfigs)

      expect(tvsPriceRepository.deleteByConfigs).toHaveBeenOnlyCalledWith([
        {
          configurationId: 'config-1',
          fromInclusive: UnixTime(100),
          toInclusive: UnixTime(200),
        },
        {
          configurationId: 'config-2',
          fromInclusive: UnixTime(300),
          toInclusive: UnixTime(400),
        },
      ])
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function config(id: string, priceId: string) {
  return {
    id,
    minHeight: 0,
    maxHeight: null,
    properties: {
      id,
      priceId,
      sinceTimestamp: UnixTime(0),
    },
  }
}

function record(configurationId: string, priceId: string, timestamp: UnixTime) {
  return {
    configurationId,
    timestamp: timestamp,
    priceUsd: timestamp * 10,
    priceId,
  }
}

const H = UnixTime.HOUR

function points(...timestamps: number[]) {
  return timestamps.map((t) => ({ timestamp: UnixTime(t), value: t * 10 }))
}

function syncEverything() {
  return mockObject<SyncOptimizer>({
    getTimestampsToSync: mockFn().returns([UnixTime(0)]),
    shouldTimestampBeSynced: mockFn().returns(true),
  })
}

function mockLogger(info: Logger['info']) {
  const logger: Logger = mockObject<Logger>({
    info,
    warn: mockFn().returns(undefined),
    for: () => logger,
    tag: () => logger,
  })
  return logger
}
