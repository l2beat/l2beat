import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import { utils } from 'ethers'
import { RetryHandler } from '../../tools'
import { HttpClient2 } from '../http/HttpClient2'
import { BlobClient } from './BlobClient'

function generateKzgCommitment(): string {
  return (
    '0x' +
    Array.from({ length: 96 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('')
  )
}

describe(BlobClient.name, () => {
  describe(BlobClient.prototype.getRelevantBlobs.name, () => {
    it('should return empty blobs for type 2 transaction', async () => {
      const client = mockClient({})
      client.getTransaction = async () => ({
        type: '0x2',
        blockNumber: 1,
      })

      const result = await client.getRelevantBlobs('txHash')
      expect(result).toEqual({ blobs: [], blockNumber: 1 })
    })

    it('should return blobs for type 3 transaction', async () => {
      const client = mockClient({})

      const kzgCommitment1 = generateKzgCommitment()
      const kzgCommitment2 = generateKzgCommitment()
      const versionedHash1 = '0x01' + utils.sha256(kzgCommitment1).substring(4)
      const versionedHash2 = '0x01' + utils.sha256(kzgCommitment2).substring(4)
      const blob1 = {
        kzg_commitment: kzgCommitment1,
        data: 'blob1',
      }
      const blob2 = {
        kzg_commitment: kzgCommitment2,
        data: 'blob2',
      }

      client.getTransaction = async () => ({
        type: '0x3',
        blockNumber: 1,
        blobVersionedHashes: [versionedHash1, versionedHash2],
      })

      client.getBlockSidecar = async () => [
        blob1,
        blob2,
        {
          kzg_commitment: generateKzgCommitment(),
          data: 'blob3',
        },
      ]

      const result = await client.getRelevantBlobs('txHash')
      expect(result).toEqual({ blockNumber: 1, blobs: [blob1, blob2] })
    })

    it('should throw on missing blobVersionedHashes', async () => {
      const client = mockClient({})
      client.getTransaction = async () => ({
        type: '0x3',
        blockNumber: 1,
      })

      await expect(client.getRelevantBlobs('txHash')).toBeRejectedWith(
        'Type 3 transaction missing blobVersionedHashes',
      )
    })
  })

  describe(BlobClient.prototype.getBlockSidecar.name, async () => {
    it('should call rpc and return result', async () => {
      const kzg_commitment = 'commitment'
      const blob = 'blob'
      const expected = [
        {
          kzg_commitment,
          blob,
        },
      ]
      const http = mockObject<HttpClient2>({
        fetch: async () => ({
          data: expected,
        }),
      })
      const client = mockClient({ http, beaconApiUrl: 'example.com/' })
      client.getBlockParentBeaconRoot = async () => 'root'

      const result = await client.getBlockSidecar(1)

      expect(http.fetch.calls[0].args[0]).toEqual(
        'example.com/eth/v1/beacon/blob_sidecars/root',
      )
      expect(result).toEqual([
        {
          kzg_commitment,
          data: blob,
        },
      ])
    })
  })

  describe(BlobClient.prototype.getBlockParentBeaconRoot.name, async () => {
    it('should call rpc and return result', async () => {})
    const client = mockClient({})
    client.callRpc = async () => ({ parentBeaconBlockRoot: 'root' })

    const result = await client.getBlockParentBeaconRoot(1)
    expect(result).toEqual('root')
  })

  describe(BlobClient.prototype.call.name, () => {
    it('should call beacon api and return result', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({ result: 'result' }),
      })
      const client = mockClient({ http, beaconApiUrl: 'BEACON_API_URL' })

      const result = await client.call('/eth/blob')

      expect(result).toEqual({ result: 'result' })
      expect(http.fetch.calls[0].args[0]).toEqual('BEACON_API_URL/eth/blob')
    })

    it('should throw on beacon error', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({
          code: -32000,
          message: 'RPC Error',
        }),
      })
      const client = mockClient({ http })

      await expect(client.call('/eth/blob')).toBeRejectedWith(
        'Response validation failed',
      )
    })
  })

  describe(BlobClient.prototype.callRpc.name, () => {
    it('should call rpc and return result', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({ result: 'result' }),
      })
      const client = mockClient({ http, generateId: () => 'abc' })
      const method = 'method'
      const params = ['param']

      const result = await client.callRpc(method, params)

      expect(result).toEqual('result')
      expect(http.fetch.calls[0].args[1]?.body).toEqual(
        JSON.stringify({
          jsonrpc: '2.0',
          id: 'abc',
          method,
          params,
        }),
      )
    })

    it('should throw on rpc error', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({
          error: {
            code: -32000,
            message: 'RPC Error',
          },
          id: 1,
          jsonrpc: '2.0',
        }),
      })
      const client = mockClient({ http })
      const method = 'method'
      const params = ['param']

      await expect(client.callRpc(method, params)).toBeRejectedWith(
        'Response validation failed',
      )
    })
  })

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
  timeout?: number
}) {
  return new BlobClient({
    beaconApiUrl: deps.beaconApiUrl ?? 'BEACON_API_URL',
    rpcUrl: deps.rpcUrl ?? 'RPC_URL',
    http: deps.http ?? mockObject<HttpClient2>({}),
    rateLimiter:
      deps.rateLimiter ?? new RateLimiter({ callsPerMinute: 100_000 }),
    retryHandler: deps.retryHandler ?? RetryHandler.TEST,
    logger: Logger.SILENT,
    timeout: deps.timeout,
    generateId: deps.generateId,
  })
}
