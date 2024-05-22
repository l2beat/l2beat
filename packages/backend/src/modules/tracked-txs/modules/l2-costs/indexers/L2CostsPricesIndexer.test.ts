import { Logger } from '@l2beat/backend-tools'
import { CoingeckoQueryService } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import { L2CostsPricesRepository } from '../repositories/L2CostsPricesRepository'
import {
  ETHEREUM_COINGECKO_ID,
  L2CostsPricesIndexer,
  L2CostsPricesIndexerDeps,
} from './L2CostsPricesIndexer'

const NOW = new UnixTime(1714662000)

describe(L2CostsPricesIndexer.name, () => {
  describe(L2CostsPricesIndexer.prototype.update.name, () => {
    it('updates correctly', async () => {
      const from = NOW.add(-1, 'hours')
      const to = NOW

      const l2CostsPricesRepositoryMock = mockObject<L2CostsPricesRepository>({
        addMany: mockFn().resolvesTo(1),
      })

      const indexer = createIndexer({
        l2CostsPricesRepository: l2CostsPricesRepositoryMock,
      })

      const prices = [{ timestamp: from, priceUsd: 3000 }]
      const fetchPricesMock = mockFn().resolvesTo(prices)
      indexer.fetchPrices = fetchPricesMock

      const result = await indexer.update(from.toNumber(), to.toNumber())

      expect(fetchPricesMock).toHaveBeenCalledWith(from, to)

      expect(l2CostsPricesRepositoryMock.addMany).toHaveBeenCalledWith(prices)

      expect(result).toEqual(to.toNumber())
    })

    it('does nothing if no prices to save', async () => {
      const from = NOW.add(-1, 'hours')
      const to = NOW

      const l2CostsPricesRepositoryMock = mockObject<L2CostsPricesRepository>({
        addMany: mockFn().resolvesTo(0),
      })

      const indexer = createIndexer({
        tag: 'update-nothing-to-save',
        l2CostsPricesRepository: l2CostsPricesRepositoryMock,
      })

      const fetchPricesMock = mockFn().resolvesTo([])
      indexer.fetchPrices = fetchPricesMock

      const result = await indexer.update(from.toNumber(), to.toNumber())

      expect(fetchPricesMock).toHaveBeenCalledWith(from, to)

      expect(l2CostsPricesRepositoryMock.addMany).not.toHaveBeenCalled()

      expect(result).toEqual(to.toNumber())
    })

    it('shifts from if time range greather than MAX_DAYS_FOR_ONE_CALL', async () => {
      const from = NOW.add(
        -CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL,
        'days',
      ).add(-1, 'hours')
      const to = NOW
      const shiftedTo = from.add(
        CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL,
        'days',
      )

      const l2CostsPricesRepositoryMock = mockObject<L2CostsPricesRepository>({
        addMany: mockFn().resolvesTo(1),
      })

      const indexer = createIndexer({
        tag: 'update-max-rane',
        l2CostsPricesRepository: l2CostsPricesRepositoryMock,
      })

      const prices = [{ timestamp: from, priceUsd: 3000 }]
      const fetchPricesMock = mockFn().resolvesTo(prices)
      indexer.fetchPrices = fetchPricesMock

      const result = await indexer.update(from.toNumber(), to.toNumber())

      expect(fetchPricesMock).toHaveBeenCalledWith(from, shiftedTo)

      expect(result).toEqual(shiftedTo.toNumber())
    })
  })

  describe(L2CostsPricesIndexer.prototype.fetchPrices.name, () => {
    it('fetches prices', async () => {
      const from = NOW.add(-1, 'hours')
      const to = NOW

      const prices = [{ timestamp: from, value: 3000 }]
      const coingeckoQueryServiceMock = mockObject<CoingeckoQueryService>({
        getUsdPriceHistoryHourly: mockFn().resolvesTo(prices),
      })

      const indexer = createIndexer({
        tag: 'fetchPrices',
        coingeckoQueryService: coingeckoQueryServiceMock,
      })

      const result = await indexer.fetchPrices(from, to)

      expect(
        coingeckoQueryServiceMock.getUsdPriceHistoryHourly,
      ).toHaveBeenCalledWith(ETHEREUM_COINGECKO_ID, from, to, undefined)

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
      const l2CostsPricesRepositoryMock = mockObject<L2CostsPricesRepository>({
        deleteAfter: mockFn().resolvesTo(NOW.toNumber()),
      })

      const indexer = createIndexer({
        tag: 'invalidate',
        l2CostsPricesRepository: l2CostsPricesRepositoryMock,
      })

      const result = await indexer.invalidate(NOW.toNumber())

      expect(l2CostsPricesRepositoryMock.deleteAfter).toHaveBeenCalledWith(NOW)

      expect(result).toEqual(NOW.toNumber())
    })
  })
})

function createIndexer(deps?: Partial<L2CostsPricesIndexerDeps>) {
  return new L2CostsPricesIndexer({
    indexerService: mockObject<IndexerService>(),
    logger: Logger.SILENT,
    minHeight: 0,
    parents: [],
    l2CostsPricesRepository: mockObject<L2CostsPricesRepository>({
      addMany: mockFn().resolvesTo(1),
    }),
    coingeckoQueryService: mockObject<CoingeckoQueryService>({
      getUsdPriceHistoryHourly: mockFn().resolvesTo([]),
    }),
    ...deps,
  })
}
