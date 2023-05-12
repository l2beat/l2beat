import { StarkexProduct } from '@l2beat/config'
import { HttpClient, Logger } from '@l2beat/shared'
import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'

import { StarkexClient } from './StarkexClient'

describe(StarkexClient.name, () => {
  const API_URL = 'xXStarkexApiUrlXx'
  const API_KEY = 'xXStarkexApiKeyXx'

  describe(StarkexClient.prototype.call.name, () => {
    it('throws for malformed responses', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ status: '2', foo: 'bar' }))
        },
      })
      const starkexClient = new StarkexClient(
        API_KEY,
        httpClient,
        Logger.SILENT,
      )

      await expect(starkexClient.call('/', 'foo')).toBeRejectedWith(
        TypeError,
        'Invalid Starkex response.',
      )
    })

    it('throws for http errors', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response('foo', { status: 400 })
        },
      })
      const starkexClient = new StarkexClient(
        API_KEY,
        httpClient,
        Logger.SILENT,
      )

      await expect(starkexClient.call('/', 'foo')).toBeRejectedWith(
        Error,
        `Server responded with non-2XX result: 400 Bad Request`,
      )
    })
  })

  describe(StarkexClient.prototype.getDailyCount.name, () => {
    it('constructs the correct body', async () => {
      const day = Math.floor(Math.random() * 10000)
      const product: StarkexProduct = 'dydx'

      const body = {
        day_start: day,
        day_end: day + 1,
        product,
        tx_type: '_all',
        token_id: '_all',
      }

      const httpClient = mockObject<HttpClient>({
        async fetch(url, init) {
          expect(url).toEqual(API_URL + '/aggregations/count')
          expect(init?.body).toEqual(JSON.stringify(body))

          return new Response(JSON.stringify({ count: 0x45 }))
        },
      })

      const starkexClient = new StarkexClient(
        API_KEY,
        httpClient,
        Logger.SILENT,
        {
          apiUrl: API_URL,
        },
      )

      await starkexClient.getDailyCount(day, product)
    })

    it('returns the count', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ count: 0x45 }))
        },
      })

      const starkexClient = new StarkexClient(
        API_KEY,
        httpClient,
        Logger.SILENT,
      )

      expect(await starkexClient.getDailyCount(1, 'dydx')).toEqual(69)
    })
  })
})
