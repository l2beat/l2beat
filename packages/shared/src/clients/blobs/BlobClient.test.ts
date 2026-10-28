import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import type { RpcClient } from '../rpc/RpcClient'
import { BlobClient } from './BlobClient'

describe(BlobClient.name, () => {
  describe(BlobClient.prototype.getRelevantBlobs.name, () => {
    it('should return empty blobs for type 2 transaction', async () => {
      const rpcClient = mockObject<RpcClient>({
        getTransaction: mockFn().returns({
          type: '0x2',
          blockNumber: 1,
        }),
      })
      const client = mockClient({ rpcClient })

      const result = await client.getRelevantBlobs('txHash')
      expect(result).toEqual({ blobs: [], blockNumber: 1 })
    })

    it('should return blobs for type 3 transaction', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ data: ['blob1', 'blob2'] }),
      })
      const rpcClient = mockObject<RpcClient>({
        getTransaction: mockFn().returns({
          type: '0x3',
          blockNumber: 1,
          blobVersionedHashes: ['0x01aa', '0x01bb'],
        }),
        getBlockParentBeaconRoot: async () => 'root',
      })
      const client = mockClient({
        http,
        beaconApiUrl: 'example.com/',
        rpcClient,
      })

      const result = await client.getRelevantBlobs('txHash')

      expect(http.fetch.calls[0].args[0]).toEqual(
        'example.com/eth/v1/beacon/blobs/root?versioned_hashes=0x01aa&versioned_hashes=0x01bb',
      )
      expect(result).toEqual({
        blockNumber: 1,
        blobs: [{ data: 'blob1' }, { data: 'blob2' }],
      })
    })

    it('should throw on missing blobVersionedHashes', async () => {
      const rpcClient = mockObject<RpcClient>({
        getTransaction: mockFn().returns({
          type: '0x3',
          blockNumber: 1,
        }),
      })
      const client = mockClient({ rpcClient })

      await expect(client.getRelevantBlobs('txHash')).toBeRejectedWith(
        'Type 3 transaction missing blobVersionedHashes',
      )
    })
  })

  describe(BlobClient.prototype.getBlobs.name, () => {
    it('asks the beacon block after the given block for the hashes', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          execution_optimistic: false,
          finalized: true,
          data: ['blob1', 'blob2'],
        }),
      })
      const rpcClient = mockObject<RpcClient>({
        getBlockParentBeaconRoot: async () => 'root',
      })
      const client = mockClient({
        http,
        beaconApiUrl: 'example.com/',
        rpcClient,
      })

      const result = await client.getBlobs(1, ['0x01aa', '0x01bb'])

      expect(rpcClient.getBlockParentBeaconRoot).toHaveBeenOnlyCalledWith(2)
      expect(http.fetch.calls[0].args[0]).toEqual(
        'example.com/eth/v1/beacon/blobs/root?versioned_hashes=0x01aa&versioned_hashes=0x01bb',
      )
      expect(result).toEqual([{ data: 'blob1' }, { data: 'blob2' }])
    })

    it('asks nothing for no hashes', async () => {
      const http = mockObject<HttpClient>({ fetch: mockFn() })
      const client = mockClient({ http })

      const result = await client.getBlobs(1, [])

      expect(result).toEqual([])
      expect(http.fetch).not.toHaveBeenCalled()
    })

    it('asks once for a hash the tx repeats', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ data: ['blob'] }),
      })
      const rpcClient = mockObject<RpcClient>({
        getBlockParentBeaconRoot: async () => 'root',
      })
      const client = mockClient({
        http,
        beaconApiUrl: 'example.com/',
        rpcClient,
      })

      const result = await client.getBlobs(1, ['0x01aa', '0x01aa'])

      expect(http.fetch.calls[0].args[0]).toEqual(
        'example.com/eth/v1/beacon/blobs/root?versioned_hashes=0x01aa',
      )
      expect(result).toEqual([{ data: 'blob' }])
    })

    it('keeps a blob that two txs of the block posted', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ data: ['blob', 'blob'] }),
      })
      const rpcClient = mockObject<RpcClient>({
        getBlockParentBeaconRoot: async () => 'root',
      })
      const client = mockClient({ http, rpcClient })

      const result = await client.getBlobs(1, ['0x01aa'])

      expect(result).toEqual([{ data: 'blob' }, { data: 'blob' }])
    })

    it('throws when the node answers fewer blobs than asked for', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ data: [] }),
      })
      const rpcClient = mockObject<RpcClient>({
        getBlockParentBeaconRoot: async () => 'root',
      })
      const client = mockClient({ http, rpcClient })

      await expect(client.getBlobs(1, ['0x01aa'])).toBeRejectedWith(
        'Beacon node answered fewer blobs than asked for',
      )
    })
  })

  describe(BlobClient.prototype.call.name, () => {
    it('should call beacon api and return result', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ result: 'result' }),
      })
      const client = mockClient({ http, beaconApiUrl: 'BEACON_API_URL' })

      const result = await client.call('/eth/blob')

      expect(result).toEqual({ result: 'result' })
      expect(http.fetch.calls[0].args[0]).toEqual('BEACON_API_URL/eth/blob')
    })

    it('should throw on beacon error', async () => {
      const http = mockObject<HttpClient>({
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

  describe(BlobClient.prototype.validateResponse.name, () => {
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
  http?: HttpClient
  beaconApiUrl?: string
  rpcClient?: RpcClient
  generateId?: () => string
  timeout?: number
}) {
  return new BlobClient({
    beaconApiUrl: deps.beaconApiUrl ?? 'BEACON_API_URL',
    rpcClient: deps.rpcClient ?? mockObject<RpcClient>({}),
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    timeout: deps.timeout,
    generateId: deps.generateId,
    sourceName: 'test',
  })
}
