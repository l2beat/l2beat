import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import {
  CoingeckoId,
  EthereumAddress,
  getHourlyTimestamps,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import {
  approximateCirculatingSupply,
  CoingeckoQueryService,
  generateRangesToCallHourly,
  MAX_DAYS_FOR_HOURLY_PRECISION,
  pickClosestValues,
  QueryResultPoint,
} from './CoingeckoQueryService'

describe(CoingeckoQueryService.name, () => {
  describe(CoingeckoQueryService.prototype.getUsdPriceHistory.name, () => {
    it('is called with correct parameters', async () => {
      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          marketCaps: [],
          totalVolumes: [],
          prices: [
            {
              date: new Date(),
              value: 1234567,
            },
          ],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      await coingeckoQueryService.getUsdPriceHistory(
        CoingeckoId('weth'),
        UnixTime.fromDate(new Date('2021-01-01')).add(-5, 'minutes'),
        UnixTime.fromDate(new Date('2021-02-01')).add(5, 'minutes'),
      )
      expect(coingeckoClient.getCoinMarketChartRange).toHaveBeenOnlyCalledWith(
        CoingeckoId('weth'),
        'usd',
        UnixTime.fromDate(new Date('2021-01-01')).add(-12, 'hours'),
        UnixTime.fromDate(new Date('2021-02-01')).add(12, 'hours'),
        undefined,
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
          marketCaps: [],
          totalVolumes: [],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistory(
        CoingeckoId('weth'),
        START,
        START.add(2, 'hours'),
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200, deltaMs: 0 },
        { timestamp: START.add(1, 'hours'), value: 1000, deltaMs: 0 },
        { timestamp: START.add(2, 'hours'), value: 1100, deltaMs: 0 },
      ])
    })

    it('handles multiple calls to get hourly', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinMarketChartRange: mockFn()
          .returnsOnce({
            prices: [{ date: START.toDate(), value: 1200 }],
            marketCaps: [],
            totalVolumes: [],
          })
          .returnsOnce({
            prices: [
              {
                date: START.add(MAX_DAYS_FOR_HOURLY_PRECISION, 'days').toDate(),
                value: 1800,
              },
            ],
            marketCaps: [],
            totalVolumes: [],
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
            marketCaps: [],
            totalVolumes: [],
          }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistory(
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
          marketCaps: [],
          totalVolumes: [],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistory(
        CoingeckoId('weth'),
        START,
        START.add(2, 'hours'),
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200, deltaMs: 0 },
        { timestamp: START.add(1, 'hours'), value: 1000, deltaMs: 0 },
        { timestamp: START.add(2, 'hours'), value: 1100, deltaMs: 0 },
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
          marketCaps: [],
          totalVolumes: [],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistory(
        CoingeckoId('weth'),
        START,
        START.add(2, 'hours'),
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200, deltaMs: -2 * 60 * 1000 },
        { timestamp: START.add(1, 'hours'), value: 1000, deltaMs: 0 },
        {
          timestamp: START.add(2, 'hours'),
          value: 1100,
          deltaMs: 2 * 60 * 1000,
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
          marketCaps: [],
          totalVolumes: [],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistory(
        CoingeckoId('weth'),
        START,
        START.add(2, 'hours'),
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200, deltaMs: 0 },
        { timestamp: START.add(1, 'hours'), value: 1000, deltaMs: 0 },
        {
          timestamp: START.add(2, 'hours'),
          value: 1100,
          deltaMs: 0,
        },
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
          totalVolumes: [],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getCirculatingSupplies(
        CoingeckoId('weth'),
        { from: START, to: START.add(2, 'hours') },
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1219900, deltaMs: 0 },
        { timestamp: START.add(1, 'hours'), value: 2126600, deltaMs: 0 },
        { timestamp: START.add(2, 'hours'), value: 2871100, deltaMs: 0 },
      ])
    })
  })

  describe(CoingeckoQueryService.prototype.getCoinIds.name, () => {
    it('called with correct parameters', async () => {
      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().returns([]),
      })

      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

      await coingeckoQueryService.getCoinIds()
      expect(coingeckoClient.getCoinList).toHaveBeenOnlyCalledWith({
        includePlatform: true,
      })
    })

    it('list of coingeckoIds', async () => {
      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().returns([
          {
            id: CoingeckoId('aave'),
            symbol: 'aave',
            name: 'Aave',
            platforms: {
              ethereum: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
            },
          },
          {
            id: CoingeckoId('compound-governance-token'),
            symbol: 'comp',
            name: 'Compound',
            platforms: {
              ethereum: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
            },
          },
          {
            id: CoingeckoId('uniswap'),
            symbol: 'uni',
            name: 'Uniswap',
            platforms: {
              ethereum: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
            },
          },
        ]),
      })

      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

      const coinsIds = await coingeckoQueryService.getCoinIds()

      expect(coinsIds).toEqual(
        new Map([
          [
            EthereumAddress('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'),
            CoingeckoId('aave'),
          ],
          [
            EthereumAddress('0xc00e94Cb662C3520282E6f5717214004A7f26888'),
            CoingeckoId('compound-governance-token'),
          ],
          [
            EthereumAddress('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'),
            CoingeckoId('uniswap'),
          ],
        ]),
      )
    })

    it('coin does not have ethereum address', async () => {
      const coingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().returns([
          {
            id: CoingeckoId('aave'),
            symbol: 'aave',
            name: 'Aave',
            platforms: {
              ethereum: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
            },
          },
          {
            id: CoingeckoId('compound-governance-token'),
            symbol: 'comp',
            name: 'Compound',
            platforms: {},
          },
          {
            id: CoingeckoId('uniswap'),
            symbol: 'uni',
            name: 'Uniswap',
            platforms: {},
          },
        ]),
      })

      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

      const coinsIds = await coingeckoQueryService.getCoinIds()

      expect(coinsIds).toEqual(
        new Map([
          [
            EthereumAddress('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'),
            CoingeckoId('aave'),
          ],
        ]),
      )
    })
  })

  describe(
    CoingeckoQueryService.prototype.queryRawHourlyPricesAndMarketCaps.name,
    () => {
      it('calls for the data until empty', async () => {
        const START = UnixTime.now()

        const coingeckoClient = mockObject<CoingeckoClient>({
          getCoinMarketChartRange: mockFn()
            .returnsOnce({
              prices: [{ date: START.add(1, 'hours').toDate(), value: 100 }],
              marketCaps: [
                { date: START.add(1, 'hours').toDate(), value: 200 },
              ],
              totalVolumes: [
                { date: START.add(1, 'hours').toDate(), value: 300 },
              ],
            })
            .returnsOnce({
              prices: [{ date: START.toDate(), value: 100 }],
              marketCaps: [{ date: START.toDate(), value: 200 }],
              totalVolumes: [{ date: START.toDate(), value: 300 }],
            })
            .returnsOnce({
              prices: [],
              marketCaps: [],
              totalVolumes: [],
            }),
        })
        const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
        const queryResult =
          await coingeckoQueryService.queryRawHourlyPricesAndMarketCaps(
            CoingeckoId('weth'),
            undefined,
            START.add(1, 'hours'),
          )
        expect(queryResult).toEqual({
          prices: [
            { date: START.toDate(), value: 100 },
            { date: START.add(1, 'hours').toDate(), value: 100 },
          ],
          marketCaps: [
            { date: START.toDate(), value: 200 },
            { date: START.add(1, 'hours').toDate(), value: 200 },
          ],
          totalVolumes: [
            { date: START.toDate(), value: 300 },
            { date: START.add(1, 'hours').toDate(), value: 300 },
          ],
        })
      })
    },
  )
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
      { value: 1000, timestamp: START, deltaMs: 0 },
      { value: 1100, timestamp: START.add(1, 'hours'), deltaMs: 0 },
      { value: 1200, timestamp: START.add(2, 'hours'), deltaMs: 0 },
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
      { value: 1000, timestamp: START, deltaMs: 2 * 60 * 1000 },
      {
        value: 1100,
        timestamp: START.add(1, 'hours'),
        deltaMs: 1 * 60 * 1000,
      },
      {
        value: 1200,
        timestamp: START.add(2, 'hours'),
        deltaMs: 3 * 60 * 1000,
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
      { value: 1000, timestamp: START, deltaMs: -2 * 60 * 1000 },
      {
        value: 1100,
        timestamp: START.add(1, 'hours'),
        deltaMs: 0,
      },
      { value: 1200, timestamp: START.add(2, 'hours'), deltaMs: 0 },
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
      { value: 1200, timestamp: START, deltaMs: 1 * 60 * 1000 },
      { value: 1300, timestamp: START.add(1, 'hours'), deltaMs: 0 },
      {
        value: 1500,
        timestamp: START.add(2, 'hours'),
        deltaMs: -1 * 60 * 1000,
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
      { value: 1000, timestamp: START, deltaMs: 0 },
      {
        value: 1200,
        timestamp: START.add(1, 'hours'),
        deltaMs: 60 * 60 * 1000 - 60 * 1000,
      },
      { value: 1200, timestamp: START.add(2, 'hours'), deltaMs: -60 * 1000 },
    ])
  })

  it('manufactures multiple missing datapoints', () => {
    const prices = [
      { value: 1000, date: START.toDate() },
      { value: 1400, date: START.add(4, 'hours').toDate() },
    ]
    const timestamps = getHourlyTimestamps(START, START.add(4, 'hours'))

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: 0 },
      {
        value: 1000,
        timestamp: START.add(1, 'hours'),
        deltaMs: -1 * 60 * 60 * 1000,
      },
      {
        value: 1400,
        timestamp: START.add(2, 'hours'),
        deltaMs: 2 * 60 * 60 * 1000,
      },
      {
        value: 1400,
        timestamp: START.add(3, 'hours'),
        deltaMs: 1 * 60 * 60 * 1000,
      },
      { value: 1400, timestamp: START.add(4, 'hours'), deltaMs: 0 },
    ])
  })

  it('manufactures start and end datapoints', () => {
    const prices = [{ value: 1100, date: START.add(1, 'hours').toDate() }]
    const timestamps = getHourlyTimestamps(START, START.add(2, 'hours'))

    expect(pickClosestValues(prices, timestamps)).toEqual([
      { value: 1100, timestamp: START, deltaMs: 1 * 60 * 60 * 1000 },
      { value: 1100, timestamp: START.add(1, 'hours'), deltaMs: 0 },
      {
        value: 1100,
        timestamp: START.add(2, 'hours'),
        deltaMs: -1 * 60 * 60 * 1000,
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

describe.skip(CoingeckoQueryService.name + ' e2e tests', function () {
  this.timeout(100000)

  const TOKEN = CoingeckoId('ethereum')
  const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))
  const DAYS_SPAN = 90
  const MAX_TRESHOLD_MINUTES = 25
  const EXPECTED_HOURLY_FAULT_RATIO = 0.15

  const httpClient = new HttpClient()
  const coingeckoClient = new CoingeckoClient(httpClient, undefined)
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  it('hourly', async () => {
    const data = await coingeckoQueryService.getUsdPriceHistory(
      TOKEN,
      START,
      START.add(DAYS_SPAN, 'hours'),
    )

    const ratio = getFaultRatio(data)

    expect(ratio < EXPECTED_HOURLY_FAULT_RATIO).toEqual(true)

    console.log('Token = ', TOKEN)
    console.log('Days span = ', DAYS_SPAN)
    console.log('Max fault [min] = ', MAX_TRESHOLD_MINUTES)
    console.log('=================')
    console.log('Fault ratio = ', Math.round(ratio * 100) / 100)
    console.log('Expected hourly fault ratio = ', EXPECTED_HOURLY_FAULT_RATIO)
    console.log('=================')

    let sum = 0
    data.forEach((point) => (sum += point.deltaMs))
    const average = sum / data.length

    console.log('Average fault [min] = ', average / 1000 / 60)

    let res = 0
    data.forEach((point) => (res += Math.pow(point.deltaMs - average, 2)))
    const deviation = Math.sqrt(res / data.length)
    console.log('Standard deviation [min] = ', deviation / 1000 / 60)
  })

  const getFaultRatio = (data: QueryResultPoint[]) => {
    const faultyData = data
      .map((i) => i.deltaMs / 1000 / 60)
      .filter((i) => i > MAX_TRESHOLD_MINUTES)

    return faultyData.length / data.length
  }
})
