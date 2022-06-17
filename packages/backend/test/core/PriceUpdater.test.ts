import { AssetId, CoingeckoId, Logger, mock, UnixTime } from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import { PriceUpdater } from '../../src/core/PriceUpdater'
import { CoingeckoQueryService } from '../../src/peripherals/coingecko/CoingeckoQueryService'
import { PriceRepository } from '../../src/peripherals/database/PriceRepository'
import { fakeToken } from '../fakes'

describe(PriceUpdater.name, () => {
  const HOUR_09 = UnixTime.fromDate(new Date('2021-09-07T09:00:00Z'))
  const HOUR_10 = UnixTime.fromDate(new Date('2021-09-07T10:00:00Z'))
  const HOUR_11 = UnixTime.fromDate(new Date('2021-09-07T11:00:00Z'))
  const HOUR_12 = UnixTime.fromDate(new Date('2021-09-07T12:00:00Z'))
  const HOUR_13 = UnixTime.fromDate(new Date('2021-09-07T13:00:00Z'))

  describe(PriceUpdater.prototype.update.name, () => {
    it('returns if empty timestamps', async () => {
      const priceRepository = mock<PriceRepository>({
        calcDataBoundaries: mockFn().returns(new Map()),
        addMany: mockFn().returns([]),
      })
      const coingeckoQueryService = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returnsOnce([]),
      })

      const priceUpdater = new PriceUpdater(
        coingeckoQueryService,
        priceRepository,
        [],
        Logger.SILENT,
      )

      await priceUpdater.update([])

      expect(priceRepository.calcDataBoundaries.calls.length).toEqual(0)
    })

    it('correctly calls updates', async () => {
      const tokens = [
        fakeToken({ id: AssetId('uni-uniswap') }),
        fakeToken({ id: AssetId.ETH }),
        fakeToken({ id: AssetId.WETH }),
      ]

      const priceRepository = mock<PriceRepository>({
        calcDataBoundaries: mockFn().returns(
          new Map([
            [tokens[0].id, { earliest: HOUR_10, latest: HOUR_12 }],
            [tokens[1].id, { earliest: HOUR_09, latest: HOUR_12 }],
          ]),
        ),
        addMany: mockFn().returns([]),
      })

      const coingeckoQueryService = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returns([]),
      })

      const priceUpdater = new PriceUpdater(
        coingeckoQueryService,
        priceRepository,
        tokens,
        Logger.SILENT,
      )

      await priceUpdater.update([HOUR_09, HOUR_10, HOUR_11, HOUR_12, HOUR_13])
      expect(
        coingeckoQueryService.getUsdPriceHistory,
      ).toHaveBeenCalledExactlyWith([
        [tokens[0].coingeckoId, HOUR_09.add(-7, 'days'), HOUR_09, 'hourly'],
        [tokens[1].coingeckoId, HOUR_13.add(-7, 'days'), HOUR_13, 'hourly'],
        [tokens[2].coingeckoId, HOUR_09.add(-7, 'days'), HOUR_13, 'hourly'],
        [tokens[0].coingeckoId, HOUR_13.add(-7, 'days'), HOUR_13, 'hourly'],
      ])
    })
  })

  describe(PriceUpdater.prototype.updateToken.name, () => {
    const TOKEN_ID = AssetId('uni-uniswap')
    const TOKEN_COINGECKO_ID = CoingeckoId('uniswap')

    let coingeckoQueryService = mock<CoingeckoQueryService>()
    let priceUpdater: PriceUpdater

    beforeEach(() => {
      const priceRepository = mock<PriceRepository>({
        calcDataBoundaries: mockFn().returns(new Map()),
        addMany: mockFn().returns([]),
      })
      coingeckoQueryService = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returns([]),
      })
      priceUpdater = new PriceUpdater(
        coingeckoQueryService,
        priceRepository,
        [fakeToken({ id: TOKEN_ID, coingeckoId: TOKEN_COINGECKO_ID })],
        Logger.SILENT,
      )
    })

    describe('no data in DB', () => {
      it('whole range query', async () => {
        await priceUpdater.updateToken(TOKEN_ID, undefined, HOUR_09, HOUR_13)

        expect(
          coingeckoQueryService.getUsdPriceHistory,
        ).toHaveBeenCalledExactlyWith([
          [TOKEN_COINGECKO_ID, HOUR_09.add(-7, 'days'), HOUR_13, 'hourly'],
        ])
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
        ).toHaveBeenCalledExactlyWith([
          [TOKEN_COINGECKO_ID, HOUR_09.add(-7, 'days'), HOUR_09, 'hourly'],
        ])
      })

      it('13:00', async () => {
        await priceUpdater.updateToken(TOKEN_ID, BOUNDARY, HOUR_13, HOUR_13)

        expect(
          coingeckoQueryService.getUsdPriceHistory,
        ).toHaveBeenCalledExactlyWith([
          [TOKEN_COINGECKO_ID, HOUR_13.add(-7, 'days'), HOUR_13, 'hourly'],
        ])
      })

      it('11:00', async () => {
        await priceUpdater.updateToken(TOKEN_ID, BOUNDARY, HOUR_11, HOUR_11)

        expect(coingeckoQueryService.getUsdPriceHistory.calls.length).toEqual(0)
      })

      it('9:00 - 13:00', async () => {
        await priceUpdater.updateToken(TOKEN_ID, BOUNDARY, HOUR_09, HOUR_13)

        expect(
          coingeckoQueryService.getUsdPriceHistory,
        ).toHaveBeenCalledExactlyWith([
          [TOKEN_COINGECKO_ID, HOUR_09.add(-7, 'days'), HOUR_09, 'hourly'],
          [TOKEN_COINGECKO_ID, HOUR_13.add(-7, 'days'), HOUR_13, 'hourly'],
        ])
      })

      it('10:00 - 12:00', async () => {
        await priceUpdater.updateToken(TOKEN_ID, BOUNDARY, HOUR_10, HOUR_12)

        expect(coingeckoQueryService.getUsdPriceHistory.calls.length).toEqual(0)
      })
    })
  })

  describe(PriceUpdater.prototype.fetchAndSave.name, () => {
    it('query coingecko and save to DB', async () => {
      const from = UnixTime.fromDate(new Date('2021-09-07T09:00:00Z'))

      const coingeckoQueryService = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returnsOnce([
          { value: 100, timestamp: from, deltaMs: 0 },
          { value: 100, timestamp: from.add(1, 'hours'), deltaMs: 0 },
          { value: 100, timestamp: from.add(2, 'hours'), deltaMs: 0 },
        ]),
      })

      const priceRepository = mock<PriceRepository>({
        addMany: mockFn().returns([]),
      })
      const tokens = [fakeToken({ id: AssetId('uni-uniswap') })]

      const priceUpdater = new PriceUpdater(
        coingeckoQueryService,
        priceRepository,
        tokens,
        Logger.SILENT,
      )

      await priceUpdater.fetchAndSave(tokens[0].id, from, from.add(2, 'hours'))

      expect(
        coingeckoQueryService.getUsdPriceHistory,
      ).toHaveBeenCalledExactlyWith([
        [
          tokens[0].coingeckoId,
          from.add(-7, 'days'),
          from.add(2, 'hours'),
          'hourly',
        ],
      ])

      expect(priceRepository.addMany).toHaveBeenCalledExactlyWith([
        [
          [
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
          ],
        ],
      ])
    })
  })
})
