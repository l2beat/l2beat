import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { CoingeckoQueryService } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IndexerService } from '../../../../../tools/uif/IndexerService'
import {
  ETHEREUM_COINGECKO_ID,
  L2CostsPricesIndexer,
  type L2CostsPricesIndexerDeps,
} from './L2CostsPricesIndexer'

const NOW = UnixTime(1714662000)

describe(L2CostsPricesIndexer.name, () => {
  describe(L2CostsPricesIndexer.prototype.update.name, () => {
    it('updates correctly', async () => {
      const from = NOW - 1 * UnixTime.HOUR
      const to = NOW

      const repository = mockObject<Database['l2CostPrice']>({
        insertMany: mockFn().resolvesTo(1),
      })

      const indexer = createIndexer({
        db: mockObject<Database>({
          l2CostPrice: repository,
        }),
      })

      const prices = [{ timestamp: from, priceUsd: 3000 }]
      const fetchPricesMock = mockFn().resolvesTo(prices)
      indexer.fetchPrices = fetchPricesMock

      const result = await indexer.update(from, to)

      expect(fetchPricesMock).toHaveBeenCalledWith(from, to)

      expect(repository.insertMany).toHaveBeenCalledWith(prices)

      expect(result).toEqual(to)
    })

    it('does nothing if no prices to save', async () => {
      const from = NOW - 1 * UnixTime.HOUR
      const to = NOW

      const repository = mockObject<Database['l2CostPrice']>({
        insertMany: mockFn().resolvesTo(0),
      })

      const indexer = createIndexer({
        tags: { tag: 'update-nothing-to-save' },
        db: mockObject<Database>({
          l2CostPrice: repository,
        }),
      })

      const fetchPricesMock = mockFn().resolvesTo([])
      indexer.fetchPrices = fetchPricesMock

      const result = await indexer.update(from, to)

      expect(fetchPricesMock).toHaveBeenCalledWith(from, to)

      expect(repository.insertMany).not.toHaveBeenCalled()

      expect(result).toEqual(to)
    })

    it('shifts from if time range greater than MAX_DAYS_FOR_ONE_CALL', async () => {
      const from =
        NOW -
        CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL * UnixTime.DAY -
        1 * UnixTime.HOUR
      const to = NOW
      const shiftedTo =
        from + CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL * UnixTime.DAY

      const repository = mockObject<Database['l2CostPrice']>({
        insertMany: mockFn().resolvesTo(1),
      })

      const indexer = createIndexer({
        tags: { tag: 'update-max-range' },
        db: mockObject<Database>({
          l2CostPrice: repository,
        }),
      })

      const prices = [{ timestamp: from, priceUsd: 3000 }]
      const fetchPricesMock = mockFn().resolvesTo(prices)
      indexer.fetchPrices = fetchPricesMock

      const result = await indexer.update(from, to)

      expect(fetchPricesMock).toHaveBeenCalledWith(from, shiftedTo)

      expect(result).toEqual(shiftedTo)
    })
  })

  describe(L2CostsPricesIndexer.prototype.fetchPrices.name, () => {
    it('fetches prices', async () => {
      const from = NOW - 1 * UnixTime.HOUR
      const to = NOW

      const prices = [{ timestamp: from, value: 3000 }]
      const coingeckoQueryServiceMock = mockObject<CoingeckoQueryService>({
        getUsdPriceHistoryHourly: mockFn().resolvesTo(prices),
      })

      const indexer = createIndexer({
        tags: { tag: 'fetchPrices' },
        coingeckoQueryService: coingeckoQueryServiceMock,
      })

      const result = await indexer.fetchPrices(from, to)

      expect(
        coingeckoQueryServiceMock.getUsdPriceHistoryHourly,
      ).toHaveBeenCalledWith(ETHEREUM_COINGECKO_ID, from, to)

      expect(result).toEqual([
        {
          timestamp: from,
          priceUsd: 3000,
        },
      ])
    })
  })

  describe(L2CostsPricesIndexer.prototype.invalidate.name, () => {
    it('deletes records', async () => {
      const repository = mockObject<Database['l2CostPrice']>({
        deleteAfter: mockFn().resolvesTo(NOW),
      })

      const indexer = createIndexer({
        tags: { tag: 'invalidate' },
        db: mockObject<Database>({
          l2CostPrice: repository,
        }),
      })

      const result = await indexer.invalidate(NOW)

      expect(repository.deleteAfter).toHaveBeenCalledWith(NOW)

      expect(result).toEqual(NOW)
    })
  })
})

function createIndexer(deps?: Partial<L2CostsPricesIndexerDeps>) {
  return new L2CostsPricesIndexer({
    indexerService: mockObject<IndexerService>(),
    logger: Logger.SILENT,
    minHeight: 0,
    parents: [],
    db: mockObject<Database>({
      l2CostPrice: mockObject<Database['l2CostPrice']>({
        insertMany: mockFn().resolvesTo(1),
      }),
    }),
    coingeckoQueryService: mockObject<CoingeckoQueryService>({
      getUsdPriceHistoryHourly: mockFn().resolvesTo([]),
    }),
    ...deps,
  })
}
