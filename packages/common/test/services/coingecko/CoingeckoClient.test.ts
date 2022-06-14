import { expect } from 'earljs'
import { Response } from 'node-fetch'

import { CoingeckoClient, CoingeckoId, HttpClient, mock } from '../../../src'
import {
  CoinMarketChartRangeData,
  CoinMarketChartRangeResult,
} from '../../../src/services/coingecko/model'
import { UnixTime } from '../../../src/types'

//add names
describe(CoingeckoClient.name, () => {
  describe('query', () => {
    it('constructs a correct url', async () => {
      const httpClient = mock<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            'https://api.coingecko.com/api/v3/a/b?foo=bar&baz=123',
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const coingeckoClient = new CoingeckoClient(httpClient)
      await coingeckoClient.query('/a/b', { foo: 'bar', baz: '123' })
    })

    it('constructs a correct when there are no options', async () => {
      const httpClient = mock<HttpClient>({
        async fetch(url) {
          expect(url).toEqual('https://api.coingecko.com/api/v3/a/b')
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const coingeckoClient = new CoingeckoClient(httpClient)
      await coingeckoClient.query('/a/b', {})
    })

    it('throws on non-2XX result', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () => new Response('', { status: 404 }),
      })

      const coingeckoClient = new CoingeckoClient(httpClient)
      await expect(coingeckoClient.query('/path', {})).toBeRejected(
        'Server responded with non-2XX result: 404 Not Found',
      )
    })

    it('throws on non-json response', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () => new Response('text'),
      })

      const coingeckoClient = new CoingeckoClient(httpClient)
      await expect(coingeckoClient.query('/path', {})).toBeRejected(
        expect.stringMatching(/json/),
      )
    })
  })

  describe(CoingeckoClient.prototype.getCoinList.name, () => {
    it('fetches coins without platforms', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify([
              { id: 'asd', symbol: 'ASD', name: 'A Sad Dime' },
              { id: 'foobar', symbol: 'FBR', name: 'Foobar coin' },
            ]),
          ),
      })
      const coingeckoClient = new CoingeckoClient(httpClient)
      const result = await coingeckoClient.getCoinList()
      expect(result).toEqual([
        { id: CoingeckoId('asd'), symbol: 'ASD', name: 'A Sad Dime' },
        { id: CoingeckoId('foobar'), symbol: 'FBR', name: 'Foobar coin' },
      ])
    })

    it('fetches coins with platforms', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify([
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
            ]),
          ),
      })
      const coingeckoClient = new CoingeckoClient(httpClient)
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
        { date: new Date(1592611200000), price: 228.9592128032193 },
        { date: new Date(1592697600000), price: 228.8691487972198 },
        { date: new Date(1592784000000), price: 227.79190590968685 },
      ],
      marketCaps: [
        { date: new Date(1592611200000), marketCap: 25534271650.26011 },
        { date: new Date(1592697600000), marketCap: 25501270877.342506 },
        { date: new Date(1592784000000), marketCap: 25381090910.620564 },
      ],
      totalVolumes: [
        { date: new Date(1592611200000), totalVolume: 6840801770.229276 },
        { date: new Date(1592697600000), totalVolume: 5400222130.457475 },
        { date: new Date(1592784000000), totalVolume: 4995955268.45639 },
      ],
    }

    it('fetches historical prices', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () => new Response(JSON.stringify(MOCK_PARSED_DATA)),
      })
      const coingeckoClient = new CoingeckoClient(httpClient)
      const result = await coingeckoClient.getCoinMarketChartRange(
        CoingeckoId('ethereum'),
        'usd',
        new UnixTime(1592577232),
        new UnixTime(1622577232),
      )

      expect(result).toEqual(MOCK_TRANSFORMED_DATA)
    })

    it('constructs correct url', async () => {
      const httpClient = mock<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            'https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=1592577232&to=1622577232',
          )
          return new Response(JSON.stringify(MOCK_PARSED_DATA))
        },
      })

      const coingeckoClient = new CoingeckoClient(httpClient)
      await coingeckoClient.getCoinMarketChartRange(
        CoingeckoId('ethereum'),
        'usd',
        new UnixTime(1592577232),
        new UnixTime(1622577232),
      )
    })
  })
})
