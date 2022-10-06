import { HttpClient, Logger, mock } from '@l2beat/common'
import { StarkexProduct } from '@l2beat/config'
import { expect } from 'earljs'
import { Response } from 'node-fetch'

import { StarkexClient } from '../../../src/peripherals/starkex'

describe(StarkexClient.name, () => {
  const API_URL = 'xXStarkexApiUrlXx'
  const API_KEY = 'xXStarkexApiKeyXx'

  describe(StarkexClient.prototype.call.name, () => {
    it('throws for malformed responses', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ status: '2', foo: 'bar' }))
        },
      })
      const starkexClient = new StarkexClient(
        API_URL,
        API_KEY,
        httpClient,
        Logger.SILENT,
      )

      await expect(starkexClient.call('foo')).toBeRejected(
        TypeError,
        'Invalid Starkex response.',
      )
    })

    it('throws for http errors', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response('foo', { status: 400 })
        },
      })
      const starkexClient = new StarkexClient(
        API_URL,
        API_KEY,
        httpClient,
        Logger.SILENT,
      )

      await expect(starkexClient.call('foo')).toBeRejected(
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
        day_start: day - 1,
        day_end: day,
        product,
        tx_type: '_all',
        token_id: '_all',
      }

      const httpClient = mock<HttpClient>({
        async fetch(url, init) {
          expect(url).toEqual(API_URL)
          expect(init?.body).toEqual(JSON.stringify(body))

          return new Response(JSON.stringify({ count: 0x45 }))
        },
      })

      const starkexClient = new StarkexClient(
        API_URL,
        API_KEY,
        httpClient,
        Logger.SILENT,
      )

      await starkexClient.getDailyCount(day, product)
    })

    it('returns the count', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ count: 0x45 }))
        },
      })

      const starkexClient = new StarkexClient(
        API_URL,
        API_KEY,
        httpClient,
        Logger.SILENT,
      )

      expect(await starkexClient.getDailyCount(1, 'dydx')).toEqual(69)
    })
  })
})
