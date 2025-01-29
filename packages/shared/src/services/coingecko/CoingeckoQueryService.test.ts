import { CoingeckoId, UnixTime, getHourlyTimestamps } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { CoingeckoClient } from '../../clients'
import {
  CoingeckoQueryService,
  MAX_DAYS_FOR_HOURLY_PRECISION,
  approximateCirculatingSupply,
  generateRangesToCallHourly,
  pickClosestValues,
} from './CoingeckoQueryService'

describe(CoingeckoQueryService.name, () => {
  describe(CoingeckoQueryService.prototype.getUsdPriceHistoryHourly
    .name, () => {
    it('is called with correct parameters', async () => {
      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          marketCaps: [mock()],
          prices: [mock()],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      await coingeckoQueryService.getUsdPriceHistoryHourly(
        CoingeckoId('weth'),
        UnixTime.fromDate(new Date('2021-01-01')),
        UnixTime.fromDate(new Date('2021-02-01')),
      )
      expect(coingeckoClient.getCoinMarketChartRange).toHaveBeenOnlyCalledWith(
        CoingeckoId('weth'),
        'usd',
        UnixTime.fromDate(new Date('2021-01-01')).add(-14, 'days'),
        UnixTime.fromDate(new Date('2021-01-01')).add(
          MAX_DAYS_FOR_HOURLY_PRECISION - 14,
          'days',
        ),
      )
    })

    it('handles regular hours range returned from API', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          prices: [
            { date: START.toDate(), value: 1200 },
            { date: START.add(1, 'hours').toDate(), value: 1000 },
            { date: START.add(2, 'hours').toDate(), value: 1100 },
          ],
          marketCaps: [mock(), mock(), mock()],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistoryHourly(
        CoingeckoId('weth'),
        START,
        START.add(2, 'hours'),
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200 },
        { timestamp: START.add(1, 'hours'), value: 1000 },
        { timestamp: START.add(2, 'hours'), value: 1100 },
      ])
    })

    it('handles multiple calls to get hourly', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinMarketChartRange: mockFn()
          .returnsOnce({
            prices: [{ date: START.toDate(), value: 1200 }],
            marketCaps: [mock()],
          })
          .returnsOnce({
            prices: [
              {
                date: START.add(MAX_DAYS_FOR_HOURLY_PRECISION, 'days').toDate(),
                value: 1800,
              },
            ],
            marketCaps: [mock()],
          })
          .returnsOnce({
            prices: [
              {
                date: START.add(
                  2 * MAX_DAYS_FOR_HOURLY_PRECISION,
                  'days',
                ).toDate(),
                value: 2400,
              },
            ],
            marketCaps: [mock()],
          }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistoryHourly(
        CoingeckoId('weth'),
        START,
        START.add(2 * MAX_DAYS_FOR_HOURLY_PRECISION, 'hours'),
      )

      const timestamps = getHourlyTimestamps(
        START,
        START.add(2 * MAX_DAYS_FOR_HOURLY_PRECISION, 'hours'),
      )
      const constPrices = [
        { date: START.toDate(), value: 1200 },
        {
          date: START.add(MAX_DAYS_FOR_HOURLY_PRECISION, 'days').toDate(),
          value: 2400,
        },
        {
          date: START.add(2 * MAX_DAYS_FOR_HOURLY_PRECISION, 'days').toDate(),
          value: 2600,
        },
      ]

      expect(prices).toEqual(pickClosestValues(constPrices, timestamps))
    })

    it('handles duplicates in data returned from API', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          prices: [
            { date: START.toDate(), value: 1200 },
            { date: START.toDate(), value: 1200 },
            { date: START.add(1, 'hours').toDate(), value: 1000 },
            { date: START.add(1, 'hours').toDate(), value: 1000 },
            { date: START.add(1, 'hours').toDate(), value: 1000 },
            { date: START.add(2, 'hours').toDate(), value: 1100 },
            { date: START.add(2, 'hours').toDate(), value: 1100 },
          ],
          marketCaps: Array(7).fill(mock()),
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistoryHourly(
        CoingeckoId('weth'),
        START,
        START.add(2, 'hours'),
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200 },
        { timestamp: START.add(1, 'hours'), value: 1000 },
        { timestamp: START.add(2, 'hours'), value: 1100 },
      ])
    })

    it('handles irregular data returned from API', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          prices: [
            { date: START.add(-2, 'minutes').toDate(), value: 1200 },
            { date: START.add(1, 'hours').toDate(), value: 1000 },
            {
              date: START.add(2, 'hours').add(2, 'minutes').toDate(),
              value: 1100,
            },
          ],
          marketCaps: Array(3).fill(mock()),
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistoryHourly(
        CoingeckoId('weth'),
        START,
        START.add(2, 'hours'),
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200 },
        { timestamp: START.add(1, 'hours'), value: 1000 },
        {
          timestamp: START.add(2, 'hours'),
          value: 1100,
        },
      ])
    })

    it('handles unsorted data returned from API', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          prices: [
            { date: START.add(1, 'hours').toDate(), value: 1000 },
            { date: START.toDate(), value: 1200 },
            {
              date: START.add(2, 'hours').toDate(),
              value: 1100,
            },
          ],
          marketCaps: Array(3).fill(mock()),
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistoryHourly(
        CoingeckoId('weth'),
        START,
        START.add(2, 'hours'),
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200 },
        { timestamp: START.add(1, 'hours'), value: 1000 },
        { timestamp: START.add(2, 'hours'), value: 1100 },
      ])
    })
  })

  describe(CoingeckoQueryService.prototype.getCirculatingSupplies.name, () => {
    it('returns circulating supplies', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          prices: [
            { date: START.toDate(), value: 101.2 },
            { date: START.add(1, 'hours').toDate(), value: 110.3 },
            { date: START.add(2, 'hours').toDate(), value: 120.4 },
          ],
          marketCaps: [
            { date: START.toDate(), value: 123456789 },
            { date: START.add(1, 'hours').toDate(), value: 234567891 },
            { date: START.add(2, 'hours').toDate(), value: 345678912 },
          ],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getCirculatingSupplies(
        CoingeckoId('weth'),
        { from: START, to: START.add(2, 'hours') },
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1219900 },
        { timestamp: START.add(1, 'hours'), value: 2126600 },
        { timestamp: START.add(2, 'hours'), value: 2871100 },
      ])
    })
  })

  describe(CoingeckoQueryService.calculateAdjustedTo.name, () => {
    it('adjust range for coingecko hourly query range', () => {
      const from = new UnixTime(0)
      const to = from.add(
        CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL * 2,
        'days',
      )

      const result = CoingeckoQueryService.calculateAdjustedTo(from, to)

      expect(result).toEqual(
        from.add(CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL, 'days'),
      )
    })

    it('does not adjust if the range is smaller than MAX_DAYS_FOR_ONE_CALL', () => {
      const from = new UnixTime(0)
      const to = from.add(
        CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL - 1,
        'days',
      )

      const result = CoingeckoQueryService.calculateAdjustedTo(from, to)

      expect(result).toEqual(to)
    })
  })
})

