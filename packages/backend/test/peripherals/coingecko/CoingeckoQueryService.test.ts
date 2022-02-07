import { CoingeckoClient, CoingeckoId, mock, UnixTime } from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import {
  CoingeckoQueryService,
  getFullTimestampsList,
  pickPrices,
} from '../../../src/peripherals/coingecko/CoingeckoQueryService'

describe(CoingeckoQueryService.name, () => {
  describe(CoingeckoQueryService.prototype.getUsdPriceHistory.name, () => {
    it('is called with correct parameters', async () => {
      const coingeckoClient = mock<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          marketCaps: [],
          totalVolumes: [],
          prices: [
            {
              date: new Date(),
              price: 1234567,
            },
          ],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      await coingeckoQueryService.getUsdPriceHistory(
        CoingeckoId('bitcoin'),
        UnixTime.fromDate(new Date('2021-01-01')).add(-5, 'minutes'),
        UnixTime.fromDate(new Date('2022-01-01')).add(5, 'minutes'),
        'daily'
      )
      expect(
        coingeckoClient.getCoinMarketChartRange
      ).toHaveBeenCalledExactlyWith([
        [
          CoingeckoId('bitcoin'),
          'usd',
          UnixTime.fromDate(new Date('2021-01-01')).add(-12, 'hours'),
          UnixTime.fromDate(new Date('2022-01-01')).add(12, 'hours'),
        ],
      ])
    })

    it('handles regular days range returned from API', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mock<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          prices: [
            { date: START.toDate(), price: 1200 },
            { date: START.add(1, 'days').toDate(), price: 1000 },
            { date: START.add(2, 'days').toDate(), price: 1100 },
          ],
          marketCaps: [],
          totalVolumes: [],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistory(
        CoingeckoId('bitcoin'),
        START,
        START.add(2, 'days'),
        'daily'
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200, deltaMs: 0 },
        { timestamp: START.add(1, 'days'), value: 1000, deltaMs: 0 },
        { timestamp: START.add(2, 'days'), value: 1100, deltaMs: 0 },
      ])
    })

    it('handles irregular days range returned from API', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mock<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          prices: [
            { date: START.add(-2, 'hours').toDate(), price: 1200 },
            { date: START.add(1, 'days').toDate(), price: 1000 },
            {
              date: START.add(2, 'days').add(2, 'hours').toDate(),
              price: 1100,
            },
          ],
          marketCaps: [],
          totalVolumes: [],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistory(
        CoingeckoId('bitcoin'),
        START,
        START.add(2, 'days'),
        'daily'
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200, deltaMs: -2 * 60 * 60 * 1000 },
        { timestamp: START.add(1, 'days'), value: 1000, deltaMs: 0 },
        {
          timestamp: START.add(2, 'days'),
          value: 1100,
          deltaMs: 2 * 60 * 60 * 1000,
        },
      ])
    })

    it('handles unsorted days range returned from API', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mock<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          prices: [
            { date: START.add(1, 'days').toDate(), price: 1000 },
            { date: START.toDate(), price: 1200 },
            {
              date: START.add(2, 'days').add(2, 'hours').toDate(),
              price: 1100,
            },
          ],
          marketCaps: [],
          totalVolumes: [],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistory(
        CoingeckoId('bitcoin'),
        START,
        START.add(2, 'days'),
        'daily'
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200, deltaMs: 0 },
        { timestamp: START.add(1, 'days'), value: 1000, deltaMs: 0 },
        {
          timestamp: START.add(2, 'days'),
          value: 1100,
          deltaMs: 2 * 60 * 60 * 1000,
        },
      ])
    })
  })
})

