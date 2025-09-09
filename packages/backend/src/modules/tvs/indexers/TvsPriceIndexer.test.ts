import { Logger } from '@l2beat/backend-tools'
import type { Database, TvsPriceRecord } from '@l2beat/database'
import type { PriceProvider } from '@l2beat/shared'
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
          .returnsOnce([{ timestamp: UnixTime(150), value: 1500 }])
          .returnsOnce([{ timestamp: UnixTime(200), value: 2000 }]),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([
          UnixTime(150),
          UnixTime(200),
        ]),
        shouldTimestampBeSynced: mockFn().returns(true),
      })

      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        insertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new TvsPriceIndexer({
        logger: Logger.SILENT,
        configurations: configs,
        priceProvider,
        db: mockDatabase({ tvsPrice: tvsPriceRepository }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

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
        record('config-2', 'bitcoin', 200),
      ]

      expect(tvsPriceRepository.insertMany).toHaveBeenOnlyCalledWith(
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
        getUsdPriceHistoryHourly: mockFn().returnsOnce([
          { timestamp: UnixTime(150), value: 1500 },
          { timestamp: UnixTime(200), value: 2000 },
        ]),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([UnixTime(150)]),
        shouldTimestampBeSynced: mockFn()
          .returnsOnce(true) // For timestamp 150
          .returnsOnce(false), // For timestamp 200
      })

      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        insertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new TvsPriceIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum')],
        priceProvider,
        db: mockDatabase({ tvsPrice: tvsPriceRepository }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      const expectedRecords: TvsPriceRecord[] = [
        record('config-1', 'ethereum', 150),
      ]

      expect(tvsPriceRepository.insertMany).toHaveBeenOnlyCalledWith(
        expectedRecords,
      )
      expect(safeHeight).toEqual(adjustedTo)
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

      const indexer = new TvsPriceIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum')],
        priceProvider,
        db: mockDatabase({ tvsPrice: mockObject() }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

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
        insertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new TvsPriceIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum')],
        priceProvider,
        db: mockDatabase({ tvsPrice: tvsPriceRepository }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(priceProvider.getUsdPriceHistoryHourly).toHaveBeenOnlyCalledWith(
        CoingeckoId('ethereum'),
        UnixTime(from),
        adjustedTo,
      )

      expect(tvsPriceRepository.insertMany).toHaveBeenOnlyCalledWith([])
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

      const indexer = new TvsPriceIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum')],
        priceProvider,
        db: mockDatabase({ tvsPrice: mockObject() }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      await expect(async () => {
        await indexer.multiUpdate(from, to, [config('config-1', 'ethereum')])
      }).toBeRejectedWith('Network error')
    })
  })

  describe(TvsPriceIndexer.prototype.removeData.name, () => {
    it('deletes records for configuration in time range', async () => {
      const tvsPriceRepository = mockObject<Database['tvsPrice']>({
        deleteByConfigInTimeRange: mockFn().returnsOnce(3).returnsOnce(2),
      })

      const indexer = new TvsPriceIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum')],
        priceProvider: mockObject<PriceProvider>({}),
        db: mockDatabase({ tvsPrice: tvsPriceRepository }),
        syncOptimizer: mockObject<SyncOptimizer>({}),
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const removalConfigs = [
        {
          id: 'config-1',
          from: 100,
          to: 200,
        },
        {
          id: 'config-2',
          from: 300,
          to: 400,
        },
      ]

      await indexer.removeData(removalConfigs)

      expect(
        tvsPriceRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        1,
        removalConfigs[0].id,
        UnixTime(removalConfigs[0].from),
        UnixTime(removalConfigs[0].to),
      )

      expect(
        tvsPriceRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        2,
        removalConfigs[1].id,
        UnixTime(removalConfigs[1].from),
        UnixTime(removalConfigs[1].to),
      )
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