describe(pickClosestValues.name, () => {
  const START = new UnixTime(1517961600)

  it('works for hours', () => {
    const prices = [
      { value: 1000, date: START.toDate() },
      { value: 1100, date: START.add(1, 'hours').toDate() },
      { value: 1200, date: START.add(2, 'hours').toDate() },
    ]
    const timestamps = getHourlyTimestamps(START, START.add(2, 'hours'))

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START },
      { value: 1100, timestamp: START.add(1, 'hours') },
      { value: 1200, timestamp: START.add(2, 'hours') },
    ])
  })

  it('adjusts dates for slightly off timestamps', () => {
    const prices = [
      { value: 1000, date: START.add(2, 'minutes').toDate() },
      { value: 1100, date: START.add(1, 'hours').add(1, 'minutes').toDate() },
      { value: 1200, date: START.add(2, 'hours').add(3, 'minutes').toDate() },
    ]
    const timestamps = getHourlyTimestamps(START, START.add(2, 'hours'))

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START },
      {
        value: 1100,
        timestamp: START.add(1, 'hours'),
      },
      {
        value: 1200,
        timestamp: START.add(2, 'hours'),
      },
    ])
  })

  it('adjusts dates before the first timestamp', () => {
    const prices = [
      { value: 1000, date: START.add(-2, 'minutes').toDate() },
      { value: 1100, date: START.add(1, 'hours').toDate() },
      { value: 1200, date: START.add(2, 'hours').toDate() },
    ]
    const timestamps = getHourlyTimestamps(START, START.add(2, 'hours'))

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START },
      {
        value: 1100,
        timestamp: START.add(1, 'hours'),
      },
      { value: 1200, timestamp: START.add(2, 'hours') },
    ])
  })

  it('discards unnecessary data', () => {
    const prices = [
      { value: 1100, date: START.add(-2, 'minutes').toDate() },
      { value: 1200, date: START.add(1, 'minutes').toDate() },
      { value: 1300, date: START.add(1, 'hours').toDate() },
      { value: 1400, date: START.add(1, 'hours').add(2, 'minutes').toDate() },
      { value: 1500, date: START.add(2, 'hours').add(-1, 'minutes').toDate() },
      { value: 1600, date: START.add(2, 'hours').add(2, 'minutes').toDate() },
    ]
    const timestamps = getHourlyTimestamps(START, START.add(2, 'hours'))

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1200, timestamp: START },
      { value: 1300, timestamp: START.add(1, 'hours') },
      {
        value: 1500,
        timestamp: START.add(2, 'hours'),
      },
    ])
  })

  it('manufactures single missing datapoint', () => {
    const prices = [
      { value: 1000, date: START.toDate() },
      { value: 1200, date: START.add(2, 'hours').add(-1, 'minutes').toDate() },
    ]
    const timestamps = getHourlyTimestamps(START, START.add(2, 'hours'))

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START },
      {
        value: 1200,
        timestamp: START.add(1, 'hours'),
      },
      { value: 1200, timestamp: START.add(2, 'hours') },
    ])
  })

  it('manufactures multiple missing datapoints', () => {
    const prices = [
      { value: 1000, date: START.toDate() },
      { value: 1400, date: START.add(4, 'hours').toDate() },
    ]
    const timestamps = getHourlyTimestamps(START, START.add(4, 'hours'))

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START },
      {
        value: 1000,
        timestamp: START.add(1, 'hours'),
      },
      {
        value: 1400,
        timestamp: START.add(2, 'hours'),
      },
      {
        value: 1400,
        timestamp: START.add(3, 'hours'),
      },
      { value: 1400, timestamp: START.add(4, 'hours') },
    ])
  })

  it('manufactures start and end datapoints', () => {
    const prices = [{ value: 1100, date: START.add(1, 'hours').toDate() }]
    const timestamps = getHourlyTimestamps(START, START.add(2, 'hours'))

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1100, timestamp: START },
      { value: 1100, timestamp: START.add(1, 'hours') },
      {
        value: 1100,
        timestamp: START.add(2, 'hours'),
      },
    ])
  })
})

