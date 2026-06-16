import { Logger } from '@l2beat/backend-tools'
import type { Database, PrivacyPriceRecord } from '@l2beat/database'
import type { PriceProvider } from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { PrivacyPriceIndexerConfig } from '../types'
import { PrivacyPriceIndexer } from './PrivacyPriceIndexer'

describe(PrivacyPriceIndexer.name, () => {
  describe(PrivacyPriceIndexer.prototype.multiUpdate.name, () => {
    it('fetches prices for distinct priceIds and saves them to DB', async () => {
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

      const privacyPriceRepository = mockObject<Database['privacyPrice']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new PrivacyPriceIndexer(
        {
          configurations: configs,
          priceProvider,
          db: mockDatabase({ privacyPrice: privacyPriceRepository }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      expect(priceProvider.getAdjustedTo).toHaveBeenOnlyCalledWith(from, to)
      expect(priceProvider.getUsdPriceHistoryHourly).toHaveBeenNthCalledWith(
        1,
        CoingeckoId('ethereum'),
        from,
        adjustedTo,
      )
      expect(priceProvider.getUsdPriceHistoryHourly).toHaveBeenNthCalledWith(
        2,
        CoingeckoId('bitcoin'),
        from,
        adjustedTo,
      )

      const expectedRecords: PrivacyPriceRecord[] = [
        {
          configurationId: 'config-1',
          timestamp: UnixTime(150),
          priceUsd: 1500,
          priceId: 'ethereum',
        },
        {
          configurationId: 'config-2',
          timestamp: UnixTime(200),
          priceUsd: 2000,
          priceId: 'bitcoin',
        },
      ]

      expect(privacyPriceRepository.upsertMany).toHaveBeenOnlyCalledWith(
        expectedRecords,
      )
      expect(safeHeight).toEqual(adjustedTo)
    })

    it('shares fetched prices across configurations with the same priceId', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const configs = [
        config('config-1', 'ethereum'),
        config('config-2', 'ethereum'),
      ]

      const priceProvider = mockObject<PriceProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getUsdPriceHistoryHourly: mockFn().returnsOnce([
          { timestamp: UnixTime(150), value: 1500 },
        ]),
      })

      const privacyPriceRepository = mockObject<Database['privacyPrice']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new PrivacyPriceIndexer(
        {
          configurations: configs,
          priceProvider,
          db: mockDatabase({ privacyPrice: privacyPriceRepository }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      await updateFn()

      expect(priceProvider.getUsdPriceHistoryHourly).toHaveBeenCalledTimes(1)
      expect(privacyPriceRepository.upsertMany).toHaveBeenOnlyCalledWith([
        {
          configurationId: 'config-1',
          timestamp: UnixTime(150),
          priceUsd: 1500,
          priceId: 'ethereum',
        },
        {
          configurationId: 'config-2',
          timestamp: UnixTime(150),
          priceUsd: 1500,
          priceId: 'ethereum',
        },
      ])
    })

    it('swallows "Insufficient data" errors and continues', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 250

      const priceProvider = mockObject<PriceProvider>({
        getAdjustedTo: mockFn().returnsOnce(adjustedTo),
        getUsdPriceHistoryHourly: mockFn().throwsOnce(
          new Error('Insufficient data in response for ethereum'),
        ),
      })

      const privacyPriceRepository = mockObject<Database['privacyPrice']>({
        upsertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new PrivacyPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider,
          db: mockDatabase({ privacyPrice: privacyPriceRepository }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(privacyPriceRepository.upsertMany).toHaveBeenOnlyCalledWith([])
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

      const indexer = new PrivacyPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider,
          db: mockDatabase({ privacyPrice: mockObject() }),
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

  describe(PrivacyPriceIndexer.prototype.removeData.name, () => {
    it('deletes records for configurations in time range', async () => {
      const privacyPriceRepository = mockObject<Database['privacyPrice']>({
        deleteByConfigs: mockFn().returns(5),
      })

      const indexer = new PrivacyPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider: mockObject<PriceProvider>({}),
          db: mockDatabase({ privacyPrice: privacyPriceRepository }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const removalConfigs = [
        { id: 'config-1', from: 100, to: 200 },
        { id: 'config-2', from: 300, to: 400 },
      ]

      await indexer.removeData(removalConfigs)

      expect(privacyPriceRepository.deleteByConfigs).toHaveBeenOnlyCalledWith([
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

    it('skips DB call when no configurations are provided', async () => {
      const privacyPriceRepository = mockObject<Database['privacyPrice']>({
        deleteByConfigs: mockFn(),
      })

      const indexer = new PrivacyPriceIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          priceProvider: mockObject<PriceProvider>({}),
          db: mockDatabase({ privacyPrice: privacyPriceRepository }),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      await indexer.removeData([])

      expect(privacyPriceRepository.deleteByConfigs).not.toHaveBeenCalled()
    })
  })

  describe(PrivacyPriceIndexer.idToConfigurationId.name, () => {
    it('differs across priceIds', () => {
      const id1 = PrivacyPriceIndexer.idToConfigurationId({
        priceId: 'ethereum',
        sinceTimestamp: UnixTime(0),
      })
      const id2 = PrivacyPriceIndexer.idToConfigurationId({
        priceId: 'bitcoin',
        sinceTimestamp: UnixTime(0),
      })
      expect(id1).not.toEqual(id2)
    })

    it('is deterministic for the same priceId', () => {
      const id1 = PrivacyPriceIndexer.idToConfigurationId({
        priceId: 'ethereum',
        sinceTimestamp: UnixTime(0),
      })
      const id2 = PrivacyPriceIndexer.idToConfigurationId({
        priceId: 'ethereum',
        sinceTimestamp: UnixTime(123),
      })
      expect(id1).toEqual(id2)
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function config(
  id: string,
  priceId: string,
): Configuration<PrivacyPriceIndexerConfig> {
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
