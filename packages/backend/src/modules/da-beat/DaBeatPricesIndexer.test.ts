import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { CoingeckoClient } from '@l2beat/shared'
import type { Configuration } from '@l2beat/shared-pure'
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
    it('fetches prices from coingecko and saves to database', async () => {
      const coingeckoResponse = [
        { id: 'ethereum', current_price: 2500.5 },
        { id: 'bitcoin', current_price: 45000.75 },
      ]

      const coingeckoClient = mockObject<CoingeckoClient>({
        query: mockFn().resolvesTo(coingeckoResponse),
      })

      const currentPriceRepository = mockObject<Database['currentPrice']>({
        upsertMany: mockFn().resolvesTo(undefined),
      })

      const configuration = mockConfiguration(['ethereum', 'bitcoin'])
      const deps = mockIndexerDeps({
        configurations: [configuration],
        coingeckoClient,
        currentPriceRepository,
      })

      const indexer = new DaBeatPricesIndexer(deps)

      const updateFn = await indexer.multiUpdate(100, 200, [configuration])
      const result = await updateFn()

      expect(coingeckoClient.query).toHaveBeenOnlyCalledWith('/coins/markets', {
        vs_currency: 'usd',
        ids: 'ethereum,bitcoin',
      })

      expect(currentPriceRepository.upsertMany).toHaveBeenOnlyCalledWith([
        { coingeckoId: 'ethereum', priceUsd: 2500.5 },
        { coingeckoId: 'bitcoin', priceUsd: 45000.75 },
      ])

      expect(result).toEqual(200)
    })

    it('returns early when no prices found', async () => {
      const coingeckoClient = mockObject<CoingeckoClient>({
        query: mockFn().resolvesTo([]),
      })

      const currentPriceRepository = mockObject<Database['currentPrice']>({
        upsertMany: mockFn().resolvesTo(undefined),
      })

      const configuration = mockConfiguration(['ethereum'])
      const deps = mockIndexerDeps({
        configurations: [configuration],
        coingeckoClient,
        currentPriceRepository,
      })

      const indexer = new DaBeatPricesIndexer(deps)

      const updateFn = await indexer.multiUpdate(100, 200, [configuration])
      const result = await updateFn()

      expect(coingeckoClient.query).toHaveBeenOnlyCalledWith('/coins/markets', {
        vs_currency: 'usd',
        ids: 'ethereum',
      })

      expect(currentPriceRepository.upsertMany).not.toHaveBeenCalled()
      expect(result).toEqual(200)
    })

    it('throws error when too many coingecko ids provided', async () => {
      const manyIds = Array.from({ length: 101 }, (_, i) => `token${i}`)
      const configuration = mockConfiguration(manyIds)
      const deps = mockIndexerDeps({
        configurations: [configuration],
      })

      const indexer = new DaBeatPricesIndexer(deps)

      await expect(
        indexer.multiUpdate(100, 200, [configuration]),
      ).toBeRejectedWith('Too many ids')
    })

    it('handles malformed coingecko response', async () => {
      const coingeckoClient = mockObject<CoingeckoClient>({
        query: mockFn().resolvesTo([
          { id: 'ethereum' }, // Missing current_price
        ]),
      })

      const configuration = mockConfiguration(['ethereum'])
      const deps = mockIndexerDeps({
        configurations: [configuration],
        coingeckoClient,
      })

      const indexer = new DaBeatPricesIndexer(deps)

      await expect(
        indexer.multiUpdate(100, 200, [configuration]),
      ).toBeRejected()
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
  coingeckoClient?: CoingeckoClient
  currentPriceRepository?: Database['currentPrice']
}

function mockIndexerDeps(options: MockIndexerDepsOptions = {}): Omit<
  ManagedMultiIndexerOptions<{ coingeckoIds: string[] }>,
  'name'
> & {
  coingeckoClient: CoingeckoClient
} {
  const defaultConfiguration = mockConfiguration(['ethereum'])

  return {
    configurations: options.configurations || [defaultConfiguration],
    coingeckoClient: options.coingeckoClient || mockObject<CoingeckoClient>(),
    db: mockDatabase({
      currentPrice:
        options.currentPriceRepository ||
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
