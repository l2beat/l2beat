import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import { RetryHandler } from '../../tools'
import { HttpClient2 } from '../http/HttpClient2'
import { BlobClient } from './BlobClient'

describe(BlobClient.name, () => {
  describe(BlobClient.prototype.validateResponse.name, () => {
    it('handles rpc error', () => {
      const client = mockClient({})
      const isValid = client.validateResponse({
        error: {
          message: 'Error',
        },
      })

      expect(isValid).toEqual({ success: false })
    })

    it('handles beacon error', () => {
      const client = mockClient({})
      const isValid = client.validateResponse({
        code: 2137,
        message: 'Error',
      })

      expect(isValid).toEqual({ success: false })
    })
  })
})

function mockClient(deps: {
  http?: HttpClient2
  beaconApiUrl?: string
  rpcUrl?: string
  rateLimiter?: RateLimiter
  retryHandler?: RetryHandler
  generateId?: () => string
}) {
  return new BlobClient({
    beaconApiUrl: deps.beaconApiUrl ?? 'BEACON_API_URL',
    rpcUrl: deps.rpcUrl ?? 'RPC_URL',
    http: deps.http ?? mockObject<HttpClient2>({}),
    rateLimiter:
      deps.rateLimiter ?? new RateLimiter({ callsPerMinute: 100_000 }),
    retryHandler: deps.retryHandler ?? RetryHandler.TEST,
    logger: Logger.SILENT,
  })
}
