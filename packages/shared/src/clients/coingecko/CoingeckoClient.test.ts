import { Logger } from '@l2beat/backend-tools'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'
import type { HttpClient } from '../../clients'
import { CoingeckoClient } from './CoingeckoClient'
import type {
  CoinMarketChartRangeData,
  CoinMarketChartRangeResult,
} from './types'

describe(CoingeckoClient.name, () => {
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
      const http = mockObject<HttpClient>({
        fetch: async () => MOCK_PARSED_DATA,
      })
      const coingeckoClient = getMockClient(http, logger)
      const result = await coingeckoClient.getCoinMarketChartRange(
        CoingeckoId('ethereum'),
        'usd',
        UnixTime(1592577232),
        UnixTime(1622577232),
      )

      expect(result).toEqual(MOCK_TRANSFORMED_DATA)
    })

    it('constructs correct url', async () => {
      const http = mockObject<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            'https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=1592577232&to=1622577232',
          )
          return MOCK_PARSED_DATA
        },
      })

      const coingeckoClient = getMockClient(http, logger)

      await coingeckoClient.getCoinMarketChartRange(
        CoingeckoId('ethereum'),
        'usd',
        UnixTime(1592577232),
        UnixTime(1622577232),
      )
    })

    it('if range ends in the future queries until UnixTime.now()', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => MOCK_PARSED_DATA,
      })
      const coingeckoClient = getMockClient(http, logger)

      const from = 100
      const to = UnixTime.now() + UnixTime.DAY

      await coingeckoClient.getCoinMarketChartRange(
        CoingeckoId('ethereum'),
        'usd',
        UnixTime(from),
        to,
      )

      const url = new URL(http.fetch.calls[0].args[0])
      const queriedTo = Number(url.searchParams.get('to'))

      expect(queriedTo).toBeLessThan(to)
      expect(queriedTo).toBeLessThanOrEqual(UnixTime.now())
    })
  })

  describe(CoingeckoClient.prototype.getCoinList.name, () => {
    it('fetches coins without platforms', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => [
          { id: 'asd', symbol: 'ASD', name: 'A Sad Dime' },
          { id: 'foobar', symbol: 'FBR', name: 'Foobar coin' },
        ],
      })
      const coingeckoClient = getMockClient(http, logger)

      const result = await coingeckoClient.getCoinList()
      expect(result).toEqual([
        { id: CoingeckoId('asd'), symbol: 'ASD', name: 'A Sad Dime' },
        { id: CoingeckoId('foobar'), symbol: 'FBR', name: 'Foobar coin' },
      ])
    })

    it('fetches coins with platforms', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => [
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
      const coingeckoClient = getMockClient(http, logger)

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
      const http = mockObject<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            'https://api.coingecko.com/api/v3/a/b?foo=bar&baz=123',
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const coingeckoClient = getMockClient(http, logger)

      await coingeckoClient.query('/a/b', { foo: 'bar', baz: '123' })
    })

    it('constructs a correct url with api key', async () => {
      const http = mockObject<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            'https://pro-api.coingecko.com/api/v3/a/b?foo=bar&baz=123&x_cg_pro_api_key=myapikey',
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const apiKey = 'myapikey'
      const coingeckoClient = getMockClient(http, logger, apiKey)

      await coingeckoClient.query('/a/b', { foo: 'bar', baz: '123' })
    })

    it('constructs a correct URL when there are no options', async () => {
      const http = mockObject<HttpClient>({
        async fetch(url) {
          expect(url).toEqual('https://api.coingecko.com/api/v3/a/b')
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const coingeckoClient = getMockClient(http, logger)

      await coingeckoClient.query('/a/b', {})
    })
  })
})

function getMockClient(http: HttpClient, logger: Logger, apiKey?: string) {
  return new CoingeckoClient({
    http,
    apiKey: apiKey,
    retryStrategy: 'TEST',
    logger,
    callsPerMinute: 100000,
    sourceName: 'test',
  })
}
