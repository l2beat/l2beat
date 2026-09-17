import { Logger } from '@l2beat/backend-tools'
import type { Database, TvsPriceRecord } from '@l2beat/database'
import type { PriceProvider } from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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

      const priceProvider = {
        getAdjustedTo: vi.fn().mockReturnValueOnce(adjustedTo),
        getUsdPriceHistoryHourly: vi
          .fn()
          .mockReturnValueOnce([{ timestamp: UnixTime(150), value: 1500 }])
          .mockReturnValueOnce([{ timestamp: UnixTime(200), value: 2000 }]),
      } as unknown as PriceProvider

      const syncOptimizer = {
        getTimestampsToSync: vi
          .fn()
          .mockReturnValueOnce([UnixTime(150), UnixTime(200)]),
        shouldTimestampBeSynced: vi.fn().mockReturnValue(true),
      } as unknown as SyncOptimizer

      const tvsPriceRepository = {
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['tvsPrice']

      const indexer = new TvsPriceIndexer(
        {
          configurations: configs,
          priceProvider,
          db: mockDatabase({ tvsPrice: tvsPriceRepository }),
          syncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
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
        record('config-2', 'bitcoin', 200),
      ]

      expect(tvsPriceRepository.upsertMany).toHaveBeenCalledExactlyOnceWith(
        expectedRecords,
      )
      expect(safeHeight).toStrictEqual(adjustedTo)
    })

    it('filters out timestamps that should not be synced', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const priceProvider = {
        getAdjustedTo: vi.fn().mockReturnValueOnce(adjustedTo),
        getUsdPriceHistoryHourly: vi.fn().mockReturnValueOnce([
          { timestamp: UnixTime(150), value: 1500 },
          { timestamp: UnixTime(200), value: 2000 },
        ]),
      } as unknown as PriceProvider

      const syncOptimizer = {
        getTimestampsToSync: vi.fn().mockReturnValueOnce([UnixTime(150)]),
        shouldTimestampBeSynced: vi
          .fn()
          .mockReturnValueOnce(true) // For timestamp 150
          .mockReturnValueOnce(false), // For timestamp 200
      } as unknown as SyncOptimizer

      const tvsPriceRepository = {
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['tvsPrice']

      const indexer = new TvsPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider,
          db: mockDatabase({ tvsPrice: tvsPriceRepository }),
          syncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
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

      expect(tvsPriceRepository.upsertMany).toHaveBeenCalledExactlyOnceWith(
        expectedRecords,
      )
      expect(safeHeight).toStrictEqual(adjustedTo)
    })

    it('returns to value if no timestamps to sync', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const priceProvider = {
        getAdjustedTo: vi.fn().mockReturnValueOnce(adjustedTo),
      } as unknown as PriceProvider

      const syncOptimizer = {
        getTimestampsToSync: vi.fn().mockReturnValueOnce([]),
      } as unknown as SyncOptimizer

      const indexer = new TvsPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider,
          db: mockDatabase({ tvsPrice: {} as unknown as Database['tvsPrice'] }),
          syncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(priceProvider.getAdjustedTo).toHaveBeenCalledExactlyOnceWith(
        from,
        to,
      )
      expect(syncOptimizer.getTimestampsToSync).toHaveBeenCalledExactlyOnceWith(
        from,
        adjustedTo,
        1,
      )
      expect(safeHeight).toStrictEqual(to)
    })

    it('handles insufficient data errors', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const priceProvider = {
        getAdjustedTo: vi.fn().mockReturnValueOnce(adjustedTo),
        getUsdPriceHistoryHourly: vi.fn().mockImplementationOnce(() => {
          throw new Error('Insufficient data in response for ethereum')
        }),
      } as unknown as PriceProvider

      const syncOptimizer = {
        getTimestampsToSync: vi.fn().mockReturnValueOnce([UnixTime(150)]),
      } as unknown as SyncOptimizer

      const tvsPriceRepository = {
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['tvsPrice']

      const indexer = new TvsPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider,
          db: mockDatabase({ tvsPrice: tvsPriceRepository }),
          syncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(
        priceProvider.getUsdPriceHistoryHourly,
      ).toHaveBeenCalledExactlyOnceWith(
        CoingeckoId('ethereum'),
        UnixTime(from),
        adjustedTo,
      )

      expect(tvsPriceRepository.upsertMany).toHaveBeenCalledExactlyOnceWith([])
      expect(safeHeight).toStrictEqual(adjustedTo)
    })

    it('rethrows other errors', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const priceProvider = {
        getAdjustedTo: vi.fn().mockReturnValueOnce(adjustedTo),
        getUsdPriceHistoryHourly: vi.fn().mockImplementationOnce(() => {
          throw new Error('Network error')
        }),
      } as unknown as PriceProvider

      const syncOptimizer = {
        getTimestampsToSync: vi.fn().mockReturnValueOnce([UnixTime(150)]),
      } as unknown as SyncOptimizer

      const indexer = new TvsPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider,
          db: mockDatabase({ tvsPrice: {} as unknown as Database['tvsPrice'] }),
          syncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      await expect(async () => {
        await indexer.multiUpdate(from, to, [config('config-1', 'ethereum')])
      }).rejects.toThrow('Network error')
    })
  })

  describe(TvsPriceIndexer.prototype.trimData.name, () => {
    it('deletes records for configurations in time range', async () => {
      const tvsPriceRepository = {
        deleteByConfigs: vi.fn().mockReturnValue(5),
      } as unknown as Database['tvsPrice']

      const indexer = new TvsPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider: {} as unknown as PriceProvider,
          db: mockDatabase({ tvsPrice: tvsPriceRepository }),
          syncOptimizer: {} as unknown as SyncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
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

      expect(
        tvsPriceRepository.deleteByConfigs,
      ).toHaveBeenCalledExactlyOnceWith([
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
