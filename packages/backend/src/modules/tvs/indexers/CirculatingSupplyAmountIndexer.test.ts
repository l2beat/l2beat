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
        insertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new CirculatingSupplyAmountIndexer({
        logger: Logger.SILENT,
        configurations: configs,
        circulatingSupplyProvider,
        db: mockDatabase({ tvsAmount: tvsAmountRepository }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

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

      expect(tvsAmountRepository.insertMany).toHaveBeenOnlyCalledWith(
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
        insertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new CirculatingSupplyAmountIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum', 18)],
        circulatingSupplyProvider,
        db: mockDatabase({ tvsAmount: tvsAmountRepository }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

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

      expect(tvsAmountRepository.insertMany).toHaveBeenOnlyCalledWith(
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

      const indexer = new CirculatingSupplyAmountIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum', 18)],
        circulatingSupplyProvider,
        db: mockDatabase({ tvsAmount: mockObject() }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

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
        insertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new CirculatingSupplyAmountIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum', 18)],
        circulatingSupplyProvider,
        db: mockDatabase({ tvsAmount: tvsAmountRepository }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

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

      expect(tvsAmountRepository.insertMany).toHaveBeenOnlyCalledWith([])
      expect(safeHeight).toEqual(adjustedTo)
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

      const indexer = new CirculatingSupplyAmountIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum', 18)],
        circulatingSupplyProvider,
        db: mockDatabase({ tvsAmount: mockObject() }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      await expect(async () => {
        await indexer.multiUpdate(from, to, [
          config('config-1', 'ethereum', 18),
        ])
      }).toBeRejectedWith('Network error')
    })
  })

  describe(CirculatingSupplyAmountIndexer.prototype.removeData.name, () => {
    it('deletes records for configuration in time range', async () => {
      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        deleteByConfigInTimeRange: mockFn().returnsOnce(3).returnsOnce(2),
      })

      const indexer = new CirculatingSupplyAmountIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum', 18)],
        circulatingSupplyProvider: mockObject<CirculatingSupplyProvider>({}),
        db: mockDatabase({ tvsAmount: tvsAmountRepository }),
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
        tvsAmountRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        1,
        removalConfigs[0].id,
        UnixTime(removalConfigs[0].from),
        UnixTime(removalConfigs[0].to),
      )

      expect(
        tvsAmountRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        2,
        removalConfigs[1].id,
        UnixTime(removalConfigs[1].from),
        UnixTime(removalConfigs[1].to),
      )
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
