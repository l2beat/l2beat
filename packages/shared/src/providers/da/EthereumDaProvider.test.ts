import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import type { BeaconChainClient, RpcClient } from '../../clients'
import { EthereumDaProvider } from './EthereumDaProvider'
import type { EthereumBlob } from './types'

describe(EthereumDaProvider.name, () => {
  describe(EthereumDaProvider.prototype.getBlobs.name, () => {
    it('should return blobs for given block range', async () => {
      const mockDate = new Date()

      const versionedHash1 = '0x0123'
      const versionedHash2 = '0x0123'

      const txHash = '0xtx1'

      const mockRpcClient = mockObject<RpcClient>({
        getBlock: mockFn().resolvesTo({
          timestamp: UnixTime.fromDate(mockDate),
          number: 1,
          transactions: [
            {
              hash: txHash,
              type: '0x3',
              blobVersionedHashes: [versionedHash1, versionedHash2],
              from: '0xfrom1',
              to: '0xto1',
            },
          ],
        }),
        getLogs: mockFn().resolvesTo([
          {
            transactionHash: txHash,
            address: 'inbox1',
            topics: ['topic1-1'],
          },
        ]),
      })

      const provider = new EthereumDaProvider(
        mockObject<BeaconChainClient>(),
        mockRpcClient,
        'ethereum',
      )

      const result = await provider.getBlobs(1, 1)

      expect(mockRpcClient.getLogs).toHaveBeenCalledWith(1, 1)

      expect(result).toEqual([
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xto1',
          sequencer: '0xfrom1',
          topics: ['topic1-1'],
          blockTimestamp: UnixTime.fromDate(mockDate),
          blockNumber: 1,
          size: 131072n,
        } as EthereumBlob,
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xto1',
          sequencer: '0xfrom1',
          topics: ['topic1-1'],
          blockTimestamp: UnixTime.fromDate(mockDate),
          blockNumber: 1,
          size: 131072n,
        } as EthereumBlob,
      ])
    })
  })

  describe(
    EthereumDaProvider.prototype.getBlobsByVersionedHashesAndBlockNumber.name,
    () => {
      it('should return blobs for given versioned hashes', async () => {
        const kzgCommitment1 = generateKzgCommitment()
        const kzgCommitment2 = generateKzgCommitment()
        const versionedHash1 =
          '0x01' + utils.sha256(kzgCommitment1).substring(4)

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
    },
  )

  describe(EthereumDaProvider.prototype.getRelevantBlobs.name, () => {
    it('should return empty blobs for type 2 transaction', async () => {
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
        mockBeaconChainClient,
        mockRpcClient,
        'ethereum',
      )

      const result = await provider.getRelevantBlobs('txHash')
      expect(result).toEqual([blob1, blob2])
    })

    it('should throw on missing blobVersionedHashes', async () => {
      const mockRpcClient = mockObject<RpcClient>({
        getBlockParentBeaconRoot: mockFn().resolvesTo('blockId'),
        getTransaction: mockFn().returns({
          type: '0x3',
          blockNumber: 1,
        }),
      })

      const mockBeaconChainClient = mockObject<BeaconChainClient>()

      const provider = new EthereumDaProvider(
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
