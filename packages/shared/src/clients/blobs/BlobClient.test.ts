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
      const http = beaconAnswering(['blob1', 'blob2'])
      const rpcClient = mockObject<RpcClient>({
        getTransaction: mockFn().returns({
          type: '0x3',
          blockNumber: 1,
          blobVersionedHashes: ['0x01aa', '0x01bb'],
        }),
        getBlockTimestamp: async () => TIMESTAMP,
      })
      const client = mockClient({
        http,
        beaconApiUrl: 'example.com/',
        rpcClient,
      })

      const result = await client.getRelevantBlobs('txHash')

      expect(http.fetch.calls[1].args[0]).toEqual(
        `example.com/eth/v1/beacon/blobs/${SLOT}?versioned_hashes=0x01aa&versioned_hashes=0x01bb`,
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
    it('asks the beacon block at the slot of the block timestamp', async () => {
      const http = beaconAnswering(['blob1', 'blob2'])
      const rpcClient = rpcAt(TIMESTAMP)
      const client = mockClient({
        http,
        beaconApiUrl: 'example.com/',
        rpcClient,
      })

      const result = await client.getBlobs(1, ['0x01aa', '0x01bb'])

      expect(rpcClient.getBlockTimestamp).toHaveBeenOnlyCalledWith(1)
      expect(http.fetch.calls.map((call) => call.args[0])).toEqual([
        'example.com/eth/v1/beacon/genesis',
        `example.com/eth/v1/beacon/blobs/${SLOT}?versioned_hashes=0x01aa&versioned_hashes=0x01bb`,
      ])
      expect(result).toEqual([{ data: 'blob1' }, { data: 'blob2' }])
    })

    it('asks for the genesis once', async () => {
      const http = beaconAnswering(['blob'])
      const client = mockClient({ http, rpcClient: rpcAt(TIMESTAMP) })

      await client.getBlobs(1, ['0x01aa'])
      await client.getBlobs(2, ['0x01aa'])

      expect(
        http.fetch.calls.filter((call) =>
          call.args[0].endsWith('eth/v1/beacon/genesis'),
        ).length,
      ).toEqual(1)
    })

    it('throws for a timestamp off the slot grid', async () => {
      const http = beaconAnswering(['blob'])
      const client = mockClient({ http, rpcClient: rpcAt(TIMESTAMP + 6) })

      await expect(client.getBlobs(1, ['0x01aa'])).toBeRejectedWith(
        'Block timestamp is off the slot grid',
      )
    })

    it('asks nothing for no hashes', async () => {
      const http = mockObject<HttpClient>({ fetch: mockFn() })
      const client = mockClient({ http })

      const result = await client.getBlobs(1, [])

      expect(result).toEqual([])
      expect(http.fetch).not.toHaveBeenCalled()
    })

    it('asks once for a hash the tx repeats', async () => {
      const http = beaconAnswering(['blob'])
      const client = mockClient({
        http,
        beaconApiUrl: 'example.com/',
        rpcClient: rpcAt(TIMESTAMP),
      })

      const result = await client.getBlobs(1, ['0x01aa', '0x01aa'])

      expect(http.fetch.calls[1].args[0]).toEqual(
        `example.com/eth/v1/beacon/blobs/${SLOT}?versioned_hashes=0x01aa`,
      )
      expect(result).toEqual([{ data: 'blob' }])
    })

    it('keeps a blob that two txs of the block posted', async () => {
      const http = beaconAnswering(['blob', 'blob'])
      const client = mockClient({ http, rpcClient: rpcAt(TIMESTAMP) })

      const result = await client.getBlobs(1, ['0x01aa'])

      expect(result).toEqual([{ data: 'blob' }, { data: 'blob' }])
    })

    it('throws when the node answers fewer blobs than asked for', async () => {
      const http = beaconAnswering([])
      const client = mockClient({ http, rpcClient: rpcAt(TIMESTAMP) })

      await expect(client.getBlobs(1, ['0x01aa'])).toBeRejectedWith(
        'Beacon node answered fewer blobs than asked for',
      )
    })

    it('throws when a doubled blob stands in for a missing one', async () => {
      const http = beaconAnswering(['blob', 'blob'])
      const client = mockClient({ http, rpcClient: rpcAt(TIMESTAMP) })

      await expect(client.getBlobs(1, ['0x01aa', '0x01bb'])).toBeRejectedWith(
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

// Mainnet genesis and the slot of block 26354565
const GENESIS = 1606824023
const SLOT = 15594090
const TIMESTAMP = GENESIS + 12 * SLOT

function beaconAnswering(blobs: string[]) {
  return mockObject<HttpClient>({
    fetch: async (url: string) =>
      url.endsWith('eth/v1/beacon/genesis')
        ? { data: { genesis_time: String(GENESIS) } }
        : { data: blobs },
  })
}

function rpcAt(timestamp: number) {
  return mockObject<RpcClient>({ getBlockTimestamp: async () => timestamp })
}
