import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import type {
  BeaconChainClient,
  BlobScanClient,
  RpcClient,
} from '../../clients'
import { EthereumDaProvider } from './EthereumDaProvider'
import type { EthereumBlob } from './types'

describe(EthereumDaProvider.name, () => {
  describe(EthereumDaProvider.prototype.getBlobs.name, () => {
    it('should return blobs for given block range', async () => {
      const mockDate = new Date()

      const mockBlobScanClient = mockObject<BlobScanClient>({
        getBlobs: mockFn().resolvesTo([
          {
            type: 'ethereum',
            daLayer: 'ethereum',
            blockTimestamp: mockDate.toISOString(),
            transaction: {
              to: '0xto1',
              from: '0xfrom1',
            },
          },
          {
            type: 'ethereum',
            daLayer: 'ethereum',
            blockTimestamp: mockDate.toISOString(),
            transaction: {
              to: '0xto2',
              from: '0xfrom2',
            },
          },
        ]),
      })

      const mockRpcClient = mockObject<RpcClient>()

      const mockBeaconChainClient = mockObject<BeaconChainClient>()

      const provider = new EthereumDaProvider(
        mockBlobScanClient,
        mockBeaconChainClient,
        mockRpcClient,
        'ethereum',
      )

      const result = await provider.getBlobs(1, 2)

      expect(result).toEqual([
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xto1',
          sequencer: '0xfrom1',
          blockTimestamp: UnixTime.fromDate(mockDate),
          size: 131072n,
        } as EthereumBlob,
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xto2',
          sequencer: '0xfrom2',
          blockTimestamp: UnixTime.fromDate(mockDate),
          size: 131072n,
        } as EthereumBlob,
      ])
    })

    it('should fallback to beacon chain if blobscan returns empty array', async () => {
      const mockDate = new Date()
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

      const mockBlobScanClient = mockObject<BlobScanClient>({
        getBlobs: mockFn().resolvesTo([]),
      })

      const mockRpcClient = mockObject<RpcClient>({
        getBlock: mockFn().resolvesTo({
          timestamp: UnixTime.fromDate(mockDate),
          transactions: [
            {
              type: '0x3',
              blobVersionedHashes: [versionedHash1, versionedHash2],
              from: '0xfrom1',
              to: '0xto1',
            },
          ],
        }),
      })

      const mockBeaconChainClient = mockObject<BeaconChainClient>({
        getBlockSidecar: mockFn().resolvesTo([blob1, blob2]),
      })

      const provider = new EthereumDaProvider(
        mockBlobScanClient,
        mockBeaconChainClient,
        mockRpcClient,
        'ethereum',
      )

      const result = await provider.getBlobs(1, 1)

      expect(result).toEqual([
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xto1',
          sequencer: '0xfrom1',
          blockTimestamp: UnixTime.fromDate(mockDate),
          size: 131072n,
        } as EthereumBlob,
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xto1',
          sequencer: '0xfrom1',
          blockTimestamp: UnixTime.fromDate(mockDate),
          size: 131072n,
        } as EthereumBlob,
      ])
    })
  })

  describe(EthereumDaProvider.prototype.getBlobsByVersionedHashesAndBlockNumber
    .name, () => {
    it('should return blobs for given versioned hashes', async () => {
      const kzgCommitment1 = generateKzgCommitment()
      const kzgCommitment2 = generateKzgCommitment()
      const versionedHash1 = '0x01' + utils.sha256(kzgCommitment1).substring(4)

      const mockBlobScanClient = mockObject<BlobScanClient>()

      const mockRpcClient = mockObject<RpcClient>({
        getBlockParentBeaconRoot: mockFn().resolvesTo('blockId'),
      })

      const mockBeaconChainClient = mockObject<BeaconChainClient>({
        getBlockSidecar: mockFn().resolvesTo([
          {
            kzg_commitment: kzgCommitment1,
            data: 'blob1',
          },
          {
            kzg_commitment: kzgCommitment2,
            data: 'blob2',
          },
        ]),
      })

      const provider = new EthereumDaProvider(
        mockBlobScanClient,
        mockBeaconChainClient,
        mockRpcClient,
        'ethereum',
      )

      const result = await provider.getBlobsByVersionedHashesAndBlockNumber(
        [versionedHash1],
        1,
      )

      expect(result).toEqual([
        {
          kzg_commitment: kzgCommitment1,
          data: 'blob1',
        },
      ])
    })

    it('should return empty array for no versioned hashes', async () => {
      const kzgCommitment1 = generateKzgCommitment()
      const kzgCommitment2 = generateKzgCommitment()

      const mockBlobScanClient = mockObject<BlobScanClient>()

      const mockRpcClient = mockObject<RpcClient>({
        getBlockParentBeaconRoot: mockFn().resolvesTo('blockId'),
      })

      const mockBeaconChainClient = mockObject<BeaconChainClient>({
        getBlockSidecar: mockFn().resolvesTo([
          {
            kzg_commitment: kzgCommitment1,
            data: 'blob1',
          },
          {
            kzg_commitment: kzgCommitment2,
            data: 'blob2',
          },
        ]),
      })

      const provider = new EthereumDaProvider(
        mockBlobScanClient,
        mockBeaconChainClient,
        mockRpcClient,
        'ethereum',
      )

      const result = await provider.getBlobsByVersionedHashesAndBlockNumber(
        [],
        1,
      )

      expect(result).toEqual([])
    })
  })

  describe(EthereumDaProvider.prototype.getRelevantBlobs.name, () => {
    it('should return empty blobs for type 2 transaction', async () => {
      const mockBlobScanClient = mockObject<BlobScanClient>()

      const mockRpcClient = mockObject<RpcClient>({
        getBlockParentBeaconRoot: mockFn().resolvesTo('blockId'),
        getTransaction: mockFn().returns({
          type: '0x2',
          blockNumber: 1,
        }),
      })

      const mockBeaconChainClient = mockObject<BeaconChainClient>({
        getBlockSidecar: mockFn().resolvesTo([]),
      })

      const provider = new EthereumDaProvider(
        mockBlobScanClient,
        mockBeaconChainClient,
        mockRpcClient,
        'ethereum',
      )

      const result = await provider.getRelevantBlobs('txHash')
      expect(result).toEqual([])
    })

    it('should return blobs for type 3 transaction', async () => {
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

      const mockBlobScanClient = mockObject<BlobScanClient>()

      const mockRpcClient = mockObject<RpcClient>({
        getBlockParentBeaconRoot: mockFn().resolvesTo('blockId'),
        getTransaction: mockFn().returns({
          type: '0x3',
          blockNumber: 1,
          blobVersionedHashes: [versionedHash1, versionedHash2],
        }),
      })

      const mockBeaconChainClient = mockObject<BeaconChainClient>({
        getBlockSidecar: mockFn().resolvesTo([
          blob1,
          blob2,
          {
            kzg_commitment: generateKzgCommitment(),
            data: 'blob3',
          },
        ]),
      })

      const provider = new EthereumDaProvider(
        mockBlobScanClient,
        mockBeaconChainClient,
        mockRpcClient,
        'ethereum',
      )

      const result = await provider.getRelevantBlobs('txHash')
      expect(result).toEqual([blob1, blob2])
    })

    it('should throw on missing blobVersionedHashes', async () => {
      const mockBlobScanClient = mockObject<BlobScanClient>()

      const mockRpcClient = mockObject<RpcClient>({
        getBlockParentBeaconRoot: mockFn().resolvesTo('blockId'),
        getTransaction: mockFn().returns({
          type: '0x3',
          blockNumber: 1,
        }),
      })

      const mockBeaconChainClient = mockObject<BeaconChainClient>()

      const provider = new EthereumDaProvider(
        mockBlobScanClient,
        mockBeaconChainClient,
        mockRpcClient,
        'ethereum',
      )

      await expect(provider.getRelevantBlobs('txHash')).toBeRejectedWith(
        'Type 3 transaction missing blobVersionedHashes',
      )
    })
  })
})

function generateKzgCommitment(): string {
  return (
    '0x' +
    Array.from({ length: 96 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('')
  )
}
