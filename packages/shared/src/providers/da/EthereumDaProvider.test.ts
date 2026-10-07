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

  describe(EthereumDaProvider.prototype.getBlocksWithBlobBatches.name, () => {
    it('returns every block with its blob transactions as batches', async () => {
      const mockRpcClient = mockObject<RpcClient>({
        getBlock: mockFn()
          .given(1, true as unknown as false)
          .resolvesToOnce({
            number: 1,
            hash: '0xhash1',
            parentHash: '0xhash0',
            timestamp: 100,
            transactions: [
              { hash: '0xplain', type: '2', from: '0xa', to: '0xb' },
              {
                hash: '0xblobs',
                type: '3',
                blobVersionedHashes: ['0x01', '0x02', '0x03'],
                from: '0xsequencer',
                to: '0xinbox',
              },
            ],
          })
          .given(2, true as unknown as false)
          .resolvesToOnce({
            number: 2,
            hash: '0xhash2',
            parentHash: '0xhash1',
            timestamp: 112,
            transactions: [],
          }),
        getLogs: mockFn().resolvesTo([
          { transactionHash: '0xblobs', topics: ['0xtopic1', '0xtopic2'] },
          { transactionHash: '0xplain', topics: ['0xother'] },
        ]),
      })
      const provider = new EthereumDaProvider(
        mockObject<BeaconChainClient>(),
        mockRpcClient,
        'ethereum',
      )

      const result = await provider.getBlocksWithBlobBatches(1, 2)

      // Blocks without blobs still come back: the live view shows them as
      // proposed, and their hashes chain the next block to the stored one
      expect(result).toEqual([
        {
          number: 1,
          hash: '0xhash1',
          parentHash: '0xhash0',
          timestamp: UnixTime(100),
          batches: [
            {
              txIndex: 1,
              txHash: '0xblobs',
              from: '0xsequencer',
              to: '0xinbox',
              topics: ['0xtopic1', '0xtopic2'],
              blobs: 3,
            },
          ],
        },
        {
          number: 2,
          hash: '0xhash2',
          parentHash: '0xhash1',
          timestamp: UnixTime(112),
          batches: [],
        },
      ])
      expect(mockRpcClient.getLogs).toHaveBeenOnlyCalledWith(1, 2)
    })

    it('asks for the blocks without waiting for the logs', async () => {
      // The live view waits on this for the newest block: fetched one after
      // the other, the two calls add up
      let logsAnswered = false
      let blockAskedEarly = false
      const mockRpcClient = mockObject<RpcClient>({
        getBlock: mockFn(async () => {
          blockAskedEarly = !logsAnswered
          return {
            number: 1,
            hash: '0xhash1',
            parentHash: '0xhash0',
            timestamp: 100,
            transactions: [],
          }
        }) as unknown as RpcClient['getBlock'],
        getLogs: mockFn(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0))
          logsAnswered = true
          return []
        }),
      })
      const provider = new EthereumDaProvider(
        mockObject<BeaconChainClient>(),
        mockRpcClient,
        'ethereum',
      )

      await provider.getBlocksWithBlobBatches(1, 1)

      expect(blockAskedEarly).toEqual(true)
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

  describe(EthereumDaProvider.prototype.getBlockTimestamp.name, () => {
    it('returns the timestamp of the block', async () => {
      const mockRpcClient = mockObject<RpcClient>({
        getBlock: mockFn().resolvesTo({ timestamp: UnixTime(1_700_000_000) }),
      })
      const provider = new EthereumDaProvider(
        mockObject<BeaconChainClient>(),
        mockRpcClient,
        'ethereum',
      )

      const timestamp = await provider.getBlockTimestamp(123)

      expect(timestamp).toEqual(UnixTime(1_700_000_000))
      // getBlock is overloaded, earl picks the includeTxs: true signature
      expect(mockRpcClient.getBlock).toHaveBeenOnlyCalledWith(
        123,
        false as unknown as true,
      )
    })
  })

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
