import { Logger } from '@l2beat/backend-tools'
import { Database, PriceRecord } from '@l2beat/database'
import {
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { MOCK_TRX, mockDatabase } from '../../../test/database'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import {
  actual,
  removal,
} from '../../../tools/uif/multi/test/mockConfigurations'
import {
  Configuration,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import { PriceService } from '../services/PriceService'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { PriceIndexer } from './PriceIndexer'

describe(PriceIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(PriceIndexer.prototype.multiUpdate.name, () => {
    it('fetches prices, optimizes and saves to DB', async () => {
      const from = 100
      const to = 300
      const adjustedTo = 200

      const priceService = mockObject<PriceService>({
        getAdjustedTo: () => new UnixTime(adjustedTo),
        fetchPrices: async () => [
          price('a', 100),
          price('a', 150), // will be filtered out, see syncOptimizer
          price('a', 200),
          price('b', 100),
          price('b', 150), // will be filtered out, see syncOptimizer
          price('b', 200),
        ],
      })

      const priceRepository = mockObject<Database['price']>({
        addMany: async () => 1,
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        shouldTimestampBeSynced: (t: UnixTime) => !(t.toNumber() % 100),
      })

      const indexer = new PriceIndexer({
        parents: [],
        priceService,
        syncOptimizer,
        coingeckoId: CoingeckoId('id'),
        indexerService: mockObject<IndexerService>({}),
        configurations: [],
        logger: Logger.SILENT,
        serializeConfiguration: () => '',
        db: mockDatabase({ price: priceRepository }),
      })

      const parameters = {
        coingeckoId: CoingeckoId('id'),
      }
      const configurations: Configuration<CoingeckoPriceConfigEntry>[] = [
        actual<CoingeckoPriceConfigEntry>('a', 100, null, parameters),
        actual<CoingeckoPriceConfigEntry>('b', 100, null, parameters),
      ]

      const safeHeight = await indexer.multiUpdate(
        from,
        to,
        configurations,
        MOCK_TRX,
      )

      expect(priceService.getAdjustedTo).toHaveBeenOnlyCalledWith(from, to)

      expect(priceService.fetchPrices).toHaveBeenOnlyCalledWith(
        new UnixTime(from),
        new UnixTime(adjustedTo),
        parameters.coingeckoId,
        configurations,
      )

      expect(
        syncOptimizer.shouldTimestampBeSynced.calls.map((c) => c.args[0]),
      ).toEqual([
        new UnixTime(100),
        new UnixTime(150),
        new UnixTime(200),
        new UnixTime(100),
        new UnixTime(150),
        new UnixTime(200),
      ])

      expect(priceRepository.addMany).toHaveBeenOnlyCalledWith(
        [price('a', 100), price('a', 200), price('b', 100), price('b', 200)],
        MOCK_TRX,
      )

      expect(safeHeight).toEqual(adjustedTo)
    })
  })

  describe(PriceIndexer.prototype.removeData.name, () => {
    it('removes data for configurations', async () => {
      const priceRepository = mockObject<Database['price']>({
        deleteByConfigInTimeRange: async () => 1,
      })

      const indexer = new PriceIndexer({
        parents: [],
        priceService: mockObject<PriceService>({}),
        syncOptimizer: mockObject<SyncOptimizer>({}),
        coingeckoId: CoingeckoId('id'),
        indexerService: mockObject<IndexerService>({}),
        configurations: [],
        logger: Logger.SILENT,
        serializeConfiguration: () => '',
        db: mockDatabase({ price: priceRepository }),
      })

      const configurations: RemovalConfiguration[] = [
        removal('a', 100, 200),
        removal('b', 200, 300),
      ]

      await indexer.removeData(configurations)

      expect(priceRepository.deleteByConfigInTimeRange).toHaveBeenNthCalledWith(
        1,
        'a',
        new UnixTime(100),
        new UnixTime(200),
      )

      expect(
        priceRepository.deleteByConfigInTimeRange,
      ).toHaveBeenLastCalledWith('b', new UnixTime(200), new UnixTime(300))
    })
  })
})

function price(configId: string, timestamp: number): PriceRecord {
  return {
    configId,
    timestamp: new UnixTime(timestamp),
    priceUsd: timestamp, // for simplicity it equals timestamp
  }
}
