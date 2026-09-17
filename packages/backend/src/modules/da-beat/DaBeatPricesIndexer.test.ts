import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { PriceProvider } from '@l2beat/shared'
import { CoingeckoId } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDatabase } from '../../test/database'
import type { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
} from '../../tools/uif/multi/types'
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

      expect(() => new DaBeatPricesIndexer(deps, Logger.SILENT)).toThrow(
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

      const priceProvider = {
        getLatestPrices: vi.fn().mockResolvedValue(pricesMap),
      } as unknown as PriceProvider

      const currentPriceRepository = {
        upsertMany: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['currentPrice']

      const configuration = mockConfiguration(['ethereum', 'bitcoin'])
      const deps = mockIndexerDeps({
        configurations: [configuration],
        priceProvider,
        currentPriceRepository,
      })

      const indexer = new DaBeatPricesIndexer(deps, Logger.SILENT)

      const updateFn = await indexer.multiUpdate(100, 200, [configuration])
      const result = await updateFn()

      expect(priceProvider.getLatestPrices).toHaveBeenCalledExactlyOnceWith([
        CoingeckoId('ethereum'),
        CoingeckoId('bitcoin'),
      ])

      expect(currentPriceRepository.upsertMany).toHaveBeenCalledExactlyOnceWith(
        [
          { coingeckoId: CoingeckoId('ethereum'), priceUsd: 2500.5 },
          { coingeckoId: CoingeckoId('bitcoin'), priceUsd: 45000.75 },
        ],
      )

      expect(result).toBe(200)
    })

    it('returns early when no prices found', async () => {
      const emptyPricesMap = new Map()

      const priceProvider = {
        getLatestPrices: vi.fn().mockResolvedValue(emptyPricesMap),
      } as unknown as PriceProvider

      const currentPriceRepository = {
        upsertMany: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['currentPrice']

      const configuration = mockConfiguration(['ethereum'])
      const deps = mockIndexerDeps({
        configurations: [configuration],
        priceProvider,
        currentPriceRepository,
      })

      const indexer = new DaBeatPricesIndexer(deps, Logger.SILENT)

      const updateFn = await indexer.multiUpdate(100, 200, [configuration])
      const result = await updateFn()

      expect(priceProvider.getLatestPrices).toHaveBeenCalledExactlyOnceWith([
        CoingeckoId('ethereum'),
      ])

      expect(currentPriceRepository.upsertMany).not.toHaveBeenCalled()
      expect(result).toBe(200)
    })

    it('handles price provider errors', async () => {
      const priceProvider = {
        getLatestPrices: vi
          .fn()
          .mockRejectedValue(new Error('Price provider error')),
      } as unknown as PriceProvider

      const configuration = mockConfiguration(['ethereum'])
      const deps = mockIndexerDeps({
        configurations: [configuration],
        priceProvider,
      })

      const indexer = new DaBeatPricesIndexer(deps, Logger.SILENT)

      await expect(
        indexer.multiUpdate(100, 200, [configuration]),
      ).rejects.toThrow('Price provider error')
    })
  })

  describe(DaBeatPricesIndexer.prototype.wipeData.name, () => {
    it('deletes records by coingecko ids', async () => {
      const currentPriceRepository = {
        deleteByCoingeckoIds: vi.fn().mockResolvedValue(5),
      } as unknown as Database['currentPrice']

      const configuration = mockConfiguration(['ethereum', 'bitcoin'])
      const deps = mockIndexerDeps({
        configurations: [configuration],
        currentPriceRepository,
      })

      const indexer = new DaBeatPricesIndexer(deps, Logger.SILENT)

      await indexer.wipeData([{ id: 'config1' }])

      expect(
        currentPriceRepository.deleteByCoingeckoIds,
      ).toHaveBeenCalledExactlyOnceWith(['ethereum', 'bitcoin'])
    })

    it('throws error when multiple configurations provided', async () => {
      const deps = mockIndexerDeps({
        configurations: [mockConfiguration(['ethereum'])],
      })

      const indexer = new DaBeatPricesIndexer(deps, Logger.SILENT)

      await expect(
        indexer.wipeData([{ id: 'config1' }, { id: 'config2' }]),
      ).rejects.toThrow('Assertion Error')
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
    priceProvider: options.priceProvider ?? ({} as unknown as PriceProvider),
    db: mockDatabase({
      currentPrice:
        options.currentPriceRepository ??
        ({} as unknown as Database['currentPrice']),
    }),
    parents: [],
    indexerService: {} as unknown as IndexerService,
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
