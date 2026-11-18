import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { CoingeckoQueryService } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IndexerService } from '../../../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../../../tools/uif/ids'
import {
  ETHEREUM_COINGECKO_ID,
  L2CostsPricesIndexer,
  type L2CostsPricesIndexerDeps,
} from './L2CostsPricesIndexer'

const NOW = UnixTime(1714662000)

describe(L2CostsPricesIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(L2CostsPricesIndexer.prototype.update.name, () => {
    it('saves hourly ETH prices from Coingecko', async () => {
      const from = NOW - 1 * UnixTime.HOUR
      const to = NOW

      const repository = mockObject<Database['l2CostPrice']>({
        insertMany: mockFn().resolvesTo(1),
      })
      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getUsdPriceHistoryHourly: mockFn().resolvesTo([
          { timestamp: from, value: 3000 },
        ]),
      })

      const indexer = createIndexer({
        db: mockObject<Database>({
          l2CostPrice: repository,
        }),
        coingeckoQueryService,
      })

      const result = await indexer.update(from, to)

      expect(
        coingeckoQueryService.getUsdPriceHistoryHourly,
      ).toHaveBeenCalledWith(ETHEREUM_COINGECKO_ID, from, to)
      expect(repository.insertMany).toHaveBeenCalledWith([
        { timestamp: from, priceUsd: 3000 },
      ])
      expect(result).toEqual(to)
    })

    it('does nothing if no prices to save', async () => {
      const from = NOW - 1 * UnixTime.HOUR
      const to = NOW

      const repository = mockObject<Database['l2CostPrice']>({
        insertMany: mockFn().resolvesTo(0),
      })

      const indexer = createIndexer({
        db: mockObject<Database>({
          l2CostPrice: repository,
        }),
      })

      const result = await indexer.update(from, to)

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

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getUsdPriceHistoryHourly: mockFn().resolvesTo([
          { timestamp: from, value: 3000 },
        ]),
      })

      const indexer = createIndexer({ coingeckoQueryService })

      const result = await indexer.update(from, to)

      expect(
        coingeckoQueryService.getUsdPriceHistoryHourly,
      ).toHaveBeenCalledWith(ETHEREUM_COINGECKO_ID, from, shiftedTo)
      expect(result).toEqual(shiftedTo)
    })
  })

  describe(L2CostsPricesIndexer.prototype.invalidate.name, () => {
    it('deletes records', async () => {
      const repository = mockObject<Database['l2CostPrice']>({
        deleteAfter: mockFn().resolvesTo(NOW),
      })

      const indexer = createIndexer({
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
  return new L2CostsPricesIndexer(
    {
      indexerService: mockObject<IndexerService>(),
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
    },
    Logger.SILENT,
  )
}
