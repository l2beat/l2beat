import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { HttpClient2, RetryHandler } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Dependencies, LoopringClient } from './LoopringClient'

describe(LoopringClient.name, () => {
  describe(LoopringClient.prototype.getFinalizedBlockNumber.name, () => {
    it('returns number of the block', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockBlock(100),
      })
      const client = mockClient({
        http,
      })
      const result = await client.getFinalizedBlockNumber()
      expect(result).toEqual(100)
    })
  })

  describe(LoopringClient.prototype.getBlock.name, () => {
    it('gets block', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockBlock(42),
      })
      const loopringClient = mockClient({
        http,
      })
      const result = await loopringClient.getBlock(42)

      expect(result).toEqual({
        blockId: 42,
        createdAt: new UnixTime(1),
        transactions: 1,
      })
    })

    it('calls http client with correct params and returns data', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockBlock(1),
      })

      const client = mockClient({
        http,
      })
      await client.query('finalized')

      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'https://example.com/block/getBlock?id=finalized',
        {
          timeout: 10_000,
        },
      )
    })

    it('throws for invalid schema', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({
          resultInfo: {
            code: 1,
            message: 'foo',
          },
        }),
      })
      const loopringClient = mockClient({ http })

      await expect(loopringClient.getBlock(1)).toBeRejectedWith(Error, 'foo')
    })
  })

  describe(LoopringClient.prototype.validateResponse.name, () => {
    it('returns false when response includes errors', async () => {
      const client = mockClient({})
      const isValid = client.validateResponse({
        resultInfo: {
          code: 1,
          message: 'Error',
        },
      })

      expect(isValid).toEqual({ success: false, message: 'Error' })
    })

    it('returns true otherwise', async () => {
      const rpc = mockClient({})
      const isValid = rpc.validateResponse(mockBlock(1))

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
  return new LoopringClient({
    http: http ?? mockObject<HttpClient2>(),
    logger: logger ?? Logger.SILENT,
    rateLimiter: rateLimiter ?? new RateLimiter({ callsPerMinute: 120 }),
    retryHandler: retryHandler ?? RetryHandler.TEST,
    url: url ?? 'https://example.com',
  })
}

function mockBlock(blockId: number) {
  return {
    blockId,
    createdAt: 1000,
    transactions: [{ txType: 'foo' }],
  }
}
