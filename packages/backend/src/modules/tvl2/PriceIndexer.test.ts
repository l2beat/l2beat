import { Logger } from '@l2beat/backend-tools'
import {
  CoingeckoQueryService,
  MAX_DAYS_FOR_HOURLY_PRECISION,
} from '@l2beat/shared'
import {
  CoingeckoId,
  EthereumAddress,
  PriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { HourlyIndexer } from '../tracked-txs/HourlyIndexer'
import { PriceIndexer } from './PriceIndexer'
import { PriceRepository } from './repositories/PriceRepository'
import { SyncOptimizer } from './SyncOptimizer'

describe(PriceIndexer.name, () => {
  describe(PriceIndexer.prototype.update.name, () => {
    const token: PriceConfigEntry = {
      chain: 'ethereum',
      address: EthereumAddress.random(),
      type: 'coingecko',
      coingeckoId: CoingeckoId('dai'),
      sinceTimestamp: UnixTime.ZERO,
    }
    it('syncs prices in range', async () => {
      const from = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))
      const to = from.add(1, 'days')

      const pricesResponse = [
        {
          value: 1,
          timestamp: from,
          deltaMs: 0,
        },
        {
          value: 1,
          timestamp: from.add(1, 'seconds'),
          deltaMs: 0,
        },
        {
          value: 2,
          timestamp: to,
          deltaMs: 0,
        },
      ]
      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getUsdPriceHistoryHourly: async () => pricesResponse,
      })

      const pricesRepository = mockObject<PriceRepository>({
        addMany: async () => 0,
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        shouldTimestampBeSynced: mockFn()
          .returnsOnce(true)
          .returnsOnce(false)
          .returnsOnce(true),
      })

      const indexer = new PriceIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        coingeckoQueryService,
        mockObject<IndexerStateRepository>({}),
        pricesRepository,
        token,
        syncOptimizer,
      )

      const newSafeHeight = await indexer.update(from.toNumber(), to.toNumber())

      expect(
        coingeckoQueryService.getUsdPriceHistoryHourly,
      ).toHaveBeenOnlyCalledWith(
        token.coingeckoId,
        // "from" is treated as inclusive, we already have data for it
        from.add(1, 'hours'),
        to,
        undefined,
      )

      expect(pricesRepository.addMany).toHaveBeenCalledWith(
        [pricesResponse[0], pricesResponse[2]].map((p) => ({
          chain: token.chain,
          address: token.address,
          timestamp: p.timestamp,
          priceUsd: p.value,
        })),
      )

      expect(newSafeHeight).toEqual(to.toNumber())
    })

    it('splits range - takes MAX_DAYS_FOR_HOURLY_PRECISION into consideration', async () => {
      const from = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))
      const to = from.add(MAX_DAYS_FOR_HOURLY_PRECISION + 1, 'days')

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getUsdPriceHistoryHourly: async () => [],
      })

      const indexer = new PriceIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        coingeckoQueryService,
        mockObject<IndexerStateRepository>({}),
        mockObject<PriceRepository>({
          addMany: async () => 0,
        }),
        token,
        mockObject<SyncOptimizer>({
          shouldTimestampBeSynced: mockFn().returns(true),
        }),
      )

      const newSafeHeight = await indexer.update(from.toNumber(), to.toNumber())

      expect(
        coingeckoQueryService.getUsdPriceHistoryHourly,
      ).toHaveBeenOnlyCalledWith(
        token.coingeckoId,
        // "from" is treated as inclusive, we already have data for it
        from.add(1, 'hours'),
        from
          .add(1, 'hours')
          .add(CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL, 'days'),
        undefined,
      )

      expect(newSafeHeight).toEqual(
        from
          .add(1, 'hours')
          .add(CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL, 'days')
          .toNumber(),
      )
    })
  })

  describe(PriceIndexer.prototype.initialize.name, () => {
    it('initialize state when not initialized', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => undefined,
        add: async () => '',
      })

      const token = mockObject<PriceConfigEntry>({
        chain: 'ethereum',
        address: EthereumAddress.random(),
        sinceTimestamp: UnixTime.fromDate(new Date('2021-01-01T00:00:00Z')),
      })

      const indexer = new PriceIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<CoingeckoQueryService>({}),
        stateRepository,
        mockObject<PriceRepository>({}),
        token,
        mockObject<SyncOptimizer>({}),
      )

      await indexer.initialize()

      expect(stateRepository.add).toHaveBeenCalledWith({
        indexerId: indexer.indexerId,
        safeHeight: 0,
        minTimestamp: token.sinceTimestamp,
      })
    })

    it('throw when there is an intent to change minTimestamp', async () => {
      const indexerState = {
        indexerId: 'indexer',
        safeHeight: 1,
        minTimestamp: UnixTime.ZERO,
      }

      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => {
          return indexerState
        },
      })

      const newToken = {
        chain: 'ethereum',
        address: EthereumAddress.random(),
        sinceTimestamp: indexerState.minTimestamp.add(-1, 'days'),
      }

      const indexer = new PriceIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<CoingeckoQueryService>({}),
        stateRepository,
        mockObject<PriceRepository>({}),
        mockObject<PriceConfigEntry>(newToken),
        mockObject<SyncOptimizer>({}),
      )

      await expect(() => indexer.initialize()).toBeRejectedWith(
        'Minimum timestamp of this indexer cannot be updated',
      )
    })
  })

  describe(PriceIndexer.prototype.getSafeHeight.name, () => {
    it('return state from DB', async () => {
      const safeHeight = 1
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => {
          return {
            indexerId: 'indexer',
            safeHeight,
            minTimestamp: UnixTime.ZERO,
          }
        },
      })

      const indexer = new PriceIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<CoingeckoQueryService>({}),
        stateRepository,
        mockObject<PriceRepository>({}),
        mockObject<PriceConfigEntry>({
          chain: 'chain',
          address: EthereumAddress.random(),
        }),
        mockObject<SyncOptimizer>({}),
      )

      const result = await indexer.getSafeHeight()

      expect(result).toEqual(safeHeight)
      expect(stateRepository.findIndexerState).toHaveBeenCalledWith(
        indexer.indexerId,
      )
    })
  })

  describe(PriceIndexer.prototype.setSafeHeight.name, () => {
    it('save safeHeight to DB', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        setSafeHeight: async () => 1,
      })

      const token = mockObject<PriceConfigEntry>({
        chain: 'ethereum',
        address: EthereumAddress.random(),
        sinceTimestamp: UnixTime.ZERO,
      })

      const indexer = new PriceIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<CoingeckoQueryService>({}),
        stateRepository,
        mockObject<PriceRepository>({}),
        token,
        mockObject<SyncOptimizer>({}),
      )

      const safeHeight = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))
      const trx = mockObject<Knex.Transaction>()
      await indexer.setSafeHeight(safeHeight.toNumber(), trx)

      expect(stateRepository.setSafeHeight).toHaveBeenCalledWith(
        indexer.indexerId,
        safeHeight.toNumber(),
        trx,
      )
    })
  })

  describe(PriceIndexer.prototype.invalidate.name, () => {
    it('deletes records before targetHeight and returns the new safe height', async () => {
      const pricesRepository = mockObject<PriceRepository>({
        deleteAfterExclusive: async () => 1,
      })
      const token = mockObject<PriceConfigEntry>({
        chain: 'ethereum',
        address: EthereumAddress.random(),
      })
      const indexer = new PriceIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<CoingeckoQueryService>({}),
        mockObject<IndexerStateRepository>({}),
        pricesRepository,
        token,
        mockObject<SyncOptimizer>({}),
      )

      const targetHeight = 10
      const newSafeHeight = await indexer.invalidate(targetHeight)

      expect(pricesRepository.deleteAfterExclusive).toHaveBeenCalledWith(
        token.chain,
        token.address,
        new UnixTime(targetHeight),
      )
      expect(newSafeHeight).toEqual(targetHeight)
    })
  })
})
