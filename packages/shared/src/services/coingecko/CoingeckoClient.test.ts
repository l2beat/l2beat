import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { CoingeckoId, UnixTime, json } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { HttpClient2 } from '../../clients'
import { RetryHandler } from '../../tools'
import { CoingeckoClient } from './CoingeckoClient'
import { CoinMarketChartRangeData, CoinMarketChartRangeResult } from './model'

describe(CoingeckoClient.name, () => {
  const rateLimiter = new RateLimiter({ callsPerMinute: 100_000 })
  const logger = Logger.SILENT

  describe(CoingeckoClient.prototype.getCoinMarketChartRange.name, () => {
    const MOCK_PARSED_DATA: CoinMarketChartRangeResult = {
      prices: [
        [1592611200000, 228.9592128032193],
        [1592697600000, 228.8691487972198],
        [1592784000000, 227.79190590968685],
      ],
      market_caps: [
        [1592611200000, 25534271650.26011],
        [1592697600000, 25501270877.342506],
        [1592784000000, 25381090910.620564],
      ],
      total_volumes: [
        [1592611200000, 6840801770.229276],
        [1592697600000, 5400222130.457475],
        [1592784000000, 4995955268.45639],
      ],
    }
    const MOCK_TRANSFORMED_DATA: CoinMarketChartRangeData = {
      prices: [
        { date: new Date(1592611200000), value: 228.9592128032193 },
        { date: new Date(1592697600000), value: 228.8691487972198 },
        { date: new Date(1592784000000), value: 227.79190590968685 },
      ],
      marketCaps: [
        { date: new Date(1592611200000), value: 25534271650.26011 },
        { date: new Date(1592697600000), value: 25501270877.342506 },
        { date: new Date(1592784000000), value: 25381090910.620564 },
      ],
    }

    it('fetches historical prices', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => MOCK_PARSED_DATA,
      })
      const coingeckoClient = new CoingeckoClient({
        http,
        apiKey: undefined,
        retryHandler: RetryHandler.TEST,
        logger,
        rateLimiter,
      })
      const result = await coingeckoClient.getCoinMarketChartRange(
        CoingeckoId('ethereum'),
        'usd',
        new UnixTime(1592577232),
        new UnixTime(1622577232),
      )

      expect(result).toEqual(MOCK_TRANSFORMED_DATA)
    })

    it('constructs correct url', async () => {
      const http = mockObject<HttpClient2>({
        async fetch(url) {
          expect(url).toEqual(
            'https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=1592577232&to=1622577232',
          )
          return MOCK_PARSED_DATA
        },
      })

      const coingeckoClient = new CoingeckoClient({
        http,
        apiKey: undefined,
        retryHandler: RetryHandler.TEST,
        logger,
        rateLimiter,
      })
      await coingeckoClient.getCoinMarketChartRange(
        CoingeckoId('ethereum'),
        'usd',
        new UnixTime(1592577232),
        new UnixTime(1622577232),
      )
    })
  })

  describe(CoingeckoClient.prototype.getCoinList.name, () => {
    it('fetches coins without platforms', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => [
          { id: 'asd', symbol: 'ASD', name: 'A Sad Dime' },
          { id: 'foobar', symbol: 'FBR', name: 'Foobar coin' },
        ],
      })
      const coingeckoClient = new CoingeckoClient({
        http,
        apiKey: undefined,
        retryHandler: RetryHandler.TEST,
        logger,
        rateLimiter,
      })
      const result = await coingeckoClient.getCoinList()
      expect(result).toEqual([
        { id: CoingeckoId('asd'), symbol: 'ASD', name: 'A Sad Dime' },
        { id: CoingeckoId('foobar'), symbol: 'FBR', name: 'Foobar coin' },
      ])
    })

    it('fetches coins with platforms', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async (): Promise<json> => [
          {
            id: 'asd',
            symbol: 'ASD',
            name: 'A Sad Dime',
            platforms: {
              ethereum: '0x1234',
              arbitrum: '0x5678',
            },
          },
          {
            id: 'foobar',
            symbol: 'FBR',
            name: 'Foobar coin',
            platforms: {},
          },
        ],
      })
      const coingeckoClient = new CoingeckoClient({
        http,
        apiKey: undefined,
        retryHandler: RetryHandler.TEST,
        logger,
        rateLimiter,
      })
      const result = await coingeckoClient.getCoinList({
        includePlatform: true,
      })
      expect(result).toEqual([
        {
          id: CoingeckoId('asd'),
          symbol: 'ASD',
          name: 'A Sad Dime',
          platforms: {
            ethereum: '0x1234',
            arbitrum: '0x5678',
          },
        },
        {
          id: CoingeckoId('foobar'),
          symbol: 'FBR',
          name: 'Foobar coin',
          platforms: {},
        },
      ])
    })
  })

  describe(CoingeckoClient.prototype.query.name, () => {
    it('constructs a correct url without api key', async () => {
      const http = mockObject<HttpClient2>({
        async fetch(url): Promise<json> {
          expect(url).toEqual(
            'https://api.coingecko.com/api/v3/a/b?foo=bar&baz=123',
          )
          return { status: '1', message: 'OK' }
        },
      })

      const coingeckoClient = new CoingeckoClient({
        http,
        apiKey: undefined,
        retryHandler: RetryHandler.TEST,
        logger,
        rateLimiter,
      })
      await coingeckoClient.query('/a/b', { foo: 'bar', baz: '123' })
    })

    it('constructs a correct url with api key', async () => {
      const http = mockObject<HttpClient2>({
        async fetch(url): Promise<json> {
          expect(url).toEqual(
            'https://pro-api.coingecko.com/api/v3/a/b?foo=bar&baz=123&x_cg_pro_api_key=myapikey',
          )
          return { status: '1', message: 'OK' }
        },
      })

      const coingeckoClient = new CoingeckoClient({
        http,
        apiKey: 'myapikey',
        retryHandler: RetryHandler.TEST,
        logger,
        rateLimiter,
      })
      await coingeckoClient.query('/a/b', { foo: 'bar', baz: '123' })
    })

    it('constructs a correct when there are no options', async () => {
      const http = mockObject<HttpClient2>({
        async fetch(url): Promise<json> {
          expect(url).toEqual('https://api.coingecko.com/api/v3/a/b')
          return { status: '1', message: 'OK' }
        },
      })

      const coingeckoClient = new CoingeckoClient({
        http,
        apiKey: undefined,
        retryHandler: RetryHandler.TEST,
        logger,
        rateLimiter,
      })
      await coingeckoClient.query('/a/b', {})
    })
  })
})
