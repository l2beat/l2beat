import { Logger } from '@l2beat/backend-tools'
import {
  type DaBlob,
  type DaProvider,
  ETHEREUM_BLOB_SIZE_BYTES,
  type EthereumBlob,
} from '@l2beat/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { BlobService } from '../services/BlobService'
import { BlobIndexer } from './BlobIndexer'

const DA_LAYER = 'test-layer'

describe(BlobIndexer.name, () => {
  describe(BlobIndexer.prototype.update.name, () => {
    it('fetches blobs and saves metrics to DB', async () => {
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

      const { indexer, daProvider, blobService } = mockIndexer({
        blobs,
        batchSize: 100,
      })

      const safeHeight = await indexer.update(100, 200)

      expect(daProvider.getBlobs).toHaveBeenCalledExactlyOnceWith(
        DA_LAYER,
        100,
        200,
      )
      expect(safeHeight).toBe(200)

      expect(blobService.save).toHaveBeenCalledWith(blobs)
    })

    describe('handles batch size', () => {
      it('from + batchSize > to', async () => {
        const { indexer, daProvider } = mockIndexer({
          batchSize: 50,
        })

        const safeHeight = await indexer.update(100, 200)

        expect(daProvider.getBlobs).toHaveBeenCalledExactlyOnceWith(
          DA_LAYER,
          100,
          150,
        )
        expect(safeHeight).toBe(150)
      })

      it('from + batchSize < to', async () => {
        const { indexer, daProvider } = mockIndexer({
          batchSize: 150,
        })

        const safeHeight = await indexer.update(100, 200)

        expect(daProvider.getBlobs).toHaveBeenCalledExactlyOnceWith(
          DA_LAYER,
          100,
          200,
        )
        expect(safeHeight).toBe(200)
      })
    })

    it('handles empty blobs response', async () => {
      const { indexer, daProvider, blobService } = mockIndexer({
        blobs: [],
        batchSize: 100,
      })

      const safeHeight = await indexer.update(100, 200)

      expect(daProvider.getBlobs).toHaveBeenCalledExactlyOnceWith(
        DA_LAYER,
        100,
        200,
      )
      expect(safeHeight).toBe(200)

      expect(blobService.save).not.toHaveBeenCalled()
    })
  })

  describe(BlobIndexer.prototype.invalidate.name, () => {
    it('deletes records', async () => {
      const targetHeight = 100
      const { indexer, blobService } = mockIndexer({})
      await indexer.invalidate(targetHeight)

      expect(blobService.deleteAfter).toHaveBeenCalledWith(
        DA_LAYER,
        targetHeight,
      )
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function mockIndexer($: {
  batchSize?: number
  indexerService?: IndexerService
  blobs?: DaBlob[]
}) {
  const blobService = {
    get: vi.fn().mockResolvedValue($.blobs ?? []),
    save: vi.fn().mockResolvedValue(undefined),
    deleteAfter: vi.fn().mockResolvedValue({}),
  } as unknown as BlobService

  const daProvider = {
    getBlobs: vi.fn(async () => $.blobs ?? []), // Empty response
  } as unknown as DaProvider

  const indexer = new BlobIndexer(
    {
      daProvider,
      daLayer: DA_LAYER,
      batchSize: $.batchSize ?? 100,
      parents: [],
      indexerService: $.indexerService ?? ({} as unknown as IndexerService),
      blobService,
      minHeight: 0,
    },
    Logger.SILENT,
  )

  return { indexer, daProvider, blobService }
}
