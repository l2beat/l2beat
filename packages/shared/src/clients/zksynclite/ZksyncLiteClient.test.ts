import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { RetryHandler } from '../../tools'
import { HttpClient2 } from '../http/HttpClient2'
import { ZksyncLiteClient } from './ZksyncLiteClient'

describe(ZksyncLiteClient.name, () => {
  describe(ZksyncLiteClient.prototype.getTransactionsInBlock.name, () => {
    it('returns transactions array', async () => {
      const transactions = Array.from({ length: 69 }, () => fakeTransaction())

      const http = mockObject<HttpClient2>({
        fetch: async () => ({
          result: { list: transactions, pagination: { count: 69 } },
        }),
      })
      const zksyncClient = mockClient({ http })
      const expected = transactions.map((tx) => ({
        ...tx,
        createdAt: UnixTime.fromDate(new Date(tx.createdAt)),
      }))

      expect(await zksyncClient.getTransactionsInBlock(42)).toEqual(expected)
    })

    it('can paginate', async () => {
      const transactions1 = Array.from({ length: 100 }, () => fakeTransaction())
      const transactions2 = Array.from({ length: 69 }, () => fakeTransaction())

      const http = mockObject<HttpClient2>({
        fetch: mockFn()
          .resolvesToOnce({
            result: { list: transactions1, pagination: { count: 169 } },
          })
          .resolvesToOnce({
            result: {
              list: [transactions1[0], ...transactions2],
              pagination: { count: 169 },
            },
          }),
      })

      const zksyncClient = mockClient({ http })

      const result = await zksyncClient.getTransactionsInBlock(42)
      const expected = transactions1.concat(transactions2).map((tx) => ({
        ...tx,
        createdAt: UnixTime.fromDate(new Date(tx.createdAt)),
      }))
      expect(result).toEqual(expected)
    })

    it('throws on first transaction in batch mismatch', async () => {
      const transactions1 = Array.from({ length: 100 }, () => fakeTransaction())
      const transactions2 = Array.from({ length: 68 }, () => fakeTransaction())
      transactions2.unshift(fakeTransaction('not-tx-hash'))

      const http = mockObject<HttpClient2>({
        fetch: mockFn()
          .resolvesToOnce({
            result: { list: transactions1, pagination: { count: 169 } },
          })
          .resolvesToOnce({
            result: {
              list: transactions2,
              pagination: { count: 169 },
            },
          }),
      })

      const zksyncClient = mockClient({ http })

      await expect(zksyncClient.getTransactionsInBlock(42)).toBeRejectedWith(
        Error,
        'Invalid Zksync first transaction',
      )
    })
  })

  describe(ZksyncLiteClient.prototype.getLatestBlockNumber.name, () => {
    it('gets latest block', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({ result: { blockNumber: 42 } }),
      })
      const zksyncClient = mockClient({ http })

      const result = await zksyncClient.getLatestBlockNumber()
      expect(result).toEqual(42)
    })
  })

  describe(ZksyncLiteClient.prototype.query.name, () => {
    it('calls with correct params and returns response', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({ result: 'success' }),
      })
      const zksyncClient = mockClient({ http })

      const result = await zksyncClient.query('path/to/resource', {
        a: 'a',
        b: 'b',
      })

      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'API_URL/path/to/resource?a=a&b=b',
        { timeout: 20_000 },
      )
      expect(result).toEqual({ result: 'success' })
    })
  })

  describe(ZksyncLiteClient.prototype.validateResponse.name, () => {
    it('retruns false when error is present', () => {
      const zksyncClient = mockClient({})

      const result = zksyncClient.validateResponse({
        status: 'error',
        error: {
          errorType: 'error',
          code: 1,
          message: 'bad error',
        },
      })
      expect(result).toEqual({ success: false })
    })
  })
})

function mockClient(deps: {
  http?: HttpClient2
  url?: string
  rateLimiter?: RateLimiter
  retryHandler?: RetryHandler
  generateId?: () => string
}) {
  return new ZksyncLiteClient({
    url: deps.url ?? 'API_URL',
    http: deps.http ?? mockObject<HttpClient2>({}),
    rateLimiter:
      deps.rateLimiter ?? new RateLimiter({ callsPerMinute: 100_000 }),
    retryHandler: deps.retryHandler ?? RetryHandler.TEST,
    logger: Logger.SILENT,
  })
}

function fakeTransaction(txHash?: string) {
  return {
    txHash: txHash ?? 'tx-hash',
    blockIndex: Math.floor(Math.random() * 1000),
    createdAt: new Date().toString(),
  }
}
