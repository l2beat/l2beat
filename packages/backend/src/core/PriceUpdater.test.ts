import { Logger } from '@l2beat/shared'
import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { setTimeout } from 'timers/promises'
import waitForExpect from 'wait-for-expect'

import { Token } from '../model'
import { CoingeckoQueryService } from '../peripherals/coingecko/CoingeckoQueryService'
import {
  PriceRecord,
  PriceRepository,
} from '../peripherals/database/PriceRepository'
import { Clock } from './Clock'
import { PriceUpdater } from './PriceUpdater'

describe(PriceUpdater.name, () => {
  const HOUR_09 = UnixTime.fromDate(new Date('2021-09-07T09:00:00Z'))
  const HOUR_10 = UnixTime.fromDate(new Date('2021-09-07T10:00:00Z'))
  const HOUR_11 = UnixTime.fromDate(new Date('2021-09-07T11:00:00Z'))
  const HOUR_12 = UnixTime.fromDate(new Date('2021-09-07T12:00:00Z'))
  const HOUR_13 = UnixTime.fromDate(new Date('2021-09-07T13:00:00Z'))

  describe(PriceUpdater.prototype.start.name, () => {
    it('triggers update now and on every new hour', async () => {
      const clock = mockObject<Clock>({
        onNewHour(callback) {
          callback(HOUR_10)
          callback(HOUR_11)
          return () => {}
        },
      })
      const priceUpdater = new PriceUpdater(
        mockObject<CoingeckoQueryService>(),
        mockObject<PriceRepository>(),
        clock,
        [],
        Logger.SILENT,
      )
      const update = mockFn<typeof priceUpdater.update>().resolvesTo(undefined)
      priceUpdater.update = update

      priceUpdater.start()

      await waitForExpect(() => {
        expect(update).toHaveBeenCalledTimes(3)
      })
    })
  })

  describe(PriceUpdater.prototype.getPricesWhenReady.name, () => {
    it('returns immediately if the data is available', async () => {
      const tokens = [fakeToken(AssetId.ETH)]
      const prices: PriceRecord[] = [
        { assetId: AssetId.ETH, priceUsd: 1000.0, timestamp: HOUR_10 },
      ]
      const priceRepository = mockObject<PriceRepository>({
        findDataBoundaries: mockFn().returns(
          new Map([[AssetId.ETH, { earliest: HOUR_10, latest: HOUR_12 }]]),
        ),
        getByTimestamp: async () => prices,
      })
      const clock = mockObject<Clock>({
        getFirstHour: () => HOUR_10,
        getLastHour: () => HOUR_12,
      })
      const priceUpdater = new PriceUpdater(
        mockObject<CoingeckoQueryService>(),
        priceRepository,
        clock,
        tokens,
        Logger.SILENT,
      )
      await priceUpdater.update()
      const result = await priceUpdater.getPricesWhenReady(HOUR_10)
      expect(result).toEqual(prices)
    })

    it('waits until data is available, then returns', async () => {
      const tokens = [fakeToken(AssetId.ETH)]
      const prices: PriceRecord[] = [
        { assetId: AssetId.ETH, priceUsd: 1000.0, timestamp: HOUR_10 },
      ]
      const priceRepository = mockObject<PriceRepository>({
        findDataBoundaries: mockFn().returns(
          new Map([[AssetId.ETH, { earliest: HOUR_10, latest: HOUR_12 }]]),
        ),
        getByTimestamp: async () => prices,
      })
      const clock = mockObject<Clock>({
        getFirstHour: () => HOUR_10,
        getLastHour: () => HOUR_12,
      })
      const priceUpdater = new PriceUpdater(
        mockObject<CoingeckoQueryService>(),
        priceRepository,
        clock,
        tokens,
        Logger.SILENT,
      )

      let result: unknown = undefined
      void priceUpdater.getPricesWhenReady(HOUR_10, 10).then((value) => {
        result = value
      })

      await setTimeout(20)
      expect(result).toEqual(undefined)

      await priceUpdater.update()

      await waitForExpect(() => {
        expect(result).toEqual(prices)
      })
    })
  })

  describe(PriceUpdater.prototype.update.name, () => {
    it('correctly calls updates', async () => {
      const tokens = [
        fakeToken(AssetId('uni-uniswap')),
        fakeToken(AssetId.ETH),
        fakeToken(AssetId.WETH),
      ]

      const priceRepository = mockObject<PriceRepository>({
        findDataBoundaries: mockFn().returns(
          new Map([
            [tokens[0].id, { earliest: HOUR_10, latest: HOUR_12 }],
            [tokens[1].id, { earliest: HOUR_09, latest: HOUR_12 }],
          ]),
        ),
        addMany: mockFn().returns([]),
      })

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returns([]),
      })

      const clock = mockObject<Clock>({
        getFirstHour: () => HOUR_09,
        getLastHour: () => HOUR_13,
      })

      const priceUpdater = new PriceUpdater(
        coingeckoQueryService,
        priceRepository,
        clock,
        tokens,
        Logger.SILENT,
      )

      await priceUpdater.update()
      expect(coingeckoQueryService.getUsdPriceHistory).toHaveBeenCalledTimes(4)
      expect(coingeckoQueryService.getUsdPriceHistory).toHaveBeenNthCalledWith(
        1,
        tokens[0].coingeckoId,
        HOUR_09.add(-7, 'days'),
        HOUR_09,
        'hourly',
        tokens[0].address,
      )
      expect(coingeckoQueryService.getUsdPriceHistory).toHaveBeenNthCalledWith(
        2,
        tokens[1].coingeckoId,
        HOUR_13.add(-7, 'days'),
        HOUR_13,
        'hourly',
        tokens[1].address,
      )
      expect(coingeckoQueryService.getUsdPriceHistory).toHaveBeenNthCalledWith(
        3,
        tokens[2].coingeckoId,
        HOUR_09.add(-7, 'days'),
        HOUR_13,
        'hourly',
        tokens[2].address,
      )
      expect(coingeckoQueryService.getUsdPriceHistory).toHaveBeenNthCalledWith(
        4,
        tokens[0].coingeckoId,
        HOUR_13.add(-7, 'days'),
        HOUR_13,
        'hourly',
        tokens[0].address,
      )
    })
  })

  describe(PriceUpdater.prototype.updateToken.name, () => {
    const TOKEN_ID = AssetId('uni-uniswap')
    const TOKEN_COINGECKO_ID = CoingeckoId('uniswap')

    let coingeckoQueryService = mockObject<CoingeckoQueryService>()
    let priceUpdater: PriceUpdater

    beforeEach(() => {
      const priceRepository = mockObject<PriceRepository>({
        findDataBoundaries: mockFn().returns(new Map()),
        addMany: mockFn().returns([]),
      })
      coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returns([]),
      })
      priceUpdater = new PriceUpdater(
        coingeckoQueryService,
        priceRepository,
        mockObject<Clock>(),
        [fakeToken(TOKEN_ID, TOKEN_COINGECKO_ID)],
        Logger.SILENT,
      )
    })

    describe('no data in DB', () => {
      it('whole range query', async () => {
        await priceUpdater.updateToken(TOKEN_ID, undefined, HOUR_09, HOUR_13)

        expect(
          coingeckoQueryService.getUsdPriceHistory,
        ).toHaveBeenOnlyCalledWith(
          TOKEN_COINGECKO_ID,
          HOUR_09.add(-7, 'days'),
          HOUR_13,
          'hourly',
          undefined,
        )
      })
    })

    describe('data in DB from 10:00 to 12:00', () => {
      const BOUNDARY = {
        earliest: HOUR_10,
        latest: HOUR_12,
      }

      it('9:00', async () => {
        await priceUpdater.updateToken(TOKEN_ID, BOUNDARY, HOUR_09, HOUR_09)

        expect(
          coingeckoQueryService.getUsdPriceHistory,
        ).toHaveBeenOnlyCalledWith(
          TOKEN_COINGECKO_ID,
          HOUR_09.add(-7, 'days'),
          HOUR_09,
          'hourly',
          undefined,
        )
      })

      it('13:00', async () => {
        await priceUpdater.updateToken(TOKEN_ID, BOUNDARY, HOUR_13, HOUR_13)

        expect(
          coingeckoQueryService.getUsdPriceHistory,
        ).toHaveBeenOnlyCalledWith(
          TOKEN_COINGECKO_ID,
          HOUR_13.add(-7, 'days'),
          HOUR_13,
          'hourly',
          undefined,
        )
      })

      it('11:00', async () => {
        await priceUpdater.updateToken(TOKEN_ID, BOUNDARY, HOUR_11, HOUR_11)

        expect(coingeckoQueryService.getUsdPriceHistory).toHaveBeenCalledTimes(
          0,
        )
      })

      it('9:00 - 13:00', async () => {
        await priceUpdater.updateToken(TOKEN_ID, BOUNDARY, HOUR_09, HOUR_13)

        expect(coingeckoQueryService.getUsdPriceHistory).toHaveBeenCalledTimes(
          2,
        )
        expect(
          coingeckoQueryService.getUsdPriceHistory,
        ).toHaveBeenNthCalledWith(
          1,
          TOKEN_COINGECKO_ID,
          HOUR_09.add(-7, 'days'),
          HOUR_09,
          'hourly',
          undefined,
        )
        expect(
          coingeckoQueryService.getUsdPriceHistory,
        ).toHaveBeenNthCalledWith(
          2,
          TOKEN_COINGECKO_ID,
          HOUR_13.add(-7, 'days'),
          HOUR_13,
          'hourly',
          undefined,
        )
      })

      it('10:00 - 12:00', async () => {
        await priceUpdater.updateToken(TOKEN_ID, BOUNDARY, HOUR_10, HOUR_12)

        expect(coingeckoQueryService.getUsdPriceHistory).toHaveBeenCalledTimes(
          0,
        )
      })
    })
  })

  describe(PriceUpdater.prototype.fetchAndSave.name, () => {
    it('query coingecko and save to DB', async () => {
      const from = UnixTime.fromDate(new Date('2021-09-07T09:00:00Z'))

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returnsOnce([
          { value: 100, timestamp: from, deltaMs: 0 },
          { value: 100, timestamp: from.add(1, 'hours'), deltaMs: 0 },
          { value: 100, timestamp: from.add(2, 'hours'), deltaMs: 0 },
        ]),
      })

      const priceRepository = mockObject<PriceRepository>({
        addMany: mockFn().returns([]),
      })
      const tokens = [fakeToken(AssetId('uni-uniswap'))]

      const priceUpdater = new PriceUpdater(
        coingeckoQueryService,
        priceRepository,
        mockObject<Clock>(),
        tokens,
        Logger.SILENT,
      )

      await priceUpdater.fetchAndSave(tokens[0].id, from, from.add(2, 'hours'))

      expect(coingeckoQueryService.getUsdPriceHistory).toHaveBeenOnlyCalledWith(
        tokens[0].coingeckoId,
        from.add(-7, 'days'),
        from.add(2, 'hours'),
        'hourly',
        undefined,
      )

      expect(priceRepository.addMany).toHaveBeenOnlyCalledWith([
        {
          assetId: tokens[0].id,
          priceUsd: 100,
          timestamp: from,
        },
        {
          assetId: tokens[0].id,
          priceUsd: 100,
          timestamp: from.add(1, 'hours'),
        },
        {
          assetId: tokens[0].id,
          priceUsd: 100,
          timestamp: from.add(2, 'hours'),
        },
      ])
    })
  })

  function fakeToken(id?: AssetId, coingeckoId?: CoingeckoId): Token {
    return {
      id: id ?? AssetId('fake-token'),
      coingeckoId: coingeckoId ?? CoingeckoId('fake-token'),
      symbol: 'FKT',
      decimals: 18,
      address: EthereumAddress.random(),
    }
  }
})
