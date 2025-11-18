import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { PriceProvider } from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../../tools/uif/ids'
import { InteropRecentPricesIndexer } from './InteropRecentPricesIndexer'

describe(InteropRecentPricesIndexer.name, () => {
  describe(InteropRecentPricesIndexer.prototype.update.name, () => {
    it('updates successfully when full hour is in range', async () => {
      const repository = mockObject<Database['interopRecentPrices']>({
        insertMany: async () => 0,
      })
      const priceProvider = mockObject<PriceProvider>({
        getAllCoingeckoIds: async () => [
          CoingeckoId('bitcoin'),
          CoingeckoId('ethereum'),
          CoingeckoId(
            'very-long-token-name-that-exceeds-64-characters-and-should-be-filtered',
          ),
        ],
        getLatestPrices: async () =>
          new Map([
            ['bitcoin', 50000],
            ['ethereum', 3000],
          ]),
      })
      const indexer = mockIndexer(repository, priceProvider)

      const from = UnixTime.fromDate(new Date('2025-10-10T13:01:00Z'))
      const to = UnixTime.fromDate(new Date('2025-10-10T14:30:00Z'))

      const result = await indexer.update(from, to)

      expect(result).toEqual(to)
      expect(priceProvider.getAllCoingeckoIds).toHaveBeenCalledTimes(1)
      expect(priceProvider.getLatestPrices).toHaveBeenCalledWith([
        CoingeckoId('bitcoin'),
        CoingeckoId('ethereum'),
      ])
      expect(repository.insertMany).toHaveBeenCalledWith([
        {
          coingeckoId: 'bitcoin',
          priceUsd: 50000,
          timestamp: UnixTime.fromDate(new Date('2025-10-10T14:00:00Z')),
        },
        {
          coingeckoId: 'ethereum',
          priceUsd: 3000,
          timestamp: UnixTime.fromDate(new Date('2025-10-10T14:00:00Z')),
        },
      ])
    })

    it('skips update when no full hour in range', async () => {
      const repository = mockObject<Database['interopRecentPrices']>({
        insertMany: async () => 0,
      })
      const priceProvider = mockObject<PriceProvider>({
        getAllCoingeckoIds: async () => [],
        getLatestPrices: async () => new Map(),
      })
      const indexer = mockIndexer(repository, priceProvider)

      const from = UnixTime.fromDate(new Date('2025-10-10T13:01:00Z'))
      const to = UnixTime.fromDate(new Date('2025-10-10T13:59:00Z'))

      const result = await indexer.update(from, to)

      expect(result).toEqual(to)
      expect(priceProvider.getAllCoingeckoIds).not.toHaveBeenCalled()
      expect(priceProvider.getLatestPrices).not.toHaveBeenCalled()
      expect(repository.insertMany).not.toHaveBeenCalled()
    })
  })

  describe(
    InteropRecentPricesIndexer.prototype.findFullHourInRange.name,
    () => {
      const indexer = mockIndexer()
      const start = UnixTime.fromDate(new Date('2025-10-10T13:00:00Z'))

      it('one full hour in range', () => {
        const from = start + UnixTime.MINUTE
        const to = start + UnixTime.HOUR

        const result = indexer.findFullHourInRange(from, to)
        expect(result).toEqual(
          UnixTime.fromDate(new Date('2025-10-10T14:00:00Z')),
        )
      })

      it('two full hours in range, gets latest', () => {
        const from = start + UnixTime.MINUTE
        const to = start + 2 * UnixTime.HOUR

        const result = indexer.findFullHourInRange(from, to)
        expect(result).toEqual(
          UnixTime.fromDate(new Date('2025-10-10T15:00:00Z')),
        )
      })

      it('full hour before range', () => {
        const from = start + UnixTime.MINUTE
        const to = start + 59 * UnixTime.MINUTE

        const result = indexer.findFullHourInRange(from, to)
        expect(result).toEqual(undefined)
      })
    },
  )

  describe(InteropRecentPricesIndexer.prototype.invalidate.name, () => {
    it('deletes records after target height', async () => {
      const repository = mockObject<Database['interopRecentPrices']>({
        deleteAfter: async () => 5,
      })
      const indexer = mockIndexer(repository)

      const targetHeight = UnixTime.fromDate(new Date('2025-10-10T14:00:00Z'))
      const result = await indexer.invalidate(targetHeight)

      expect(result).toEqual(5)
      expect(repository.deleteAfter).toHaveBeenCalledWith(targetHeight)
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function mockIndexer(
  repository?: Database['interopRecentPrices'],
  priceProvider?: PriceProvider,
) {
  return new InteropRecentPricesIndexer({
    db: mockObject<Database>({ interopRecentPrices: repository }),
    priceProvider: priceProvider ?? mockObject<PriceProvider>({}),
    parents: [],
    minHeight: 1,
    indexerService: mockObject<IndexerService>({}),
    logger: Logger.SILENT,
  })
}
