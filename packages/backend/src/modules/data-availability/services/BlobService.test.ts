import type { Database, TxWithBlobsRecord } from '@l2beat/database'
import { ETHEREUM_BLOB_SIZE_BYTES, type EthereumBlob } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import { BlobService } from './BlobService'

describe(BlobService.name, () => {
  describe(BlobService.prototype.save.name, () => {
    it('should save blob txs', async () => {
      const blobs: EthereumBlob[] = [
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          blockTimestamp: 100_000,
          blockNumber: 1,
          size: 2n * ETHEREUM_BLOB_SIZE_BYTES,
          inbox: '0x123',
          sequencer: '0x456',
          txHash: '0xtx1',
          blobCount: 2,
          topics: ['0xabc', '0xdef'],
          logs: [{ emitter: '0x789', topics: ['0xabc', '0xdef'] }],
        },
      ]

      const mockTxWithBlobsRepository = mockObject<Database['txWithBlobs']>({
        insertMany: mockFn().resolvesTo(undefined),
      })

      const mockDb = mockDatabase({
        txWithBlobs: mockTxWithBlobsRepository,
      })

      const blobService = new BlobService(mockDb)
      await blobService.save(blobs)

      expect(mockTxWithBlobsRepository.insertMany).toHaveBeenCalledWith(
        blobs.map((blob) => ({
          blockNumber: blob.blockNumber,
          timestamp: blob.blockTimestamp,
          daLayer: blob.daLayer,
          from: blob.sequencer,
          to: blob.inbox,
          txHash: blob.txHash,
          blobCount: blob.blobCount,
          logs: blob.logs,
          topics: null,
        })),
      )
    })
  })

  describe(BlobService.prototype.get.name, () => {
    it('should get blob txs', async () => {
      const records: TxWithBlobsRecord[] = [
        {
          id: 1,
          blockNumber: 100,
          timestamp: 100_000,
          daLayer: 'ethereum',
          from: '0x123',
          to: '0x456',
          txHash: '0xtx1',
          blobCount: 2,
          logs: [{ emitter: '0x789', topics: ['0xabc', '0xdef'] }],
          topics: null,
        },
        {
          // Legacy row backfilled from the per-blob table.
          id: 2,
          blockNumber: 99,
          timestamp: 99_000,
          daLayer: 'ethereum',
          from: '0xabc',
          to: '0xdef',
          txHash: null,
          blobCount: 1,
          logs: null,
          topics: ['0xlegacy'],
        },
      ]

      const mockTxWithBlobsRepository = mockObject<Database['txWithBlobs']>({
        getByBlockRangeInclusive: mockFn().resolvesTo(records),
      })

      const mockDb = mockDatabase({
        txWithBlobs: mockTxWithBlobsRepository,
      })

      const blobService = new BlobService(mockDb)
      const blobs = await blobService.get('ethereum', 1, 100)

      expect(blobs).toEqualUnsorted([
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          blockTimestamp: 100_000,
          blockNumber: 100,
          size: 2n * ETHEREUM_BLOB_SIZE_BYTES,
          inbox: '0x456',
          sequencer: '0x123',
          txHash: '0xtx1',
          blobCount: 2,
          topics: ['0xabc', '0xdef'],
          logs: [{ emitter: '0x789', topics: ['0xabc', '0xdef'] }],
        },
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          blockTimestamp: 99_000,
          blockNumber: 99,
          size: ETHEREUM_BLOB_SIZE_BYTES,
          inbox: '0xdef',
          sequencer: '0xabc',
          txHash: null,
          blobCount: 1,
          topics: ['0xlegacy'],
          logs: null,
        },
      ])

      expect(
        mockTxWithBlobsRepository.getByBlockRangeInclusive,
      ).toHaveBeenCalledWith('ethereum', 1, 100)
    })
  })

  describe(BlobService.prototype.deleteAfter.name, () => {
    it('should delete blob txs', async () => {
      const deletedRecords = 2
      const mockTxWithBlobsRepository = mockObject<Database['txWithBlobs']>({
        deleteAfter: mockFn().resolvesTo(deletedRecords),
      })

      const mockDb = mockDatabase({
        txWithBlobs: mockTxWithBlobsRepository,
      })

      const blobService = new BlobService(mockDb)
      const result = await blobService.deleteAfter('ethereum', 100)

      expect(result).toEqual(deletedRecords)

      expect(mockTxWithBlobsRepository.deleteAfter).toHaveBeenCalledWith(
        'ethereum',
        100,
      )
    })
  })
})
