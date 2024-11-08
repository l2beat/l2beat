import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { RetryHandler } from '../../tools'
import { HttpClient2 } from '../http/HttpClient2'
import { DegateClient, Dependencies } from './DegateClient'

describe(DegateClient.name, () => {
  describe(DegateClient.prototype.getBlockWithTransactions.name, () => {
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
        transactions: [{ hash: '10', type: 'foo' }],
      })
    })
  })

  describe(DegateClient.prototype.queryBlock.name, () => {
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

    it('works for latest', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockBlock(10),
      })
      const degateClient = mockClient({
        http,
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

  describe(DegateClient.prototype.validateResponse.name, () => {
    it('returns false when response includes errors', async () => {
      const client = mockClient({})
      const isValid = client.validateResponse({
        code: 1,
        message: 'Error',
      })

      expect(isValid).toEqual({ success: false, message: 'Error' })
    })

    it('returns true otherwise', async () => {
      const rpc = mockClient({})
      const isValid = rpc.validateResponse({
        code: 0,
        data: 'success',
      })

      expect(isValid).toEqual({ success: true })
    })
  })
})

function mockClient({
  http,
  logger,
  rateLimiter,
  retryHandler,
  url,
}: Partial<Dependencies>) {
  return new DegateClient({
    http: http ?? mockObject<HttpClient2>(),
    logger: logger ?? Logger.SILENT,
    rateLimiter: rateLimiter ?? new RateLimiter({ callsPerMinute: 120 }),
    retryHandler: retryHandler ?? RetryHandler.TEST,
    url: url ?? 'https://example.com',
  })
}

function mockBlock(blockId: number): unknown {
  return {
    code: 0,
    data: {
      blockId,
      createdAt: 1000,
      transactions: [{ txType: 'foo' }],
    },
  }
}
