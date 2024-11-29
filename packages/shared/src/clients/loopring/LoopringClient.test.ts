import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { UnixTime, json } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { RetryHandler } from '../../tools'
import { HttpClient2 } from '../http/HttpClient2'
import { LoopringClient } from './LoopringClient'

describe(LoopringClient.name, () => {
  describe(LoopringClient.prototype.getBlockWithTransactions.name, () => {
    it('gets block with txs', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockBlock(10),
      })
      const degateClient = mockClient({
        http,
      })
      const result = await degateClient.getBlockWithTransactions(42)
      expect(result).toEqual({
        hash: '10',
        number: 10,
        timestamp: 1,
        transactions: [{ type: 'foo' }],
      })
    })
  })

  describe(LoopringClient.prototype.queryBlock.name, () => {
    it('correctly queries API', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockBlock(10),
      })
      const degateClient = mockClient({
        http,
      })
      const result = await degateClient.queryBlock(42)
      expect(result).toEqual({
        blockId: 10,
        createdAt: new UnixTime(1),
        transactions: [{ txType: 'foo' }],
      })
      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'https://example.com/block/getBlock?id=42',
        {
          timeout: 30_000,
        },
      )
    })

    it('works for latest Loopring', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockBlock(10),
      })
      const degateClient = mockClient({
        http,
        type: 'loopring',
      })
      const result = await degateClient.queryBlock('latest')
      expect(result).toEqual({
        blockId: 10,
        createdAt: new UnixTime(1),
        transactions: [{ txType: 'foo' }],
      })
      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'https://example.com/block/getBlock?id=finalized',
        {
          timeout: 30_000,
        },
      )
    })

    it('works for latest Degate', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockBlock(10, 'degate3'),
      })
      const degateClient = mockClient({
        http,
        type: 'degate3',
      })
      const result = await degateClient.queryBlock('latest')
      expect(result).toEqual({
        blockId: 10,
        createdAt: new UnixTime(1),
        transactions: [{ txType: 'foo' }],
      })
      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'https://example.com/block/getBlock?id=latest',
        {
          timeout: 30_000,
        },
      )
    })
  })

  describe(LoopringClient.prototype.validateResponse.name, () => {
    it('Loopring: returns false when response includes errors', async () => {
      const client = mockClient({ type: 'loopring' })
      const isValid = client.validateResponse({
        resultInfo: {
          code: 1,
          message: 'Error',
        },
      })

      expect(isValid).toEqual({ success: false, message: 'Error' })
    })

    it('Degate: returns false when response includes errors', async () => {
      const client = mockClient({ type: 'degate3' })
      const isValid = client.validateResponse({
        code: 1,
        message: 'Error',
      })

      expect(isValid).toEqual({ success: false, message: 'Error' })
    })

    it('returns true otherwise', async () => {
      const rpc = mockClient({})
      const isValid = rpc.validateResponse({})

      expect(isValid).toEqual({ success: true })
    })
  })
})

function mockClient(deps: {
  http?: HttpClient2
  rateLimiter?: RateLimiter
  retryHandler?: RetryHandler
  logger?: Logger
  url?: string
  type?: 'loopring' | 'degate3'
}) {
  return new LoopringClient({
    http: deps.http ?? mockObject<HttpClient2>(),
    logger: deps.logger ?? Logger.SILENT,
    rateLimiter: deps.rateLimiter ?? RateLimiter.TEST,
    retryHandler: deps.retryHandler ?? RetryHandler.TEST,
    url: deps.url ?? 'https://example.com',
    type: deps.type ?? 'loopring',
  })
}

function mockBlock(
  blockId: number,
  type: 'loopring' | 'degate3' = 'loopring',
): json {
  const block = {
    blockId,
    createdAt: 1000,
    transactions: [{ txType: 'foo' }],
  }
  return type === 'loopring'
    ? block
    : {
        code: 0,
        data: block,
      }
}
