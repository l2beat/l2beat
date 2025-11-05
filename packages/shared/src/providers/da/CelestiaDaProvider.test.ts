import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { CelestiaRpcClient } from '../../clients'
import { CelestiaDaProvider } from './CelestiaDaProvider'

describe(CelestiaDaProvider.name, () => {
  describe(CelestiaDaProvider.prototype.getBlobs.name, () => {
    it('fetches blobs from multiple blocks with plain-text encoding (after block 6515203)', async () => {
      const blockData = [
        {
          blockNumber: 6515203,
          timestamp: '2024-01-01T12:00:00Z',
          namespacesKey: 'namespaces',
          namespacesValue: '["namespace1", "namespace2"]',
          sizesKey: 'blob_sizes',
          sizesValue: '[100, 200]',
        },
        {
          blockNumber: 6515204,
          timestamp: '2024-01-02T12:00:00Z',
          namespacesKey: 'namespaces',
          namespacesValue: '["namespace3", "namespace4"]',
          sizesKey: 'blob_sizes',
          sizesValue: '[300, 400]',
        },
      ]
      const rpcClientMock = createMockRpcClient(blockData)
      const provider = new CelestiaDaProvider(rpcClientMock, 'celestia')
      const blobs = await provider.getBlobs(6515203, 6515204)

      expect(blobs).toEqual([
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace1',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
          blockNumber: 6515203,
          size: BigInt(100),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace2',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
          blockNumber: 6515203,
          size: BigInt(200),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace3',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-02T12:00:00Z')),
          blockNumber: 6515204,
          size: BigInt(300),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace4',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-02T12:00:00Z')),
          blockNumber: 6515204,
          size: BigInt(400),
        },
      ])
    })

    it('fetches blobs from blocks with base64 encoding (before block 6515203)', async () => {
      const blockData = [
        {
          blockNumber: 6515201,
          timestamp: '2024-01-01T12:00:00Z',
          namespacesKey: 'bmFtZXNwYWNlcw==', // 'namespaces' encoded in base64
          namespacesValue: Buffer.from('["namespace1", "namespace2"]').toString(
            'base64',
          ),
          sizesKey: 'YmxvYl9zaXplcw==', // 'blob_sizes' encoded in base64
          sizesValue: Buffer.from('[100, 200]').toString('base64'),
        },
        {
          blockNumber: 6515202,
          timestamp: '2024-01-02T12:00:00Z',
          namespacesKey: 'bmFtZXNwYWNlcw==', // 'namespaces' encoded in base64
          namespacesValue: Buffer.from('["namespace3", "namespace4"]').toString(
            'base64',
          ),
          sizesKey: 'YmxvYl9zaXplcw==', // 'blob_sizes' encoded in base64
          sizesValue: Buffer.from('[300, 400]').toString('base64'),
        },
      ]
      const rpcClientMock = createMockRpcClient(blockData)
      const provider = new CelestiaDaProvider(rpcClientMock, 'celestia')
      const blobs = await provider.getBlobs(6515201, 6515202)

      expect(blobs).toEqual([
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace1',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
          blockNumber: 6515201,
          size: BigInt(100),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace2',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
          blockNumber: 6515201,
          size: BigInt(200),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace3',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-02T12:00:00Z')),
          blockNumber: 6515202,
          size: BigInt(300),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace4',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-02T12:00:00Z')),
          blockNumber: 6515202,
          size: BigInt(400),
        },
      ])
    })

    it('returns empty array when block has no transactions', async () => {
      const rpcClientMock = mockObject<CelestiaRpcClient>({
        getBlockResult: async () => ({
          height: '100',
          txs_results: null,
        }),
        getBlockTimestamp: async () =>
          UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
      })
      const provider = new CelestiaDaProvider(rpcClientMock, 'celestia')
      const blobs = await provider.getBlobs(1, 1)

      expect(blobs).toEqual([])
    })

    it('filters out non-blob events', async () => {
      const rpcClientMock = mockObject<CelestiaRpcClient>({
        getBlockResult: async () => ({
          height: '100',
          txs_results: [
            {
              events: [
                {
                  type: 'otherEvent',
                  attributes: [
                    {
                      key: 'other-key',
                      value: 'different-value',
                    },
                  ],
                },
              ],
            },
          ],
        }),
        getBlockTimestamp: async () =>
          UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
      })
      const provider = new CelestiaDaProvider(rpcClientMock, 'celestia')
      const blobs = await provider.getBlobs(6515204, 6515204)

      expect(blobs).toEqual([])
    })
  })
})

interface BlockData {
  blockNumber: number
  timestamp: string
  namespacesKey: string
  namespacesValue: string
  sizesKey: string
  sizesValue: string
}

function createMockRpcClient(blockData: BlockData[]) {
  const blockMap = new Map(blockData.map((b) => [b.blockNumber, b]))

  return mockObject<CelestiaRpcClient>({
    getBlockResult: async (blockNumber: number) => {
      const data = blockMap.get(blockNumber)
      if (!data) {
        throw new Error(`No mock data for block ${blockNumber}`)
      }

      return {
        height: '100',
        txs_results: [
          {
            events: [
              {
                type: 'celestia.blob.v1.EventPayForBlobs',
                attributes: [
                  {
                    key: data.namespacesKey,
                    value: data.namespacesValue,
                  },
                  {
                    key: data.sizesKey,
                    value: data.sizesValue,
                  },
                ],
              },
              {
                type: 'otherEvent',
                attributes: [
                  {
                    key: 'other-key',
                    value: 'different-value',
                  },
                ],
              },
            ],
          },
        ],
      }
    },
    getBlockTimestamp: async (blockNumber: number) => {
      const data = blockMap.get(blockNumber)
      if (!data) {
        throw new Error(`No mock data for block ${blockNumber}`)
      }
      return UnixTime.fromDate(new Date(data.timestamp))
    },
  })
}
