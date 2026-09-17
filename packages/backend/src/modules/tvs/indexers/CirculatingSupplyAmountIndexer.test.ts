import { Logger } from '@l2beat/backend-tools'
import type { Database, TvsAmountRecord } from '@l2beat/database'
import type { CirculatingSupplyProvider } from '@l2beat/shared'
import { CoingeckoId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { SyncOptimizer } from '../tools/SyncOptimizer'
import { CirculatingSupplyAmountIndexer } from './CirculatingSupplyAmountIndexer'

describe(CirculatingSupplyAmountIndexer.name, () => {
  describe(CirculatingSupplyAmountIndexer.prototype.multiUpdate.name, () => {
    it('fetches circulating supplies and saves them to DB', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const configs = [
        config('config-1', 'ethereum', 18),
        config('config-2', 'bitcoin', 8),
      ]

      const circulatingSupplyProvider = {
        getAdjustedTo: vi.fn().mockReturnValueOnce(adjustedTo),
        getCirculatingSupplies: vi
          .fn()
          .mockReturnValueOnce([{ timestamp: UnixTime(150), value: 120000000 }])
          .mockReturnValueOnce([{ timestamp: UnixTime(200), value: 19000000 }]),
      } as unknown as CirculatingSupplyProvider

      const syncOptimizer = {
        getTimestampsToSync: vi
          .fn()
          .mockReturnValueOnce([UnixTime(150), UnixTime(200)]),
        shouldTimestampBeSynced: vi.fn().mockReturnValue(true),
      } as unknown as SyncOptimizer

      const tvsAmountRepository = {
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['tvsAmount']

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: configs,
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
          syncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      expect(
        circulatingSupplyProvider.getCirculatingSupplies,
      ).toHaveBeenNthCalledWith(1, CoingeckoId('ethereum'), {
        from,
        to: adjustedTo,
      })

      expect(
        circulatingSupplyProvider.getCirculatingSupplies,
      ).toHaveBeenNthCalledWith(2, CoingeckoId('bitcoin'), {
        from,
        to: adjustedTo,
      })

      const expectedRecords: TvsAmountRecord[] = [
        {
          configurationId: 'config-1',
          timestamp: UnixTime(150),
          amount: BigInt(120000000 * 10 ** 18),
        },
        {
          configurationId: 'config-2',
          timestamp: UnixTime(200),
          amount: BigInt(19000000 * 10 ** 8),
        },
      ]

      expect(tvsAmountRepository.upsertMany).toHaveBeenCalledExactlyOnceWith(
        expectedRecords,
      )
      expect(safeHeight).toStrictEqual(adjustedTo)
    })

    it('filters out timestamps that should not be synced', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const circulatingSupplyProvider = {
        getAdjustedTo: vi.fn().mockReturnValueOnce(adjustedTo),
        getCirculatingSupplies: vi.fn().mockReturnValueOnce([
          { timestamp: UnixTime(150), value: 120000000 },
          { timestamp: UnixTime(200), value: 125000000 },
        ]),
      } as unknown as CirculatingSupplyProvider

      const syncOptimizer = {
        getTimestampsToSync: vi.fn().mockReturnValueOnce([UnixTime(150)]),
        shouldTimestampBeSynced: vi
          .fn()
          .mockReturnValueOnce(true) // For timestamp 150
          .mockReturnValueOnce(false), // For timestamp 200
      } as unknown as SyncOptimizer

      const tvsAmountRepository = {
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['tvsAmount']

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
          syncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum', 18),
      ])
      const safeHeight = await updateFn()

      const expectedRecords: TvsAmountRecord[] = [
        {
          configurationId: 'config-1',
          timestamp: UnixTime(150),
          amount: BigInt(120000000 * 10 ** 18),
        },
      ]

      expect(tvsAmountRepository.upsertMany).toHaveBeenCalledExactlyOnceWith(
        expectedRecords,
      )
      expect(safeHeight).toStrictEqual(adjustedTo)
    })

    it('returns to value if no timestamps to sync', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const circulatingSupplyProvider = {
        getAdjustedTo: vi.fn().mockReturnValueOnce(adjustedTo),
      } as unknown as CirculatingSupplyProvider

      const syncOptimizer = {
        getTimestampsToSync: vi.fn().mockReturnValueOnce([]),
      } as unknown as SyncOptimizer

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider,
          db: mockDatabase({
            tvsAmount: {} as unknown as Database['tvsAmount'],
          }),
          syncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum', 18),
      ])
      const safeHeight = await updateFn()

      expect(
        circulatingSupplyProvider.getAdjustedTo,
      ).toHaveBeenCalledExactlyOnceWith(from, to)
      expect(syncOptimizer.getTimestampsToSync).toHaveBeenCalledExactlyOnceWith(
        from,
        adjustedTo,
        1,
      )
      expect(safeHeight).toStrictEqual(to)
    })

    it('drops invalid supply values and saves the rest', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const circulatingSupplyProvider = {
        getAdjustedTo: vi.fn().mockReturnValueOnce(adjustedTo),
        getCirculatingSupplies: vi.fn().mockReturnValueOnce([
          { timestamp: UnixTime(150), value: 120000000 },
          { timestamp: UnixTime(200), value: Number.NaN },
        ]),
      } as unknown as CirculatingSupplyProvider

      const syncOptimizer = {
        getTimestampsToSync: vi
          .fn()
          .mockReturnValueOnce([UnixTime(150), UnixTime(200)]),
        shouldTimestampBeSynced: vi.fn().mockReturnValue(true),
      } as unknown as SyncOptimizer

      const tvsAmountRepository = {
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['tvsAmount']

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
          syncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum', 18),
      ])
      const safeHeight = await updateFn()

      const expectedRecords: TvsAmountRecord[] = [
        {
          configurationId: 'config-1',
          timestamp: UnixTime(150),
          amount: BigInt(120000000 * 10 ** 18),
        },
      ]

      expect(tvsAmountRepository.upsertMany).toHaveBeenCalledExactlyOnceWith(
        expectedRecords,
      )
      expect(safeHeight).toStrictEqual(adjustedTo)
    })

    it('handles insufficient data errors', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const circulatingSupplyProvider = {
        getAdjustedTo: vi.fn().mockReturnValueOnce(adjustedTo),
        getCirculatingSupplies: vi.fn().mockImplementationOnce(() => {
          throw new Error('Insufficient data in response for ethereum')
        }),
      } as unknown as CirculatingSupplyProvider

      const syncOptimizer = {
        getTimestampsToSync: vi.fn().mockReturnValueOnce([UnixTime(150)]),
      } as unknown as SyncOptimizer

      const tvsAmountRepository = {
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['tvsAmount']

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
          syncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum', 18),
      ])
      const safeHeight = await updateFn()

      expect(
        circulatingSupplyProvider.getCirculatingSupplies,
      ).toHaveBeenCalledExactlyOnceWith(CoingeckoId('ethereum'), {
        from,
        to: adjustedTo,
      })

      expect(tvsAmountRepository.upsertMany).toHaveBeenCalledExactlyOnceWith([])
      expect(safeHeight).toStrictEqual(adjustedTo)
    })

    it('rethrows other errors', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const circulatingSupplyProvider = {
        getAdjustedTo: vi.fn().mockReturnValueOnce(adjustedTo),
        getCirculatingSupplies: vi.fn().mockImplementationOnce(() => {
          throw new Error('Network error')
        }),
      } as unknown as CirculatingSupplyProvider

      const syncOptimizer = {
        getTimestampsToSync: vi.fn().mockReturnValueOnce([UnixTime(150)]),
      } as unknown as SyncOptimizer

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider,
          db: mockDatabase({
            tvsAmount: {} as unknown as Database['tvsAmount'],
          }),
          syncOptimizer,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      await expect(async () => {
        await indexer.multiUpdate(from, to, [
          config('config-1', 'ethereum', 18),
        ])
      }).rejects.toThrow('Network error')
    })
  })

  describe(CirculatingSupplyAmountIndexer.prototype.trimData.name, () => {
    it('deletes records for configurations in time range', async () => {
      const tvsAmountRepository = {
        deleteByConfigs: vi.fn().mockReturnValue(5),
      } as unknown as Database['tvsAmount']

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider: {} as unknown as CirculatingSupplyProvider,
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
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
        tvsAmountRepository.deleteByConfigs,
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

  describe('SOURCE', () => {
    it('returns the correct source identifier', () => {
      expect(CirculatingSupplyAmountIndexer.SOURCE()).toStrictEqual(
        'l2b-circulating-supply',
      )
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function config(id: string, apiId: string, decimals: number) {
  return {
    id,
    minHeight: 0,
    maxHeight: null,
    properties: {
      type: 'circulatingSupply' as const,
      sinceTimestamp: 0,
      apiId,
      decimals,
      address: EthereumAddress.ZERO,
      chain: 'chain',
    },
  }
}
