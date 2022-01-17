import { expect } from 'chai'
import { Response } from 'node-fetch'

import { CoingeckoClient, CoingeckoId,HttpClient, mock } from '../../../src'

describe.only('CoingeckoClient', () => {
  describe('query', () => {
    it('constructs a correct url', async () => {
      const httpClient = mock<HttpClient>({
        async fetch(url) {
          expect(url).to.equal(
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
          expect(url).to.equal('https://api.coingecko.com/api/v3/a/b')
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
      await expect(coingeckoClient.query('/path', {})).to.be.rejectedWith(
        'Server responded with non-2XX result: 404 Not Found'
      )
    })

    it('throws on non-json response', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () => new Response('text'),
      })

      const coingeckoClient = new CoingeckoClient(httpClient)
      await expect(coingeckoClient.query('/path', {})).to.be.rejectedWith(
        /json/
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
      expect(result).to.deep.equal([
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
      expect(result).to.deep.equal([
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
        fetch: async () =>
          new Response(
            JSON.stringify(
              {
                prices: [
                  [
                    1392595200000,
                    645.14
                  ],
                  [
                    1392681600000,
                    625.01
                  ],
                  [
                    1392768000000,
                    620.99
                  ],
                  [
                    1392854400000,
                    593.89
                  ],
                ]
              },
            )
          ),
      })
      const coingeckoClient = new CoingeckoClient(httpClient)
      const result = await coingeckoClient.getCoinMarketChartRange()

      expect(result).to.deep.equal(
        {
          prices: [
            [
              1392595200000,
              645.14
            ],
            [
              1392681600000,
              625.01
            ],
            [
              1392768000000,
              620.99
            ],
            [
              1392854400000,
              593.89
            ],
          ]
        },
      )
      
    })
  })
})
