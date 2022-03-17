import { CoingeckoId, Logger, mock, UnixTime } from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import { PriceUpdater } from '../../src/core/PriceUpdater'
import { CoingeckoQueryService } from '../../src/peripherals/coingecko/CoingeckoQueryService'
import { PriceRepository } from '../../src/peripherals/database/PriceRepository'

describe(PriceUpdater.name, () => {
  const _09 = UnixTime.fromDate(new Date('2021-09-07T09:00:00Z'))
  const _10 = UnixTime.fromDate(new Date('2021-09-07T10:00:00Z'))
  const _11 = UnixTime.fromDate(new Date('2021-09-07T11:00:00Z'))
  const _12 = UnixTime.fromDate(new Date('2021-09-07T12:00:00Z'))
  const _13 = UnixTime.fromDate(new Date('2021-09-07T13:00:00Z'))

  describe(PriceUpdater.prototype.update.name, () => {
    it('rejects if empty timestamps', async () => {
      const priceRepository = mock<PriceRepository>({
        getDataBoundaries: mockFn().returns(new Map()),
        addOrUpdate: mockFn().returns([]),
      })
      const coingeckoQS = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returnsOnce([]),
      })

      const priceUpdater = new PriceUpdater(
        coingeckoQS,
        priceRepository,
        [],
        Logger.SILENT
      )

      await expect(priceUpdater.update([])).toBeRejected(
        'Timestamps array cannot be empty'
      )
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
            [tokens[0], { earliest: _10, latest: _12 }],
            [tokens[1], { earliest: _09, latest: _12 }],
          ])
        ),
        addOrUpdate: mockFn().returns([]),
      })

      const coingeckoQS = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returns([]),
      })

      const priceUpdater = new PriceUpdater(
        coingeckoQS,
        priceRepository,
        tokens,
        Logger.SILENT
      )

      await priceUpdater.update([_09, _10, _11, _12, _13])

      expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledWith([
        tokens[0],
        _09,
        _10,
        'hourly',
      ])
      expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledWith([
        tokens[0],
        _12,
        _13,
        'hourly',
      ])
      expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledWith([
        tokens[1],
        _12,
        _13,
        'hourly',
      ])
      expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledWith([
        tokens[2],
        _09,
        _13,
        'hourly',
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
        const coingeckoQS = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returnsOnce([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQS,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(
          CoingeckoId('uniswap'),
          undefined,
          _09,
          _13
        )

        expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledExactlyWith([
          [CoingeckoId('uniswap'), _09, _13, 'hourly'],
        ])
      })
    })

    describe('data in DB from 10:00 to 12:00', () => {
      const TOKEN = CoingeckoId('uniswap')
      const BOUNDARIES = {
        earliest: _10,
        latest: _12,
      }

      const priceRepository = mock<PriceRepository>({
        addOrUpdate: mockFn().returns([]),
      })

      it('9:00', async () => {
        const coingeckoQS = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returns([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQS,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(TOKEN, BOUNDARIES, _09, _09)

        expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledExactlyWith([
          [TOKEN, _09, _10, 'hourly'],
        ])
      })
      it('13:00', async () => {
        const coingeckoQS = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returns([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQS,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(TOKEN, BOUNDARIES, _13, _13)

        expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledExactlyWith([
          [TOKEN, _12, _13, 'hourly'],
        ])
      })
      it('11:00', async () => {
        const coingeckoQS = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returns([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQS,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(TOKEN, BOUNDARIES, _11, _11)

        expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledExactlyWith([])
      })
      it('9:00 - 13:00', async () => {
        const coingeckoQS = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returns([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQS,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(TOKEN, BOUNDARIES, _09, _13)

        expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledExactlyWith([
          [TOKEN, _09, _10, 'hourly'],
          [TOKEN, _12, _13, 'hourly'],
        ])
      })
      it('10:00 - 12:00', async () => {
        const coingeckoQS = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returns([]),
        })

        const priceUpdater = new PriceUpdater(
          coingeckoQS,
          priceRepository,
          [],
          Logger.SILENT
        )

        await priceUpdater.updateToken(TOKEN, BOUNDARIES, _10, _12)

        expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledExactlyWith([])
      })
    })
  })

  describe(PriceUpdater.prototype.fetchAndSave.name, () => {
    it('query coingecko and save to DB', async () => {
      const from = UnixTime.fromDate(new Date('2021-09-07T09:00:00Z'))

      const coingeckoQS = mock<CoingeckoQueryService>({
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
        coingeckoQS,
        priceRepository,
        tokens,
        Logger.SILENT
      )

      await priceUpdater.fetchAndSave(tokens[0], from, from.add(2, 'hours'))

      expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledExactlyWith([
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
