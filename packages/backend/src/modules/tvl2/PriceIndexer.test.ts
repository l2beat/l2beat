import { Logger } from '@l2beat/backend-tools'
import { CoingeckoQueryService } from '@l2beat/shared'
import {
  CoingeckoId,
  EthereumAddress,
  PriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { HourlyIndexer } from '../liveness/HourlyIndexer'
import { PriceIndexer } from './PriceIndexer'
import { PricesRepository } from './repositories/PricesRepository'
import { SyncService } from './SyncService'

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

      const syncService = mockObject<SyncService>({
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
        syncService,
      )

      const newSafeHeight = await indexer.update(from.toNumber(), to.toNumber())

      expect(syncService.getTimestampToSync).toHaveBeenNthCalledWith(
        1,
        'ethereum',
        from,
        'from',
      )
      expect(syncService.getTimestampToSync).toHaveBeenLastCalledWith(
        'ethereum',
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

    it('sync scheduled before minimum timestamp to sync', async () => {
      const from = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

      const syncService = mockObject<SyncService>({
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
        syncService,
      )

      const fromBeforeMinTimestamp = 0

      const newSafeHeight = await indexer.update(
        fromBeforeMinTimestamp,
        fromBeforeMinTimestamp + 1,
      )

      expect(syncService.getTimestampToSync).toHaveBeenNthCalledWith(
        1,
        'ethereum',
        new UnixTime(fromBeforeMinTimestamp),
        'from',
      )

      expect(newSafeHeight).toEqual(fromBeforeMinTimestamp + 1)
    })
  })
  describe(PriceIndexer.prototype.initialize.name, () => {
    // if indexer state is not initialized, it should be initialized
    // throw when there is an intent to change the minimum timestamp
  })
  describe(PriceIndexer.prototype.start.name, () => {
    // calls initialize and super.start
  })
  describe(PriceIndexer.prototype.getSafeHeight.name, () => {
    // returns the safe height from DB
  })
  describe(PriceIndexer.prototype.setSafeHeight.name, () => {
    // set safe height in DB
    // get minTimestamp if safe height is lower than minTimestamp
  })
  describe(PriceIndexer.prototype.invalidate.name, () => {
    // delete records before targetHeight and returns the new safe height
  })
})
