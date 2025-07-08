import type { BlobRecord, Database } from '@l2beat/database'
import { ETHEREUM_BLOB_SIZE_BYTES, type EthereumBlob } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import { BlobService } from './BlobService'

describe(BlobService.name, () => {
  describe(BlobService.prototype.save.name, () => {
    it('should save blobs', async () => {
      const blobs: EthereumBlob[] = [
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          blockTimestamp: 100_000,
          blockNumber: 1,
          size: ETHEREUM_BLOB_SIZE_BYTES,
          inbox: '0x123',
          sequencer: '0x456',
          topics: ['0xabc', '0xdef'],
        },
      ]

      const mockBlobRepository = mockObject<Database['blobs']>({
        insertMany: mockFn().resolvesTo(undefined),
      })

      const mockDb = mockDatabase({
        blobs: mockBlobRepository,
      })

      const blobService = new BlobService(mockDb)
      await blobService.save(blobs)

      expect(mockBlobRepository.insertMany).toHaveBeenCalledWith(
        blobs.map((blob) => ({
          blockNumber: blob.blockNumber,
          timestamp: blob.blockTimestamp,
          daLayer: blob.daLayer,
          from: blob.sequencer,
          to: blob.inbox,
          topics: blob.topics ?? null,
          size: null,
        })),
      )
    })
  })

  describe(BlobService.prototype.get.name, () => {
    it('should get blobs', async () => {
      const records: BlobRecord[] = [
        {
          id: 1,
          blockNumber: 100,
          timestamp: 100_000,
          daLayer: 'ethereum',
          from: '0x123',
          to: '0x456',
          topics: ['0xabc', '0xdef'],
          size: null,
        },
      ]

      const mockBlobRepository = mockObject<Database['blobs']>({
        getByBlockRangeInclusive: mockFn().resolvesTo(records),
      })

      const mockDb = mockDatabase({
        blobs: mockBlobRepository,
      })

      const blobService = new BlobService(mockDb)
      const blobs = await blobService.get('ethereum', 1, 100)

      expect(blobs).toEqualUnsorted(
        records.map((record) => ({
          type: 'ethereum',
          daLayer: record.daLayer,
          blockTimestamp: record.timestamp,
          blockNumber: record.blockNumber,
          size: ETHEREUM_BLOB_SIZE_BYTES,
          inbox: record.to ?? '',
          sequencer: record.from,
          topics: record.topics ?? [],
        })),
      )

      expect(mockBlobRepository.getByBlockRangeInclusive).toHaveBeenCalledWith(
        'ethereum',
        1,
        100,
      )
    })
  })

  describe(BlobService.prototype.deleteAfter.name, () => {
    it('should delete blobs', async () => {
      const deletedRecords = 2
      const mockBlobRepository = mockObject<Database['blobs']>({
        deleteAfter: mockFn().resolvesTo(deletedRecords),
      })

      const mockDb = mockDatabase({
        blobs: mockBlobRepository,
      })

      const blobService = new BlobService(mockDb)
      const result = await blobService.deleteAfter('ethereum', 100)

      expect(result).toEqual(deletedRecords)

      expect(mockBlobRepository.deleteAfter).toHaveBeenCalledWith(
        'ethereum',
        100,
      )
    })
  })
})
