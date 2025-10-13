import { CoingeckoId, getHourlyTimestamps, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { CoingeckoClient } from '../../clients'
import {
  approximateCirculatingSupply,
  CoingeckoQueryService,
  generateRangesToCallHourly,
  MAX_DAYS_FOR_HOURLY_PRECISION,
  pickClosestValues,
} from './CoingeckoQueryService'

describe(CoingeckoQueryService.name, () => {
  describe(
    CoingeckoQueryService.prototype.getUsdPriceHistoryHourly.name,
    () => {
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
        expect(
          coingeckoClient.getCoinMarketChartRange,
        ).toHaveBeenOnlyCalledWith(
          CoingeckoId('weth'),
          'usd',
          UnixTime.fromDate(new Date('2021-01-01')) - 14 * UnixTime.DAY,
          UnixTime.fromDate(new Date('2021-01-01')) +
            (MAX_DAYS_FOR_HOURLY_PRECISION - 14) * UnixTime.DAY,
        )
      })

      it('handles regular hours range returned from API', async () => {
        const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

        const coingeckoClient = mockObject<CoingeckoClient>({
          getCoinMarketChartRange: mockFn().returns({
            prices: [
              { date: UnixTime.toDate(START), value: 1200 },
              {
                date: UnixTime.toDate(START + 1 * UnixTime.HOUR),
                value: 1000,
              },
              {
                date: UnixTime.toDate(START + 2 * UnixTime.HOUR),
                value: 1100,
              },
            ],
            marketCaps: [mock(), mock(), mock()],
          }),
        })
        const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
        const prices = await coingeckoQueryService.getUsdPriceHistoryHourly(
          CoingeckoId('weth'),
          START,
          START + 2 * UnixTime.HOUR,
        )
        expect(prices).toEqual([
          { timestamp: START, value: 1200 },
          { timestamp: START + 1 * UnixTime.HOUR, value: 1000 },
          { timestamp: START + 2 * UnixTime.HOUR, value: 1100 },
        ])
      })

      it('handles multiple calls to get hourly', async () => {
        const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

        const coingeckoClient = mockObject<CoingeckoClient>({
          getCoinMarketChartRange: mockFn()
            .returnsOnce({
              prices: [{ date: UnixTime.toDate(START), value: 1200 }],
              marketCaps: [mock()],
            })
            .returnsOnce({
              prices: [
                {
                  date: UnixTime.toDate(
                    START + MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY,
                  ),
                  value: 1800,
                },
              ],
              marketCaps: [mock()],
            })
            .returnsOnce({
              prices: [
                {
                  date: UnixTime.toDate(
                    START + 2 * MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY,
                  ),
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
          START + 2 * MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.HOUR,
        )

        const timestamps = getHourlyTimestamps(
          START,
          START + 2 * MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.HOUR,
        )
        const constPrices = [
          { date: UnixTime.toDate(START), value: 1200 },
          {
            date: UnixTime.toDate(
              START + MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY,
            ),
            value: 2400,
          },
          {
            date: UnixTime.toDate(
              START + 2 * MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY,
            ),
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
              { date: UnixTime.toDate(START), value: 1200 },
              { date: UnixTime.toDate(START), value: 1200 },
              {
                date: UnixTime.toDate(START + 1 * UnixTime.HOUR),
                value: 1000,
              },
              {
                date: UnixTime.toDate(START + 1 * UnixTime.HOUR),
                value: 1000,
              },
              {
                date: UnixTime.toDate(START + 1 * UnixTime.HOUR),
                value: 1000,
              },
              {
                date: UnixTime.toDate(START + 2 * UnixTime.HOUR),
                value: 1100,
              },
              {
                date: UnixTime.toDate(START + 2 * UnixTime.HOUR),
                value: 1100,
              },
            ],
            marketCaps: Array(7).fill(mock()),
          }),
        })
        const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
        const prices = await coingeckoQueryService.getUsdPriceHistoryHourly(
          CoingeckoId('weth'),
          START,
          START + 2 * UnixTime.HOUR,
        )
        expect(prices).toEqual([
          { timestamp: START, value: 1200 },
          { timestamp: START + 1 * UnixTime.HOUR, value: 1000 },
          { timestamp: START + 2 * UnixTime.HOUR, value: 1100 },
        ])
      })

      it('handles irregular data returned from API', async () => {
        const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

        const coingeckoClient = mockObject<CoingeckoClient>({
          getCoinMarketChartRange: mockFn().returns({
            prices: [
              {
                date: UnixTime.toDate(START - 2 * UnixTime.MINUTE),
                value: 1200,
              },
              {
                date: UnixTime.toDate(START + 1 * UnixTime.HOUR),
                value: 1000,
              },
              {
                date: UnixTime.toDate(
                  START + 2 * UnixTime.HOUR + 2 * UnixTime.MINUTE,
                ),
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
          START + 2 * UnixTime.HOUR,
        )
        expect(prices).toEqual([
          { timestamp: START, value: 1200 },
          { timestamp: START + 1 * UnixTime.HOUR, value: 1000 },
          {
            timestamp: START + 2 * UnixTime.HOUR,
            value: 1100,
          },
        ])
      })

      it('handles unsorted data returned from API', async () => {
        const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

        const coingeckoClient = mockObject<CoingeckoClient>({
          getCoinMarketChartRange: mockFn().returns({
            prices: [
              {
                date: UnixTime.toDate(START + 1 * UnixTime.HOUR),
                value: 1000,
              },
              { date: UnixTime.toDate(START), value: 1200 },
              {
                date: UnixTime.toDate(START + 2 * UnixTime.HOUR),
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
          START + 2 * UnixTime.HOUR,
        )
        expect(prices).toEqual([
          { timestamp: START, value: 1200 },
          { timestamp: START + 1 * UnixTime.HOUR, value: 1000 },
          { timestamp: START + 2 * UnixTime.HOUR, value: 1100 },
        ])
      })
    },
  )

  describe(CoingeckoQueryService.prototype.getCirculatingSupplies.name, () => {
    it('returns circulating supplies', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          prices: [
            { date: UnixTime.toDate(START), value: 101.2 },
            {
              date: UnixTime.toDate(START + 1 * UnixTime.HOUR),
              value: 110.3,
            },
            {
              date: UnixTime.toDate(START + 2 * UnixTime.HOUR),
              value: 120.4,
            },
          ],
          marketCaps: [
            { date: UnixTime.toDate(START), value: 123456789 },
            {
              date: UnixTime.toDate(START + 1 * UnixTime.HOUR),
              value: 234567891,
            },
            {
              date: UnixTime.toDate(START + 2 * UnixTime.HOUR),
              value: 345678912,
            },
          ],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getCirculatingSupplies(
        CoingeckoId('weth'),
        { from: START, to: START + 2 * UnixTime.HOUR },
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1219900 },
        { timestamp: START + 1 * UnixTime.HOUR, value: 2126600 },
        { timestamp: START + 2 * UnixTime.HOUR, value: 2871100 },
      ])
    })
  })

  describe(CoingeckoQueryService.calculateAdjustedTo.name, () => {
    it('adjust range for coingecko hourly query range', () => {
      const from = 0
      const to =
        from + CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL * 2 * UnixTime.DAY

      const result = CoingeckoQueryService.calculateAdjustedTo(from, to)

      expect(result).toEqual(
        from + CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL * UnixTime.DAY,
      )
    })

    it('does not adjust if the range is smaller than MAX_DAYS_FOR_ONE_CALL', () => {
      const from = 0
      const to =
        from + (CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL - 1) * UnixTime.DAY

      const result = CoingeckoQueryService.calculateAdjustedTo(from, to)

      expect(result).toEqual(to)
    })
  })

  describe(CoingeckoQueryService.prototype.getAllCoingeckoIds.name, () => {
    it('returns all coingecko ids from coin list', async () => {
      const mockCoinList = [
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
        { id: 'tether', symbol: 'USDT', name: 'Tether' },
      ]

      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().returns(mockCoinList),
      })

      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const result = await coingeckoQueryService.getAllCoingeckoIds()

      expect(result).toEqual(['bitcoin', 'ethereum', 'tether'].map(CoingeckoId))
    })
  })
})

describe(pickClosestValues.name, () => {
  const START = UnixTime(1517961600)

  it('works for hours', () => {
    const prices = [
      { value: 1000, date: UnixTime.toDate(START) },
      { value: 1100, date: UnixTime.toDate(START + 1 * UnixTime.HOUR) },
      { value: 1200, date: UnixTime.toDate(START + 2 * UnixTime.HOUR) },
    ]
    const timestamps = getHourlyTimestamps(START, START + 2 * UnixTime.HOUR)

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START },
      { value: 1100, timestamp: START + 1 * UnixTime.HOUR },
      { value: 1200, timestamp: START + 2 * UnixTime.HOUR },
    ])
  })

  it('adjusts dates for slightly off timestamps', () => {
    const prices = [
      { value: 1000, date: UnixTime.toDate(START + 2 * UnixTime.MINUTE) },
      {
        value: 1100,
        date: UnixTime.toDate(START + 1 * UnixTime.HOUR + 1 * UnixTime.MINUTE),
      },
      {
        value: 1200,
        date: UnixTime.toDate(START + 2 * UnixTime.HOUR + 3 * UnixTime.MINUTE),
      },
    ]
    const timestamps = getHourlyTimestamps(START, START + 2 * UnixTime.HOUR)

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START },
      {
        value: 1100,
        timestamp: START + 1 * UnixTime.HOUR,
      },
      {
        value: 1200,
        timestamp: START + 2 * UnixTime.HOUR,
      },
    ])
  })

  it('adjusts dates before the first timestamp', () => {
    const prices = [
      { value: 1000, date: UnixTime.toDate(START - 2 * UnixTime.MINUTE) },
      { value: 1100, date: UnixTime.toDate(START + 1 * UnixTime.HOUR) },
      { value: 1200, date: UnixTime.toDate(START + 2 * UnixTime.HOUR) },
    ]
    const timestamps = getHourlyTimestamps(START, START + 2 * UnixTime.HOUR)

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START },
      {
        value: 1100,
        timestamp: START + 1 * UnixTime.HOUR,
      },
      { value: 1200, timestamp: START + 2 * UnixTime.HOUR },
    ])
  })

  it('discards unnecessary data', () => {
    const prices = [
      { value: 1100, date: UnixTime.toDate(START - 2 * UnixTime.MINUTE) },
      { value: 1200, date: UnixTime.toDate(START + 1 * UnixTime.MINUTE) },
      { value: 1300, date: UnixTime.toDate(START + 1 * UnixTime.HOUR) },
      {
        value: 1400,
        date: UnixTime.toDate(START + 1 * UnixTime.HOUR + 2 * UnixTime.MINUTE),
      },
      {
        value: 1500,
        date: UnixTime.toDate(START + 2 * UnixTime.HOUR - 1 * UnixTime.MINUTE),
      },
      {
        value: 1600,
        date: UnixTime.toDate(START + 2 * UnixTime.HOUR + 2 * UnixTime.MINUTE),
      },
    ]
    const timestamps = getHourlyTimestamps(START, START + 2 * UnixTime.HOUR)

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1200, timestamp: START },
      { value: 1300, timestamp: START + 1 * UnixTime.HOUR },
      {
        value: 1500,
        timestamp: START + 2 * UnixTime.HOUR,
      },
    ])
  })

  it('manufactures single missing datapoint', () => {
    const prices = [
      { value: 1000, date: UnixTime.toDate(START) },
      {
        value: 1200,
        date: UnixTime.toDate(START + 2 * UnixTime.HOUR - 1 * UnixTime.MINUTE),
      },
    ]
    const timestamps = getHourlyTimestamps(START, START + 2 * UnixTime.HOUR)

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START },
      {
        value: 1200,
        timestamp: START + 1 * UnixTime.HOUR,
      },
      { value: 1200, timestamp: START + 2 * UnixTime.HOUR },
    ])
  })

  it('manufactures multiple missing datapoints', () => {
    const prices = [
      { value: 1000, date: UnixTime.toDate(START) },
      { value: 1400, date: UnixTime.toDate(START + 4 * UnixTime.HOUR) },
    ]
    const timestamps = getHourlyTimestamps(START, START + 4 * UnixTime.HOUR)

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START },
      {
        value: 1000,
        timestamp: START + 1 * UnixTime.HOUR,
      },
      {
        value: 1400,
        timestamp: START + 2 * UnixTime.HOUR,
      },
      {
        value: 1400,
        timestamp: START + 3 * UnixTime.HOUR,
      },
      { value: 1400, timestamp: START + 4 * UnixTime.HOUR },
    ])
  })

  it('manufactures start and end datapoints', () => {
    const prices = [
      { value: 1100, date: UnixTime.toDate(START + 1 * UnixTime.HOUR) },
    ]
    const timestamps = getHourlyTimestamps(START, START + 2 * UnixTime.HOUR)

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1100, timestamp: START },
      { value: 1100, timestamp: START + 1 * UnixTime.HOUR },
      {
        value: 1100,
        timestamp: START + 2 * UnixTime.HOUR,
      },
    ])
  })
})

describe(generateRangesToCallHourly.name, () => {
  it('30 days', () => {
    const start = UnixTime.fromDate(new Date('2021-07-01T00:00:00Z'))

    expect(
      generateRangesToCallHourly(start, start + 30 * UnixTime.DAY),
    ).toEqual([
      {
        start: start,
        end: start + 30 * UnixTime.DAY,
      },
    ])
  })

  it('90 days', () => {
    const start = UnixTime.fromDate(new Date('2021-07-01T00:00:00Z'))

    expect(
      generateRangesToCallHourly(start, start + 90 * UnixTime.DAY),
    ).toEqual([
      {
        start: start,
        end: start + MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY,
      },
      {
        start: start + MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY,
        end: start + 90 * UnixTime.DAY,
      },
    ])
  })

  it('180 days', () => {
    const start = UnixTime.fromDate(new Date('2021-07-01T00:00:00Z'))

    expect(
      generateRangesToCallHourly(start, start + 180 * UnixTime.DAY),
    ).toEqual([
      {
        start: start,
        end: start + MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY,
      },
      {
        start: start + MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY,
        end: start + 2 * MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY,
      },
      {
        start: start + 2 * MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY,
        end: start + 180 * UnixTime.DAY,
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