describe(pickPrices.name, () => {
  const START = new UnixTime(1517961600)

  it('works for days', () => {
    const prices = [
      { price: 1000, date: START.toDate() },
      { price: 1100, date: START.add(1, 'days').toDate() },
      { price: 1200, date: START.add(2, 'days').toDate() },
    ]
    const timestamps = getFullTimestampsList(
      START,
      START.add(2, 'days'),
      'daily'
    )

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: 0 },
      { value: 1100, timestamp: START.add(1, 'days'), deltaMs: 0 },
      { value: 1200, timestamp: START.add(2, 'days'), deltaMs: 0 },
    ])
  })

  it('works for hours', () => {
    const prices = [
      { price: 1000, date: START.toDate() },
      { price: 1100, date: START.add(1, 'hours').toDate() },
      { price: 1200, date: START.add(2, 'hours').toDate() },
    ]
    const timestamps = getFullTimestampsList(
      START,
      START.add(2, 'hours'),
      'hourly'
    )

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: 0 },
      { value: 1100, timestamp: START.add(1, 'hours'), deltaMs: 0 },
      { value: 1200, timestamp: START.add(2, 'hours'), deltaMs: 0 },
    ])
  })

  it('adjusts dates for slightly off timestamps', () => {
    const prices = [
      { price: 1000, date: START.add(2, 'minutes').toDate() },
      { price: 1100, date: START.add(1, 'days').add(1, 'minutes').toDate() },
      { price: 1200, date: START.add(2, 'days').add(3, 'minutes').toDate() },
    ]
    const timestamps = getFullTimestampsList(
      START,
      START.add(2, 'days'),
      'daily'
    )

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: 2 * 60 * 1000 },
      {
        value: 1100,
        timestamp: START.add(1, 'days'),
        deltaMs: 1 * 60 * 1000,
      },
      {
        value: 1200,
        timestamp: START.add(2, 'days'),
        deltaMs: 3 * 60 * 1000,
      },
    ])
  })

  it('adjusts dates before the first timestamp', () => {
    const prices = [
      { price: 1000, date: START.add(-2, 'minutes').toDate() },
      { price: 1100, date: START.add(1, 'days').toDate() },
      { price: 1200, date: START.add(2, 'days').toDate() },
    ]
    const timestamps = getFullTimestampsList(
      START,
      START.add(2, 'days'),
      'daily'
    )

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: -2 * 60 * 1000 },
      {
        value: 1100,
        timestamp: START.add(1, 'days'),
        deltaMs: 0,
      },
      { value: 1200, timestamp: START.add(2, 'days'), deltaMs: 0 },
    ])
  })

  it('discards unecessary data', () => {
    const prices = [
      { price: 1100, date: START.add(-2, 'minutes').toDate() },
      { price: 1200, date: START.add(1, 'minutes').toDate() },
      { price: 1300, date: START.add(1, 'days').toDate() },
      { price: 1400, date: START.add(1, 'days').add(2, 'minutes').toDate() },
      { price: 1500, date: START.add(2, 'days').add(-1, 'minutes').toDate() },
      { price: 1600, date: START.add(2, 'days').add(2, 'minutes').toDate() },
    ]
    const timestamps = getFullTimestampsList(
      START,
      START.add(2, 'days'),
      'daily'
    )

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1200, timestamp: START, deltaMs: 1 * 60 * 1000 },
      { value: 1300, timestamp: START.add(1, 'days'), deltaMs: 0 },
      {
        value: 1500,
        timestamp: START.add(2, 'days'),
        deltaMs: -1 * 60 * 1000,
      },
    ])
  })

  it('manufactures single missing datapoint', () => {
    const prices = [
      { price: 1000, date: START.toDate() },
      { price: 1200, date: START.add(2, 'days').add(-1, 'minutes').toDate() },
    ]
    const timestamps = getFullTimestampsList(
      START,
      START.add(2, 'days'),
      'daily'
    )

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: 0 },
      {
        value: 1200,
        timestamp: START.add(1, 'days'),
        deltaMs: 24 * 60 * 60 * 1000 - 60 * 1000,
      },
      { value: 1200, timestamp: START.add(2, 'days'), deltaMs: -60 * 1000 },
    ])
  })

  it('manufactures multiple missing datapoints', () => {
    const prices = [
      { price: 1000, date: START.toDate() },
      { price: 1400, date: START.add(4, 'days').toDate() },
    ]
    const timestamps = getFullTimestampsList(
      START,
      START.add(4, 'days'),
      'daily'
    )

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: 0 },
      {
        value: 1000,
        timestamp: START.add(1, 'days'),
        deltaMs: -24 * 60 * 60 * 1000,
      },
      {
        value: 1000,
        timestamp: START.add(2, 'days'),
        deltaMs: -48 * 60 * 60 * 1000,
      },
      {
        value: 1400,
        timestamp: START.add(3, 'days'),
        deltaMs: 24 * 60 * 60 * 1000,
      },
      { value: 1400, timestamp: START.add(4, 'days'), deltaMs: 0 },
    ])
  })

  it('manufactures start and end datapoints', () => {
    const prices = [{ price: 1100, date: START.add(1, 'days').toDate() }]
    const timestamps = getFullTimestampsList(
      START,
      START.add(2, 'days'),
      'daily'
    )

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1100, timestamp: START, deltaMs: 24 * 60 * 60 * 1000 },
      { value: 1100, timestamp: START.add(1, 'days'), deltaMs: 0 },
      {
        value: 1100,
        timestamp: START.add(2, 'days'),
        deltaMs: -24 * 60 * 60 * 1000,
      },
    ])
  })
})

