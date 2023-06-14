import { HttpClient, Logger } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Response } from 'node-fetch'

import { ZksyncClient } from './ZksyncClient'

describe(ZksyncClient.name, () => {
  describe(ZksyncClient.prototype.getTransactionsInBlock.name, () => {
    it('returns transactions array', async () => {
      const transactions = Array.from({ length: 69 }, () => fakeTransaction())

      const httpClient = mockObject<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify({
              status: 'success',
              error: null,
              result: { list: transactions, pagination: { count: 69 } },
            }),
          ),
      })
      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)
      const expected = transactions.map((tx) => ({
        ...tx,
        createdAt: UnixTime.fromDate(tx.createdAt),
      }))

      expect(await zksyncClient.getTransactionsInBlock(42)).toEqual(expected)
    })

    it('throws for invalid schema', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify({
              status: 'success',
              error: null,
              result: { foo: 'bar' },
            }),
          ),
      })
      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)

      await expect(zksyncClient.getTransactionsInBlock(42)).toBeRejectedWith(
        TypeError,
        'Invalid Zksync transactions schema',
      )
    })

    it('can paginate', async () => {
      const transactions1 = Array.from({ length: 100 }, () => fakeTransaction())
      const transactions2 = Array.from({ length: 69 }, () => fakeTransaction())

      const httpClient = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: 'success',
                error: null,
                result: { list: transactions1, pagination: { count: 169 } },
              }),
            ),
          )
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: 'success',
                error: null,
                result: {
                  list: [transactions1[0], ...transactions2],
                  pagination: { count: 169 },
                },
              }),
            ),
          ),
      })

      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)

      const result = await zksyncClient.getTransactionsInBlock(42)
      const expected = transactions1
        .concat(transactions2)
        .map((tx) => ({ ...tx, createdAt: UnixTime.fromDate(tx.createdAt) }))
      expect(result).toEqual(expected)
    })

    it('throws for transaction mismatch', async () => {
      const transactions1 = Array.from({ length: 100 }, () => fakeTransaction())
      const transactions2 = Array.from({ length: 68 }, () => fakeTransaction())
      transactions2.unshift(fakeTransaction({ txHash: 'not-tx-hash' }))

      const httpClient = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: 'success',
                error: null,
                result: { list: transactions1, pagination: { count: 169 } },
              }),
            ),
          )
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: 'success',
                error: null,
                result: {
                  list: transactions2,
                  pagination: { count: 169 },
                },
              }),
            ),
          ),
      })

      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)

      await expect(zksyncClient.getTransactionsInBlock(42)).toBeRejectedWith(
        Error,
        'Invalid Zksync first transaction',
      )
    })
  })

  describe(ZksyncClient.prototype.getLatestBlock.name, () => {
    it('gets latest block', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify({
              status: 'success',
              error: null,
              result: { blockNumber: 42 },
            }),
          ),
      })
      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)

      const result = await zksyncClient.getLatestBlock()
      expect(result).toEqual(42)
    })

    it('throws for invalid schema', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify({
              status: 'success',
              error: null,
              result: { foo: 'bar' },
            }),
          ),
      })
      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)

      await expect(zksyncClient.getLatestBlock()).toBeRejectedWith(
        TypeError,
        'Invalid Zksync block schema',
      )
    })
  })

  describe(ZksyncClient.prototype.call.name, () => {
    it('throws for error responses', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(
            JSON.stringify({
              status: 'error',
              error: { errorType: 'type', code: 45, message: 'Oops!' },
              result: null,
            }),
          )
        },
      })
      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)
      await expect(zksyncClient.call('foo', { bar: '1234' })).toBeRejectedWith(
        Error,
        'Oops!',
      )
    })

    it('throws for malformed responses', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ status: '', foo: 'bar' }))
        },
      })
      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)
      await expect(zksyncClient.call('foo', { bar: '1234' })).toBeRejectedWith(
        TypeError,
        'Invalid Zksync response.',
      )
    })

    it('throws for http errors', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response('foo', { status: 400 })
        },
      })
      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)
      await expect(zksyncClient.call('foo', { bar: '1234' })).toBeRejectedWith(
        Error,
        'Http error 400: foo',
      )
    })
  })
})

interface Transaction {
  txHash: string
  blockIndex: number
  createdAt: Date
}

function fakeTransaction(transaction?: Partial<Transaction>): Transaction {
  return {
    txHash: 'tx-hash',
    blockIndex: Math.floor(Math.random() * 1000),
    createdAt: new Date(),
    ...transaction,
  }
}
