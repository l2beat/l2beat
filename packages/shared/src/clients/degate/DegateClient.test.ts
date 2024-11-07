import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { RetryHandler } from '../../tools'
import { HttpClient2 } from '../http/HttpClient2'
import { DegateClient, Dependencies } from './DegateClient'

describe(DegateClient.name, () => {
  const rateLimiter = new RateLimiter({
    callsPerMinute: 120,
  })

  describe(DegateClient.prototype.getLatestBlockNumber.name, () => {
    it('returns number of the block', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockBlock(100),
      })
      const degateClient = mockClient({
        http,
      })
      const result = await degateClient.getLatestBlockNumber()
      expect(result).toEqual(100)
    })
  })

  describe(DegateClient.prototype.getBlock.name, () => {
    it('gets block', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockBlock(42),
      })
      const degateClient = mockClient({
        http,
      })
      const result = await degateClient.getBlock(42)
      expect(result).toEqual({
        blockId: 42,
        createdAt: new UnixTime(1),
        transactions: [{ txType: 'foo' }],
      })
    })

    it('calls http client with correct params and returns data', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockBlock(1),
      })

      const degateClient = mockClient({
        http,
      })
      await degateClient.query('latest')

      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'https://example.com/block/getBlock?id=latest',
        {
          timeout: 30_000,
        },
      )
    })

    it('throws for invalid schema', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({ code: 1, message: 'foo' }),
      })
      const degateClient = new DegateClient({
        http,
        logger: Logger.SILENT,
        rateLimiter,
        retryHandler: RetryHandler.TEST,
        url: 'https://example.com',
      })
      await expect(degateClient.getBlock(1)).toBeRejectedWith(Error, 'foo')
    })
  })

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
        hash: 'UNSUPPORTED',
        number: 10,
        timestamp: 1,
        transactions: [{ hash: 'UNSUPPORTED', type: 'foo' }],
      })
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