describe(generateRangesToCallHourly.name, () => {
  it('30 days', () => {
    const start = UnixTime.fromDate(new Date('2021-07-01T00:00:00Z'))

    expect(generateRangesToCallHourly(start, start.add(30, 'days'))).toEqual([
      {
        start: start,
        end: start.add(30, 'days'),
      },
    ])
  })

  it('90 days', () => {
    const start = UnixTime.fromDate(new Date('2021-07-01T00:00:00Z'))

    expect(generateRangesToCallHourly(start, start.add(90, 'days'))).toEqual([
      {
        start: start,
        end: start.add(MAX_DAYS_FOR_HOURLY_PRECISION, 'days'),
      },
      {
        start: start.add(MAX_DAYS_FOR_HOURLY_PRECISION, 'days'),
        end: start.add(90, 'days'),
      },
    ])
  })

  it('180 days', () => {
    const start = UnixTime.fromDate(new Date('2021-07-01T00:00:00Z'))

    expect(generateRangesToCallHourly(start, start.add(180, 'days'))).toEqual([
      {
        start: start,
        end: start.add(MAX_DAYS_FOR_HOURLY_PRECISION, 'days'),
      },
      {
        start: start.add(MAX_DAYS_FOR_HOURLY_PRECISION, 'days'),
        end: start.add(2 * MAX_DAYS_FOR_HOURLY_PRECISION, 'days'),
      },
      {
        start: start.add(2 * MAX_DAYS_FOR_HOURLY_PRECISION, 'days'),
        end: start.add(180, 'days'),
      },
    ])
  })
})

describe(approximateCirculatingSupply.name, () => {
  const testCases = [
    {
      price: 100,
      marketCap: 100,
      expected: 1,
    },
    {
      price: 100,
      marketCap: 101,
      expected: 1,
    },
    {
      price: 1.01,
      marketCap: 123456789,
      expected: 122230000,
    },
    {
      price: 0.978234,
      marketCap: 1_275_234_567,
      expected: 1303600000,
    },
  ]

  for (const testCase of testCases) {
    it(`marketCap = ${testCase.marketCap}, price = ${testCase.price}`, () => {
      expect(
        approximateCirculatingSupply(testCase.marketCap, testCase.price),
      ).toEqual(testCase.expected)
    })
  }
})

function mock(date?: Date, value?: number) {
  return {
    date: date ?? new Date(),
    value: value ?? 1234567,
  }
}
