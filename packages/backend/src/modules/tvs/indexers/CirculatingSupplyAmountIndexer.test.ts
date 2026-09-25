import { Logger } from '@l2beat/backend-tools'
import type { Database, TvsAmountRecord } from '@l2beat/database'
import type { CirculatingSupplyProvider } from '@l2beat/shared'
import { CoingeckoId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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

      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getCirculatingSupplies: mockFn()
          .returnsOnce([{ timestamp: UnixTime(150), value: 120000000 }])
          .returnsOnce([{ timestamp: UnixTime(200), value: 19000000 }]),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([
          UnixTime(150),
          UnixTime(200),
        ]),
        shouldTimestampBeSynced: mockFn().returns(true),
      })

      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: configs,
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
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

      expect(tvsAmountRepository.upsertMany).toHaveBeenOnlyCalledWith(
        expectedRecords,
      )
      expect(safeHeight).toEqual(adjustedTo)
    })

    it('filters out timestamps that should not be synced', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getCirculatingSupplies: mockFn().returnsOnce([
          { timestamp: UnixTime(150), value: 120000000 },
          { timestamp: UnixTime(200), value: 125000000 },
        ]),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([UnixTime(150)]),
        shouldTimestampBeSynced: mockFn()
          .returnsOnce(true) // For timestamp 150
          .returnsOnce(false), // For timestamp 200
      })

      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
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

      expect(tvsAmountRepository.upsertMany).toHaveBeenOnlyCalledWith(
        expectedRecords,
      )
      expect(safeHeight).toEqual(adjustedTo)
    })

    it('returns to value if no timestamps to sync', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([]),
      })

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: mockObject() }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum', 18),
      ])
      const safeHeight = await updateFn()

      expect(circulatingSupplyProvider.getAdjustedTo).toHaveBeenOnlyCalledWith(
        from,
        to,
      )
      expect(syncOptimizer.getTimestampsToSync).toHaveBeenOnlyCalledWith(
        from,
        adjustedTo,
        1,
      )
      expect(safeHeight).toEqual(to)
    })

    it('drops invalid supply values and saves the rest', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getCirculatingSupplies: mockFn().returnsOnce([
          { timestamp: UnixTime(150), value: 120000000 },
          { timestamp: UnixTime(200), value: Number.NaN },
        ]),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([
          UnixTime(150),
          UnixTime(200),
        ]),
        shouldTimestampBeSynced: mockFn().returns(true),
      })

      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
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

      expect(tvsAmountRepository.upsertMany).toHaveBeenOnlyCalledWith(
        expectedRecords,
      )
      expect(safeHeight).toEqual(adjustedTo)
    })

    it('handles insufficient data errors', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getCirculatingSupplies: mockFn().throwsOnce(
          new Error('Insufficient data in response for ethereum'),
        ),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([UnixTime(150)]),
      })

      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum', 18),
      ])
      const safeHeight = await updateFn()

      expect(
        circulatingSupplyProvider.getCirculatingSupplies,
      ).toHaveBeenOnlyCalledWith(CoingeckoId('ethereum'), {
        from,
        to: adjustedTo,
      })

      expect(tvsAmountRepository.upsertMany).toHaveBeenOnlyCalledWith([])
      expect(safeHeight).toEqual(adjustedTo)
    })

    it('quarantines failing configurations and keeps syncing the others', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const configs = [
        config('config-1', 'token-1', 2),
        config('config-2', 'bad', 2),
        config('config-3', 'token-3', 2),
        config('config-4', 'token-4', 2),
        config('config-5', 'token-5', 2),
        config('config-6', 'token-6', 2),
      ]

      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getAdjustedTo: mockFn().returns(adjustedTo),
        getCirculatingSupplies: mockFn(async (coingeckoId: CoingeckoId) => {
          if (coingeckoId === CoingeckoId('bad')) {
            throw new Error('Network error')
          }
          return [{ timestamp: UnixTime(150), value: 100 }]
        }),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returns([UnixTime(150)]),
        shouldTimestampBeSynced: mockFn().returns(true),
      })

      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        upsertMany: mockFn().returns(undefined),
      })

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: configs,
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      // the failing configuration does not block the others
      expect(safeHeight).toEqual(adjustedTo)
      expect(tvsAmountRepository.upsertMany).toHaveBeenNthCalledWith(
        1,
        configs
          .filter((c) => c.properties.apiId !== 'bad')
          .map((c) => ({
            configurationId: c.id,
            timestamp: UnixTime(150),
            amount: BigInt(100 * 10 ** 2),
          })),
      )
      expect(
        circulatingSupplyProvider.getCirculatingSupplies,
      ).toHaveBeenCalledTimes(6)

      // the quarantined configuration is skipped on subsequent updates
      const updateFn2 = await indexer.multiUpdate(from, to, configs)
      await updateFn2()

      expect(
        circulatingSupplyProvider.getCirculatingSupplies,
      ).toHaveBeenCalledTimes(11)
    })

    it('quarantines configurations when amount conversion fails', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const configs = [
        config('config-1', 'token-1', 2),
        config('config-2', 'venice-token', 2),
        config('config-3', 'token-3', 2),
        config('config-4', 'token-4', 2),
        config('config-5', 'token-5', 2),
        config('config-6', 'token-6', 2),
      ]

      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getAdjustedTo: mockFn().returns(adjustedTo),
        getCirculatingSupplies: mockFn(async (coingeckoId: CoingeckoId) => {
          if (coingeckoId === CoingeckoId('venice-token')) {
            // broken Coingecko data can end up as NaN which makes
            // the BigInt conversion throw a RangeError
            return [{ timestamp: UnixTime(150), value: Number.NaN }]
          }
          return [{ timestamp: UnixTime(150), value: 100 }]
        }),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returns([UnixTime(150)]),
        shouldTimestampBeSynced: mockFn().returns(true),
      })

      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        upsertMany: mockFn().returns(undefined),
      })

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: configs,
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      expect(safeHeight).toEqual(adjustedTo)
      expect(tvsAmountRepository.upsertMany).toHaveBeenOnlyCalledWith(
        configs
          .filter((c) => c.properties.apiId !== 'venice-token')
          .map((c) => ({
            configurationId: c.id,
            timestamp: UnixTime(150),
            amount: BigInt(100 * 10 ** 2),
          })),
      )
    })

    it('rethrows when too many configurations fail', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      // 2 out of 6 failing configurations exceed the allowed
      // quarantined ratio, so the error is treated as systemic
      const configs = [
        config('config-1', 'token-1', 2),
        config('config-2', 'bad-1', 2),
        config('config-3', 'bad-2', 2),
        config('config-4', 'token-4', 2),
        config('config-5', 'token-5', 2),
        config('config-6', 'token-6', 2),
      ]

      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getAdjustedTo: mockFn().returns(adjustedTo),
        getCirculatingSupplies: mockFn(async (coingeckoId: CoingeckoId) => {
          if (String(coingeckoId).startsWith('bad')) {
            throw new Error('Network error')
          }
          return [{ timestamp: UnixTime(150), value: 100 }]
        }),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returns([UnixTime(150)]),
        shouldTimestampBeSynced: mockFn().returns(true),
      })

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: configs,
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: mockObject() }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      await expect(async () => {
        await indexer.multiUpdate(from, to, configs)
      }).toBeRejectedWith('Network error')
    })

    it('rethrows other errors', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getCirculatingSupplies: mockFn().throwsOnce(new Error('Network error')),
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce([UnixTime(150)]),
      })

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider,
          db: mockDatabase({ tvsAmount: mockObject() }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      await expect(async () => {
        await indexer.multiUpdate(from, to, [
          config('config-1', 'ethereum', 18),
        ])
      }).toBeRejectedWith('Network error')
    })
  })

  describe(CirculatingSupplyAmountIndexer.prototype.trimData.name, () => {
    it('deletes records for configurations in time range', async () => {
      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        deleteByConfigs: mockFn().returns(5),
      })

      const indexer = new CirculatingSupplyAmountIndexer(
        {
          configurations: [config('config-1', 'ethereum', 18)],
          circulatingSupplyProvider: mockObject<CirculatingSupplyProvider>({}),
          db: mockDatabase({ tvsAmount: tvsAmountRepository }),
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

      expect(tvsAmountRepository.deleteByConfigs).toHaveBeenOnlyCalledWith([
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
      expect(CirculatingSupplyAmountIndexer.SOURCE()).toEqual(
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
