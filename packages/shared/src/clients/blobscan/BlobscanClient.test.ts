import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { BlobScanClient } from './BlobscanClient'

describe(BlobScanClient.name, () => {
  describe(BlobScanClient.prototype.getBlobs.name, () => {
    it('handles single-page responses', async () => {
      const blob = mockBlob()

      const http = mockObject<HttpClient>({
        fetch: mockFn().resolvesToOnce({
          blobs: [blob],
          totalBlobs: 500,
        }),
      })

      const client = mockClient({ http })

      const result = await client.getBlobs(100, 200)

      expect(result.length).toEqual(1)
      expect(http.fetch).toHaveBeenCalledTimes(1)
    })

    it('handles multi-page responses', async () => {
      const blob = mockBlob()

      const firstPage = {
        blobs: [blob],
        totalBlobs: 501, // More than MAX_PER_PAGE to trigger pagination
      }
      const secondPage = {
        blobs: [
          {
            ...blob,
            blockNumber: 101,
            txHash: '0xdef1',
          },
        ],
        totalBlobs: 501,
      }

      const http = mockObject<HttpClient>({
        fetch: mockFn().resolvesToOnce(firstPage).resolvesToOnce(secondPage),
      })

      const client = mockClient({ http })

      const result = await client.getBlobs(100, 200)

      expect(result.length).toEqual(2)
      expect(http.fetch).toHaveBeenCalledTimes(2)
    })
  })
})

function mockClient(deps: {
  http?: HttpClient
  baseUrl?: string
  timeout?: number
  maxPerPage?: number
}) {
  return new BlobScanClient({
    http: deps.http ?? mockObject<HttpClient>(),
    baseUrl: deps.baseUrl ?? 'http://example.com/',
    timeout: deps.timeout,
    maxPerPage: deps.maxPerPage,
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    sourceName: 'test',
  })
}

function mockBlob() {
  return {
    commitment: '0x1234',
    proof: '0x5678',
    size: 123456,
    versionedHash: '0x9abc',
    dataStorageReferences: [
      {
        storage: 'ipfs',
        url: 'ipfs://QmExample',
      },
    ],
    index: 0,
    txHash: '0xdef0',
    txIndex: 1,
    blockHash: '0xabcd',
    blockNumber: 100,
    blockTimestamp: '2024-01-01T00:00:00Z',
    transaction: {
      from: '0x1234567890123456789012345678901234567890',
      to: '0x0987654321098765432109876543210987654321',
    },
  }
}
