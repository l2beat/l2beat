import { CoingeckoId, Logger, mock, UnixTime } from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import { PriceUpdater } from '../../src/core/PriceUpdater'
import { CoingeckoQueryService } from '../../src/peripherals/coingecko/CoingeckoQueryService'
import { PriceRepository } from '../../src/peripherals/database/PriceRepository'

describe(PriceUpdater.name, () => {
  const HOUR_09 = UnixTime.fromDate(new Date('2021-09-07T09:00:00Z'))
  const HOUR_10 = UnixTime.fromDate(new Date('2021-09-07T10:00:00Z'))
  const HOUR_11 = UnixTime.fromDate(new Date('2021-09-07T11:00:00Z'))
  const HOUR_12 = UnixTime.fromDate(new Date('2021-09-07T12:00:00Z'))
  const HOUR_13 = UnixTime.fromDate(new Date('2021-09-07T13:00:00Z'))

  describe(PriceUpdater.prototype.update.name, () => {
    it('returns if empty timestamps', async () => {
      const priceRepository = mock<PriceRepository>({
        getDataBoundaries: mockFn().returns(new Map()),
        addOrUpdate: mockFn().returns([]),
      })
      const coingeckoQueryService = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returnsOnce([]),
      })

      const priceUpdater = new PriceUpdater(
        coingeckoQueryService,
        priceRepository,
        [],
        Logger.SILENT
      )

      await priceUpdater.update([])

      expect(priceRepository.getDataBoundaries.calls.length).toEqual(0)
    })

    it('correctly calls updates', async () => {
      const tokens = [
        CoingeckoId('uniswap'),
        CoingeckoId('ethereum'),
        CoingeckoId('dai'),
      ]

      const priceRepository = mock<PriceRepository>({
        getDataBoundaries: mockFn().returns(
          new Map([
            [tokens[0], { earliest: HOUR_10, latest: HOUR_12 }],
            [tokens[1], { earliest: HOUR_09, latest: HOUR_12 }],
          ])
        ),
        addOrUpdate: mockFn().returns([]),
      })

      const coingeckoQueryService = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returns([]),
      })

      const priceUpdater = new PriceUpdater(
        coingeckoQueryService,
        priceRepository,
        tokens,
        Logger.SILENT
      )

      await priceUpdater.update([HOUR_09, HOUR_10, HOUR_11, HOUR_12, HOUR_13])
      expect(
        coingeckoQueryService.getUsdPriceHistory
      ).toHaveBeenCalledExactlyWith([
        [tokens[0], HOUR_09, HOUR_10, 'hourly'],
        [tokens[1], HOUR_12, HOUR_13, 'hourly'],
        [tokens[2], HOUR_09, HOUR_13, 'hourly'],
        [tokens[0], HOUR_12, HOUR_13, 'hourly'],
      ])
    })
  })

  describe(PriceUpdater.prototype.updateToken.name, () => {
    describe('no data in DB', () => {
      const priceRepository = mock<PriceRepository>({
        getDataBoundaries: mockFn().returns(new Map()),
        addOrUpdate: mockFn().returns([]),
      })

      it('whole range query', async () => {
        const coingeckoQueryService = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returnsOnce([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQueryService,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(
          CoingeckoId('uniswap'),
          undefined,
          HOUR_09,
          HOUR_13
        )

        expect(
          coingeckoQueryService.getUsdPriceHistory
        ).toHaveBeenCalledExactlyWith([
          [CoingeckoId('uniswap'), HOUR_09, HOUR_13, 'hourly'],
        ])
      })
    })

    describe('data in DB from 10:00 to 12:00', () => {
      const TOKEN = CoingeckoId('uniswap')
      const BOUNDARY = {
        earliest: HOUR_10,
        latest: HOUR_12,
      }

      const priceRepository = mock<PriceRepository>({
        addOrUpdate: mockFn().returns([]),
      })

      it('9:00', async () => {
        const coingeckoQueryService = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returns([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQueryService,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(TOKEN, BOUNDARY, HOUR_09, HOUR_09)

        expect(
          coingeckoQueryService.getUsdPriceHistory
        ).toHaveBeenCalledExactlyWith([[TOKEN, HOUR_09, HOUR_10, 'hourly']])
      })

      it('13:00', async () => {
        const coingeckoQueryService = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returns([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQueryService,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(TOKEN, BOUNDARY, HOUR_13, HOUR_13)

        expect(
          coingeckoQueryService.getUsdPriceHistory
        ).toHaveBeenCalledExactlyWith([[TOKEN, HOUR_12, HOUR_13, 'hourly']])
      })

      it('11:00', async () => {
        const coingeckoQueryService = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returns([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQueryService,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(TOKEN, BOUNDARY, HOUR_11, HOUR_11)

        expect(coingeckoQueryService.getUsdPriceHistory.calls.length).toEqual(0)
      })

      it('9:00 - 13:00', async () => {
        const coingeckoQueryService = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returns([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQueryService,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(TOKEN, BOUNDARY, HOUR_09, HOUR_13)

        expect(
          coingeckoQueryService.getUsdPriceHistory
        ).toHaveBeenCalledExactlyWith([
          [TOKEN, HOUR_09, HOUR_10, 'hourly'],
          [TOKEN, HOUR_12, HOUR_13, 'hourly'],
        ])
      })

      it('10:00 - 12:00', async () => {
        const coingeckoQueryService = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returns([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQueryService,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(TOKEN, BOUNDARY, HOUR_10, HOUR_12)

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
        addOrUpdate: mockFn().returns([]),
      })
      const tokens = [CoingeckoId('uniswap')]

      const priceUpdater = new PriceUpdater(
        coingeckoQueryService,
        priceRepository,
        tokens,
        Logger.SILENT
      )

      await priceUpdater.fetchAndSave(tokens[0], from, from.add(2, 'hours'))

      expect(
        coingeckoQueryService.getUsdPriceHistory
      ).toHaveBeenCalledExactlyWith([
        [tokens[0], from, from.add(2, 'hours'), 'hourly'],
      ])

      expect(priceRepository.addOrUpdate).toHaveBeenCalledExactlyWith([
        [
          [
            {
              coingeckoId: tokens[0],
              priceUsd: 100,
              timestamp: from,
            },
            {
              coingeckoId: tokens[0],
              priceUsd: 100,
              timestamp: from.add(1, 'hours'),
            },
            {
              coingeckoId: tokens[0],
              priceUsd: 100,
              timestamp: from.add(2, 'hours'),
            },
          ],
        ],
      ])
    })
  })
})
