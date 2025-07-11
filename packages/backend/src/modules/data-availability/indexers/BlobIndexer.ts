import type { DaProvider } from '@l2beat/shared'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import type { BlobService } from '../services/BlobService'

export interface Dependencies extends Omit<ManagedChildIndexerOptions, 'name'> {
  daProvider: DaProvider
  blobService: BlobService
  daLayer: string
  batchSize: number
}

export class BlobIndexer extends ManagedChildIndexer {
  constructor(private readonly $: Dependencies) {
    super({
      ...$,
      name: INDEXER_NAMES.BLOB,
      tags: { tag: $.daLayer },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async update(from: number, to: number): Promise<number> {
    const adjustedTo =
      from + this.$.batchSize < to ? from + this.$.batchSize : to

    this.logger.info('Fetching blobs', {
      from,
      to: adjustedTo,
    })

    const blobs = await this.$.daProvider.getBlobs(
      this.$.daLayer,
      from,
      adjustedTo,
    )

    if (blobs.length === 0) {
      this.logger.info('Empty blobs response received', {
        from,
        to: adjustedTo,
      })

      return adjustedTo
    }

    this.logger.info('Fetched blobs', {
      blobs: blobs.length,
    })

    await this.$.blobService.save(blobs)

    this.logger.info('Saved blobs into DB', {
      from,
      to: adjustedTo,
      records: blobs.length,
    })

    return adjustedTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const deletedRows = await this.$.blobService.deleteAfter(
      this.$.daLayer,
      targetHeight,
    )

    if (deletedRows > 0) {
      this.$.logger.info('Deleted rows', { deletedRows })
    }

    return Promise.resolve(targetHeight)
  }

  get daLayer() {
    return this.$.daLayer
  }
}
