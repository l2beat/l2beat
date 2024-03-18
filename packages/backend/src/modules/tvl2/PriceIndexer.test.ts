import { Logger } from '@l2beat/backend-tools'
import { CoingeckoQueryService } from '@l2beat/shared'
import {
  CoingeckoId,
  EthereumAddress,
  PriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { HourlyIndexer } from '../liveness/HourlyIndexer'
import { PriceIndexer } from './PriceIndexer'
import { PricesRepository } from './repositories/PricesRepository'
import { SyncOptimizer } from './SyncOptimizer'

describe(PriceIndexer.name, () => {
  describe(PriceIndexer.prototype.update.name, () => {
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

      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => {
          return {
            indexerId: 'indexer',
            safeHeight: from.toNumber(),
            minTimestamp: UnixTime.ZERO,
          }
        },
        setSafeHeight: async () => 1,
      })

      const pricesRepository = mockObject<PricesRepository>({
        addMany: async () => 0,
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returnsOnce(from).returnsOnce(to),
        shouldTimestampBeSynced: mockFn()
          .returnsOnce(true)
          .returnsOnce(false)
          .returnsOnce(true),
      })

      const token: PriceConfigEntry = {
        chain: 'ethereum',
        address: EthereumAddress.random(),
        type: 'coingecko',
        coingeckoId: CoingeckoId('dai'),
        sinceTimestamp: UnixTime.ZERO,
      }

      const indexer = new PriceIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        coingeckoQueryService,
        stateRepository,
        pricesRepository,
        token,
        syncOptimizer,
      )

      const newSafeHeight = await indexer.update(from.toNumber(), to.toNumber())

      expect(syncOptimizer.getTimestampToSync).toHaveBeenNthCalledWith(
        1,
        from,
        'from',
      )
      expect(syncOptimizer.getTimestampToSync).toHaveBeenLastCalledWith(
        to,
        'to',
      )

      expect(
        coingeckoQueryService.getUsdPriceHistoryHourly,
      ).toHaveBeenOnlyCalledWith(
        token.coingeckoId,
        from,
        to,
        token.address as EthereumAddress,
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

    it('immediately return when sync scheduled before minimum timestamp', async () => {
      const from = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returns(from),
      })

      const indexer = new PriceIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<CoingeckoQueryService>({}),
        mockObject<IndexerStateRepository>({}),
        mockObject<PricesRepository>({}),
        mockObject<PriceConfigEntry>({
          chain: 'ethereum',
          address: EthereumAddress.random(),
        }),
        syncOptimizer,
      )

      const fromBeforeMinTimestamp = 0

      const newSafeHeight = await indexer.update(
        fromBeforeMinTimestamp,
        fromBeforeMinTimestamp + 1,
      )

      expect(syncOptimizer.getTimestampToSync).toHaveBeenNthCalledWith(
        1,
        new UnixTime(fromBeforeMinTimestamp),
        'from',
      )

      expect(newSafeHeight).toEqual(fromBeforeMinTimestamp + 1)
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
        sinceTimestamp: UnixTime.ZERO,
      })

      const indexer = new PriceIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<CoingeckoQueryService>({}),
        stateRepository,
        mockObject<PricesRepository>({}),
        token,
        mockObject<SyncOptimizer>({}),
      )

      await indexer.initialize()

      expect(stateRepository.add).toHaveBeenCalledWith({
        indexerId: indexer.indexerId,
        safeHeight: token.sinceTimestamp.toNumber(),
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
        mockObject<PricesRepository>({}),
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
        mockObject<PricesRepository>({}),
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
    it('save minTimestamp if safeHeight is before minTimestamp', async () => {
      const now = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

      const stateRepository = mockObject<IndexerStateRepository>({
        setSafeHeight: async () => 1,
      })

      const token = mockObject<PriceConfigEntry>({
        chain: 'ethereum',
        address: EthereumAddress.random(),
        sinceTimestamp: now.add(1, 'days'),
      })

      const indexer = new PriceIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<CoingeckoQueryService>({}),
        stateRepository,
        mockObject<PricesRepository>({}),
        token,
        mockObject<SyncOptimizer>({}),
      )

      const trx = mockObject<Knex.Transaction>()
      await indexer.setSafeHeight(now.toNumber(), trx)

      expect(stateRepository.setSafeHeight).toHaveBeenCalledWith(
        indexer.indexerId,
        token.sinceTimestamp.toNumber(),
        trx,
      )
    })
  })

  describe(PriceIndexer.prototype.invalidate.name, () => {
    it('deletes records before targetHeight and returns the new safe height', async () => {
      const pricesRepository = mockObject<PricesRepository>({
        deleteBeforeInclusive: async () => 1,
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

      expect(pricesRepository.deleteBeforeInclusive).toHaveBeenCalledWith(
        token.chain,
        token.address,
        new UnixTime(targetHeight),
      )
      expect(newSafeHeight).toEqual(targetHeight)
    })
  })
})