describe(getFullTimestampsList.name, () => {
  describe('hourly', () => {
    const GRANULARITY = 'hourly'
    const FROM = UnixTime.fromDate(new Date('2021-09-07T13:00:00Z'))
    const TO = UnixTime.fromDate(new Date('2021-09-07T15:00:00Z'))

    const RESULT = [
      FROM,
      UnixTime.fromDate(new Date('2021-09-07T14:00:00Z')),
      TO,
    ]

    it('throws if FROM greater than TO', () => {
      expect(() => getFullTimestampsList(TO, FROM, GRANULARITY)).toThrow(
        'FROM cannot be greater than TO'
      )
    })

    it('13:00 to 15:00', () => {
      expect(getFullTimestampsList(FROM, TO, GRANULARITY)).toEqual(RESULT)
    })

    it('13:01 to 15:01', () => {
      expect(
        getFullTimestampsList(
          FROM.add(1, 'minutes'),
          TO.add(1, 'minutes'),
          GRANULARITY
        )
      ).toEqual([
        UnixTime.fromDate(new Date('2021-09-07T14:00:00Z')),
        UnixTime.fromDate(new Date('2021-09-07T15:00:00Z')),
      ])
    })

    it('23:00 to 01:00', () => {
      const from = UnixTime.fromDate(new Date('2021-09-07T23:00:00Z'))
      const to = UnixTime.fromDate(new Date('2021-09-08T01:00:00Z'))
      const result = [
        from,
        UnixTime.fromDate(new Date('2021-09-08T00:00:00Z')),
        to,
      ]

      expect(getFullTimestampsList(from, to, GRANULARITY)).toEqual(result)
    })
  })

  describe('daily', () => {
    const GRANULARITY = 'daily'
    const FROM = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
    const TO = UnixTime.fromDate(new Date('2021-09-09T00:00:00Z'))

    const RESULT = [
      FROM,
      UnixTime.fromDate(new Date('2021-09-08T00:00:00Z')),
      TO,
    ]

    it('throws if FROM greater than TO', () => {
      expect(() => getFullTimestampsList(TO, FROM, GRANULARITY)).toThrow(
        'FROM cannot be greater than TO'
      )
    })

    it('07.09.2021 00:00 to 09.09.2021 00:00', () => {
      expect(getFullTimestampsList(FROM, TO, GRANULARITY)).toEqual(RESULT)
    })

    it('07.09.2021 01:00 to 09.09.2021 01:00', () => {
      expect(
        getFullTimestampsList(
          FROM.add(1, 'hours'),
          TO.add(1, 'hours'),
          GRANULARITY
        )
      ).toEqual([
        UnixTime.fromDate(new Date('2021-09-08T00:00:00Z')),
        UnixTime.fromDate(new Date('2021-09-09T00:00:00Z')),
      ])
    })
  })
})
