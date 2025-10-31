import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { CelestiaRpcClient } from '../../clients'
import { CelestiaDaProvider } from './CelestiaDaProvider'

describe(CelestiaDaProvider.name, () => {
  describe(CelestiaDaProvider.prototype.getBlobs.name, () => {
    it('fetches blobs from multiple blocks with different timestamps', async () => {
      const rpcClientMock = createMockRpcClient()
      const provider = new CelestiaDaProvider(rpcClientMock, 'celestia')
      const namespaces = [
        'namespace1',
        'namespace2',
        'namespace3',
        'namespace4',
      ]
      const blobs = await provider.getBlobs(1, 2, namespaces)

      expect(blobs).toEqual([
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace1',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
          blockNumber: 1,
          size: BigInt(100),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace2',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
          blockNumber: 1,
          size: BigInt(200),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace3',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-02T12:00:00Z')),
          blockNumber: 2,
          size: BigInt(300),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace4',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-02T12:00:00Z')),
          blockNumber: 2,
          size: BigInt(400),
        },
      ])
    })

    it('throws when namespaces are not provided', async () => {
      const rpcClientMock = createMockRpcClient()
      const provider = new CelestiaDaProvider(rpcClientMock, 'celestia')

      await expect(() => provider.getBlobs(1, 2)).toBeRejectedWith(
        'Namespaces are required',
      )
    })

    it('returns empty array when no blobs found', async () => {
      const rpcClientMock = mockObject<CelestiaRpcClient>({
        getBlobsForNamespaces: async () => [],
        getBlockTimestamp: async () =>
          UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
      })
      const provider = new CelestiaDaProvider(rpcClientMock, 'celestia')
      const blobs = await provider.getBlobs(1, 1, ['namespace1'])

      expect(blobs).toEqual([])
    })
  })
})

function createMockRpcClient() {
  // Create base64 strings with specific byte lengths
  // 100 bytes, 200 bytes, 300 bytes, 400 bytes
  const data100 = Buffer.alloc(100).toString('base64')
  const data200 = Buffer.alloc(200).toString('base64')
  const data300 = Buffer.alloc(300).toString('base64')
  const data400 = Buffer.alloc(400).toString('base64')

  return mockObject<CelestiaRpcClient>({
    getBlobsForNamespaces: async (blockNumber: number) => {
      if (blockNumber === 1) {
        return [
          { namespace: 'namespace1', data: data100 },
          { namespace: 'namespace2', data: data200 },
        ]
      }
      if (blockNumber === 2) {
        return [
          { namespace: 'namespace3', data: data300 },
          { namespace: 'namespace4', data: data400 },
        ]
      }
      return []
    },
    getBlockTimestamp: async (blockNumber: number) =>
      UnixTime.fromDate(
        new Date(
          blockNumber === 1 ? '2024-01-01T12:00:00Z' : '2024-01-02T12:00:00Z',
        ),
      ),
  })
}
