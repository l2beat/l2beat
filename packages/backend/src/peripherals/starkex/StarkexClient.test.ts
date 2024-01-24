import { Logger } from '@l2beat/backend-tools'
import { StarkexProduct } from '@l2beat/config'
import { HttpClient } from '@l2beat/shared'
import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'

import {
  STARKEX_BI_API_V2,
  STARKEX_BI_API_V3,
  StarkexClient,
} from './StarkexClient'

describe(StarkexClient.name, () => {
  const API_URL = 'xXStarkexApiUrlXx'
  const API_KEY = 'xXStarkexApiKeyXx'

  describe(StarkexClient.prototype.call.name, () => {
    it('constructs correct url and parameters', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ count: 123 }))
        },
      })
      const starkexClient = new StarkexClient(
        API_KEY,
        httpClient,
        Logger.SILENT,
      )

      const path = '/resource'
      await starkexClient.call(API_URL, path, 'foo')

      expect(httpClient.fetch).toHaveBeenCalledWith(
        API_URL + path + '?key=' + API_KEY,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: expect.anything(),
          timeout: expect.a(Number),
        },
      )
    })

    it('parses and returns the response', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ count: 123 }))
        },
      })
      const starkexClient = new StarkexClient(
        API_KEY,
        httpClient,
        Logger.SILENT,
      )

      const response = await starkexClient.call(API_URL, '/', 'foo')

      expect(response).toEqual({ count: 123 })
    })
    it('throws when response has wrong format', async () => {
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

      await expect(starkexClient.call(API_URL, '/', 'foo')).toBeRejectedWith(
        TypeError,
        'Invalid Starkex response.',
      )
    })

    it('throws when there is an error', async () => {
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

      await expect(starkexClient.call(API_URL, '/', 'foo')).toBeRejectedWith(
        Error,
        `Server responded with non-2XX result: 400 Bad Request`,
      )
    })
  })

  describe(StarkexClient.prototype.getDailyCount.name, () => {
    it('uses API V2 for dydx', async () => {
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
          expect(url).toEqual(
            STARKEX_BI_API_V2 + '/aggregations/count' + `?key=${API_KEY}`,
          )
          expect(init?.body).toEqual(JSON.stringify(body))

          return new Response(JSON.stringify({ count: 0x45 }))
        },
      })

      const starkexClient = new StarkexClient(
        API_KEY,
        httpClient,
        Logger.SILENT,
      )

      await starkexClient.getDailyCount(day, product)
    })

    it('uses API V3 for others', async () => {
      const day = Math.floor(Math.random() * 10000)
      const product: StarkexProduct = 'immutable'

      const body = {
        day_start: day,
        day_end: day + 1,
        product,
      }

      const httpClient = mockObject<HttpClient>({
        async fetch(url, init) {
          expect(url).toEqual(
            STARKEX_BI_API_V3 + '/aggregations/count' + `?key=${API_KEY}`,
          )
          expect(init?.body).toEqual(JSON.stringify(body))

          return new Response(JSON.stringify({ count: 0x45 }))
        },
      })

      const starkexClient = new StarkexClient(
        API_KEY,
        httpClient,
        Logger.SILENT,
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
