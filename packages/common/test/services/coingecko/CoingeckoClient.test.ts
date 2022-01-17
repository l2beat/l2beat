import { expect } from 'earljs'
import { Response } from 'node-fetch'

import {
  CoingeckoClient,
  CoingeckoId,
  CoingeckoMarketChartRangeParams,
  HttpClient,
  mock,
} from '../../../src'
import { MOCK_DATA } from './MOCK_DATA'

describe.only('CoingeckoClient', () => {
  describe('query', () => {
    it('constructs a correct url', async () => {
      const httpClient = mock<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            'https://api.coingecko.com/api/v3/a/b?foo=bar&baz=123'
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
        'Server responded with non-2XX result: 404 Not Found'
      )
    })

    it('throws on non-json response', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () => new Response('text'),
      })

      const coingeckoClient = new CoingeckoClient(httpClient)
      await expect(coingeckoClient.query('/path', {})).toBeRejected(
        'invalid json response body at  reason: Unexpected token e in JSON at position 1'
      )
    })

    it('multiple queries take longer than a minute', async () => {
      //TODO
    })
  })

  describe('getCoinList', () => {
    it('fetches coins without platforms', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify([
              { id: 'asd', symbol: 'ASD', name: 'A Sad Dime' },
              { id: 'foobar', symbol: 'FBR', name: 'Foobar coin' },
            ])
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
            ])
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

  describe('getMarketChartRange', () => {
    it('fetches historical prices', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () => new Response(JSON.stringify(MOCK_DATA)),
      })
      const coingeckoClient = new CoingeckoClient(httpClient)
      const result = await coingeckoClient.getCoinMarketChartRange(
        CoingeckoId('ethereum'),
        CoingeckoMarketChartRangeParams('usd', 1592577232, new Date(1622577232))
      )

      expect(result).toEqual(MOCK_DATA)
    })

    it('constructs correct url', async () => {
      const httpClient = mock<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            'https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=1592577232&to=1622577232'
          )
          return new Response(JSON.stringify(MOCK_DATA))
        },
      })

      const coingeckoClient = new CoingeckoClient(httpClient)
      await coingeckoClient.getCoinMarketChartRange(
        CoingeckoId('ethereum'),
        CoingeckoMarketChartRangeParams('usd', 1592577232, new Date(1622577232))
      )
    })
  })
})
