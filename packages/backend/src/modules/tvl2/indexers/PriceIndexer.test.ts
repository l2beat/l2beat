import { Logger } from '@l2beat/backend-tools'
import {
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { mockDbMiddleware } from '../../../tools/uif/multi/MultiIndexer.test'
import {
  removal,
  update,
} from '../../../tools/uif/multi/test/mockConfigurations'
import {
  DatabaseMiddleware,
  RemovalConfiguration,
  UpdateConfiguration,
} from '../../../tools/uif/multi/types'
import { PriceRecord, PriceRepository } from '../repositories/PriceRepository'
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

      const priceRepository = mockObject<PriceRepository>({
        addMany: async () => 1,
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        shouldTimestampBeSynced: (t: UnixTime) => !(t.toNumber() % 100),
      })

      const indexer = new PriceIndexer({
        priceRepository,
        parents: [],
        priceService,
        syncOptimizer,
        coingeckoId: CoingeckoId('id'),
        indexerService: mockObject<IndexerService>({}),
        configurations: [],
        logger: Logger.SILENT,
        encode: () => '',
        decode: () => mockObject<CoingeckoPriceConfigEntry>(),
        createDatabaseMiddleware: async () =>
          mockObject<DatabaseMiddleware>({}),
      })

      const parameters = {
        coingeckoId: CoingeckoId('id'),
      }
      const configurations: UpdateConfiguration<CoingeckoPriceConfigEntry>[] = [
        update<CoingeckoPriceConfigEntry>('a', 100, null, false, parameters),
        update<CoingeckoPriceConfigEntry>('b', 100, null, false, parameters),
        update<CoingeckoPriceConfigEntry>('c', 100, null, true, parameters),
      ]

      const safeHeight = await indexer.multiUpdate(
        from,
        to,
        configurations,
        mockDbMiddleware,
      )

      expect(priceService.getAdjustedTo).toHaveBeenOnlyCalledWith(from, to)

      expect(priceService.fetchPrices).toHaveBeenOnlyCalledWith(
        new UnixTime(from),
        new UnixTime(adjustedTo),
        parameters.coingeckoId,
        configurations.slice(0, 2),
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
        undefined,
      )

      expect(safeHeight).toEqual(adjustedTo)
    })

    it('returns to if no configurations to sync', async () => {
      const from = 100
      const to = 300

      const indexer = new PriceIndexer({
        priceRepository: mockObject<PriceRepository>({}),
        parents: [],
        priceService: mockObject<PriceService>({}),
        syncOptimizer: mockObject<SyncOptimizer>({}),
        coingeckoId: CoingeckoId('id'),
        indexerService: mockObject<IndexerService>({}),
        configurations: [],
        logger: Logger.SILENT,
        encode: () => '',
        decode: () => mockObject<CoingeckoPriceConfigEntry>(),
        createDatabaseMiddleware: async () =>
          mockObject<DatabaseMiddleware>({}),
      })

      const parameters = {
        coingeckoId: CoingeckoId('id'),
      }
      const configurations: UpdateConfiguration<CoingeckoPriceConfigEntry>[] = [
        update<CoingeckoPriceConfigEntry>('a', 100, null, true, parameters),
        update<CoingeckoPriceConfigEntry>('c', 100, null, true, parameters),
      ]

      const safeHeight = await indexer.multiUpdate(
        from,
        to,
        configurations,
        mockDbMiddleware,
      )

      expect(safeHeight).toEqual(to)
    })
  })

  describe(PriceIndexer.prototype.removeData.name, () => {
    it('removes data for configurations', async () => {
      const priceRepository = mockObject<PriceRepository>({
        deleteByConfigInTimeRange: async () => 1,
      })

      const indexer = new PriceIndexer({
        priceRepository,
        parents: [],
        priceService: mockObject<PriceService>({}),
        syncOptimizer: mockObject<SyncOptimizer>({}),
        coingeckoId: CoingeckoId('id'),
        indexerService: mockObject<IndexerService>({}),
        configurations: [],
        logger: Logger.SILENT,
        encode: () => '',
        decode: () => mockObject<CoingeckoPriceConfigEntry>(),
        createDatabaseMiddleware: async () =>
          mockObject<DatabaseMiddleware>({}),
      })

      const configurations: RemovalConfiguration<CoingeckoPriceConfigEntry>[] =
        [
          removal<CoingeckoPriceConfigEntry>('a', 100, 200),
          removal<CoingeckoPriceConfigEntry>('b', 200, 300),
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
