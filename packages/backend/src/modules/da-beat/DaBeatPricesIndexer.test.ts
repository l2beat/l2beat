import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { PriceProvider } from '@l2beat/shared'
import { CoingeckoId, type Configuration } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../test/database'
import type { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import type { ManagedMultiIndexerOptions } from '../../tools/uif/multi/types'
import { DaBeatPricesIndexer } from './DaBeatPricesIndexer'

describe(DaBeatPricesIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe('constructor', () => {
    it('throws when given multiple configurations', () => {
      const deps = mockIndexerDeps({
        configurations: [
          mockConfiguration(['ethereum'], 'config1'),
          mockConfiguration(['bitcoin'], 'config2'),
        ],
      })

      expect(() => new DaBeatPricesIndexer(deps)).toThrow(
        'This indexer should take only one configuration',
      )
    })
  })

  describe(DaBeatPricesIndexer.prototype.multiUpdate.name, () => {
    it('fetches prices from price provider and saves to database', async () => {
      const pricesMap = new Map([
        [CoingeckoId('ethereum'), 2500.5],
        [CoingeckoId('bitcoin'), 45000.75],
      ])

      const priceProvider = mockObject<PriceProvider>({
        getLatestPrices: mockFn().resolvesTo(pricesMap),
      })

      const currentPriceRepository = mockObject<Database['currentPrice']>({
        upsertMany: mockFn().resolvesTo(undefined),
      })

      const configuration = mockConfiguration(['ethereum', 'bitcoin'])
      const deps = mockIndexerDeps({
        configurations: [configuration],
        priceProvider,
        currentPriceRepository,
      })

      const indexer = new DaBeatPricesIndexer(deps)

      const updateFn = await indexer.multiUpdate(100, 200, [configuration])
      const result = await updateFn()

      expect(priceProvider.getLatestPrices).toHaveBeenOnlyCalledWith([
        CoingeckoId('ethereum'),
        CoingeckoId('bitcoin'),
      ])

      expect(currentPriceRepository.upsertMany).toHaveBeenOnlyCalledWith([
        { coingeckoId: CoingeckoId('ethereum'), priceUsd: 2500.5 },
        { coingeckoId: CoingeckoId('bitcoin'), priceUsd: 45000.75 },
      ])

      expect(result).toEqual(200)
    })

    it('returns early when no prices found', async () => {
      const emptyPricesMap = new Map()

      const priceProvider = mockObject<PriceProvider>({
        getLatestPrices: mockFn().resolvesTo(emptyPricesMap),
      })

      const currentPriceRepository = mockObject<Database['currentPrice']>({
        upsertMany: mockFn().resolvesTo(undefined),
      })

      const configuration = mockConfiguration(['ethereum'])
      const deps = mockIndexerDeps({
        configurations: [configuration],
        priceProvider,
        currentPriceRepository,
      })

      const indexer = new DaBeatPricesIndexer(deps)

      const updateFn = await indexer.multiUpdate(100, 200, [configuration])
      const result = await updateFn()

      expect(priceProvider.getLatestPrices).toHaveBeenOnlyCalledWith([
        CoingeckoId('ethereum'),
      ])

      expect(currentPriceRepository.upsertMany).not.toHaveBeenCalled()
      expect(result).toEqual(200)
    })

    it('handles price provider errors', async () => {
      const priceProvider = mockObject<PriceProvider>({
        getLatestPrices: mockFn().rejectsWith(
          new Error('Price provider error'),
        ),
      })

      const configuration = mockConfiguration(['ethereum'])
      const deps = mockIndexerDeps({
        configurations: [configuration],
        priceProvider,
      })

      const indexer = new DaBeatPricesIndexer(deps)

      await expect(
        indexer.multiUpdate(100, 200, [configuration]),
      ).toBeRejectedWith('Price provider error')
    })
  })

  describe(DaBeatPricesIndexer.prototype.removeData.name, () => {
    it('deletes records by coingecko ids', async () => {
      const currentPriceRepository = mockObject<Database['currentPrice']>({
        deleteByCoingeckoIds: mockFn().resolvesTo(5),
      })

      const configuration = mockConfiguration(['ethereum', 'bitcoin'])
      const deps = mockIndexerDeps({
        configurations: [configuration],
        currentPriceRepository,
      })

      const indexer = new DaBeatPricesIndexer(deps)

      await indexer.removeData([{ id: 'config1', from: 100, to: 200 }])

      expect(
        currentPriceRepository.deleteByCoingeckoIds,
      ).toHaveBeenOnlyCalledWith(['ethereum', 'bitcoin'])
    })

    it('throws error when multiple configurations provided', async () => {
      const deps = mockIndexerDeps({
        configurations: [mockConfiguration(['ethereum'])],
      })

      const indexer = new DaBeatPricesIndexer(deps)

      await expect(
        indexer.removeData([
          { id: 'config1', from: 100, to: 200 },
          { id: 'config2', from: 300, to: 400 },
        ]),
      ).toBeRejectedWith('Assertion Error')
    })
  })
})

interface MockIndexerDepsOptions {
  configurations?: Configuration<{ coingeckoIds: string[] }>[]
  priceProvider?: PriceProvider
  currentPriceRepository?: Database['currentPrice']
}

function mockIndexerDeps(options: MockIndexerDepsOptions = {}): Omit<
  ManagedMultiIndexerOptions<{ coingeckoIds: string[] }>,
  'name'
> & {
  priceProvider: PriceProvider
} {
  const defaultConfiguration = mockConfiguration(['ethereum'])

  return {
    configurations: options.configurations ?? [defaultConfiguration],
    priceProvider: options.priceProvider ?? mockObject<PriceProvider>(),
    db: mockDatabase({
      currentPrice:
        options.currentPriceRepository ??
        mockObject<Database['currentPrice']>(),
    }),
    logger: Logger.SILENT,
    parents: [],
    indexerService: mockObject<IndexerService>(),
  }
}

function mockConfiguration(coingeckoIds: string[], id = 'config1') {
  return {
    id,
    minHeight: 0,
    maxHeight: null,
    properties: {
      coingeckoIds,
    },
  }
}
