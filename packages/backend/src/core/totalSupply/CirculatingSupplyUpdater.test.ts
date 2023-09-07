import { Logger } from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { setTimeout } from 'timers/promises'
import waitForExpect from 'wait-for-expect'

import { CoingeckoQueryService } from '../../peripherals/coingecko/CoingeckoQueryService'
import {
  CirculatingSupplyRecord,
  CirculatingSupplyRepository,
} from '../../peripherals/database/CirculatingSupplyRepository'
import { Clock } from '../Clock'
import { CirculatingSupplyUpdater } from './CirculatingSupplyUpdater'

const chainId = ChainId.ETHEREUM

describe(CirculatingSupplyUpdater.name, () => {
  const HOUR_09 = UnixTime.fromDate(new Date('2021-09-07T09:00:00Z'))
  const HOUR_10 = UnixTime.fromDate(new Date('2021-09-07T10:00:00Z'))
  const HOUR_11 = UnixTime.fromDate(new Date('2021-09-07T11:00:00Z'))
  const HOUR_12 = UnixTime.fromDate(new Date('2021-09-07T12:00:00Z'))
  const HOUR_13 = UnixTime.fromDate(new Date('2021-09-07T13:00:00Z'))

  describe(CirculatingSupplyUpdater.prototype.start.name, () => {
    it('triggers update now and on every new hour', async () => {
      const clock = mockObject<Clock>({
        onNewHour(callback) {
          callback(HOUR_10)
          callback(HOUR_11)
          return () => {}
        },
      })
      const circulatingSupplyUpdater = new CirculatingSupplyUpdater(
        mockObject<CoingeckoQueryService>(),
        mockObject<CirculatingSupplyRepository>(),
        clock,
        [],
        ChainId.ETHEREUM,
        Logger.SILENT,
        new UnixTime(0),
      )
      const update =
        mockFn<typeof circulatingSupplyUpdater.update>().resolvesTo(undefined)
      circulatingSupplyUpdater.update = update

      circulatingSupplyUpdater.start()

      await waitForExpect(() => {
        expect(update).toHaveBeenCalledTimes(3)
      })
    })
  })

  describe(
    CirculatingSupplyUpdater.prototype.getCirculatingSuppliesWhenReady.name,
    () => {
      it('returns immediately if the data is available', async () => {
        const tokens = [fakeToken(AssetId.ETH)]
        const prices: CirculatingSupplyRecord[] = [
          {
            assetId: AssetId.ETH,
            circulatingSupply: 1000,
            timestamp: HOUR_10,
            chainId,
          },
        ]
        const CirculatingSupplyRepository =
          mockObject<CirculatingSupplyRepository>({
            findDataBoundaries: mockFn().returns(
              new Map([[AssetId.ETH, { earliest: HOUR_10, latest: HOUR_12 }]]),
            ),
            getByTimestamp: async () => prices,
          })
        const clock = mockObject<Clock>({
          getFirstHour: () => HOUR_10,
          getLastHour: () => HOUR_12,
        })
        const circulatingSupplyUpdater = new CirculatingSupplyUpdater(
          mockObject<CoingeckoQueryService>(),
          CirculatingSupplyRepository,
          clock,
          tokens,
          ChainId.ETHEREUM,
          Logger.SILENT,
          new UnixTime(0),
        )
        await circulatingSupplyUpdater.update()
        const result =
          await circulatingSupplyUpdater.getCirculatingSuppliesWhenReady(
            HOUR_10,
          )
        expect(result).toEqual(prices)
      })

      it('waits until data is available, then returns', async () => {
        const tokens = [fakeToken(AssetId.ETH)]
        const prices: CirculatingSupplyRecord[] = [
          {
            assetId: AssetId.ETH,
            circulatingSupply: 1000.0,
            timestamp: HOUR_10,
            chainId,
          },
        ]
        const CirculatingSupplyRepository =
          mockObject<CirculatingSupplyRepository>({
            findDataBoundaries: mockFn().returns(
              new Map([[AssetId.ETH, { earliest: HOUR_10, latest: HOUR_12 }]]),
            ),
            getByTimestamp: async () => prices,
          })
        const clock = mockObject<Clock>({
          getFirstHour: () => HOUR_10,
          getLastHour: () => HOUR_12,
        })
        const circulatingSupplyUpdater = new CirculatingSupplyUpdater(
          mockObject<CoingeckoQueryService>(),
          CirculatingSupplyRepository,
          clock,
          tokens,
          ChainId.ETHEREUM,
          Logger.SILENT,
          new UnixTime(0),
        )

        let result: unknown = undefined
        void circulatingSupplyUpdater
          .getCirculatingSuppliesWhenReady(HOUR_10, 10)
          .then((value) => {
            result = value
          })

        await setTimeout(20)
        expect(result).toEqual(undefined)

        await circulatingSupplyUpdater.update()

        await waitForExpect(() => {
          expect(result).toEqual(prices)
        })
      })
    },
  )

  describe(CirculatingSupplyUpdater.prototype.update.name, () => {
    it('correctly calls updates', async () => {
      const tokens = [
        fakeToken(AssetId('uni-uniswap')),
        fakeToken(AssetId.ETH),
        fakeToken(AssetId.WETH),
      ]

      const CirculatingSupplyRepository =
        mockObject<CirculatingSupplyRepository>({
          findDataBoundaries: mockFn().returns(
            new Map([
              [tokens[0].id, { earliest: HOUR_10, latest: HOUR_12 }],
              [tokens[1].id, { earliest: HOUR_09, latest: HOUR_12 }],
            ]),
          ),
          addOrUpdateMany: mockFn().returns([]),
        })

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getCirculatingSupplies: mockFn().returns([]),
      })

      const clock = mockObject<Clock>({
        getFirstHour: () => HOUR_09,
        getLastHour: () => HOUR_13,
      })

      const circulatingSupplyUpdater = new CirculatingSupplyUpdater(
        coingeckoQueryService,
        CirculatingSupplyRepository,
        clock,
        tokens,
        ChainId.ETHEREUM,
        Logger.SILENT,
        new UnixTime(0),
      )

      await circulatingSupplyUpdater.update()
      expect(
        coingeckoQueryService.getCirculatingSupplies,
      ).toHaveBeenCalledTimes(4)
      expect(
        coingeckoQueryService.getCirculatingSupplies,
      ).toHaveBeenNthCalledWith(
        1,
        tokens[0].coingeckoId,
        HOUR_09.add(-7, 'days'),
        HOUR_09,
        'hourly',
        tokens[0].address,
      )
      expect(
        coingeckoQueryService.getCirculatingSupplies,
      ).toHaveBeenNthCalledWith(
        2,
        tokens[1].coingeckoId,
        HOUR_13.add(-7, 'days'),
        HOUR_13,
        'hourly',
        tokens[1].address,
      )
      expect(
        coingeckoQueryService.getCirculatingSupplies,
      ).toHaveBeenNthCalledWith(
        3,
        tokens[2].coingeckoId,
        HOUR_09.add(-7, 'days'),
        HOUR_13,
        'hourly',
        tokens[2].address,
      )
      expect(
        coingeckoQueryService.getCirculatingSupplies,
      ).toHaveBeenNthCalledWith(
        4,
        tokens[0].coingeckoId,
        HOUR_13.add(-7, 'days'),
        HOUR_13,
        'hourly',
        tokens[0].address,
      )
    })

    it('correctly calls updates', async () => {
      const tokens: Token[] = [
        { ...fakeToken(AssetId.ETH), sinceTimestamp: HOUR_10 },
      ]

      const CirculatingSupplyRepository =
        mockObject<CirculatingSupplyRepository>({
          findDataBoundaries: mockFn().returns(new Map([])),
          addOrUpdateMany: mockFn().returns([]),
        })

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getCirculatingSupplies: mockFn().returns([]),
      })

      const clock = mockObject<Clock>({
        getFirstHour: () => HOUR_09,
        getLastHour: () => HOUR_13,
      })

      const circulatingSupplyUpdater = new CirculatingSupplyUpdater(
        coingeckoQueryService,
        CirculatingSupplyRepository,
        clock,
        tokens,
        ChainId.ETHEREUM,
        Logger.SILENT,
        new UnixTime(0),
      )

      await circulatingSupplyUpdater.update()
      expect(
        coingeckoQueryService.getCirculatingSupplies,
      ).toHaveBeenCalledTimes(1)
      expect(
        coingeckoQueryService.getCirculatingSupplies,
      ).toHaveBeenNthCalledWith(
        1,
        tokens[0].coingeckoId,
        HOUR_10.add(-7, 'days'),
        HOUR_13,
        'hourly',
        tokens[0].address,
      )
    })
  })

  describe(CirculatingSupplyUpdater.prototype.updateToken.name, () => {
    const TOKEN_ID = AssetId('uni-uniswap')
    const TOKEN_COINGECKO_ID = CoingeckoId('uniswap')

    let coingeckoQueryService = mockObject<CoingeckoQueryService>()
    let circulatingSupplyUpdater: CirculatingSupplyUpdater

    beforeEach(() => {
      const CirculatingSupplyRepository =
        mockObject<CirculatingSupplyRepository>({
          findDataBoundaries: mockFn().returns(new Map()),
          addOrUpdateMany: mockFn().returns([]),
        })
      coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getCirculatingSupplies: mockFn().returns([]),
      })
      circulatingSupplyUpdater = new CirculatingSupplyUpdater(
        coingeckoQueryService,
        CirculatingSupplyRepository,
        mockObject<Clock>(),
        [fakeToken(TOKEN_ID, TOKEN_COINGECKO_ID)],
        ChainId.ETHEREUM,
        Logger.SILENT,
        new UnixTime(0),
      )
    })

    describe('no data in DB', () => {
      it('whole range query', async () => {
        await circulatingSupplyUpdater.updateToken(
          TOKEN_ID,
          undefined,
          HOUR_09,
          HOUR_13,
        )

        expect(
          coingeckoQueryService.getCirculatingSupplies,
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
        await circulatingSupplyUpdater.updateToken(
          TOKEN_ID,
          BOUNDARY,
          HOUR_09,
          HOUR_09,
        )

        expect(
          coingeckoQueryService.getCirculatingSupplies,
        ).toHaveBeenOnlyCalledWith(
          TOKEN_COINGECKO_ID,
          HOUR_09.add(-7, 'days'),
          HOUR_09,
          'hourly',
          undefined,
        )
      })

      it('13:00', async () => {
        await circulatingSupplyUpdater.updateToken(
          TOKEN_ID,
          BOUNDARY,
          HOUR_13,
          HOUR_13,
        )

        expect(
          coingeckoQueryService.getCirculatingSupplies,
        ).toHaveBeenOnlyCalledWith(
          TOKEN_COINGECKO_ID,
          HOUR_13.add(-7, 'days'),
          HOUR_13,
          'hourly',
          undefined,
        )
      })

      it('11:00', async () => {
        await circulatingSupplyUpdater.updateToken(
          TOKEN_ID,
          BOUNDARY,
          HOUR_11,
          HOUR_11,
        )

        expect(
          coingeckoQueryService.getCirculatingSupplies,
        ).toHaveBeenCalledTimes(0)
      })

      it('9:00 - 13:00', async () => {
        await circulatingSupplyUpdater.updateToken(
          TOKEN_ID,
          BOUNDARY,
          HOUR_09,
          HOUR_13,
        )

        expect(
          coingeckoQueryService.getCirculatingSupplies,
        ).toHaveBeenCalledTimes(2)
        expect(
          coingeckoQueryService.getCirculatingSupplies,
        ).toHaveBeenNthCalledWith(
          1,
          TOKEN_COINGECKO_ID,
          HOUR_09.add(-7, 'days'),
          HOUR_09,
          'hourly',
          undefined,
        )
        expect(
          coingeckoQueryService.getCirculatingSupplies,
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
        await circulatingSupplyUpdater.updateToken(
          TOKEN_ID,
          BOUNDARY,
          HOUR_10,
          HOUR_12,
        )

        expect(
          coingeckoQueryService.getCirculatingSupplies,
        ).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe(CirculatingSupplyUpdater.prototype.fetchAndSave.name, () => {
    it('query coingecko and save to DB', async () => {
      const from = UnixTime.fromDate(new Date('2021-09-07T09:00:00Z'))

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getCirculatingSupplies: mockFn().returnsOnce([
          { value: 100, timestamp: from, deltaMs: 0 },
          { value: 100, timestamp: from.add(1, 'hours'), deltaMs: 0 },
          { value: 100, timestamp: from.add(2, 'hours'), deltaMs: 0 },
        ]),
      })

      const circulatingSupplyRepository =
        mockObject<CirculatingSupplyRepository>({
          addOrUpdateMany: mockFn().returns([]),
        })
      const tokens = [fakeToken(AssetId('uni-uniswap'))]

      const circulatingSupplyUpdater = new CirculatingSupplyUpdater(
        coingeckoQueryService,
        circulatingSupplyRepository,
        mockObject<Clock>(),
        tokens,
        ChainId.ETHEREUM,
        Logger.SILENT,
        new UnixTime(0),
      )

      await circulatingSupplyUpdater.fetchAndSave(
        tokens[0].id,
        from,
        from.add(2, 'hours'),
      )

      expect(
        coingeckoQueryService.getCirculatingSupplies,
      ).toHaveBeenOnlyCalledWith(
        tokens[0].coingeckoId,
        from.add(-7, 'days'),
        from.add(2, 'hours'),
        'hourly',
        undefined,
      )

      expect(
        circulatingSupplyRepository.addOrUpdateMany,
      ).toHaveBeenOnlyCalledWith([
        {
          assetId: tokens[0].id,
          circulatingSupply: 100,
          timestamp: from,
          chainId,
        },
        {
          assetId: tokens[0].id,
          circulatingSupply: 100,
          timestamp: from.add(1, 'hours'),
          chainId,
        },
        {
          assetId: tokens[0].id,
          circulatingSupply: 100,
          timestamp: from.add(2, 'hours'),
          chainId,
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
      formula: 'circulatingSupply',
      chainId: ChainId.ETHEREUM,
      category: 'ether', // irrelevant
      type: 'CBV', // irrelevant
      name: 'Fake', // irrelevant
      sinceTimestamp: new UnixTime(0), // irrelevant
    }
  }
})
