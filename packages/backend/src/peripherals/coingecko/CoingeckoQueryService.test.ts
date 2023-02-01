import {
  CoingeckoClient,
  getTimestamps,
  HttpClient,
  mock,
} from '@l2beat/common'
import { CoingeckoId, EthereumAddress, UnixTime } from '@l2beat/types'
import { expect, mockFn } from 'earljs'

import {
  COINGECKO_HOURLY_MAX_SPAN_IN_DAYS,
  CoingeckoQueryService,
  generateRangesToCallHourly,
  pickPrices,
  PriceHistoryPoint,
} from './CoingeckoQueryService'

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
        CoingeckoId('weth'),
        UnixTime.fromDate(new Date('2021-01-01')).add(-5, 'minutes'),
        UnixTime.fromDate(new Date('2022-01-01')).add(5, 'minutes'),
        'daily',
      )
      expect(
        coingeckoClient.getCoinMarketChartRange,
      ).toHaveBeenCalledExactlyWith([
        [
          CoingeckoId('weth'),
          'usd',
          UnixTime.fromDate(new Date('2021-01-01')).add(-12, 'hours'),
          UnixTime.fromDate(new Date('2022-01-01')).add(12, 'hours'),
          undefined,
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
        CoingeckoId('weth'),
        START,
        START.add(2, 'days'),
        'daily',
      )
      expect(prices).toEqual([
        { timestamp: START, value: 1200, deltaMs: 0 },
        { timestamp: START.add(1, 'days'), value: 1000, deltaMs: 0 },
        { timestamp: START.add(2, 'days'), value: 1100, deltaMs: 0 },
      ])
    })

    it('handles multiple calls to get hourly', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mock<CoingeckoClient>({
        getCoinMarketChartRange: mockFn()
          .returnsOnce({
            prices: [
              { date: START.toDate(), price: 1200 },
              { date: START.add(30, 'days').toDate(), price: 1000 },
              { date: START.add(60, 'days').toDate(), price: 1400 },
              { date: START.add(80, 'days').toDate(), price: 1800 },
            ],
            marketCaps: [],
            totalVolumes: [],
          })
          .returnsOnce({
            prices: [
              { date: START.add(80, 'days').toDate(), price: 1800 },
              { date: START.add(90, 'days').toDate(), price: 1700 },
              { date: START.add(120, 'days').toDate(), price: 1900 },
              { date: START.add(150, 'days').toDate(), price: 2000 },
              { date: START.add(160, 'days').toDate(), price: 2400 },
            ],
            marketCaps: [],
            totalVolumes: [],
          })
          .returnsOnce({
            prices: [
              { date: START.add(160, 'days').toDate(), price: 2400 },
              { date: START.add(180, 'days').toDate(), price: 2600 },
            ],
            marketCaps: [],
            totalVolumes: [],
          }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistory(
        CoingeckoId('weth'),
        START,
        START.add(180, 'days'),
        'hourly',
      )

      const timestamps = getTimestamps(START, START.add(180, 'days'), 'hourly')
      const constPrices = [
        { date: START.toDate(), price: 1200 },
        { date: START.add(30, 'days').toDate(), price: 1000 },
        { date: START.add(60, 'days').toDate(), price: 1400 },
        { date: START.add(80, 'days').toDate(), price: 1800 },
        { date: START.add(90, 'days').toDate(), price: 1700 },
        { date: START.add(120, 'days').toDate(), price: 1900 },
        { date: START.add(150, 'days').toDate(), price: 2000 },
        { date: START.add(160, 'days').toDate(), price: 2400 },
        { date: START.add(180, 'days').toDate(), price: 2600 },
      ]

      expect(prices).toEqual(pickPrices(constPrices, timestamps))
    })

    it('handles duplicates in data returned from API', async () => {
      const START = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))

      const coingeckoClient = mock<CoingeckoClient>({
        getCoinMarketChartRange: mockFn().returns({
          prices: [
            { date: START.toDate(), price: 1200 },
            { date: START.toDate(), price: 1200 },
            { date: START.add(1, 'days').toDate(), price: 1000 },
            { date: START.add(1, 'days').toDate(), price: 1000 },
            { date: START.add(1, 'days').toDate(), price: 1000 },
            { date: START.add(2, 'days').toDate(), price: 1100 },
            { date: START.add(2, 'days').toDate(), price: 1100 },
          ],
          marketCaps: [],
          totalVolumes: [],
        }),
      })
      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
      const prices = await coingeckoQueryService.getUsdPriceHistory(
        CoingeckoId('weth'),
        START,
        START.add(2, 'days'),
        'daily',
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
        CoingeckoId('weth'),
        START,
        START.add(2, 'days'),
        'daily',
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
        CoingeckoId('weth'),
        START,
        START.add(2, 'days'),
        'daily',
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

  describe(CoingeckoQueryService.prototype.getCoinIds.name, () => {
    it('called with correct parameters', async () => {
      const coingeckoClient = mock<CoingeckoClient>({
        getCoinList: mockFn().returns([]),
      })

      const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

      await coingeckoQueryService.getCoinIds()
      expect(coingeckoClient.getCoinList).toHaveBeenCalledExactlyWith([
        [
          {
            includePlatform: true,
          },
        ],
      ])
    })

    it('list of coingeckoIds', async () => {
      const coingeckoClient = mock<CoingeckoClient>({
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
      const coingeckoClient = mock<CoingeckoClient>({
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
})

describe(pickPrices.name, () => {
  const START = new UnixTime(1517961600)

  it('works for days', () => {
    const prices = [
      { price: 1000, date: START.toDate() },
      { price: 1100, date: START.add(1, 'days').toDate() },
      { price: 1200, date: START.add(2, 'days').toDate() },
    ]
    const timestamps = getTimestamps(START, START.add(2, 'days'), 'daily')

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
    const timestamps = getTimestamps(START, START.add(2, 'hours'), 'hourly')

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
    const timestamps = getTimestamps(START, START.add(2, 'days'), 'daily')

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
    const timestamps = getTimestamps(START, START.add(2, 'days'), 'daily')

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
    const timestamps = getTimestamps(START, START.add(2, 'days'), 'daily')

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
    const timestamps = getTimestamps(START, START.add(2, 'days'), 'daily')

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
    const timestamps = getTimestamps(START, START.add(4, 'days'), 'daily')

    expect(pickPrices(prices, timestamps)).toEqual([
      { value: 1000, timestamp: START, deltaMs: 0 },
      {
        value: 1000,
        timestamp: START.add(1, 'days'),
        deltaMs: -24 * 60 * 60 * 1000,
      },
      {
        value: 1400,
        timestamp: START.add(2, 'days'),
        deltaMs: 48 * 60 * 60 * 1000,
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
    const timestamps = getTimestamps(START, START.add(2, 'days'), 'daily')

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
        end: start.add(COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days'),
      },
      {
        start: start.add(COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days'),
        end: start.add(90, 'days'),
      },
    ])
  })

  it('180 days', () => {
    const start = UnixTime.fromDate(new Date('2021-07-01T00:00:00Z'))

    expect(generateRangesToCallHourly(start, start.add(180, 'days'))).toEqual([
      {
        start: start,
        end: start.add(COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days'),
      },
      {
        start: start.add(COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days'),
        end: start.add(2 * COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days'),
      },
      {
        start: start.add(2 * COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days'),
        end: start.add(180, 'days'),
      },
    ])
  })
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

  it('daily', async () => {
    const data = await coingeckoQueryService.getUsdPriceHistory(
      TOKEN,
      START,
      START.add(DAYS_SPAN, 'days'),
      'daily',
    )

    const ratio = getFaultRatio(data)

    expect(ratio).toEqual(0)
  })

  it('hourly', async () => {
    const data = await coingeckoQueryService.getUsdPriceHistory(
      TOKEN,
      START,
      START.add(DAYS_SPAN, 'days'),
      'hourly',
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

  const getFaultRatio = (data: PriceHistoryPoint[]) => {
    const faultyData = data
      .map((i) => i.deltaMs / 1000 / 60)
      .filter((i) => i > MAX_TRESHOLD_MINUTES)

    return faultyData.length / data.length
  }
})
