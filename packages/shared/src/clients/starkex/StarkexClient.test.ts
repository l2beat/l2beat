import { Logger } from '@l2beat/backend-tools'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it } from 'vitest'
import type { HttpClient } from '../http/HttpClient'
import {
  STARKEX_BI_API_V2,
  STARKEX_BI_API_V3,
  StarkexClient,
} from './StarkexClient'

describe(StarkexClient.name, () => {
  const API_URL = 'xXStarkexApiUrlXx'
  const API_KEY = 'xXStarkexApiKeyXx'

  describe(StarkexClient.prototype.query.name, () => {
    it('constructs correct url and parameters', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async () => ({ count: 123 }),
      })
      const starkexClient = mockClient({
        apiKey: API_KEY,
        http: httpClient,
      })

      const path = '/resource'
      const body = { foo: 'bar' }
      await starkexClient.query(API_URL, path, body)

      expect(httpClient.fetch).toHaveBeenCalledWith(
        API_URL + path + '?key=' + API_KEY,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          timeout: expect.any(Number),
        },
      )
    })

    it('parses and returns the response', async () => {
      const starkexClient = mockClient({
        apiKey: API_KEY,
        http: mockObject<HttpClient>({
          fetch: async () => ({ count: 11 }),
        }),
      })

      const response = await starkexClient.query(API_URL, '/', 'foo')

      expect(response).toStrictEqual({ count: 11 })
    })
  })

  describe(StarkexClient.prototype.validateResponse.name, () => {
    it('returns false when response includes errors', async () => {
      const rpc = mockClient({})
      const validationInfo = rpc.validateResponse({
        message: 'error',
      })

      expect(validationInfo.success).toStrictEqual(false)
    })

    it('returns true otherwise', async () => {
      const rpc = mockClient({})
      const validationInfo = rpc.validateResponse({
        count: 1,
      })

      expect(validationInfo.success).toStrictEqual(true)
    })
  })

  describe(StarkexClient.prototype.getDailyCount.name, () => {
    it('uses API V2 for dydx', async () => {
      const day = Math.floor(Math.random() * 10000)

      const body = {
        day_start: day,
        day_end: day + 1,
        product: 'dydx',
        tx_type: '_all',
        token_id: '_all',
      }

      const httpClient = mockObject<HttpClient>({
        async fetch(url, init) {
          expect(url).toStrictEqual(
            STARKEX_BI_API_V2 + '/aggregations/count' + `?key=${API_KEY}`,
          )
          expect(init?.body).toStrictEqual(JSON.stringify(body))

          return { count: 45 }
        },
      })

      const starkexClient = mockClient({
        apiKey: API_KEY,
        http: httpClient,
      })

      await starkexClient.getDailyCount(day, 'dydx')
    })

    it('uses API V3 for others', async () => {
      const day = Math.floor(Math.random() * 10000)

      const body = {
        day_start: day,
        day_end: day + 1,
        product: 'immutable',
      }

      const httpClient = mockObject<HttpClient>({
        async fetch(url, init) {
          expect(url).toStrictEqual(
            STARKEX_BI_API_V3 + '/aggregations/count' + `?key=${API_KEY}`,
          )
          expect(init?.body).toStrictEqual(JSON.stringify(body))

          return { count: 45 }
        },
      })

      const starkexClient = mockClient({
        apiKey: API_KEY,
        http: httpClient,
      })

      await starkexClient.getDailyCount(day, 'immutable')
    })

    it('returns the count', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async () => ({ count: 2137 }),
      })

      const starkexClient = mockClient({
        apiKey: API_KEY,
        http: httpClient,
      })

      expect(await starkexClient.getDailyCount(1, 'dydx')).toStrictEqual(2137)
    })
  })
})

function mockClient(deps: {
  http?: HttpClient
  logger?: Logger
  apiKey?: string
}) {
  return new StarkexClient({
    http:
      deps.http ??
      mockObject<HttpClient>({
        fetch: async () => ({ count: 123 }),
      }),
    logger: deps.logger ?? Logger.SILENT,
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    apiKey: deps.apiKey ?? 'abcdef1234',
    sourceName: 'test',
  })
}
